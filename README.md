# kmina · Rutas que cuentan historias

> Propuesta para el **Desafío #6** de **Cultura Málaga 2026** — Plataforma de rutas temáticas que interconectan cultura, gastronomía y arte en Málaga.

Web app profesional, sin build step, lista para **GitHub Pages**. Construida con HTML + CSS + JavaScript vanilla, **Three.js** para elementos 3D, y **Leaflet** para el mapa interactivo de la ruta Picasso.

## Demo local

```bash
# Cualquier servidor estático funciona. Por ejemplo:
python -m http.server 8000
# o con Node:
npx serve .
```

Luego abre `http://localhost:8000`.

## Despliegue en GitHub Pages

1. Sube el repositorio a GitHub
2. Ve a **Settings → Pages**
3. En **Source**, selecciona **GitHub Actions**
4. El workflow `.github/workflows/deploy.yml` desplegará automáticamente en cada push a `main`

URL resultante: `https://<usuario>.github.io/kmina/`

## Stack

| Capa | Tecnología |
|------|------------|
| 3D | Three.js vía import map (ESM CDN) |
| Mapa | Leaflet + tiles CartoDB Voyager |
| Tipografía | Fraunces + Inter + Cormorant Garamond |
| Sin build | HTML + CSS + JS vanilla |

## Funcionalidades

- Hero editorial con escultura 3D cubista interactiva (wireframe + facetas + partículas de fondo)
- 5 rutas curadas: Medieval, Picasso, Gastronómica, Histórica, Flamenca
- 25 paradas reales de Málaga con coordenadas, horarios y precios
- Mapa interactivo (Leaflet) con la ruta Picasso exacta (4 paradas del Google Maps compartido), marcadores numerados con pulso, polyline animada, popups, botón que abre la ruta real en Google Maps
- Arte CSS generativo por ubicación (composiciones cubistas únicas por lugar)
- Generador de ruta personalizada con filtros por temática y tipo
- Sistema de logros y progreso con persistencia en localStorage
- Animaciones de scroll (reveal), marquee, transiciones de página

## Estructura

```
kmina/
├── index.html              # Entry point (import map Three.js)
├── css/
│   └── style.css           # Sistema de diseño editorial
├── js/
│   ├── data.js             # Rutas, paradas (con lat/lng) y logros
│   ├── three-scene.js      # Escena 3D del hero (módulo ES)
│   ├── map.js              # Mapa Leaflet + polyline animada
│   └── app.js              # Router, vistas, progreso
├── .nojekyll               # Bypass Jekyll en GitHub Pages
└── .github/workflows/
    └── deploy.yml          # Deploy automático
```

## La ruta Picasso (en el mapa)

La ruta Picasso usa exactamente las 4 paradas del Google Maps compartido:
1. Museo Picasso Málaga, C. San Agustín, 8
2. Iglesia de Santiago, C. Granada, 78
3. Teatro Cánovas, C. Comedias, 18
4. El Café de Chinitas, Pje. Chinitas, 6

El botón Google Maps abre la ruta original en Google Maps.

## Licencia

Demo ideatón, Cultura Málaga 2026.
