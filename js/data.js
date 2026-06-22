// =========================================================
// KMINA · Datos de rutas, paradas y logros
// Coordenadas reales aproximadas de Málaga para el mapa
// =========================================================

const RUTAS = [
  {
    id: 'medieval',
    nombre: 'Ruta Medieval',
    descripcion: 'Málaga fortificada: la Alcazaba, Gibralfaro y los teatros que aún custodian el espíritu medieval de la ciudad.',
    imagen: '🏰',
    art: 'art-medieval',
    color: '#8B6F47',
    accent: '#D4A843',
    duracion: '4 horas',
    distancia: '3.5 km',
    paradas: [
      {
        id: 1, nombre: 'Alcazaba de Málaga', tipo: 'monumento',
        art: 'art-medieval',
        img: 'img/alcazaba.jpg',
        tags: ['medieval', 'histórico', 'arquitectura'],
        lat: 36.7210, lng: -4.4166,
        descripcion: 'Fortaleza palaciega del siglo XI, una de las más importantes de la época musulmana en Andalucía. Sus murallas y jardines cuentan la historia del poder islámico en la ciudad.',
        horario: '09:00 - 20:00', precio: '3,50 €'
      },
      {
        id: 2, nombre: 'Castillo de Gibralfaro', tipo: 'monumento',
        art: 'art-medieval',
        img: 'img/gibralfaro.jpg',
        tags: ['medieval', 'histórico', 'mirador'],
        lat: 36.7228, lng: -4.4113,
        descripcion: 'Fortificación del siglo XIV que corona el monte Gibralfaro. Ofrece las mejores vistas panorámicas de Málaga y fue clave en la defensa de la ciudad durante la Reconquista.',
        horario: '09:00 - 20:00', precio: '3,50 €'
      },
      {
        id: 3, nombre: 'Teatro Romano', tipo: 'cultural',
        art: 'art-historia',
        img: 'img/teatro-romano.jpg',
        tags: ['medieval', 'histórico', 'arte'],
        lat: 36.7201, lng: -4.4183,
        descripcion: 'Construido en el siglo I a.C., este teatro fue utilizado hasta el siglo III y redescubierto en 1951. Su reutilización de materiales en la época medieval lo conecta directamente con nuestra ruta.',
        horario: '10:00 - 18:00', precio: 'Gratuito'
      },
      {
        id: 4, nombre: 'Taberna del Pasaje', tipo: 'restaurante',
        art: 'art-gastro',
        img: 'img/taberna-pasaje.jpg',
        tags: ['medieval', 'gastronómico', 'tradicional'],
        lat: 36.7225, lng: -4.4198,
        descripcion: 'Taberna centenaria que mantiene recetas tradicionales medievales adaptadas. Su cocido y sus vinos de la tierra evocan los sabores de la Málaga antigua.',
        horario: '12:00 - 00:00', precio: '15-25 €'
      },
      {
        id: 5, nombre: 'Muralla Nazarí', tipo: 'monumento',
        art: 'art-abstract-1',
        img: 'img/muralla-nazari.jpg',
        tags: ['medieval', 'histórico'],
        lat: 36.7210, lng: -4.4175,
        descripcion: 'Restos de la muralla que rodeaba la medina de Málaga. Un paseo por sus alrededores permite entender la estructura defensiva de la ciudad medieval.',
        horario: '24h', precio: 'Gratuito'
      }
    ]
  },
  {
    id: 'picasso',
    nombre: 'Ruta Picasso',
    descripcion: 'Sigue los pasos del genio malagueño. Desde su casa natal hasta los museos que albergan su obra, una ruta imprescindible para los amantes del arte.',
    imagen: '🎨',
    art: 'art-cubismo-azul',
    color: '#2C6E8A',
    accent: '#D4A843',
    duracion: '3 horas',
    distancia: '2 km',
    paradas: [
      {
        id: 6, nombre: 'Museo Picasso Málaga', tipo: 'museo',
        art: 'art-cubismo-azul',
        img: 'img/museo-picasso.jpg',
        tags: ['artístico', 'cultural', 'picasso'],
        lat: 36.7217363, lng: -4.4184291,
        descripcion: 'Más de 200 obras donadas por la familia del artista. Un recorrido por la evolución creativa de Picasso desde sus inicios hasta sus últimas obras. Ubicado en el Palacio de Buenavista, Calle San Agustín 8.',
        horario: '10:00 - 19:00', precio: '10 €'
      },
      {
        id: 7, nombre: 'Iglesia de Santiago', tipo: 'monumento',
        art: 'art-cubismo-rosa',
        img: 'img/iglesia-santiago.jpg',
        tags: ['artístico', 'cultural', 'picasso', 'histórico'],
        lat: 36.7223243, lng: -4.4176066,
        descripcion: 'Templo donde fue bautizado Pablo Ruiz Picasso en 1881. La Parroquia Santiago Apóstol conserva el acta bautismal del artista y el ambiente barroco malagueño.',
        horario: '10:00 - 13:00 / 18:00 - 21:00', precio: 'Gratuito'
      },
      {
        id: 8, nombre: 'Teatro Cánovas', tipo: 'teatro',
        art: 'art-abstract-1',
        img: 'img/teatro-canovas.jpg',
        tags: ['artístico', 'cultural', 'teatro', 'picasso'],
        lat: 36.72289, lng: -4.4212,
        descripcion: 'En la Calle Comedias 18, este espacio escénico rinde homenaje a las artes que Picasso amaba. Programación de teatro, música y exposiciones contemporáneas.',
        horario: 'Variable según programación', precio: 'Variable'
      },
      {
        id: 9, nombre: 'El Café de Chinitas', tipo: 'restaurante',
        art: 'art-flamenco',
        img: 'img/cafe-chinitas.jpg',
        tags: ['artístico', 'gastronómico', 'flamenco', 'picasso'],
        lat: 36.7208742, lng: -4.4212455,
        descripcion: 'Pasaje de Chinitas, 6. Taberna histórica frecuentada por Picasso y escenario de sus pasiones andaluzas. Flamenco en vivo, vermut y la Málaga más auténtica.',
        horario: '12:00 - 02:00', precio: '15-30 €'
      },
      {
        id: 10, nombre: 'Casa Natal de Picasso', tipo: 'museo',
        art: 'art-cubismo-azul',
        img: 'img/casa-natal-picasso.jpg',
        tags: ['artístico', 'cultural', 'picasso'],
        lat: 36.7220, lng: -4.4180,
        descripcion: 'Edificio del siglo XIX donde nació Pablo Ruiz Picasso en 1881. Hoy es un museo que alberga objetos personales y obras tempranas del artista.',
        horario: '09:30 - 20:00', precio: '3 €'
      }
    ]
  },
  {
    id: 'gastronomica',
    nombre: 'Ruta Gastronómica',
    descripcion: 'Un viaje por los sabores de Málaga: mercados tradicionales, bodegas centenarias y restaurantes de vanguardia que definen la identidad culinaria de la ciudad.',
    imagen: '🍊',
    art: 'art-gastro',
    color: '#D4A843',
    accent: '#C84B31',
    duracion: '5 horas',
    distancia: '2.5 km',
    paradas: [
      {
        id: 11, nombre: 'Mercado de Atarazanas', tipo: 'mercado',
        art: 'art-gastro',
        img: 'img/mercado-atarazanas.jpg',
        tags: ['gastronómico', 'tradicional', 'cultural'],
        lat: 36.7184, lng: -4.4206,
        descripcion: 'Construido en el siglo XIV como astillero nazarí, hoy es el mercado central de Málaga. Sus productos frescos reflejan la riqueza gastronómica de la provincia.',
        horario: '08:00 - 15:00', precio: 'Variable'
      },
      {
        id: 12, nombre: 'El Pimpi', tipo: 'restaurante',
        art: 'art-cubismo-rosa',
        img: 'img/el-pimpi.jpg',
        tags: ['gastronómico', 'tradicional', 'cultural'],
        lat: 36.7212, lng: -4.4182,
        descripcion: 'Bodega-restaurante emblemática desde 1971. Frecuentada por Picasso y otros artistas, es parada obligatoria para probar vinos de Málaga y tapas tradicionales.',
        horario: '10:00 - 01:00', precio: '15-30 €'
      },
      {
        id: 13, nombre: 'Museo del Vino de Málaga', tipo: 'museo',
        art: 'art-abstract-1',
        img: 'img/museo-vino.jpg',
        tags: ['gastronómico', 'cultural', 'vino'],
        lat: 36.7205, lng: -4.4190,
        descripcion: 'Historia de la tradición vinícola malagueña desde la época fenicia. Incluye cata de vinos dulces que hicieron famosa a Málaga en el mundo.',
        horario: '10:00 - 18:00', precio: '6 €'
      },
      {
        id: 14, nombre: 'Casa de Guardia', tipo: 'bar',
        art: 'art-gastro',
        img: 'img/casa-guardia.jpg',
        tags: ['gastronómico', 'tradicional', 'vino'],
        lat: 36.7197, lng: -4.4208,
        descripcion: 'La bodega más antigua de Málaga (1840). Sus vinos dulces se sirven directamente de barriles centenarios. Una experiencia única en el mundo.',
        horario: '10:00 - 22:00', precio: '5-15 €'
      },
      {
        id: 15, nombre: 'Restaurante José Carlos García', tipo: 'restaurante',
        art: 'art-cubismo-azul',
        img: 'img/jose-carlos-garcia.jpg',
        tags: ['gastronómico', 'moderno', 'estrella michelin'],
        lat: 36.7167, lng: -4.4142,
        descripcion: 'Estrella Michelin en el Muelle Uno. Cocina de vanguardia que reinterpreta los sabores tradicionales malagueños con técnicas innovadoras.',
        horario: '13:30 - 22:00', precio: '60-90 €'
      }
    ]
  },
  {
    id: 'historica',
    nombre: 'Ruta Histórica',
    descripcion: 'Recorre 3000 años de historia en un solo paseo. Fenicios, romanos, árabes y cristianos dejaron su huella en las calles de Málaga.',
    imagen: '🏛️',
    art: 'art-historia',
    color: '#2D6A4F',
    accent: '#8B6F47',
    duracion: '4 horas',
    distancia: '4 km',
    paradas: [
      {
        id: 16, nombre: 'Catedral de Málaga', tipo: 'monumento',
        art: 'art-historia',
        img: 'img/catedral-malaga.jpg',
        tags: ['histórico', 'arquitectura', 'religioso'],
        lat: 36.7200, lng: -4.4200,
        descripcion: 'Conocida como "La Manquita" por su torre inacabada. Construida entre los siglos XVI y XVIII sobre una mezquita, mezcla estilos renacentista, barroco y neoclásico.',
        horario: '10:00 - 18:00', precio: '8 €'
      },
      {
        id: 17, nombre: 'Plaza de la Constitución', tipo: 'plaza',
        art: 'art-abstract-1',
        img: 'img/plaza-constitucion.jpg',
        tags: ['histórico', 'cultural'],
        lat: 36.7205, lng: -4.4189,
        descripcion: 'Corazón de la ciudad desde el siglo XV. Aquí se proclamó la Constitución de 1812 y ha sido testigo de los momentos clave de la historia malagueña.',
        horario: '24h', precio: 'Gratuito'
      },
      {
        id: 18, nombre: 'Calle Larios', tipo: 'calle',
        art: 'art-abstract-1',
        img: 'img/calle-larios.jpg',
        tags: ['histórico', 'comercial', 'arquitectura'],
        lat: 36.7198, lng: -4.4188,
        descripcion: 'La calle más emblemática de Málaga, inaugurada en 1891. Su arquitectura historicista y sus tiendas la convierten en un museo al aire libre.',
        horario: '24h', precio: 'Gratuito'
      },
      {
        id: 19, nombre: 'Museo de Málaga', tipo: 'museo',
        art: 'art-medieval',
        img: 'img/museo-malaga.jpg',
        tags: ['histórico', 'cultural', 'arqueología'],
        lat: 36.7189, lng: -4.4140,
        descripcion: 'Ubicado en el Palacio de la Aduana, alberga colecciones de arqueología y bellas artes que cuentan la historia completa de la provincia.',
        horario: '09:00 - 21:00', precio: '1,50 €'
      },
      {
        id: 20, nombre: 'Santuario de la Victoria', tipo: 'monumento',
        art: 'art-historia',
        img: 'img/santuario-victoria.jpg',
        tags: ['histórico', 'arqueología', 'religioso'],
        lat: 36.7160, lng: -4.4170,
        descripcion: 'Basílica donde Fernando el Católico recibió las llaves de la ciudad en 1487. Marca el inicio de la Málaga cristiana y custodia los Reyes Santos.',
        horario: '09:00 - 13:00 / 17:00 - 20:00', precio: 'Gratuito'
      }
    ]
  },
  {
    id: 'flamenca',
    nombre: 'Ruta Flamenca',
    descripcion: 'El arte jondo en las calles de Málaga. Tablaos, peñas y teatros donde el flamenco late con fuerza, combinado con la mejor gastronomía andaluza.',
    imagen: '💃',
    art: 'art-flamenco',
    color: '#C84B31',
    accent: '#D4A843',
    duracion: '3 horas',
    distancia: '2 km',
    paradas: [
      {
        id: 21, nombre: 'Tablao Flamenco Los Amayas', tipo: 'espectáculo',
        art: 'art-flamenco',
        img: 'img/tablao-amayas.jpg',
        tags: ['flamenco', 'artístico', 'cultural'],
        lat: 36.7205, lng: -4.4185,
        descripcion: 'Uno de los tablaos más auténticos de Málaga. Actuaciones en vivo de cante, baile y guitarra en un ambiente íntimo y familiar.',
        horario: '20:00 - 00:00', precio: '25 €'
      },
      {
        id: 22, nombre: 'Peña Flamenca Juan Breva', tipo: 'cultural',
        art: 'art-flamenco',
        img: 'img/pena-juan-breva.jpg',
        tags: ['flamenco', 'cultural', 'tradicional'],
        lat: 36.7209, lng: -4.4212,
        descripcion: 'Peña flamenca fundada en 1958. Dedicada a preservar y difundir el flamenco malagueño. Sesiones de cante por bulerías y soleás.',
        horario: '20:00 - 23:00', precio: '10 €'
      },
      {
        id: 23, nombre: 'Teatro Cervantes', tipo: 'teatro',
        art: 'art-historia',
        img: 'img/teatro-cervantes.jpg',
        tags: ['flamenco', 'artístico', 'cultural', 'teatro'],
        lat: 36.7200, lng: -4.4170,
        descripcion: 'Teatro histórico del siglo XIX que acoge los mejores espectáculos flamencos y de artes escénicas. Su arquitectura neoclásica es impresionante.',
        horario: 'Variable', precio: 'Variable'
      },
      {
        id: 24, nombre: 'Bodega El Pimpi (Sala Flamenca)', tipo: 'restaurante',
        art: 'art-flamenco',
        img: 'img/bodega-pimpi.jpg',
        tags: ['flamenco', 'gastronómico', 'tradicional'],
        lat: 36.7212, lng: -4.4182,
        descripcion: 'La taberna andaluza por excelencia con actuaciones flamencas en directo. La combinación de vino, tapas y flamenco es la esencia de la cultura andaluza.',
        horario: '12:00 - 02:00', precio: '15-25 €'
      },
      {
        id: 25, nombre: 'Centro Cultural Flamenco \'La Malagueta\'', tipo: 'cultural',
        art: 'art-flamenco',
        img: 'img/centro-andaluz-letras.jpg',
        tags: ['flamenco', 'cultural', 'tradicional'],
        lat: 36.7212, lng: -4.4185,
        descripcion: 'Espacio dedicado a la difusión del flamenco malagueño. Talleres, exposiciones y recitales para comprender la profundidad del arte jondo.',
        horario: '10:00 - 22:00', precio: 'Variable'
      }
    ]
  }
];

const LOGROS = [
  { id: 'l1', nombre: 'Principiante', descripcion: 'Completa tu primera ruta', icono: '🌱', umbral: 1 },
  { id: 'l2', nombre: 'Explorador', descripcion: 'Completa 2 rutas', icono: '🧭', umbral: 2 },
  { id: 'l3', nombre: 'Historiador', descripcion: 'Completa la Ruta Histórica', icono: '📜', umbral: 1, ruta: 'historica' },
  { id: 'l4', nombre: 'Foodie', descripcion: 'Completa la Ruta Gastronómica', icono: '🍊', umbral: 1, ruta: 'gastronomica' },
  { id: 'l5', nombre: 'Picassiano', descripcion: 'Completa la Ruta Picasso', icono: '🎨', umbral: 1, ruta: 'picasso' },
  { id: 'l6', nombre: 'Medievalista', descripcion: 'Completa la Ruta Medieval', icono: '⚔️', umbral: 1, ruta: 'medieval' },
  { id: 'l7', nombre: 'Flamenco', descripcion: 'Completa la Ruta Flamenca', icono: '💃', umbral: 1, ruta: 'flamenca' },
  { id: 'l8', nombre: 'Conquistador', descripcion: 'Completa TODAS las rutas', icono: '👑', umbral: 5 }
];

const TAGS_DISPONIBLES = ['medieval', 'histórico', 'artístico', 'gastronómico', 'cultural', 'flamenco', 'tradicional', 'moderno', 'arquitectura', 'vino', 'picasso', 'arqueología', 'teatro'];

const TIPOS_DISPONIBLES = ['monumento', 'museo', 'restaurante', 'teatro', 'cultural', 'plaza', 'mercado', 'espectáculo', 'calle', 'bar'];

// Google Maps directions URL prebuilt (Picasso route) for the demo
const GOOGLE_MAPS_PICASSO_URL = 'https://www.google.com/maps/dir/Museo+Picasso+M%C3%A1laga,+Palacio+de+Buenavista,+C.+San+Agust%C3%ADn,+8,+Distrito+Centro,+29015+M%C3%A1laga/Parroquia+Santiago+Ap%C3%B3stol+M%C3%A1laga,+C.+Granada,+78,+Distrito+Centro,+29015+M%C3%A1laga/C.+Comedias,+18,+Distrito+Centro,+29008+M%C3%A1laga/El+Caf%C3%A9+de+Chinitas,+Pje.+Chinitas,+6,+Distrito+Centro,+29015+M%C3%A1laga/@36.7220837,-4.4221888,17z/data=!3m2!4b1!5s0xd72f7c010168ac1:0xb5463cca800605dc!4m26!4b25!1m5!1m1!1s0xd72f795542a70b7:0x1c82c7e9854c2bb9!2m2!1d-4.4184291!2d36.7217363!1m5!1m1!1s0xd72f7c005305f3b:0xca2def585c7490dc!2m2!1d-4.4176066!2d36.7223243!1m5!1m1!1s0xd72f7be363f3981:0x56cdf4c23f79cf74!2m2!1d-4.4212!2d36.72289!1m5!1m1!1s0xd72f764702df033:0x6c82f43d2637b35!2m2!1d-4.4212455!2d36.7208742!3e2';
