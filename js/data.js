const RUTAS = [
  {
    id: 'medieval',
    nombre: 'Ruta Medieval',
    descripcion: 'Descubre la Málaga fortificada, desde la Alcazaba hasta el Castillo de Gibralfaro, pasando por teatros y tabernas que conservan el espíritu de la Edad Media.',
    imagen: '🏰',
    color: '#8B4513',
    duracion: '4 horas',
    distancia: '3.5 km',
    paradas: [
      { id: 1, nombre: 'Alcazaba de Málaga', tipo: 'monumento', tags: ['medieval', 'histórico', 'arquitectura'], descripcion: 'Fortaleza palaciega del siglo XI, una de las más importantes de la época musulmana en Andalucía. Sus murallas y jardines cuentan la historia del poder islámico en la ciudad.', horario: '09:00 - 20:00', precio: '3,50 €' },
      { id: 2, nombre: 'Castillo de Gibralfaro', tipo: 'monumento', tags: ['medieval', 'histórico', 'mirador'], descripcion: 'Fortificación del siglo XIV que corona el monte Gibralfaro. Ofrece las mejores vistas panorámicas de Málaga y fue clave en la defensa de la ciudad durante la Reconquista.', horario: '09:00 - 20:00', precio: '3,50 €' },
      { id: 3, nombre: 'Teatro Romano', tipo: 'cultural', tags: ['medieval', 'histórico', 'arte'], descripcion: 'Construido en el siglo I a.C., este teatro fue utilizado hasta el siglo III y redescubierto en 1951. Su reutilización de materiales en la época medieval lo conecta directamente con nuestra ruta.', horario: '10:00 - 18:00', precio: 'Gratuito' },
      { id: 4, nombre: 'Taberna del Pasaje', tipo: 'restaurante', tags: ['medieval', 'gastronómico', 'tradicional'], descripcion: 'Taberna centenaria que mantiene recetas tradicionales medievales adaptadas. Su cocido y sus vinos de la tierra evocan los sabores de la Málaga antigua.', horario: '12:00 - 00:00', precio: '15-25 €' },
      { id: 5, nombre: 'Muralla Nazarí', tipo: 'monumento', tags: ['medieval', 'histórico'], descripcion: 'Restos de la muralla que rodeaba la medina de Málaga. Un paseo por sus alrededores permite entender la estructura defensiva de la ciudad medieval.', horario: '24h', precio: 'Gratuito' }
    ]
  },
  {
    id: 'picasso',
    nombre: 'Ruta Picasso',
    descripcion: 'Sigue los pasos del genio malagueño. Desde su casa natal hasta los museos que albergan su obra, una ruta imprescindible para los amantes del arte.',
    imagen: '🎨',
    color: '#E85D3A',
    duracion: '3 horas',
    distancia: '2 km',
    paradas: [
      { id: 6, nombre: 'Casa Natal de Picasso', tipo: 'museo', tags: ['artístico', 'cultural', 'picasso'], descripcion: 'Edificio del siglo XIX donde nació Pablo Ruiz Picasso en 1881. Hoy es un museo que alberga objetos personales y obras tempranas del artista.', horario: '09:30 - 20:00', precio: '3 €' },
      { id: 7, nombre: 'Museo Picasso Málaga', tipo: 'museo', tags: ['artístico', 'cultural', 'picasso'], descripcion: 'Más de 200 obras donadas por la familia del artista. Un recorrido por la evolución creativa de Picasso desde sus inicios hasta sus últimas obras.', horario: '10:00 - 19:00', precio: '10 €' },
      { id: 8, nombre: 'Museo de Bellas Artes', tipo: 'museo', tags: ['artístico', 'cultural'], descripcion: 'Obras de artistas malagueños del siglo XIX y XX. Imprescindible para entender el contexto artístico en el que creció Picasso.', horario: '10:00 - 18:00', precio: '1,50 €' },
      { id: 9, nombre: 'Restaurante La Cosmopolita', tipo: 'restaurante', tags: ['artístico', 'gastronómico', 'moderno'], descripcion: 'Cocina de autor malagueña en un edificio modernista. El arte también se saborea, y aquí cada plato es una obra de arte culinaria.', horario: '13:00 - 23:00', precio: '20-35 €' },
      { id: 10, nombre: 'Centro de Arte Contemporáneo', tipo: 'museo', tags: ['artístico', 'moderno', 'cultural'], descripcion: 'Arte contemporáneo nacional e internacional en un antiguo mercado mayorista. El diálogo entre el arte de Picasso y el actual es fascinante.', horario: '10:00 - 21:00', precio: 'Gratuito' }
    ]
  },
  {
    id: 'gastronomica',
    nombre: 'Ruta Gastronómica',
    descripcion: 'Un viaje por los sabores de Málaga: mercados tradicionales, bodegas centenarias y restaurantes de vanguardia que definen la identidad culinaria de la ciudad.',
    imagen: '🍊',
    color: '#D4A843',
    duracion: '5 horas',
    distancia: '2.5 km',
    paradas: [
      { id: 11, nombre: 'Mercado de Atarazanas', tipo: 'mercado', tags: ['gastronómico', 'tradicional', 'cultural'], descripcion: 'Construido en el siglo XIV como astillero nazarí, hoy es el mercado central de Málaga. Sus productos frescos reflejan la riqueza gastronómica de la provincia.', horario: '08:00 - 15:00', precio: 'Variable' },
      { id: 12, nombre: 'El Pimpi', tipo: 'restaurante', tags: ['gastronómico', 'tradicional', 'cultural'], descripcion: 'Bodega-restaurante emblemática desde 1971. Frecuentada por Picasso y otros artistas, es parada obligatoria para probar vinos de Málaga y tapas tradicionales.', horario: '10:00 - 01:00', precio: '15-30 €' },
      { id: 13, nombre: 'Museo del Vino de Málaga', tipo: 'museo', tags: ['gastronómico', 'cultural', 'vino'], descripcion: 'Historia de la tradición vinícola malagueña desde la época fenicia. Incluye cata de vinos dulces que hicieron famosa a Málaga en el mundo.', horario: '10:00 - 18:00', precio: '6 €' },
      { id: 14, nombre: 'Casa de Guardia', tipo: 'bar', tags: ['gastronómico', 'tradicional', 'vino'], descripcion: 'La bodega más antigua de Málaga (1840). Sus vinos dulces se sirven directamente de barriles centenarios. Una experiencia única en el mundo.', horario: '10:00 - 22:00', precio: '5-15 €' },
      { id: 15, nombre: 'Restaurante José Carlos García', tipo: 'restaurante', tags: ['gastronómico', 'moderno', 'estrella michelin'], descripcion: 'Estrella Michelin en el Muelle Uno. Cocina de vanguardia que reinterpreta los sabores tradicionales malagueños con técnicas innovadoras.', horario: '13:30 - 22:00', precio: '60-90 €' }
    ]
  },
  {
    id: 'historica',
    nombre: 'Ruta Histórica',
    descripcion: 'Recorre 3000 años de historia en un solo paseo. Fenicios, romanos, árabes y cristianos dejaron su huella en las calles de Málaga.',
    imagen: '🏛️',
    color: '#2D6A4F',
    duracion: '4 horas',
    distancia: '4 km',
    paradas: [
      { id: 16, nombre: 'Catedral de Málaga', tipo: 'monumento', tags: ['histórico', 'arquitectura', 'religioso'], descripcion: 'Conocida como "La Manquita" por su torre inacabada. Construida entre los siglos XVI y XVIII sobre una mezquita, mezcla estilos renacentista, barroco y neoclásico.', horario: '10:00 - 18:00', precio: '8 €' },
      { id: 17, nombre: 'Plaza de la Constitución', tipo: 'plaza', tags: ['histórico', 'cultural'], descripcion: 'Corazón de la ciudad desde el siglo XV. Aquí se proclamó la Constitución de 1812 y ha sido testigo de los momentos clave de la historia malagueña.', horario: '24h', precio: 'Gratuito' },
      { id: 18, nombre: 'Calle Larios', tipo: 'calle', tags: ['histórico', 'comercial', 'arquitectura'], descripcion: 'La calle más emblemática de Málaga, inaugurada en 1891. Su arquitectura historicista y sus tiendas la convierten en un museo al aire libre.', horario: '24h', precio: 'Gratuito' },
      { id: 19, nombre: 'Museo de Málaga', tipo: 'museo', tags: ['histórico', 'cultural', 'arqueología'], descripcion: 'Ubicado en el Palacio de la Aduana, alberga colecciones de arqueología y bellas artes que cuentan la historia completa de la provincia.', horario: '09:00 - 21:00', precio: '1,50 €' },
      { id: 20, nombre: 'Sitio de los Fenicios', tipo: 'yacimiento', tags: ['histórico', 'arqueología', 'fenicio'], descripcion: 'Restos del primer asentamiento fenicio de Málaga (siglo VIII a.C.). El origen de todo: donde empezó la historia de la ciudad.', horario: '10:00 - 14:00', precio: 'Gratuito' }
    ]
  },
  {
    id: 'flamenca',
    nombre: 'Ruta Flamenca',
    descripcion: 'El arte jondo en las calles de Málaga. Tablaos, peñas y teatros donde el flamenco late con fuerza, combinado con la mejor gastronomía andaluza.',
    imagen: '💃',
    color: '#C1292E',
    duracion: '3 horas',
    distancia: '2 km',
    paradas: [
      { id: 21, nombre: 'Tablao Flamenco El Gallo Ronco', tipo: 'espectáculo', tags: ['flamenco', 'artístico', 'cultural'], descripcion: 'Uno de los tablaos más auténticos de Málaga. Actuaciones en vivo de cante, baile y guitarra en un ambiente íntimo y familiar.', horario: '20:00 - 00:00', precio: '25 €' },
      { id: 22, nombre: 'Peña Flamenca Juan Breva', tipo: 'cultural', tags: ['flamenco', 'cultural', 'tradicional'], descripcion: 'Peña flamenca fundada en 1958. Dedicada a preservar y difundir el flamenco malagueño. Sesiones de cante por bulerías y soleás.', horario: '20:00 - 23:00', precio: '10 €' },
      { id: 23, nombre: 'Teatro Cervantes', tipo: 'teatro', tags: ['flamenco', 'artístico', 'cultural', 'teatro'], descripcion: 'Teatro histórico del siglo XIX que acoge los mejores espectáculos flamencos y de artes escénicas. Su arquitectura neoclásica es impresionante.', horario: 'Variable', precio: 'Variable' },
      { id: 24, nombre: 'Bodega El Trillo', tipo: 'restaurante', tags: ['flamenco', 'gastronómico', 'tradicional'], descripcion: 'Taberna andaluza con actuaciones flamencas en directo. La combinación de vino, tapas y flamenco es la esencia de la cultura andaluza.', horario: '12:00 - 02:00', precio: '15-25 €' },
      { id: 25, nombre: 'Centro Andaluz de las Letras', tipo: 'cultural', tags: ['flamenco', 'cultural', 'literatura'], descripcion: 'Espacio dedicado a la literatura andaluza. Alberga exposiciones sobre la poesía flamenca y su influencia en los grandes escritores de la región.', horario: '10:00 - 18:00', precio: 'Gratuito' }
    ]
  }
];

const LOGROS = [
  { id: 'l1', nombre: 'Principiante', descripcion: 'Completa tu primera ruta', icono: '🌱', umbral: 1 },
  { id: 'l2', nombre: 'Explorador', descripcion: 'Completa 2 rutas', icono: '🧭', umbral: 2 },
  { id: 'l3', nombre: 'Historiador', descripcion: 'Completa la Ruta Histórica', icono: '📜', umbral: 1, ruta: 'historica' },
  { id: 'l4', nombre: 'Foodie', descripcion: 'Completa la Ruta Gastronómica', icono: '🍊', umbral: 1, ruta: 'gastronomica' },
  { id: 'l5', nombre: 'Artista', descripcion: 'Completa la Ruta Picasso', icono: '🎨', umbral: 1, ruta: 'picasso' },
  { id: 'l6', nombre: 'Medievalista', descripcion: 'Completa la Ruta Medieval', icono: '⚔️', umbral: 1, ruta: 'medieval' },
  { id: 'l7', nombre: 'Flamenco', descripcion: 'Completa la Ruta Flamenca', icono: '💃', umbral: 1, ruta: 'flamenca' },
  { id: 'l8', nombre: 'Conquistador', descripcion: 'Completa TODAS las rutas', icono: '👑', umbral: 5 }
];

const TAGS_DISPONIBLES = ['medieval', 'histórico', 'artístico', 'gastronómico', 'cultural', 'flamenco', 'tradicional', 'moderno', 'arquitectura', 'vino', 'picasso', 'arqueología', 'teatro', 'naturaleza'];
