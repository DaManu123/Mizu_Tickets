// =====================================================
//  NEONSTAGE — Mock Data
//  Datos simulados de conciertos y artistas
// =====================================================

const CONCERTS = [
  {
    id: 1,
    artist: "The Weeknd",
    tour: "After Hours Til Dawn",
    genre: "R&B / Pop",
    date: "2025-07-12",
    time: "20:30",
    venue: "Estadio Azteca",
    city: "Ciudad de México",
    country: "México",
    address: "Calzada de Tlalpan 3465, Coyoacán, CDMX",
    image: "https://picsum.photos/seed/weeknd21/800/450",
    cover: "https://picsum.photos/seed/weeknd21bg/1600/600",
    color: "#8B0000",
    accent: "#ff4444",
    description: "Abel Tesfaye regresa a México con su épico After Hours Til Dawn Tour. Una producción espectacular con pirotecnia, pantallas gigantes y más de 30 éxitos que han definido una generación. No te pierdas la experiencia visual más impresionante del año.",
    capacity: 87000,
    sold: 72000,
    featured: true,
    tickets: [
      { type: "General",    price: 850,  available: 8000, desc: "Acceso al área de piso general. Vista al escenario, ambiente sin asientos." },
      { type: "Preferente", price: 1500, available: 3200, desc: "Zona cercana al escenario con mejor vista. Incluye zona delimitada." },
      { type: "VIP",        price: 3500, available: 480,  desc: "Área VIP exclusiva con open bar, acceso anticipado y memorabilia oficial.", vip: true },
      { type: "Palco VIP",  price: 6800, available: 60,   desc: "Palco privado para 4 personas con servicio premium y meet & greet.", vip: true }
    ]
  },
  {
    id: 2,
    artist: "Bad Bunny",
    tour: "Most Wanted Tour",
    genre: "Reggaetón / Trap",
    date: "2025-08-02",
    time: "21:00",
    venue: "Foro Sol",
    city: "Ciudad de México",
    country: "México",
    address: "Av. Viaducto Río Churubusco s/n, Iztacalco, CDMX",
    image: "https://picsum.photos/seed/badbunny55/800/450",
    cover: "https://picsum.photos/seed/badbunny55bg/1600/600",
    color: "#4a0072",
    accent: "#c800ff",
    description: "El Conejo Malo regresa con su Most Wanted Tour, el show más esperado del año en Latinoamérica. Más de 3 horas de música, sorpresas, estética única y la energía que solo Bad Bunny puede ofrecer.",
    capacity: 65000,
    sold: 65000,
    featured: true,
    tickets: [
      { type: "General",    price: 1200, available: 0,    desc: "AGOTADO — Área de piso general." },
      { type: "Preferente", price: 2200, available: 200,  desc: "Zona cercana al escenario. Últimas entradas disponibles." },
      { type: "VIP",        price: 4500, available: 80,   desc: "Área VIP exclusiva con open bar y acceso anticipado.", vip: true }
    ]
  },
  {
    id: 3,
    artist: "Taylor Swift",
    tour: "The Eras Tour",
    genre: "Pop / Country",
    date: "2025-08-28",
    time: "19:00",
    venue: "Estadio GNP Seguros",
    city: "Ciudad de México",
    country: "México",
    address: "Av. Insurgentes Sur 3695, Tlalpan, CDMX",
    image: "https://picsum.photos/seed/tayloreras/800/450",
    cover: "https://picsum.photos/seed/taylorersbg/1600/600",
    color: "#1a0050",
    accent: "#9d4edd",
    description: "El tour más épico de la historia continúa en México. Taylor Swift recorre 10 eras de su carrera en un show de 3.5 horas lleno de magia, vestuarios espectaculares y canciones sorpresa. Una experiencia única e irrepetible.",
    capacity: 55000,
    sold: 48000,
    featured: true,
    tickets: [
      { type: "General",    price: 1800, available: 4200, desc: "Zona de piso sin asignación de lugar." },
      { type: "Tribuna",    price: 2800, available: 1800, desc: "Asiento numerado con excelente visibilidad." },
      { type: "VIP Floor",  price: 5500, available: 320,  desc: "Piso VIP cerca del escenario con área lounge.", vip: true },
      { type: "Golden Pit", price: 9800, available: 45,   desc: "Área premium frente al escenario. Acceso meet & greet.", vip: true }
    ]
  },
  {
    id: 4,
    artist: "Metallica",
    tour: "M72 World Tour",
    genre: "Heavy Metal",
    date: "2025-09-14",
    time: "19:30",
    venue: "Palacio de los Deportes",
    city: "Ciudad de México",
    country: "México",
    address: "Av. del Conscripto 311, Magdalena Mixiuca, CDMX",
    image: "https://picsum.photos/seed/metallica72/800/450",
    cover: "https://picsum.photos/seed/metallica72bg/1600/600",
    color: "#1a1a00",
    accent: "#ffd700",
    description: "Los maestros del metal regresan con el M72 World Tour. Dos noches épicas con setlists diferentes, la etapa 360° más avanzada del mundo y más de 40 años de historia en cada riff. \m/",
    capacity: 22000,
    sold: 18500,
    featured: false,
    tickets: [
      { type: "General",    price: 950,  available: 1800, desc: "Área general de piso." },
      { type: "Preferente", price: 1800, available: 900,  desc: "Sección preferente con mejor sonido." },
      { type: "VIP",        price: 4200, available: 200,  desc: "Inner Circle VIP con open bar y set list exclusivo.", vip: true }
    ]
  },
  {
    id: 5,
    artist: "Billie Eilish",
    tour: "Hit Me Hard & Soft Tour",
    genre: "Indie Pop / Alternative",
    date: "2025-09-28",
    time: "20:00",
    venue: "Arena Ciudad de México",
    city: "Ciudad de México",
    country: "México",
    address: "Av. de las Granjas 800, Azcapotzalco, CDMX",
    image: "https://picsum.photos/seed/billieeilish88/800/450",
    cover: "https://picsum.photos/seed/billieeilish88bg/1600/600",
    color: "#003300",
    accent: "#00ff88",
    description: "Billie Eilish presenta su tercer álbum de estudio en una gira íntima y visualmente impactante. Una experiencia audiovisual única donde la música se convierte en arte. Presentación sostenible sin plástico de un solo uso.",
    capacity: 22000,
    sold: 15000,
    featured: false,
    tickets: [
      { type: "General",    price: 800,  available: 5000, desc: "Área general con visión al escenario." },
      { type: "Preferente", price: 1600, available: 2200, desc: "Zona preferente con mejor acústica." },
      { type: "VIP",        price: 3800, available: 400,  desc: "Paquete VIP con merchandising exclusivo y acceso anticipado.", vip: true }
    ]
  },
  {
    id: 6,
    artist: "Karol G",
    tour: "Mañana Será Bonito",
    genre: "Reggaetón / Pop Latino",
    date: "2025-10-11",
    time: "20:30",
    venue: "Foro Sol",
    city: "Ciudad de México",
    country: "México",
    address: "Av. Viaducto Río Churubusco s/n, Iztacalco, CDMX",
    image: "https://picsum.photos/seed/karolg99/800/450",
    cover: "https://picsum.photos/seed/karolg99bg/1600/600",
    color: "#4a1942",
    accent: "#ff69b4",
    description: "La Bichota llega con su tour más grande y ambicioso. Escenario en forma de alas, 26 bailarines, orquesta en vivo y un show de 3 horas que ha roto récords en todo el mundo. Puro flow.",
    capacity: 65000,
    sold: 38000,
    featured: true,
    tickets: [
      { type: "General",    price: 900,  available: 12000, desc: "Área de piso general." },
      { type: "Preferente", price: 1700, available: 5500,  desc: "Zona preferente numerada." },
      { type: "VIP",        price: 3900, available: 800,   desc: "VIP con open bar, área lounge y vista privilegiada.", vip: true }
    ]
  },
  {
    id: 7,
    artist: "Arctic Monkeys",
    tour: "The Car Tour",
    genre: "Rock Alternativo",
    date: "2025-10-25",
    time: "21:00",
    venue: "Pepsi Center WTC",
    city: "Ciudad de México",
    country: "México",
    address: "Filadelfia 32, Nápoles, CDMX",
    image: "https://picsum.photos/seed/arcticmonkeys77/800/450",
    cover: "https://picsum.photos/seed/arcticmonkeys77bg/1600/600",
    color: "#001a33",
    accent: "#0088ff",
    description: "Alex Turner y los Arctic Monkeys presentan The Car en su gira mundial con una producción cinematográfica sin precedentes. Desde Teddy Picker hasta el más reciente álbum, una noche de rock alternativo puro.",
    capacity: 18000,
    sold: 12000,
    featured: false,
    tickets: [
      { type: "General",    price: 700,  available: 4000, desc: "Área general de piso." },
      { type: "Preferente", price: 1400, available: 1800, desc: "Sección preferente con asiento." },
      { type: "VIP",        price: 3200, available: 350,  desc: "Experiencia VIP con acceso backstage fotográfico.", vip: true }
    ]
  },
  {
    id: 8,
    artist: "Rosalía",
    tour: "Motomami Live",
    genre: "Latin Alternative / Flamenco",
    date: "2025-11-08",
    time: "21:00",
    venue: "Auditorio Nacional",
    city: "Ciudad de México",
    country: "México",
    address: "Paseo de la Reforma 50, Chapultepec Polanco, CDMX",
    image: "https://picsum.photos/seed/rosalia44/800/450",
    cover: "https://picsum.photos/seed/rosalia44bg/1600/600",
    color: "#330000",
    accent: "#ff3333",
    description: "La reina del nuevo flamenco fusión regresa con Motomami Live. Una experiencia artística que mezcla motos, coreografías imposibles, moda de vanguardia y la voz más original de la música contemporánea.",
    capacity: 9500,
    sold: 9000,
    featured: false,
    tickets: [
      { type: "General",    price: 1200, available: 300, desc: "Zona de piso, muy pocas entradas disponibles." },
      { type: "Butaca",     price: 2000, available: 180, desc: "Asiento numerado en zona central." },
      { type: "VIP",        price: 4800, available: 40,  desc: "Palco VIP con vista privilegiada y catering.", vip: true }
    ]
  },
  {
    id: 9,
    artist: "Coldplay",
    tour: "Music of the Spheres",
    genre: "Rock / Pop",
    date: "2025-11-22",
    time: "19:30",
    venue: "Estadio Azteca",
    city: "Ciudad de México",
    country: "México",
    address: "Calzada de Tlalpan 3465, Coyoacán, CDMX",
    image: "https://picsum.photos/seed/coldplay33/800/450",
    cover: "https://picsum.photos/seed/coldplay33bg/1600/600",
    color: "#001a4d",
    accent: "#0066ff",
    description: "El espectáculo más colorido del planeta. Coldplay regresa con pulseras LED, confeti, fuegos artificiales y una producción 100% sostenible. The Spheres World Tour es la gira más vista en la historia de los conciertos.",
    capacity: 87000,
    sold: 78000,
    featured: true,
    tickets: [
      { type: "General",    price: 1100, available: 4000, desc: "Piso general con pulsera LED incluida." },
      { type: "Preferente", price: 2100, available: 1500, desc: "Zona preferente con kit de fan incluido." },
      { type: "VIP",        price: 4800, available: 320,  desc: "VIP con acceso anticipado, área especial y kit premium.", vip: true },
      { type: "Diamond",    price: 8500, available: 50,   desc: "Meet & greet con la banda, foto oficial y regalo exclusivo.", vip: true }
    ]
  },
  {
    id: 10,
    artist: "Peso Pluma",
    tour: "Genesis World Tour",
    genre: "Regional Mexicano",
    date: "2025-12-06",
    time: "20:00",
    venue: "Estadio BBVA",
    city: "Monterrey",
    country: "México",
    address: "Av. Pablo Livas 2011, Guadalupe, Nuevo León",
    image: "https://picsum.photos/seed/pesopluma66/800/450",
    cover: "https://picsum.photos/seed/pesopluma66bg/1600/600",
    color: "#1a0000",
    accent: "#cc0000",
    description: "El fenómeno más grande de la música regional mexicana en su primera gira internacional de estadios. Hassan Kabande te lleva a un viaje por el corrido tumbado que conquistó el mundo.",
    capacity: 53000,
    sold: 28000,
    featured: false,
    tickets: [
      { type: "General",    price: 750,  available: 14000, desc: "Zona general de piso." },
      { type: "Preferente", price: 1400, available: 6000,  desc: "Tribuna preferente con asiento numerado." },
      { type: "VIP",        price: 3500, available: 900,   desc: "Área VIP con open bar y acceso prioritario.", vip: true }
    ]
  },
  {
    id: 11,
    artist: "Drake",
    tour: "It's All a Blur",
    genre: "Hip Hop / Rap",
    date: "2025-12-19",
    time: "21:30",
    venue: "Palacio de los Deportes",
    city: "Ciudad de México",
    country: "México",
    address: "Av. del Conscripto 311, Magdalena Mixiuca, CDMX",
    image: "https://picsum.photos/seed/drakeblur88/800/450",
    cover: "https://picsum.photos/seed/drakeblur88bg/1600/600",
    color: "#0d1a00",
    accent: "#00cc44",
    description: "Drizzy regresa a México con It's All a Blur Tour, una producción de primer nivel con visuales impresionantes, el mejor sound system del mundo y un setlist que atraviesa toda su discografía.",
    capacity: 22000,
    sold: 14000,
    featured: false,
    tickets: [
      { type: "General",    price: 880,  available: 5000, desc: "Área general de piso." },
      { type: "Preferente", price: 1700, available: 2200, desc: "Zona preferente con mejor sonido." },
      { type: "OVO VIP",    price: 4200, available: 450,  desc: "Experiencia OVO VIP con merchandising oficial y open bar.", vip: true }
    ]
  },
  {
    id: 12,
    artist: "Dua Lipa",
    tour: "Radical Optimism Tour",
    genre: "Pop / Dance",
    date: "2026-01-17",
    time: "20:30",
    venue: "Arena Ciudad de México",
    city: "Ciudad de México",
    country: "México",
    address: "Av. de las Granjas 800, Azcapotzalco, CDMX",
    image: "https://picsum.photos/seed/dualipa2026/800/450",
    cover: "https://picsum.photos/seed/dualipa2026bg/1600/600",
    color: "#001533",
    accent: "#00aaff",
    description: "La reina del pop dance presenta Radical Optimism en una gira que combina pop hedonista, coreografías de mundo y la producción de luces más avanzada de 2026. Physcal, Levitating, Break My Heart y muchos más.",
    capacity: 22000,
    sold: 9000,
    featured: false,
    tickets: [
      { type: "General",    price: 950,  available: 7000, desc: "Zona general de piso." },
      { type: "Preferente", price: 1900, available: 3500, desc: "Sección preferente numerada." },
      { type: "VIP",        price: 4200, available: 600,  desc: "VIP con kit de fan, open bar y área exclusiva.", vip: true }
    ]
  }
];

// Formatea fecha a español
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Formatea precio a MXN
function formatPrice(amount) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(amount);
}

// Porcentaje vendido
function getSoldPercent(concert) {
  return Math.round((concert.sold / concert.capacity) * 100);
}

// Obtener etiqueta de disponibilidad
function getAvailLabel(concert) {
  const pct = getSoldPercent(concert);
  if (pct >= 98) return { label: '🔴 AGOTADO', cls: 'scarce' };
  if (pct >= 85) return { label: '🟡 POCAS ENTRADAS', cls: 'scarce' };
  return { label: '🟢 DISPONIBLE', cls: 'ok' };
}

// Genera código de orden único
function generateOrderId() {
  return 'NS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// Genera código de ticket
function generateTicketCode() {
  return Array.from({length: 4}, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join('-');
}
