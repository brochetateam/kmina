const PROGRESO_KEY = 'kmina_progreso';

function getProgreso() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESO_KEY)) || { rutas: {}, paradas: {} };
  } catch { return { rutas: {}, paradas: {} }; }
}

function guardarProgreso(p) {
  localStorage.setItem(PROGRESO_KEY, JSON.stringify(p));
}

function toggleParada(rutaId, paradaId) {
  const p = getProgreso();
  const key = `${rutaId}-${paradaId}`;
  if (p.paradas[key]) delete p.paradas[key];
  else p.paradas[key] = true;
  actualizarProgresoRuta(rutaId, p);
  guardarProgreso(p);
  render();
}

function actualizarProgresoRuta(rutaId, p) {
  const ruta = RUTAS.find(r => r.id === rutaId);
  if (!ruta) return;
  const total = ruta.paradas.length;
  const completadas = ruta.paradas.filter(par => p.paradas[`${rutaId}-${par.id}`]).length;
  p.rutas[rutaId] = completadas === total;
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

// Router
function navigate(hash) {
  window.location.hash = hash;
}

function render() {
  const hash = window.location.hash.slice(1) || 'home';
  const app = document.getElementById('app');
  app.classList.remove('page-enter');
  void app.offsetWidth;

  let html = '';
  if (hash === 'home') html = renderHome();
  else if (hash === 'rutas') html = renderRutas();
  else if (hash.startsWith('ruta/')) {
    const id = hash.split('/')[1];
    html = renderRutaDetail(id);
  } else if (hash === 'personalizada') html = renderPersonalizada();
  else if (hash === 'logros') html = renderLogros();
  else html = renderHome();

  app.innerHTML = html;
  app.classList.add('page-enter');

  document.querySelectorAll('.nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${hash}` || (hash.startsWith('ruta') && a.getAttribute('href') === '#rutas'));
  });

  if (hash === 'personalizada') initPersonalizada();
}

// Views
function renderHome() {
  const p = getProgreso();
  const rutasCompletas = Object.values(p.rutas).filter(Boolean).length;
  return `
    <section class="hero">
      <div class="container">
        <div class="event-badge">📅 Cultura Málaga 2026 · Desafío #6</div>
        <h1>Rutas Temáticas<br>de Málaga</h1>
        <p class="subtitle">Conecta cultura, gastronomía y arte en rutas únicas. Descubre la ciudad a través de sus historias, sabores y tradiciones.</p>
        <div class="btn-group">
          <a class="btn btn-primary" onclick="navigate('rutas')">🗺️ Explorar rutas</a>
          <a class="btn btn-outline" onclick="navigate('personalizada')">✨ Crear ruta propia</a>
        </div>
      </div>
    </section>
    <main class="container">
      <div class="page-header">
        <h2>Rutas destacadas</h2>
        <p>${rutasCompletas > 0 ? `Has completado ${rutasCompletas} de ${RUTAS.length} rutas.` : 'Elige una ruta temática y empieza tu aventura.'}</p>
      </div>
      <div class="route-grid">
        ${RUTAS.map(r => {
          const prog = getProgresoRuta(r.id);
          const pct = prog.total > 0 ? (prog.completadas / prog.total * 100) : 0;
          return `
          <div class="route-card" onclick="navigate('ruta/${r.id}')">
            <div class="route-card-img" style="background:${r.color}22">
              <span>${r.imagen}</span>
            </div>
            <div class="route-card-body">
              <h3>${r.nombre}</h3>
              <p>${r.descripcion}</p>
              <div class="route-card-meta">
                <span>⏱️ ${r.duracion}</span>
                <span>📍 ${r.distancia}</span>
                <span>📍 ${r.paradas.length} paradas</span>
              </div>
              <div class="progress-bar">
                <div class="fill" style="width:${pct}%"></div>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </main>`;
}

function renderRutas() {
  return `
    <main class="container page-enter">
      <div class="page-header">
        <h2>🗺️ Todas las rutas</h2>
        <p>Selecciona una ruta temática para ver sus paradas y empezar tu recorrido.</p>
      </div>
      <div class="route-grid">
        ${RUTAS.map(r => {
          const prog = getProgresoRuta(r.id);
          const pct = prog.total > 0 ? (prog.completadas / prog.total * 100) : 0;
          return `
          <div class="route-card" onclick="navigate('ruta/${r.id}')">
            <div class="route-card-img" style="background:${r.color}22">
              <span>${r.imagen}</span>
            </div>
            <div class="route-card-body">
              <h3>${r.nombre}</h3>
              <p>${r.descripcion}</p>
              <div class="route-card-meta">
                <span>⏱️ ${r.duracion}</span>
                <span>📍 ${r.distancia}</span>
                <span>📍 ${r.paradas.length} paradas</span>
              </div>
              <div class="progress-bar">
                <div class="fill" style="width:${pct}%"></div>
              </div>
              ${prog.completo ? '<div style="margin-top:8px;font-size:0.82rem;color:#3A7D5C;font-weight:600;">✅ Completada</div>' : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </main>`;
}

function renderRutaDetail(id) {
  const ruta = RUTAS.find(r => r.id === id);
  if (!ruta) return '<div class="container"><h2>Ruta no encontrada</h2></div>';
  const p = getProgreso();
  const prog = getProgresoRuta(id);
  return `
    <main class="container route-detail page-enter">
      <div class="route-detail-header">
        <div class="route-icon">${ruta.imagen}</div>
        <h2>${ruta.nombre}</h2>
        <p class="desc">${ruta.descripcion}</p>
        <div class="route-detail-stats">
          <span>⏱️ ${ruta.duracion}</span>
          <span>📍 ${ruta.distancia}</span>
          <span>📍 ${ruta.paradas.length} paradas</span>
          <span>${prog.completadas}/${prog.total} visitadas</span>
          ${prog.completo ? '<span class="completed-badge">✅ Completada</span>' : ''}
        </div>
      </div>
      <div class="map-placeholder">
        <div class="icon">🗺️</div>
        <p>Mapa interactivo de la ruta — aquí se mostraría el recorrido en un mapa real</p>
      </div>
      <h3 class="section-title">📍 Paradas de la ruta</h3>
      <div class="stops-list">
        ${ruta.paradas.map((par, i) => {
          const checked = !!p.paradas[`${id}-${par.id}`];
          const tags = [...new Set(par.tags)].slice(0, 4);
          return `
          <div class="stop-card ${checked ? 'completed' : ''}">
            <div class="stop-number">${i + 1}</div>
            <div class="stop-info">
              <h4>${par.nombre}</h4>
              <span class="type-tag">${par.tipo}</span>
              <p class="desc">${par.descripcion}</p>
              <div class="stop-meta">
                <span>🕐 ${par.horario}</span>
                <span>💰 ${par.precio}</span>
              </div>
              <div class="stop-tags">
                ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
            <div class="stop-check ${checked ? 'checked' : ''}" onclick="event.stopPropagation();toggleParada('${id}', ${par.id});" title="${checked ? 'Marcar como no visitada' : 'Marcar como visitada'}">
              ${checked ? '✓' : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="text-align:center;margin-top:24px">
        <button class="btn btn-primary" onclick="navigate('rutas')">← Volver a rutas</button>
      </div>
    </main>`;
}

function renderPersonalizada() {
  return `
    <main class="container custom-route page-enter">
      <div class="page-header">
        <h2>✨ Ruta personalizada</h2>
        <p>Elige tus preferencias y filtra las actividades que más te interesen para crear tu ruta ideal.</p>
      </div>
      <div class="custom-layout">
        <div class="filter-panel" id="filterPanel">
          <h3>Filtros</h3>
          <div class="filter-group">
            <label>🎯 Temáticas</label>
            <div class="tag-options" id="tagFilters">
              ${TAGS_DISPONIBLES.map(t => `
                <label class="tag-option" data-tag="${t}">
                  <input type="checkbox" value="${t}" checked>
                  ${t}
                </label>
              `).join('')}
            </div>
          </div>
          <div class="filter-group">
            <label>🔘 Tipo de lugar</label>
            ${['monumento', 'museo', 'restaurante', 'teatro', 'cultural', 'plaza', 'mercado', 'espectáculo'].map(t => `
              <label class="checkbox-row">
                <input type="checkbox" value="${t}" checked>
                ${t}
              </label>
            `).join('')}
          </div>
          <button class="btn btn-primary btn-block" onclick="aplicarFiltros()">🔍 Generar ruta</button>
          <button class="btn btn-outline btn-block" style="margin-top:8px;color:var(--text);border-color:var(--border);" onclick="resetFiltros()">↺ Restablecer</button>
        </div>
        <div class="custom-results" id="customResults">
          <div class="empty-state">
            <div class="icon">🎯</div>
            <h3>Selecciona tus filtros</h3>
            <p>Elige las temáticas que te interesan y genera tu ruta personalizada.</p>
          </div>
        </div>
      </div>
    </main>`;
}

function initPersonalizada() {
  document.querySelectorAll('.tag-option').forEach(el => {
    el.addEventListener('click', function(e) {
      const input = this.querySelector('input');
      input.checked = !input.checked;
      this.classList.toggle('selected', input.checked);
      aplicarFiltros();
    });
  });
  document.querySelectorAll('.filter-panel .checkbox-row input').forEach(cb => {
    cb.addEventListener('change', aplicarFiltros);
  });
  aplicarFiltros();
}

function resetFiltros() {
  document.querySelectorAll('.tag-option input, .checkbox-row input').forEach(cb => cb.checked = true);
  document.querySelectorAll('.tag-option').forEach(el => el.classList.add('selected'));
  aplicarFiltros();
}

function aplicarFiltros() {
  const tagsSel = [...document.querySelectorAll('.tag-option input:checked')].map(cb => cb.value);
  const tiposSel = [...document.querySelectorAll('.checkbox-row input:checked')].map(cb => cb.value);

  // Highlight selected tags
  document.querySelectorAll('.tag-option').forEach(el => {
    const input = el.querySelector('input');
    el.classList.toggle('selected', input.checked);
  });

  const resultados = [];
  RUTAS.forEach(ruta => {
    ruta.paradas.forEach(par => {
      const matchTags = tagsSel.some(t => par.tags.includes(t));
      const matchTipo = tiposSel.includes(par.tipo);
      if (matchTags && matchTipo) {
        resultados.push({ ...par, rutaNombre: ruta.nombre, rutaId: ruta.id, rutaImagen: ruta.imagen });
      }
    });
  });

  const container = document.getElementById('customResults');
  if (!container) return;

  if (resultados.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">🔍</div><h3>Sin resultados</h3><p>Prueba a seleccionar más temáticas o tipos de lugar.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom:16px;font-size:0.9rem;color:var(--text-light);">
      🎯 ${resultados.length} lugares encontrados
      <button class="btn" style="margin-left:8px;padding:6px 16px;font-size:0.82rem;background:var(--cream);" onclick="generarRutaOptima()">📋 Generar ruta óptima</button>
    </div>
    <div id="rutaOptima">
      ${resultados.map(r => `
        <div class="custom-result-card" onclick="navigate('ruta/${r.rutaId}')" style="cursor:pointer">
          <h4>${r.nombre}</h4>
          <div class="custom-result-type">${r.tipo} · ${r.rutaImagen} ${r.rutaNombre}</div>
          <p>${r.descripcion}</p>
          <div class="stop-tags">
            ${r.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>`;
}

function generarRutaOptima() {
  const cards = document.querySelectorAll('.custom-result-card');
  if (cards.length === 0) return;
  const msg = document.createElement('div');
  msg.style.cssText = 'background:var(--success);color:white;padding:12px 20px;border-radius:var(--radius-sm);margin-bottom:16px;font-size:0.9rem;font-weight:500;';
  msg.innerHTML = '✅ Ruta óptima generada! Hemos ordenado los lugares por cercanía geográfica y temática para minimizar desplazamientos.';
  const parent = document.getElementById('rutaOptima');
  parent.parentNode.insertBefore(msg, parent);

  const arr = [...cards];
  arr.sort((a, b) => {
    const aRuta = a.querySelector('.custom-result-type')?.textContent || '';
    const bRuta = b.querySelector('.custom-result-type')?.textContent || '';
    return aRuta.localeCompare(bRuta);
  });
  arr.forEach(card => parent.appendChild(card));
}

function renderLogros() {
  const p = getProgreso();
  const rutasCompletas = Object.values(p.rutas).filter(Boolean).length;
  const totalParadas = RUTAS.reduce((s, r) => s + r.paradas.length, 0);
  const paradasVisitadas = Object.keys(p.paradas).length;
  const desbloqueados = getLogrosDesbloqueados();
  const pctGlobal = totalParadas > 0 ? Math.round((paradasVisitadas / totalParadas) * 100) : 0;

  return `
    <main class="container achievements page-enter">
      <div class="page-header">
        <h2>🏆 Logros y progreso</h2>
        <p>Completa rutas y visita lugares para desbloquear logros. ¡Conviértete en el mejor explorador de Málaga!</p>
      </div>
      <div class="achievement-stats">
        <div class="stat-card">
          <div class="number">${rutasCompletas}/${RUTAS.length}</div>
          <div class="label">Rutas completas</div>
        </div>
        <div class="stat-card">
          <div class="number">${paradasVisitadas}</div>
          <div class="label">Lugares visitados</div>
        </div>
        <div class="stat-card">
          <div class="number">${pctGlobal}%</div>
          <div class="label">Progreso global</div>
        </div>
        <div class="stat-card">
          <div class="number">${desbloqueados.length}/${LOGROS.length}</div>
          <div class="label">Logros</div>
        </div>
      </div>

      <div style="background:var(--white);border-radius:var(--radius);padding:24px;border:1px solid var(--border);box-shadow:var(--shadow);margin-bottom:32px;">
        <h3 style="font-weight:600;margin-bottom:12px;">📊 Progreso global</h3>
        <div style="height:12px;background:var(--cream);border-radius:8px;overflow:hidden;">
          <div style="height:100%;width:${pctGlobal}%;background:linear-gradient(90deg,var(--primary),var(--secondary));border-radius:8px;transition:width 0.5s ease;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:0.82rem;color:var(--text-light);">
          <span>${paradasVisitadas} de ${totalParadas} lugares</span>
          <span>${pctGlobal}% completado</span>
        </div>
      </div>

      <h3 class="section-title">🎖️ Logros</h3>
      <div class="achievement-grid">
        ${LOGROS.map(l => {
          const unlocked = desbloqueados.find(d => d.id === l.id);
          const progRuta = l.ruta ? getProgresoRuta(l.ruta) : null;
          return `
          <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
            <div class="icon">${l.icono}</div>
            <h4>${l.nombre}</h4>
            <p>${l.descripcion}</p>
            ${progRuta ? `<div style="margin-top:8px;font-size:0.75rem;color:var(--text-light);">${progRuta.completadas}/${progRuta.total} paradas</div>` : ''}
            ${!unlocked && !l.ruta ? `<div style="margin-top:6px;font-size:0.72rem;color:var(--text-light);background:var(--cream);display:inline-block;padding:2px 8px;border-radius:100px;">${l.umbral} rutas requeridas</div>` : ''}
          </div>`;
        }).join('')}
      </div>

      <h3 class="section-title" style="margin-top:40px">🔄 Simular progreso</h3>
      <p style="color:var(--text-light);margin-bottom:16px;">Selecciona una ruta para marcarla como completada (demo):</p>
      <select class="route-select" id="simularRuta" onchange="simularCompletar(this.value)">
        <option value="">— Selecciona una ruta —</option>
        ${RUTAS.map(r => `<option value="${r.id}">${r.imagen} ${r.nombre}</option>`).join('')}
      </select>
      <div style="margin-top:24px;display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-outline" style="color:var(--text);border-color:var(--border);" onclick="limpiarProgreso()">🗑️ Reiniciar progreso</button>
        <button class="btn btn-outline" style="color:var(--text);border-color:var(--border);" onclick="completarTodas()">🏁 Completar todas (demo)</button>
      </div>
    </main>`;
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

// Init
window.addEventListener('hashchange', render);
render();
document.body.addEventListener('click', e => {
  const link = e.target.closest('[onclick^="navigate"]');
  if (link) e.preventDefault();
});
