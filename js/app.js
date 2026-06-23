// =========================================================
// KMINA · App principal (router + vistas + progreso)
// =========================================================

const PROGRESO_KEY = 'kmina_progreso';

function getProgreso() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESO_KEY)) || { rutas: {}, paradas: {} };
  } catch { return { rutas: {}, paradas: {} }; }
}
function guardarProgreso(p) {
  localStorage.setItem(PROGRESO_KEY, JSON.stringify(p));
}

function getProgresoRuta(rutaId) {
  const p = getProgreso();
  const ruta = RUTAS.find(r => r.id === rutaId);
  if (!ruta) return { completadas: 0, total: 0, completo: false };
  const total = ruta.paradas.length;
  const completadas = ruta.paradas.filter(par => p.paradas[`${rutaId}-${par.id}`]).length;
  return { completadas, total, completo: completadas === total };
}

function getLogrosDesbloqueados() {
  const p = getProgreso();
  const rutasCompletas = Object.values(p.rutas).filter(Boolean).length;
  return LOGROS.filter(l => {
    if (l.ruta) return p.rutas[l.ruta];
    return rutasCompletas >= l.umbral;
  });
}

// =========================================================
// Render helpers
// =========================================================
function getRouteImage(ruta) {
  if (ruta.paradas && ruta.paradas.length) {
    const p = ruta.paradas.find(x => x.img);
    if (p) return p.img;
  }
  return null;
}

function renderArt(item, extraClass = '') {
  // Devuelve el HTML de la "imagen representativa":
  //   - <img> real si tiene img
  //   - <div class="art ..."> (CSS cubista) como fallback
  const artInner = (artClass) => {
    const inner = [];
    if (artClass === 'art-cubismo-rosa') inner.push('<span class="eye"></span>');
    if (artClass === 'art-medieval') inner.push('<span class="tower"></span><span class="tower r"></span>');
    if (artClass === 'art-historia') inner.push('<span class="arch"></span><span class="arch r"></span>');
    if (artClass === 'art-gastro') inner.push('<span class="leaf"></span>');
    if (artClass === 'art-abstract-1') inner.push('<span class="line"></span>');
    return inner.join('');
  };
  if (item.img) {
    return `<img src="${item.img}" alt="${item.nombre || ''}" loading="lazy" decoding="async" class="art-image ${extraClass}">`;
  }
  return `<div class="art ${item.art} ${extraClass}">${artInner(item.art)}</div>`;
}

// =========================================================
// Hero map · preview de la ruta Picasso
// =========================================================
let _heroLeafletMap = null;

function renderHeroMap() {
  const el = document.getElementById('heroMap');
  if (!el) return;

  // Si el contenedor aún no tiene tamaño (fonts async, aspect-ratio),
  // reintentamos en el siguiente frame hasta que tenga dimensiones reales.
  if (el.clientWidth === 0 || el.clientHeight === 0) {
    // Límite de reintentos para no buclear infinito
    renderHeroMap._retries = (renderHeroMap._retries || 0) + 1;
    if (renderHeroMap._retries > 60) {
      console.warn('[Kmina] heroMap nunca tuvo tamaño, mostrando fallback SVG');
      renderHeroMapFallback(el);
      return;
    }
    requestAnimationFrame(renderHeroMap);
    return;
  }
  renderHeroMap._retries = 0;

  // Si Leaflet no cargó, fallback SVG
  if (!window.L) {
    console.warn('[Kmina] Leaflet no cargó, mostrando fallback SVG');
    renderHeroMapFallback(el);
    return;
  }

  // Limpia si ya había un mapa (re-render del home)
  if (_heroLeafletMap) {
    _heroLeafletMap.remove();
    _heroLeafletMap = null;
  }

  const picasso = RUTAS.find(r => r.id === 'picasso');
  if (!picasso) {
    renderHeroMapFallback(el);
    return;
  }

  const stops = picasso.paradas.filter(s => s.lat != null && s.lng != null);
  if (stops.length === 0) {
    renderHeroMapFallback(el);
    return;
  }

  const map = L.map(el, {
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: true,
    dragging: false,
    doubleClickZoom: false,
    fadeAnimation: true,
    zoomAnimation: true
  });

  // Forzar recálculo de tamaño (clave con aspect-ratio + fonts async)
  map.invalidateSize();

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> · © <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  const color = picasso.color || '#2C6E8A';
  const latlngs = stops.map(s => [s.lat, s.lng]);

  // Polyline con efecto de "dibujo"
  const polyline = L.polyline(latlngs, {
    color, weight: 4, opacity: 0.85,
    dashArray: '1, 12', lineCap: 'round'
  }).addTo(map);

  // Marcadores
  stops.forEach((s, i) => {
    const icon = L.divIcon({
      className: 'kmina-marker kmina-marker-hero',
      html: `<div class="kmina-marker-inner" style="--c:${color}"><span>${i + 1}</span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    L.marker([s.lat, s.lng], { icon, title: s.nombre }).addTo(map);
  });

  // Fit bounds con padding
  const bounds = L.latLngBounds(latlngs);
  map.fitBounds(bounds, { padding: [60, 60] });

  // Re-invalidate tras fitBounds y tras un tick (asegura render correcto de tiles)
  setTimeout(() => map.invalidateSize(), 50);
  setTimeout(() => map.invalidateSize(), 250);

  // Animación: dibuja la polyline progresivamente
  let progress = 0;
  const animate = () => {
    if (!_heroLeafletMap) return; // fue disposed, parar
    progress = Math.min(1, progress + 0.02);
    if (progress < 1) {
      const drawn = [];
      for (let i = 0; i <= stops.length - 1; i++) {
        const t = Math.min(1, Math.max(0, progress * (stops.length - 1) - i));
        if (t > 0) {
          if (i < stops.length - 1) {
            const p1 = L.latLng(stops[i].lat, stops[i].lng);
            const p2 = L.latLng(stops[i + 1].lat, stops[i + 1].lng);
            const interp = [p1.lat + (p2.lat - p1.lat) * t, p1.lng + (p2.lng - p1.lng) * t];
            drawn.push(interp);
          }
        }
      }
      if (drawn.length > 1) polyline.setLatLngs(drawn);
      else if (drawn.length === 1) polyline.setLatLngs([drawn[0], drawn[0]]);
      requestAnimationFrame(animate);
    } else {
      polyline.setLatLngs(latlngs);
      // Re-dibujar con lineCap bonito
      setTimeout(() => {
        polyline.setStyle({ dashArray: null, opacity: 0.9 });
      }, 50);
    }
  };
  setTimeout(animate, 400);

  el._leafletMap = map;
  _heroLeafletMap = map;

  // Invalidate size cuando cambia el viewport
  if (!window._heroMapResizeBound) {
    window._heroMapResizeBound = true;
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (_heroLeafletMap) _heroLeafletMap.invalidateSize();
      }, 200);
    });
  }
}

// Fallback SVG: si Leaflet falla o el contenedor no tiene tamaño,
// muestra una composición minimalista con las paradas de la ruta Picasso.
function renderHeroMapFallback(el) {
  const picasso = RUTAS.find(r => r.id === 'picasso');
  if (!picasso) {
    el.innerHTML = '<div class="hero-map-fallback-text">Ruta Picasso</div>';
    return;
  }
  const stops = picasso.paradas.filter(s => s.lat != null);
  if (stops.length === 0) {
    el.innerHTML = '<div class="hero-map-fallback-text">Ruta Picasso</div>';
    return;
  }
  const color = picasso.color || '#2C6E8A';
  const W = 100, H = 100;
  const lats = stops.map(s => s.lat);
  const lngs = stops.map(s => s.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const rangeLat = Math.max(0.001, maxLat - minLat);
  const rangeLng = Math.max(0.001, maxLng - minLng);

  const points = stops.map((s, i) => {
    const u = (s.lng - minLng) / rangeLng;
    const v = 1 - (s.lat - minLat) / rangeLat;
    return { x: 10 + u * 80, y: 10 + v * 80, label: i + 1 };
  });
  const polylinePts = points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

  el.innerHTML =
    '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" class="hero-map-svg">' +
    '<defs>' +
    '<pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse">' +
    '<path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(14,14,15,0.05)" stroke-width="0.3"/>' +
    '</pattern>' +
    '</defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#g)"/>' +
    '<polyline points="' + polylinePts + '" fill="none" stroke="' + color + '" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2,1.5" opacity="0.9"/>' +
    points.map(p =>
      '<g>' +
      '<circle cx="' + p.x.toFixed(2) + '" cy="' + p.y.toFixed(2) + '" r="4" fill="' + color + '" stroke="#FAF6EC" stroke-width="1.2"/>' +
      '<text x="' + p.x.toFixed(2) + '" y="' + (p.y + 1.2).toFixed(2) + '" text-anchor="middle" font-size="3.2" font-weight="700" fill="#FAF6EC" font-family="Georgia, serif">' + p.label + '</text>' +
      '</g>'
    ).join('') +
    '<text x="50" y="7" text-anchor="middle" font-size="3.4" font-weight="600" fill="#0E0E0F" font-family="Georgia, serif" letter-spacing="0.6">RUTA PICASSO</text>' +
    '<text x="50" y="96" text-anchor="middle" font-size="2.6" fill="#8C8572" font-family="Georgia, serif">' + stops.length + ' paradas · centro histórico</text>' +
    '</svg>';
}

function toggleParada(rutaId, paradaId) {
  const p = getProgreso();
  const key = `${rutaId}-${paradaId}`;
  if (p.paradas[key]) delete p.paradas[key];
  else p.paradas[key] = true;

  const ruta = RUTAS.find(r => r.id === rutaId);
  if (ruta) {
    const total = ruta.paradas.length;
    const completadas = ruta.paradas.filter(par => p.paradas[`${rutaId}-${par.id}`]).length;
    p.rutas[rutaId] = completadas === total;
  }
  guardarProgreso(p);
  render();
}

function navigate(hash) {
  window.location.hash = hash;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  const hash = (window.location.hash || '#home').slice(1) || 'home';
  const app = document.getElementById('app');
  app.classList.remove('page-enter');
  void app.offsetWidth;

  let html = '';
  if (hash === 'home') html = renderHome();
  else if (hash === 'rutas') html = renderRutas();
  else if (hash.startsWith('ruta/')) html = renderRutaDetail(hash.split('/')[1]);
  else if (hash === 'personalizada') html = renderPersonalizada();
  else if (hash === 'logros') html = renderLogros();
  else html = renderHome();

  app.innerHTML = html;
  app.classList.add('page-enter');

  // Init mapa del hero cuando estamos en home (espera a que el contenedor tenga tamaño)
  if (hash === 'home') {
    requestAnimationFrame(() => requestAnimationFrame(renderHeroMap));
  }

  // Active nav
  document.querySelectorAll('[data-nav]').forEach(a => {
    const target = a.getAttribute('data-nav');
    a.classList.toggle('active', target === hash || (target === 'rutas' && hash.startsWith('ruta/')));
  });

  // Post-render hooks
  if (hash.startsWith('ruta/')) {
    setTimeout(() => {
      const ruta = RUTAS.find(r => r.id === hash.split('/')[1]);
      if (ruta) renderRouteMap('routeMap', ruta.paradas, { color: ruta.color || '#C84B31' });
      observeReveal();
    }, 50);
  } else if (hash === 'personalizada') {
    initPersonalizada();
  } else {
    observeReveal();
  }
}

// ============ REVEAL ON SCROLL ============
let revealObserver = null;
function observeReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ============ VIEWS ============

function renderHome() {
  const rutasCompletas = RUTAS.filter(r => getProgresoRuta(r.id).completo).length;
  const totalParadas = RUTAS.reduce((s, r) => s + r.paradas.length, 0);
  const totalLogros = LOGROS.length;

  return `
    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="hero-eyebrow">Cultura Málaga 2026 · Desafío #6</div>
            <h1>
              Rutas que<br>
              <span class="italic">cuentan</span> <span class="underline-mark">historias</span>.
            </h1>
            <p class="hero-lead">
              Conectamos cultura, gastronomía y arte en itinerarios curados por temática.
              Una plataforma para descubrir Málaga siguiendo los pasos de quienes la
              hicieron única.
            </p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#rutas" onclick="navigate('rutas');return false;">
                Explorar rutas <span class="arrow">→</span>
              </a>
              <a class="btn btn-outline" href="#personalizada" onclick="navigate('personalizada');return false;">
                Crear ruta propia
              </a>
            </div>
            <div class="hero-meta">
              <div class="hero-meta-item">
                <span class="num">${RUTAS.length}</span>
                <span class="lbl">Rutas curadas</span>
              </div>
              <div class="hero-meta-item">
                <span class="num">${totalParadas}</span>
                <span class="lbl">Paradas</span>
              </div>
              <div class="hero-meta-item">
                <span class="num">${totalLogros}</span>
                <span class="lbl">Logros</span>
              </div>
            </div>
          </div>
          <div class="hero-canvas-wrap" id="heroCanvasWrap">
            <div class="hero-map" id="heroMap"></div>
            <div class="hero-map-overlay">
              <span class="hero-canvas-tag">made with ❤ in Málaga</span>
              <span class="hero-canvas-tag b">Ruta Picasso · 5 paradas</span>
            </div>
            <div class="hero-map-legend">
              <div class="hero-legend-item"><span class="dot" style="--c:#2C6E8A"></span> Paradas</div>
              <div class="hero-legend-item"><span class="line" style="--c:#2C6E8A"></span> Recorrido</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span>Ruta Medieval</span><span>Ruta Picasso</span><span>Ruta Gastronómica</span>
        <span>Ruta Histórica</span><span>Ruta Flamenca</span>
        <span>Ruta Medieval</span><span>Ruta Picasso</span><span>Ruta Gastronómica</span>
        <span>Ruta Histórica</span><span>Ruta Flamenca</span>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="section-header reveal">
          <div>
            <span class="section-eyebrow">Itinerarios curados</span>
            <h2 class="section-title">Cinco rutas para<br><em>descubrir la ciudad</em>.</h2>
          </div>
          <p class="section-desc">
            Cada ruta combina monumentos, museos, restaurantes y experiencias bajo una
            mirada temática común. ${rutasCompletas > 0 ? `Ya completaste ${rutasCompletas} de ${RUTAS.length}.` : 'Empieza por la que más te inspire.'}
          </p>
        </div>
        <div class="routes-grid">
          ${RUTAS.map((r, idx) => {
    const prog = getProgresoRuta(r.id);
    return `
              <article class="route-card reveal" onclick="navigate('ruta/${r.id}')" style="transition-delay:${idx * 60}ms">
                <div class="route-card-art">
                  ${(() => {
        const _img = getRouteImage(r); return _img
          ? `<img src="${_img}" alt="${r.nombre}" loading="lazy" decoding="async" class="art-image">`
          : `<div class="art ${r.art}">${r.art === 'art-cubismo-rosa' ? '<span class="eye"></span>' : ''}${r.art === 'art-medieval' ? '<span class="tower"></span><span class="tower r"></span>' : ''}${r.art === 'art-historia' ? '<span class="arch"></span><span class="arch r"></span>' : ''}${r.art === 'art-gastro' ? '<span class="leaf"></span>' : ''}${r.art === 'art-abstract-1' ? '<span class="line"></span>' : ''}</div>`;
      })()}
                </div>
                ${prog.completo ? '<div class="route-card-progress done">✓ Completada</div>' :
        prog.completadas > 0 ? `<div class="route-card-progress">${prog.completadas}/${prog.total}</div>` : ''}
                <div class="route-card-body">
                  <div class="route-card-num">
                    <span>0${idx + 1} · ${r.distancia}</span>
                    <span class="arrow-link">→</span>
                  </div>
                  <h3>${r.nombre}</h3>
                  <p>${r.descripcion}</p>
                  <div class="route-card-meta">
                    <span>⏱ ${r.duracion}</span>
                    <span>◎ ${r.paradas.length} paradas</span>
                  </div>
                </div>
              </article>`;
  }).join('')}
        </div>
      </div>
    </section>

    <section class="section" style="background:var(--ink); color:var(--paper); margin-top: 40px;">
      <div class="container">
        <div class="section-header reveal" style="color:var(--paper);">
          <div>
            <span class="section-eyebrow" style="color:var(--ochre);">El modelo</span>
            <h2 class="section-title" style="color:var(--paper);">Plataforma cultural<br><em style="color:var(--ochre);">que interconecta</em>.</h2>
          </div>
          <p class="section-desc" style="color:rgba(242,235,220,0.7);">
            Empresas de diferentes sectores se unen bajo una temática común para crear
            eventos que ninguno podría organizar en solitario. La plataforma curates
            las rutas y visibiliza a los partners.
          </p>
        </div>
        <div class="routes-grid reveal">
          ${[
      { n: '01', t: 'Curación temática', d: 'Seleccionamos los lugares y experiencias que mejor cuentan la historia.' },
      { n: '02', t: 'Rutas autogeneradas', d: 'Filtros por intereses, accesibilidad y tiempo disponible.' },
      { n: '03', t: 'Logros & narrativa', d: 'Cada ruta completada revela un capítulo nuevo de la ciudad.' },
      { n: '04', t: 'Partners integrados', d: 'Museos, bares, teatros y tiendas se conectan en una sola experiencia.' }
    ].map(item => `
            <div style="border:1px solid rgba(242,235,220,0.15); border-radius: var(--radius); padding: 32px; background: rgba(242,235,220,0.03);">
              <div style="font-family:var(--font-display); color:var(--ochre); font-size: 1.4rem; margin-bottom: 12px;">${item.n}</div>
              <h3 style="font-family:var(--font-display); font-weight: 500; font-size: 1.3rem; margin-bottom: 8px; color:var(--paper);">${item.t}</h3>
              <p style="font-family:var(--font-serif); color:rgba(242,235,220,0.7); font-size: 1rem; line-height: 1.5;">${item.d}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderRutas() {
  return `
    <section class="section" style="padding-top: 140px;">
      <div class="container">
        <div class="section-header reveal">
          <div>
            <span class="section-eyebrow">Catálogo</span>
            <h2 class="section-title">Todas las rutas<br><em>disponibles</em>.</h2>
          </div>
          <p class="section-desc">
            Selecciona una ruta temática para descubrir sus paradas, marcarlas como
            visitadas y acumular logros.
          </p>
        </div>
        <div class="routes-grid">
          ${RUTAS.map((r, idx) => {
    const prog = getProgresoRuta(r.id);
    return `
              <article class="route-card reveal" onclick="navigate('ruta/${r.id}')" style="transition-delay:${idx * 60}ms">
                <div class="route-card-art">
                  ${(() => {
        const _img = getRouteImage(r); return _img
          ? `<img src="${_img}" alt="${r.nombre}" loading="lazy" decoding="async" class="art-image">`
          : `<div class="art ${r.art}">${r.art === 'art-cubismo-rosa' ? '<span class="eye"></span>' : ''}${r.art === 'art-medieval' ? '<span class="tower"></span><span class="tower r"></span>' : ''}${r.art === 'art-historia' ? '<span class="arch"></span><span class="arch r"></span>' : ''}${r.art === 'art-gastro' ? '<span class="leaf"></span>' : ''}${r.art === 'art-abstract-1' ? '<span class="line"></span>' : ''}</div>`;
      })()}
                </div>
                ${prog.completo ? '<div class="route-card-progress done">✓ Completada</div>' :
        prog.completadas > 0 ? `<div class="route-card-progress">${prog.completadas}/${prog.total}</div>` : ''}
                <div class="route-card-body">
                  <div class="route-card-num">
                    <span>0${idx + 1} · ${r.distancia}</span>
                    <span class="arrow-link">→</span>
                  </div>
                  <h3>${r.nombre}</h3>
                  <p>${r.descripcion}</p>
                  <div class="route-card-meta">
                    <span>⏱ ${r.duracion}</span>
                    <span>◎ ${r.paradas.length} paradas</span>
                  </div>
                </div>
              </article>`;
  }).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderRutaDetail(id) {
  const ruta = RUTAS.find(r => r.id === id);
  if (!ruta) return `<section class="section"><div class="container"><h1>Ruta no encontrada</h1></div></section>`;

  const p = getProgreso();
  const prog = getProgresoRuta(id);
  const gmapsUrl = ruta.id === 'picasso' ? GOOGLE_MAPS_PICASSO_URL : buildGoogleMapsUrl(ruta.paradas);

  return `
    <section class="route-detail">
      <div class="container">
        <div class="route-header reveal">
          <div>
            <span class="route-num">RUTA 0${RUTAS.indexOf(ruta) + 1} · ${ruta.distancia}</span>
            <h1>${ruta.nombre.replace('Ruta ', '')}<em>.</em></h1>
            <div class="route-header-stats">
              <span>⏱ <strong>${ruta.duracion}</strong></span>
              <span>◎ <strong>${ruta.paradas.length}</strong> paradas</span>
              <span>◎ <strong>${prog.completadas}/${prog.total}</strong> visitadas</span>
              ${prog.completo ? '<span style="color:var(--olive); font-weight:600;">✓ Completada</span>' : ''}
            </div>
          </div>
          <p>${ruta.descripcion}</p>
        </div>

        <div class="map-container reveal">
          <div class="map-overlay">◎ ${ruta.nombre}</div>
          <div class="map-actions">
            <a class="btn" href="${gmapsUrl}" target="_blank" rel="noopener">↗ Google Maps</a>
            <a class="btn" href="#personalizada" onclick="navigate('personalizada');return false;">+ Crear variante</a>
          </div>
          <div id="routeMap"></div>
        </div>

        <div class="reveal" style="text-align:center; margin-bottom: 32px;">
          <span class="section-eyebrow">El recorrido</span>
          <h3 class="section-title" style="font-size: 2rem; max-width: 100%;">${ruta.paradas.length} paradas, una <em>historia</em>.</h3>
        </div>

        <div class="stops-list">
          ${ruta.paradas.map((par, i) => {
    const checked = !!p.paradas[`${id}-${par.id}`];
    return `
              <div class="stop-card reveal ${checked ? 'completed' : ''}" style="transition-delay:${i * 50}ms">
                <div class="stop-number">Parada ${i + 1}</div>
                <div class="stop-art">
                  ${par.img
        ? `<img src="${par.img}" alt="${par.nombre}" loading="lazy" decoding="async" class="art-image art-sm">`
        : `<div class="art ${par.art} art-sm">${par.art === 'art-cubismo-rosa' ? '<span class="eye"></span>' : ''}${par.art === 'art-medieval' ? '<span class="tower"></span><span class="tower r"></span>' : ''}${par.art === 'art-historia' ? '<span class="arch"></span><span class="arch r"></span>' : ''}${par.art === 'art-gastro' ? '<span class="leaf"></span>' : ''}${par.art === 'art-abstract-1' ? '<span class="line"></span>' : ''}</div>`
      }
                </div>
                <div class="stop-info">
                  <span class="type">${par.tipo}</span>
                  <h3>${par.nombre}</h3>
                  <p>${par.descripcion}</p>
                  <div class="stop-meta">
                    <span>🕐 ${par.horario}</span>
                    <span>◎ ${par.precio}</span>
                  </div>
                  <div class="stop-tags">
                    ${par.tags.slice(0, 4).map(t => `<span class="tag-pill">${t}</span>`).join('')}
                  </div>
                </div>
                <div class="stop-check ${checked ? 'checked' : ''}" onclick="event.stopPropagation();toggleParada('${id}', ${par.id});" title="${checked ? 'Marcar como no visitada' : 'Marcar como visitada'}">
                  ${checked ? '✓' : '○'}
                </div>
              </div>`;
  }).join('')}
        </div>

        <div style="text-align:center; margin-top: 60px;" class="reveal">
          <a class="btn btn-outline" href="#rutas" onclick="navigate('rutas');return false;">← Volver al catálogo</a>
          ${prog.completo ? '<p style="margin-top:24px; font-family:var(--font-display); font-style:italic; color:var(--olive); font-size:1.2rem;">Has completado esta ruta. ¡Forma parte de la historia!</p>' : ''}
        </div>
      </div>
    </section>
  `;
}

function renderPersonalizada() {
  return `
    <section class="section" style="padding-top: 140px;">
      <div class="container">
        <div class="section-header reveal">
          <div>
            <span class="section-eyebrow">A tu medida</span>
            <h2 class="section-title">Crea tu ruta<br><em>personalizada</em>.</h2>
          </div>
          <p class="section-desc">
            Elige temáticas, tipos de lugar y obtén un itinerario curado al instante.
            Puedes incluir paradas ajenas a la temática o filtrarlas.
          </p>
        </div>

        <div class="custom-layout reveal">
          <aside class="filter-panel">
            <h3>Filtros</h3>
            <div class="filter-group">
              <label>Temáticas</label>
              <div class="tag-options" id="tagFilters">
                ${TAGS_DISPONIBLES.map(t => `
                  <label class="tag-chip on" data-tag="${t}">
                    <input type="checkbox" value="${t}" checked>
                    ${t}
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="filter-group">
              <label>Tipo de lugar</label>
              ${TIPOS_DISPONIBLES.map(t => `
                <label class="checkbox-row">
                  <input type="checkbox" value="${t}" checked>
                  ${t}
                </label>
              `).join('')}
            </div>
            <div class="filter-group">
              <label>Modo</label>
              <label class="checkbox-row">
                <input type="checkbox" id="exclusivo" checked>
                Solo lugares de la temática
              </label>
            </div>
            <button class="btn btn-primary btn-block" onclick="aplicarFiltros()">Generar ruta</button>
            <button class="btn btn-outline btn-block" onclick="resetFiltros()">Restablecer</button>
          </aside>
          <div class="custom-results" id="customResults"></div>
        </div>
      </div>
    </section>
  `;
}

function initPersonalizada() {
  document.querySelectorAll('#tagFilters .tag-chip').forEach(chip => {
    chip.addEventListener('click', e => {
      e.preventDefault();
      const input = chip.querySelector('input');
      input.checked = !input.checked;
      chip.classList.toggle('on', input.checked);
      aplicarFiltros();
    });
  });
  document.querySelectorAll('.filter-panel .checkbox-row input').forEach(cb => {
    cb.addEventListener('change', aplicarFiltros);
  });
  aplicarFiltros();
}

function resetFiltros() {
  document.querySelectorAll('#tagFilters .tag-chip').forEach(chip => {
    const input = chip.querySelector('input');
    input.checked = true;
    chip.classList.add('on');
  });
  document.querySelectorAll('.filter-panel .checkbox-row input').forEach(cb => cb.checked = true);
  aplicarFiltros();
}

function aplicarFiltros() {
  const tagsSel = [...document.querySelectorAll('#tagFilters input:checked')].map(cb => cb.value);
  const tiposSel = [...document.querySelectorAll('.filter-panel .checkbox-row input:not(#exclusivo):checked')].map(cb => cb.value);
  const exclusivo = document.getElementById('exclusivo')?.checked;

  const resultados = [];
  RUTAS.forEach(ruta => {
    ruta.paradas.forEach(par => {
      const matchTags = tagsSel.some(t => par.tags.includes(t));
      const matchTipo = tiposSel.includes(par.tipo);
      if (exclusivo) {
        // Require ALL selected tags to be present? Let's require any for usability
        if (matchTags && matchTipo) resultados.push({ ...par, rutaNombre: ruta.nombre, rutaId: ruta.id, rutaArt: ruta.art });
      } else {
        if ((matchTags || tagsSel.length === 0) && (matchTipo || tiposSel.length === 0)) {
          resultados.push({ ...par, rutaNombre: ruta.nombre, rutaId: ruta.id, rutaArt: ruta.art });
        }
      }
    });
  });

  const container = document.getElementById('customResults');
  if (!container) return;

  if (resultados.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">∅</div><h3>Sin resultados</h3><p>Prueba a seleccionar más temáticas o tipos de lugar.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="results-header">
      <h3><span id="resCount">${resultados.length}</span> paradas seleccionadas</h3>
      <span class="results-count">Ordenadas por relevancia</span>
    </div>
    <div id="resultList">
      ${resultados.map((r, i) => `
        <div class="custom-result-card" onclick="navigate('ruta/${r.rutaId}')" style="animation: pageIn 0.5s var(--ease) ${i * 30}ms both;">
          <div class="stop-art">
            ${r.img
      ? `<img src="${r.img}" alt="${r.nombre}" loading="lazy" decoding="async" class="art-image art-sm">`
      : `<div class="art ${r.art} art-sm">${r.art === 'art-cubismo-rosa' ? '<span class="eye"></span>' : ''}${r.art === 'art-medieval' ? '<span class="tower"></span><span class="tower r"></span>' : ''}${r.art === 'art-historia' ? '<span class="arch"></span><span class="arch r"></span>' : ''}${r.art === 'art-gastro' ? '<span class="leaf"></span>' : ''}${r.art === 'art-abstract-1' ? '<span class="line"></span>' : ''}</div>`
    }
          </div>
          <div>
            <h4>${r.nombre}</h4>
            <span class="type">${r.tipo} · ${r.rutaNombre}</span>
            <p>${r.descripcion.slice(0, 130)}${r.descripcion.length > 130 ? '…' : ''}</p>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function renderLogros() {
  const rutasCompletas = RUTAS.filter(r => getProgresoRuta(r.id).completo).length;
  const totalParadas = RUTAS.reduce((s, r) => s + r.paradas.length, 0);
  const p = getProgreso();
  const paradasVisitadas = Object.keys(p.paradas).length;
  const desbloqueados = getLogrosDesbloqueados();
  const pctGlobal = totalParadas > 0 ? Math.round((paradasVisitadas / totalParadas) * 100) : 0;

  return `
    <section class="section" style="padding-top: 140px;">
      <div class="container">
        <div class="section-header reveal">
          <div>
            <span class="section-eyebrow">Tu recorrido</span>
            <h2 class="section-title">Logros<br><em>y progreso</em>.</h2>
          </div>
          <p class="section-desc">
            Cada ruta completada y cada parada visitada desbloquea nuevos capítulos
            de tu historia en Málaga.
          </p>
        </div>

        <div class="achievement-stats">
          <div class="stat-card reveal"><span class="number">${rutasCompletas}/${RUTAS.length}</span><span class="label">Rutas</span></div>
          <div class="stat-card reveal" style="transition-delay:60ms"><span class="number">${paradasVisitadas}</span><span class="label">Paradas</span></div>
          <div class="stat-card reveal" style="transition-delay:120ms"><span class="number">${pctGlobal}%</span><span class="label">Progreso</span></div>
          <div class="stat-card reveal" style="transition-delay:180ms"><span class="number">${desbloqueados.length}/${LOGROS.length}</span><span class="label">Logros</span></div>
        </div>

        <div class="progress-block reveal">
          <h3>Progreso global</h3>
          <div class="progress-bar-big">
            <div class="fill" style="width:${pctGlobal}%"></div>
          </div>
          <div class="progress-meta">
            <span><strong>${paradasVisitadas}</strong> de ${totalParadas} lugares visitados</span>
            <span><strong>${pctGlobal}%</strong> completado</span>
          </div>
        </div>

        <h3 class="section-title reveal" style="font-size:1.8rem; margin-bottom:24px;">Insignias</h3>
        <div class="achievement-grid">
          ${LOGROS.map((l, i) => {
    const unlocked = desbloqueados.find(d => d.id === l.id);
    const progRuta = l.ruta ? getProgresoRuta(l.ruta) : null;
    return `
              <div class="achievement-card reveal ${unlocked ? 'unlocked' : 'locked'}" style="transition-delay:${i * 40}ms">
                <span class="achievement-icon">${l.icono}</span>
                <h4>${l.nombre}</h4>
                <p>${l.descripcion}</p>
                ${progRuta ? `<div class="meta">${progRuta.completadas}/${progRuta.total} paradas</div>` : ''}
                ${!unlocked && !l.ruta ? `<div class="meta">${l.umbral} rutas requeridas</div>` : ''}
              </div>`;
  }).join('')}
        </div>

        <div class="simulator reveal">
          <h3>Simular progreso · demo</h3>
          <p>Para ver el sistema en acción durante la presentación, marca una ruta como completada al instante.</p>
          <div class="simulator-row">
            <select id="simularRuta" onchange="simularCompletar(this.value)">
              <option value="">— Selecciona una ruta —</option>
              ${RUTAS.map(r => `<option value="${r.id}">${r.imagen} ${r.nombre}</option>`).join('')}
            </select>
            <button class="btn btn-outline" onclick="completarTodas()">Completar todas</button>
            <button class="btn btn-outline" onclick="limpiarProgreso()">Reiniciar</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function simularCompletar(rutaId) {
  if (!rutaId) return;
  const ruta = RUTAS.find(r => r.id === rutaId);
  if (!ruta) return;
  const p = getProgreso();
  ruta.paradas.forEach(par => { p.paradas[`${rutaId}-${par.id}`] = true; });
  p.rutas[rutaId] = true;
  guardarProgreso(p);
  render();
}

function limpiarProgreso() {
  if (confirm('¿Reiniciar todo el progreso?')) {
    localStorage.removeItem(PROGRESO_KEY);
    render();
  }
}

function completarTodas() {
  const p = { rutas: {}, paradas: {} };
  RUTAS.forEach(ruta => {
    ruta.paradas.forEach(par => { p.paradas[`${ruta.id}-${par.id}`] = true; });
    p.rutas[ruta.id] = true;
  });
  guardarProgreso(p);
  render();
}

// ============ INIT ============

// Header scroll style + FAB
function setupHeader() {
  const header = document.getElementById('siteHeader');
  const fab = document.getElementById('fab');
  function onScroll() {
    const sc = window.scrollY > 30;
    header?.classList.toggle('scrolled', sc);
    fab?.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

window.addEventListener('hashchange', render);
function boot() {
  setupHeader();
  render();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
