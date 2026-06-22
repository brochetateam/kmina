// =========================================================
// Map module · Leaflet + OpenStreetMap + custom route polyline
// Provides interactive map with markers, popups, animated route
// =========================================================

let map = null;
let routeLayer = null;

function buildMarkerIcon(num, color = '#C84B31') {
  return L.divIcon({
    className: 'kmina-marker',
    html: `<div class="kmina-marker-inner" style="--c:${color}">
             <span>${num}</span>
           </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

function renderRouteMap(containerId, stops, options = {}) {
  const el = document.getElementById(containerId);
  if (!el || !window.L) {
    if (el) el.innerHTML = '<div class="empty-state"><div class="icon">⌖</div><h3>Mapa no disponible</h3></div>';
    return;
  }

  // Clean previous
  if (map) {
    map.remove();
    map = null;
  }
  el.innerHTML = '';

  const validStops = stops.filter(s => s.lat != null && s.lng != null);
  if (validStops.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="icon">⌖</div><h3>Sin coordenadas</h3></div>';
    return;
  }

  // Init map
  map = L.map(el, {
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true
  }).setView([36.7215, -4.4200], 15);

  // CartoDB Voyager (clean editorial tiles, free)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Polyline (animated draw)
  const latlngs = validStops.map(s => [s.lat, s.lng]);
  const polyline = L.polyline(latlngs, {
    color: '#C84B31',
    weight: 4,
    opacity: 0.85,
    dashArray: '1, 12',
    lineCap: 'round'
  }).addTo(map);

  // Animate drawing
  let progress = 0;
  const totalLen = polyline.getDistance ? 0 : 0;
  const animate = () => {
    progress += 0.012;
    if (progress >= 1) progress = 1;
    try {
      // Use stroke-dashoffset trick via getPointAt
      const drawn = [];
      for (let i = 0; i <= validStops.length - 1; i++) {
        const t = Math.min(1, Math.max(0, progress * (validStops.length - 1) - i));
        if (t > 0) {
          if (i < validStops.length - 1) {
            const p1 = L.latLng(validStops[i].lat, validStops[i].lng);
            const p2 = L.latLng(validStops[i+1].lat, validStops[i+1].lng);
            const interp = [p1.lat + (p2.lat - p1.lat) * t, p1.lng + (p2.lng - p1.lng) * t];
            drawn.push(interp);
          }
        }
      }
      if (drawn.length > 1) {
        polyline.setLatLngs(drawn);
      } else if (drawn.length === 1) {
        polyline.setLatLngs([drawn[0], drawn[0]]);
      }
    } catch (e) {}
    if (progress < 1) requestAnimationFrame(animate);
    else polyline.setLatLngs(latlngs);
  };
  requestAnimationFrame(animate);

  // Markers
  validStops.forEach((s, i) => {
    const marker = L.marker([s.lat, s.lng], {
      icon: buildMarkerIcon(i + 1, options.color || '#C84B31'),
      title: s.nombre
    }).addTo(map);

    const popupHtml = `
      <div class="map-popup">
        <div class="map-popup-num">Parada ${i + 1}</div>
        <h4>${s.nombre}</h4>
        <div class="type">${s.tipo || ''}</div>
        <p>${(s.descripcion || '').slice(0, 140)}${(s.descripcion||'').length > 140 ? '…' : ''}</p>
      </div>`;
    marker.bindPopup(popupHtml, { maxWidth: 280, className: 'kmina-popup' });
  });

  // Fit bounds with padding
  const bounds = L.latLngBounds(latlngs);
  map.fitBounds(bounds, { padding: [50, 50] });

  // Enable scroll zoom on click
  map.once('focus', () => map.scrollWheelZoom.enable());
  map.on('click', () => map.scrollWheelZoom.enable());
}

function buildGoogleMapsUrl(stops) {
  // Build a Google Maps directions URL with the stops as waypoints
  const valid = stops.filter(s => s.lat != null && s.lng != null);
  if (valid.length < 2) return 'https://www.google.com/maps';
  const origin = `${valid[0].lat},${valid[0].lng}`;
  const destination = `${valid[valid.length-1].lat},${valid[valid.length-1].lng}`;
  const waypoints = valid.slice(1, -1).map(s => `${s.lat},${s.lng}`).join('|');
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  return url;
}

window.renderRouteMap = renderRouteMap;
window.buildGoogleMapsUrl = buildGoogleMapsUrl;
