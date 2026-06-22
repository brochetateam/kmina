// =========================================================
// KMINA · Three.js
//   · Hero mode:  mapa 3D de Málaga con las 5 rutas
//   · Ambient:    escultura cubista de fondo (opcional)
//   Loaded as classic script — THREE is a global from CDN
// =========================================================

(function () {
  'use strict';
  if (!window.THREE) {
    console.error('Three.js no cargó. Asegúrate de que el CDN responde.');
    return;
  }
  const THREE = window.THREE;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// -------- Configuración global del mapa de Málaga --------
// Bounding box del centro histórico de Málaga (todas las paradas caen dentro)
const MALAGA_BOUNDS = {
  minLat: 36.715, maxLat: 36.725,
  minLng: -4.422, maxLng: -4.408
};
const MAP_SIZE = 8;          // tamaño del plano en world units
const MAP_HEIGHT_MAX = 1.4;  // altura máxima del relieve

// Convertir lat/lng a coordenadas locales del plano (x, z, altura desde relieve)
function latLngToWorld(lat, lng) {
  const u = (lng - MALAGA_BOUNDS.minLng) / (MALAGA_BOUNDS.maxLng - MALAGA_BOUNDS.minLng);
  const v = 1 - (lat - MALAGA_BOUNDS.minLat) / (MALAGA_BOUNDS.maxLat - MALAGA_BOUNDS.minLat);
  const x = (u - 0.5) * MAP_SIZE;
  const z = (v - 0.5) * MAP_SIZE;
  return { x, z };
}

// Pseudo-random noise (sin librería externa, suficiente para relieve suave)
function hash2d(x, y) {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}
function smoothNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash2d(xi, yi);
  const b = hash2d(xi + 1, yi);
  const c = hash2d(xi, yi + 1);
  const d = hash2d(xi + 1, yi + 1);
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}
function fbm(x, y) {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 4; i++) {
    v += amp * smoothNoise(x * freq, y * freq);
    freq *= 2;
    amp *= 0.5;
  }
  return v;
}

// Altura del relieve en (x, z) — modela "Málaga": costa al sur (z positivo, bajo), monte al norte
function getHeightAt(x, z) {
  const u = (x + MAP_SIZE / 2) / MAP_SIZE;       // 0..1 este-oeste
  const v = (z + MAP_SIZE / 2) / MAP_SIZE;       // 0..1 norte-sur (norte = v=0, sur = v=1, costa)
  // Relieve base
  const n = fbm(x * 0.8 + 3.1, z * 0.8 - 1.7);  // 0..1
  let h = (n - 0.4) * MAP_HEIGHT_MAX * 1.4;
  // Monte Gibralfaro: bump al noroeste
  const dx = x - (-2.4), dz = z - (-2.0);
  const distSq = dx * dx + dz * dz;
  const giblH = Math.max(0, 1.0 - distSq / 1.6) * 1.6;
  h += giblH;
  // Depresión suave del río Guadalmedina (centro-este)
  const drx = x - 0.6, drz = z - 0.3;
  const distR = Math.sqrt(drx * drx + drz * drz);
  if (distR < 1.2) h -= (1.2 - distR) * 0.35;
  // Borde sur: costa (más bajo)
  if (v > 0.78) h -= (v - 0.78) * 1.4;
  return h;
}

// =========================================================
// HERO MAP  ·  mapa 3D de Málaga con las 5 rutas
// =========================================================
function buildHeroMap(canvas, rutas) {
  const parent = canvas.parentElement;
  let w = parent.clientWidth || 600;
  let h = parent.clientHeight || 600;
  const dpr = Math.min(window.devicePixelRatio, 2);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    console.warn('WebGL no disponible');
    return null;
  }
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 7.5, 6.5);
  camera.lookAt(0, 0, 0);

  // --- Luces ---
  scene.add(new THREE.AmbientLight(0xFAF6EC, 0.55));
  const key = new THREE.DirectionalLight(0xFFE8C0, 1.2);
  key.position.set(4, 8, 3);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x6FA8C0, 0.7);
  fill.position.set(-4, 3, -2);
  scene.add(fill);
  const back = new THREE.DirectionalLight(0xC84B31, 0.25);
  back.position.set(0, -2, -5);
  scene.add(back);

  // --- Relieve (plano subdividido con altura procedural) ---
  const PLANE_RES = 100;
  const planeGeo = new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE, PLANE_RES, PLANE_RES);
  planeGeo.rotateX(-Math.PI / 2);
  const pos = planeGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    pos.setY(i, getHeightAt(x, z));
  }
  planeGeo.computeVertexNormals();

  // Material del terreno — color crema cálido con sombreado
  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0xEFE6D2,
    roughness: 0.9,
    metalness: 0.0,
    flatShading: false
  });
  const terrain = new THREE.Mesh(planeGeo, terrainMat);
  scene.add(terrain);

  // Wireframe sutil del relieve (líneas topográficas)
  const wireMat = new THREE.LineBasicMaterial({ color: 0x0E0E0F, transparent: true, opacity: 0.18 });
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(planeGeo), wireMat);
  scene.add(wire);

  // --- Líneas de costa (borde sur) ---
  const seaLine = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP_SIZE * 1.4, MAP_SIZE * 0.4),
    new THREE.MeshBasicMaterial({ color: 0x2C6E8A, transparent: true, opacity: 0.45 })
  );
  seaLine.position.set(0, -0.02, MAP_SIZE * 0.7);
  seaLine.rotateX(-Math.PI / 2);
  scene.add(seaLine);

  // --- Rutas como líneas brillantes ---
  const routeLines = [];
  const markers = [];

  const ROUTE_COLORS = rutas.map(r => new THREE.Color(r.color || '#C84B31'));
  const defaultColors = [0x2C6E8A, 0xD4A843, 0xC84B31, 0x2D6A4F, 0x8B6F47];
  rutas.forEach((ruta, idx) => {
    const color = ROUTE_COLORS[idx] || new THREE.Color(defaultColors[idx % 5]);
    const pts = [];
    ruta.paradas.forEach(par => {
      if (par.lat == null || par.lng == null) return;
      const { x, z } = latLngToWorld(par.lat, par.lng);
      const y = getHeightAt(x, z) + 0.18;
      pts.push(new THREE.Vector3(x, y, z));
    });
    if (pts.length < 2) return;
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color, transparent: true, opacity: 0.95, linewidth: 2
    });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    routeLines.push({ line, mat, fullGeo: geo, pts, drawnLen: 0, color });

    // Esferas luminosas en cada parada
    ruta.paradas.forEach((par, pi) => {
      if (par.lat == null) return;
      const { x, z } = latLngToWorld(par.lat, par.lng);
      const y = getHeightAt(x, z) + 0.22;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 24, 24),
        new THREE.MeshStandardMaterial({
          color, emissive: color, emissiveIntensity: 0.7, roughness: 0.3, metalness: 0.2
        })
      );
      sphere.position.set(x, y, z);
      sphere.userData = { baseY: y, par, rutaId: ruta.id, paradaId: par.id, color };
      scene.add(sphere);
      markers.push(sphere);

      // Halo (sprite radial)
      const haloMat = new THREE.SpriteMaterial({
        color, transparent: true, opacity: 0.45, depthWrite: false
      });
      const halo = new THREE.Sprite(haloMat);
      halo.scale.set(0.4, 0.4, 0.4);
      halo.position.set(x, y, z);
      scene.add(halo);
    });
  });

  // --- Mar Mediterráneo (plano grande semitransparente) ---
  const seaMat = new THREE.MeshBasicMaterial({ color: 0x2C6E8A, transparent: true, opacity: 0.18 });
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(MAP_SIZE * 2, MAP_SIZE * 0.6), seaMat);
  sea.position.set(0, -0.5, MAP_SIZE * 0.85);
  sea.rotateX(-Math.PI / 2);
  scene.add(sea);

  // --- Etiquetas de las rutas en la leyenda del mapa (sprites) ---
  // Usamos canvas 2D para generar texturas con texto
  function makeTextSprite(text, color) {
    const cv = document.createElement('canvas');
    cv.width = 256; cv.height = 64;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#FAF6EC';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cv.width / 2, cv.height / 2);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sp = new THREE.Sprite(mat);
    sp.scale.set(1.4, 0.35, 1);
    return sp;
  }
  // Anotaciones geográficas discretas
  const gibLabel = makeTextSprite('Gibralfaro', '#8B6F47');
  gibLabel.position.set(-2.4, getHeightAt(-2.4, -2.0) + 0.6, -2.0);
  scene.add(gibLabel);

  const centroLabel = makeTextSprite('Centro', '#8B6F47');
  centroLabel.position.set(0.2, 0.8, 0.2);
  scene.add(centroLabel);

  const marLabel = makeTextSprite('Mar', '#2C6E8A');
  marLabel.position.set(0, 0.3, MAP_SIZE * 0.78);
  scene.add(marLabel);

  // --- Estado de animación ---
  let startTime = performance.now();
  let mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let isVisible = true;
  let disposed = false;

  function onResize() {
    const nw = parent.clientWidth || 600;
    const nh = parent.clientHeight || 600;
    if (nw === 0 || nh === 0) return;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh, false);
  }
  const onMouse = (e) => {
    const rect = parent.getBoundingClientRect();
    mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.ty = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };
  window.addEventListener('resize', onResize);
  parent.addEventListener('mousemove', onMouse);
  const visObserver = new IntersectionObserver(entries => {
    entries.forEach(e => isVisible = e.isIntersecting);
  }, { threshold: 0.05 });
  visObserver.observe(parent);
  document.addEventListener('visibilitychange', () => { isVisible = !document.hidden; });

  // --- Render loop ---
  function animate() {
    if (disposed) return;
    requestAnimationFrame(animate);
    if (!isVisible) return;
    const t = (performance.now() - startTime) / 1000;

    // Mouse easing
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    // Rotación lenta del mapa + parallax
    scene.rotation.y = t * 0.08 + mouse.x * 0.35;
    scene.rotation.x = mouse.y * 0.15;

    // Pulso de los marcadores
    markers.forEach((m, i) => {
      const phase = t * 1.5 + i * 0.5;
      const s = 1 + Math.sin(phase) * 0.18;
      m.scale.setScalar(s);
      m.position.y = m.userData.baseY + Math.sin(phase) * 0.04;
    });

    // "Dibujo" de las líneas de ruta (efecto progresivo la primera vez)
    if (t < 4) {
      routeLines.forEach(rl => {
        const ratio = Math.min(1, t / 2.2);
        const drawCount = Math.max(2, Math.floor(rl.pts.length * ratio));
        const sliced = rl.pts.slice(0, drawCount);
        rl.line.geometry.setFromPoints(sliced);
        rl.line.geometry.attributes.position.needsUpdate = true;
      });
    } else {
      // Restaurar geometría completa (en caso de re-render tras resize)
      routeLines.forEach(rl => {
        if (rl.line.geometry.attributes.position.count !== rl.pts.length) {
          rl.line.geometry.setFromPoints(rl.pts);
        }
      });
    }

    renderer.render(scene, camera);
  }
  animate();

  return { renderer, scene, camera, canvas, dispose: () => {
    disposed = true;
    window.removeEventListener('resize', onResize);
    parent.removeEventListener('mousemove', onMouse);
    visObserver.disconnect();
    renderer.dispose();
  }};
}

// =========================================================
// AMBIENT  ·  escultura cubista de fondo (opcional, no usado
// en el hero porque ahora el canvas es del mapa)
// =========================================================
function buildAmbient(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  scene.add(new THREE.AmbientLight(0xFAF6EC, 0.6));
  const k = new THREE.DirectionalLight(0xD4A843, 1.2);
  k.position.set(3, 2, 4); scene.add(k);
  const f = new THREE.DirectionalLight(0x2C6E8A, 0.8);
  f.position.set(-3, -1, 2); scene.add(f);

  // Escultura cubista
  const geo = new THREE.IcosahedronGeometry(1.6, 1);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const noise = 0.18 * Math.sin(v.x * 2.5) * Math.cos(v.y * 2.5 + v.z * 1.5);
    v.multiplyScalar(1 + noise);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();

  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0x0E0E0F, transparent: true, opacity: 0.3 })
  );
  const solid = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: 0xD4A843, roughness: 0.45, metalness: 0.25, flatShading: true, transparent: true, opacity: 0.8
  }));
  const tri = new THREE.Mesh(
    new THREE.TetrahedronGeometry(1.0, 0),
    new THREE.MeshStandardMaterial({
      color: 0x2C6E8A, roughness: 0.6, metalness: 0.1, flatShading: true, transparent: true, opacity: 0.7
    })
  );
  tri.rotation.set(Math.PI / 4, Math.PI / 6, 0);
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xC84B31, roughness: 0.3, metalness: 0.4, emissive: 0xC84B31, emissiveIntensity: 0.1 })
  );
  orb.position.set(1.6, 0.9, 0.3);

  const sculpture = new THREE.Group();
  sculpture.add(solid, wire, tri, orb);
  sculpture.position.set(1.6, 0, 0);
  scene.add(sculpture);

  // Shards
  const shards = [];
  const shardGeos = [
    new THREE.TetrahedronGeometry(0.12, 0),
    new THREE.OctahedronGeometry(0.1, 0),
    new THREE.BoxGeometry(0.12, 0.12, 0.12),
    new THREE.IcosahedronGeometry(0.08, 0)
  ];
  const colors = [0xC84B31, 0xD4A843, 0x2C6E8A, 0x0E0E0F, 0x5C2A4A, 0x3A4F2E];
  const N = window.innerWidth < 700 ? 18 : 32;
  for (let i = 0; i < N; i++) {
    const geo = shardGeos[i % shardGeos.length];
    const mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length], transparent: true, opacity: 0.35 + Math.random() * 0.3
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6 - 3);
    m.userData = {
      rotSpeed: { x: (Math.random() - 0.5) * 0.4, y: (Math.random() - 0.5) * 0.4, z: (Math.random() - 0.5) * 0.2 },
      floatSpeed: 0.2 + Math.random() * 0.4,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: m.position.y
    };
    m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    shards.push(m);
    scene.add(m);
  }

  let clock = new THREE.Clock();
  let mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let isVisible = true;

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  const onMouse = (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouse);
  document.addEventListener('visibilitychange', () => { isVisible = !document.hidden; });

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    if (sculpture) {
      if (!prefersReduced) {
        sculpture.rotation.y = t * 0.25;
        sculpture.rotation.x = Math.sin(t * 0.3) * 0.18;
      }
      sculpture.rotation.y += mouse.x * 0.4;
      sculpture.rotation.x += mouse.y * 0.25;
    }
    shards.forEach(s => {
      s.rotation.x += s.userData.rotSpeed.x * 0.01;
      s.rotation.y += s.userData.rotSpeed.y * 0.01;
      s.position.y = s.userData.baseY + Math.sin(t * s.userData.floatSpeed + s.userData.floatOffset) * 0.3;
    });
    camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();
}

// =========================================================
// Bootstrap — exponer API global
// =========================================================
let heroInstance = null;

function initHeroMap(rutas) {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (!rutas || !rutas.length) return;
  // Re-crear si la canvas cambió (re-render del home)
  if (heroInstance && heroInstance.canvas === canvas) return;
  if (heroInstance) heroInstance.dispose();
  heroInstance = buildHeroMap(canvas, rutas);
}

function initAmbient() {
  const canvas = document.getElementById('bg-canvas');
  if (canvas) buildAmbient(canvas);
}

window.KMINA_THREE = { initHeroMap, initAmbient };

// Auto-init ambient si existe
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAmbient);
} else {
  initAmbient();
}

})();
