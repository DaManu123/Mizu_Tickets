// =====================================================
//  NEONSTAGE — Main Application
//  SPA con router hash, gestión de estado y LocalStorage
// =====================================================

/* ── Estado Global ──────────────────────────────── */
const State = {
  cart:    JSON.parse(localStorage.getItem('ns_cart')    || '[]'),
  user:    JSON.parse(localStorage.getItem('ns_user')    || 'null'),
  orders:  JSON.parse(localStorage.getItem('ns_orders')  || '[]'),
  users:   JSON.parse(localStorage.getItem('ns_users')   || '[]'),
};

function saveCart()   { localStorage.setItem('ns_cart',   JSON.stringify(State.cart));   }
function saveOrders() { localStorage.setItem('ns_orders', JSON.stringify(State.orders)); }
function saveUsers()  { localStorage.setItem('ns_users',  JSON.stringify(State.users));  }
function saveUser()   { localStorage.setItem('ns_user',   JSON.stringify(State.user));   }

/* ── Toast Notifications ────────────────────────── */
function toast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', info: '💫' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

/* ── Router ─────────────────────────────────────── */
function navigate(path) {
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function router() {
  const hash = window.location.hash.replace('#', '') || '/';
  const app  = document.getElementById('app');

  // Parse route and params
  const parts = hash.split('/').filter(Boolean);
  const route = '/' + (parts[0] || '');
  const param  = parts[1];

  // Render navbar + page
  const navHTML = renderNav();
  let pageHTML = '';

  if (route === '/')            pageHTML = renderHome();
  else if (route === '/events') pageHTML = renderEvents();
  else if (route === '/event' && param) pageHTML = renderEventDetail(parseInt(param));
  else if (route === '/cart')   pageHTML = renderCart();
  else if (route === '/checkout') pageHTML = renderCheckout();
  else if (route === '/confirmation') pageHTML = renderConfirmation();
  else if (route === '/login')  pageHTML = renderAuth();
  else if (route === '/profile') pageHTML = renderProfile();
  else pageHTML = render404();

  app.innerHTML = navHTML + pageHTML + renderFooter();
  bindEvents(route, param);
  initCanvas();
  highlightNavLink(route);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  setTimeout(router, 800); // Brief loader display
});

/* ── Background Canvas ──────────────────────────── */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let stars = Array.from({length: 120}, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    o: Math.random(), v: Math.random() * 0.008 + 0.002
  }));
  let raf;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.o += s.v;
      if (s.o > 1 || s.o < 0) s.v *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.o * 0.6})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  if (raf) cancelAnimationFrame(raf);
  draw();
  window.onresize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars.forEach(s => { s.x = Math.random() * W; s.y = Math.random() * H; });
  };
}

/* ── Navbar ─────────────────────────────────────── */
function renderNav() {
  const cartCount = State.cart.reduce((s, i) => s + i.qty, 0);
  const badge = cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : '';
  const userBtn = State.user
    ? `<div class="nav-avatar" data-action="goto-profile" title="${State.user.name}">${State.user.name[0].toUpperCase()}</div>`
    : `<button class="nav-user-btn" data-action="goto-login">Iniciar sesión</button>`;

  return `
  <nav class="navbar" id="navbar">
    <div class="nav-logo" data-action="goto-home">NEONSTAGE</div>
    <ul class="nav-links">
      <li><button class="nav-link" data-route="/">Inicio</button></li>
      <li><button class="nav-link" data-route="/events">Eventos</button></li>
      ${State.user ? `<li><button class="nav-link" data-route="/profile">Mi Perfil</button></li>` : ''}
    </ul>
    <div class="nav-actions">
      <button class="nav-cart-btn" data-action="goto-cart">
        🎟️ Carrito ${badge}
      </button>
      ${userBtn}
      <button class="hamburger" id="hamburger" aria-label="Menú">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <div class="nav-drawer" id="nav-drawer">
    <button class="nav-link" data-route="/">🏠 Inicio</button>
    <button class="nav-link" data-route="/events">🎵 Eventos</button>
    <button class="nav-link" data-route="/cart">🎟️ Carrito (${cartCount})</button>
    ${State.user
      ? `<button class="nav-link" data-route="/profile">👤 ${State.user.name}</button>`
      : `<button class="nav-link" data-route="/login">🔑 Iniciar sesión</button>`}
  </div>`;
}

function highlightNavLink(route) {
  document.querySelectorAll('.nav-link[data-route]').forEach(el => {
    el.classList.toggle('active', el.dataset.route === route);
  });
  // Scroll listener for navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar && navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── Footer ─────────────────────────────────────── */
function renderFooter() {
  return `
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-name">NEONSTAGE</div>
          <p class="footer-brand-desc">La plataforma líder de tickets para conciertos en México. Experiencias únicas, precios transparentes, sin complicaciones.</p>
        </div>
        <div>
          <div class="footer-heading">Eventos</div>
          <ul class="footer-links">
            <li><a data-route="/events">Todos los conciertos</a></li>
            <li><a>Rock & Metal</a></li>
            <li><a>Pop & R&B</a></li>
            <li><a>Reggaetón</a></li>
            <li><a>Próximos estrenos</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-heading">Ayuda</div>
          <ul class="footer-links">
            <li><a>Centro de ayuda</a></li>
            <li><a>Política de reembolso</a></li>
            <li><a>Preguntas frecuentes</a></li>
            <li><a>Contáctanos</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-heading">Legal</div>
          <ul class="footer-links">
            <li><a>Términos de servicio</a></li>
            <li><a>Privacidad</a></li>
            <li><a>Cookies</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} NeonStage. Todos los derechos reservados.</span>
        <div class="footer-socials">
          <div class="footer-social">𝕏</div>
          <div class="footer-social">f</div>
          <div class="footer-social">▶</div>
          <div class="footer-social">📸</div>
        </div>
      </div>
    </div>
  </footer>`;
}

/* ── HOME PAGE ──────────────────────────────────── */
function renderHome() {
  const featured = CONCERTS.filter(c => c.featured);
  const upcoming  = CONCERTS.slice(0, 6);

  return `
  <div class="page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="hero-bg"></div>
        <div class="hero-image"></div>
        <div class="hero-content">
          <div class="hero-tag">🔴 En vivo esta temporada</div>
          <h1 class="hero-title">
            <span class="line1">TU PRÓXIMO</span>
            <span class="line2">CONCIERTO</span>
          </h1>
          <p class="hero-sub">Los mejores artistas del mundo en una sola plataforma. Compra tus tickets de forma segura, rápida y sin sorpresas.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" data-route="/events">Ver todos los eventos</button>
            <button class="btn btn-ghost btn-lg" data-route="/cart">Mi carrito 🎟️</button>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value">+120</div>
              <div class="hero-stat-label">Eventos este año</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">+2M</div>
              <div class="hero-stat-label">Tickets vendidos</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">98%</div>
              <div class="hero-stat-label">Clientes satisfechos</div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-scroll-hint">
        <span>Explorar</span>
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <hr class="neon-line">

    <!-- Filter Pills -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">🔥 Próximos eventos</div>
          <h2 class="section-title">CONCIERTOS<br><span style="color:var(--cyan)">DESTACADOS</span></h2>
          <p class="section-sub">Los shows más esperados del año, disponibles en NeonStage</p>
        </div>
        <div class="filter-pills" id="home-pills">
          <button class="pill active" data-genre="all">Todos</button>
          <button class="pill" data-genre="Pop">Pop</button>
          <button class="pill" data-genre="Rock">Rock</button>
          <button class="pill" data-genre="Reggaetón">Reggaetón</button>
          <button class="pill" data-genre="Hip Hop">Hip Hop</button>
          <button class="pill" data-genre="Metal">Metal</button>
          <button class="pill" data-genre="Alternativo">Alternativo</button>
        </div>
        <div class="concerts-grid" id="home-grid">
          ${upcoming.map(renderConcertCard).join('')}
        </div>
        <div style="text-align:center;margin-top:40px">
          <button class="btn btn-ghost btn-lg" data-route="/events">Ver todos los eventos →</button>
        </div>
      </div>
    </section>

    <hr class="neon-line">

    <!-- Promo Banner -->
    <section class="section">
      <div class="container">
        <div class="promo-banner">
          <div class="promo-text">
            <div class="promo-title">🎁 Regístrate y obtén<br><span style="color:var(--cyan)">10% de descuento</span></div>
            <p class="promo-sub">En tu primera compra. Sin letra pequeña. Sin complicaciones.</p>
          </div>
          <button class="btn btn-primary btn-lg" data-route="/login">Crear cuenta gratis</button>
        </div>
      </div>
    </section>
  </div>`;
}

function renderConcertCard(concert) {
  const avail   = getAvailLabel(concert);
  const minPrice = Math.min(...concert.tickets.map(t => t.price));
  const dateObj  = new Date(concert.date + 'T00:00:00');
  const dateShort = dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

  return `
  <div class="concert-card" data-action="goto-event" data-id="${concert.id}">
    <div class="card-img-wrap">
      <img src="${concert.image}" alt="${concert.artist}" loading="lazy" />
      <div class="card-img-overlay" style="background:linear-gradient(135deg,${concert.color}aa,${concert.accent}44)"></div>
      <span class="card-genre-badge" style="color:${concert.accent}">${concert.genre}</span>
      <span class="card-availability ${avail.cls}">${avail.label}</span>
    </div>
    <div class="card-body">
      <div class="card-artist">${concert.artist}</div>
      <div class="card-tour">${concert.tour}</div>
      <div class="card-meta">
        <div class="card-meta-item"><span class="meta-icon">📅</span>${dateShort}</div>
        <div class="card-meta-item"><span class="meta-icon">🕐</span>${concert.time} hrs</div>
        <div class="card-meta-item"><span class="meta-icon">📍</span>${concert.venue}</div>
        <div class="card-meta-item"><span class="meta-icon">🏙️</span>${concert.city}</div>
      </div>
      <div class="card-footer">
        <div>
          <div class="card-price-label">Desde</div>
          <div class="card-price"><span class="price-currency">$</span>${minPrice.toLocaleString('es-MX')}</div>
        </div>
        <button class="btn btn-primary btn-sm">Ver tickets →</button>
      </div>
    </div>
  </div>`;
}

/* ── EVENTS PAGE ────────────────────────────────── */
function renderEvents(query = '', genre = 'all', sort = 'date') {
  return `
  <div class="page">
    <div class="container">
      <div class="events-page-header">
        <h1 class="events-page-title">TODOS LOS<br><span style="color:var(--pink)">EVENTOS</span></h1>
        <div class="events-controls">
          <div class="search-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" id="search-input"
              placeholder="Buscar artista, tour, venue..." value="${query}" />
          </div>
          <select class="filter-select" id="genre-select">
            <option value="all">Todos los géneros</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="reggaeton">Reggaetón</option>
            <option value="hiphop">Hip Hop</option>
            <option value="metal">Metal</option>
            <option value="alternativo">Alternativo</option>
            <option value="latino">Latino</option>
          </select>
          <select class="filter-select" id="sort-select">
            <option value="date">Ordenar: Fecha</option>
            <option value="price-asc">Precio: Menor a mayor</option>
            <option value="price-desc">Precio: Mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>
      </div>
      <div id="events-results"></div>
    </div>
  </div>`;
}

function filterAndRenderEvents() {
  const query  = (document.getElementById('search-input')?.value || '').toLowerCase();
  const genre  = document.getElementById('genre-select')?.value || 'all';
  const sort   = document.getElementById('sort-select')?.value  || 'date';

  let list = [...CONCERTS];

  // Search filter
  if (query) {
    list = list.filter(c =>
      c.artist.toLowerCase().includes(query) ||
      c.tour.toLowerCase().includes(query) ||
      c.venue.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.genre.toLowerCase().includes(query)
    );
  }

  // Genre filter
  if (genre !== 'all') {
    const map = {
      pop: 'pop', rock: 'rock', reggaeton: 'reggaetón',
      hiphop: 'hip', metal: 'metal', alternativo: 'altern', latino: 'latin'
    };
    const key = map[genre] || genre;
    list = list.filter(c => c.genre.toLowerCase().includes(key));
  }

  // Sort
  if (sort === 'date') list.sort((a, b) => a.date.localeCompare(b.date));
  else if (sort === 'price-asc')  list.sort((a, b) => Math.min(...a.tickets.map(t => t.price)) - Math.min(...b.tickets.map(t => t.price)));
  else if (sort === 'price-desc') list.sort((a, b) => Math.min(...b.tickets.map(t => t.price)) - Math.min(...a.tickets.map(t => t.price)));
  else if (sort === 'name') list.sort((a, b) => a.artist.localeCompare(b.artist));

  const container = document.getElementById('events-results');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔎</div>
        <div class="no-results-title">Sin resultados</div>
        <p>Intenta con otros filtros o busca un artista diferente.</p>
        <button class="btn btn-ghost mt24" onclick="document.getElementById('search-input').value=''; filterAndRenderEvents();">Limpiar búsqueda</button>
      </div>`;
    return;
  }

  container.innerHTML = `
    <p class="results-count">${list.length} evento${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}</p>
    <div class="concerts-grid large">${list.map(renderConcertCard).join('')}</div>`;

  // Re-bind card clicks
  container.querySelectorAll('[data-action="goto-event"]').forEach(el => {
    el.addEventListener('click', () => navigate(`/event/${el.dataset.id}`));
  });
}

/* ── EVENT DETAIL PAGE ──────────────────────────── */
function renderEventDetail(id) {
  const c = CONCERTS.find(x => x.id === id);
  if (!c) return render404();

  const avail = getAvailLabel(c);
  const sold  = getSoldPercent(c);

  const ticketOptions = c.tickets.map((t, i) => {
    const soldOut = t.available === 0;
    return `
    <div class="ticket-option ${t.vip ? 'vip' : ''} ${i === 0 && !soldOut ? 'selected' : ''} ${soldOut ? 'sold-out' : ''}"
         data-ticket-idx="${i}" ${soldOut ? 'style="opacity:0.45;pointer-events:none"' : ''}>
      <div class="ticket-type-name">
        ${t.vip ? '<span class="vip-crown">👑</span>' : '🎟️ '}${t.type}
        ${soldOut ? ' <span style="font-size:0.72rem;color:var(--pink);font-weight:700;text-transform:uppercase">AGOTADO</span>' : ''}
      </div>
      <div class="ticket-type-desc">${t.desc}</div>
      <div class="ticket-type-footer">
        <div class="ticket-type-price">${formatPrice(t.price)}</div>
        <div class="ticket-type-avail">${soldOut ? '' : `${t.available.toLocaleString()} disponibles`}</div>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="page event-detail">
    <div class="container">
      <!-- Back button -->
      <button class="btn btn-ghost btn-sm mb24" data-action="go-back">← Volver</button>

      <!-- Banner -->
      <div class="event-hero-banner">
        <img src="${c.cover}" alt="${c.artist}" />
        <div class="banner-overlay" style="background:linear-gradient(135deg,rgba(8,8,16,0.9) 0%,rgba(8,8,16,0.2) 70%)">
          <span class="banner-genre" style="color:${c.accent}">${c.genre}</span>
          <h1 class="banner-artist">${c.artist}</h1>
          <p class="banner-tour">${c.tour}</p>
        </div>
      </div>

      <div class="detail-layout">
        <!-- Left column -->
        <div>
          <!-- Info -->
          <div class="detail-section">
            <div class="detail-section-title">📋 Información del evento</div>
            <div class="event-info-grid">
              <div class="info-item">
                <div class="info-label">Fecha</div>
                <div class="info-value">${formatDate(c.date)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Hora</div>
                <div class="info-value">${c.time} hrs</div>
              </div>
              <div class="info-item">
                <div class="info-label">Venue</div>
                <div class="info-value highlight">${c.venue}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Ciudad</div>
                <div class="info-value">${c.city}, ${c.country}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Género</div>
                <div class="info-value">${c.genre}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Disponibilidad</div>
                <div class="info-value">${avail.label}</div>
              </div>
            </div>
            <div style="margin-top:16px;background:var(--bg);border-radius:var(--radius);padding:12px;font-size:0.82rem;color:var(--text-muted)">
              <span style="color:var(--cyan);font-weight:700">${sold}% vendido</span> —
              <span>${c.sold.toLocaleString()} de ${c.capacity.toLocaleString()} entradas vendidas</span>
              <div style="height:4px;background:var(--surface2);border-radius:2px;margin-top:8px;overflow:hidden">
                <div style="height:100%;width:${sold}%;background:linear-gradient(90deg,var(--cyan),var(--pink));border-radius:2px;transition:width 1s ease"></div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="detail-section">
            <div class="detail-section-title">🎵 Sobre el show</div>
            <p class="event-description">${c.description}</p>
          </div>

          <!-- Venue / Map -->
          <div class="detail-section">
            <div class="detail-section-title">📍 Ubicación del venue</div>
            <div class="venue-map">
              <div class="venue-map-bg"></div>
              <div class="venue-pin">
                <div class="venue-pin-dot"></div>
                <div class="venue-pin-label">${c.venue}</div>
                <div class="venue-pin-sub">${c.address}</div>
              </div>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <a href="https://maps.google.com/?q=${encodeURIComponent(c.address)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">🗺️ Abrir en Google Maps</a>
              <button class="btn btn-ghost btn-sm">🚇 Cómo llegar</button>
            </div>
          </div>
        </div>

        <!-- Right column — Ticket selector -->
        <div class="ticket-sticky">
          <div class="ticket-card">
            <div class="ticket-card-header">
              <div class="ticket-card-title">Selecciona tu ticket</div>
              <div class="ticket-card-sub">${formatDate(c.date)} · ${c.time} hrs</div>
            </div>
            <div class="ticket-options" id="ticket-options">
              ${ticketOptions}
            </div>
            <div class="ticket-qty-row">
              <span class="qty-label">Cantidad</span>
              <div class="qty-control">
                <button class="qty-btn" id="qty-minus">−</button>
                <span class="qty-value" id="qty-val">1</span>
                <button class="qty-btn" id="qty-plus">+</button>
              </div>
            </div>
            <div class="ticket-total-row">
              <span class="ticket-total-label">Total estimado</span>
              <span class="ticket-total-price" id="ticket-total">${formatPrice(c.tickets[0]?.price || 0)}</span>
            </div>
            <div class="ticket-add-btn">
              <button class="btn btn-primary btn-full btn-lg" id="add-to-cart-btn" data-concert-id="${c.id}">
                🛒 Agregar al carrito
              </button>
            </div>
          </div>
          <div style="margin-top:12px;padding:12px;text-align:center;font-size:0.78rem;color:var(--text-dim)">
            🔒 Pago 100% seguro · Reembolsos en 48 hrs · Tickets digitales
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── CART PAGE ──────────────────────────────────── */
function renderCart() {
  if (State.cart.length === 0) {
    return `
    <div class="page cart-page">
      <div class="container">
        <h1 class="cart-title">MI CARRITO</h1>
        <div class="cart-empty">
          <div class="cart-empty-icon">🎟️</div>
          <div class="cart-empty-title">¡Tu carrito está vacío!</div>
          <p class="cart-empty-sub">Explora los próximos conciertos y agrega tus tickets favoritos.</p>
          <button class="btn btn-primary btn-lg" data-route="/events">Explorar eventos</button>
        </div>
      </div>
    </div>`;
  }

  const subtotal = State.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const service  = Math.round(subtotal * 0.06);
  const total    = subtotal + service;

  const itemsHTML = State.cart.map(item => {
    const concert = CONCERTS.find(c => c.id === item.concertId);
    if (!concert) return '';
    return `
    <div class="cart-item" data-cart-key="${item.key}">
      <img class="cart-item-img" src="${concert.image}" alt="${concert.artist}" />
      <div>
        <div class="cart-item-artist">${concert.artist}</div>
        <div class="cart-item-type">${item.type}</div>
        <div class="cart-item-meta">${formatDate(concert.date)} · ${concert.venue}</div>
        <div class="cart-item-meta" style="margin-top:4px">Cantidad: <strong>${item.qty}</strong></div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
        <button class="cart-item-remove" data-action="remove-cart-item" data-key="${item.key}">✕ Eliminar</button>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="page cart-page">
    <div class="container">
      <h1 class="cart-title">MI CARRITO</h1>
      <div class="cart-layout">
        <div>
          <div class="cart-items">${itemsHTML}</div>
        </div>
        <div>
          <div class="order-summary">
            <div class="order-summary-title">Resumen del pedido</div>
            <div class="summary-line"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
            <div class="summary-line"><span>Cargo por servicio (6%)</span><span>${formatPrice(service)}</span></div>
            <div class="summary-line total"><span>Total</span><span class="val">${formatPrice(total)}</span></div>
            <div class="coupon-row">
              <input type="text" class="coupon-input" id="coupon-input" placeholder="Código de descuento" />
              <button class="btn btn-ghost btn-sm" id="coupon-btn">Aplicar</button>
            </div>
            <button class="btn btn-primary btn-full btn-lg" data-route="/checkout">Proceder al pago →</button>
            <button class="btn btn-ghost btn-full mt8" style="margin-top:8px" data-route="/events">← Seguir comprando</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── CHECKOUT PAGE ──────────────────────────────── */
function renderCheckout() {
  if (State.cart.length === 0) { navigate('/cart'); return ''; }
  if (!State.user) { navigate('/login'); return ''; }

  const subtotal = State.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const service  = Math.round(subtotal * 0.06);
  const total    = subtotal + service;

  const summaryItems = State.cart.map(item => {
    const c = CONCERTS.find(x => x.id === item.concertId);
    return `<div class="summary-line"><span>${c?.artist} — ${item.type} ×${item.qty}</span><span>${formatPrice(item.price * item.qty)}</span></div>`;
  }).join('');

  return `
  <div class="page checkout-page">
    <div class="container">
      <h1 class="checkout-title">CHECKOUT</h1>
      <div class="checkout-steps">
        <div class="checkout-step active">1. Datos personales</div>
        <div class="checkout-step active">2. Pago</div>
        <div class="checkout-step">3. Confirmación</div>
      </div>
      <div class="checkout-layout">
        <div>
          <div class="form-card">
            <div class="form-section-title">👤 Datos del comprador</div>
            <div class="form-row cols2">
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input class="form-input" id="f-name" placeholder="Tu nombre" value="${State.user?.name?.split(' ')[0] || ''}" />
                <span class="form-error hidden" id="e-name">Campo requerido</span>
              </div>
              <div class="form-group">
                <label class="form-label">Apellido</label>
                <input class="form-input" id="f-lastname" placeholder="Tu apellido" />
                <span class="form-error hidden" id="e-lastname">Campo requerido</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Correo electrónico</label>
                <input class="form-input" id="f-email" type="email" placeholder="correo@ejemplo.com" value="${State.user?.email || ''}" />
                <span class="form-error hidden" id="e-email">Correo inválido</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input class="form-input" id="f-phone" type="tel" placeholder="+52 55 1234 5678" />
              </div>
            </div>

            <div class="divider"></div>

            <div class="form-section-title">💳 Información de pago</div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nombre en la tarjeta</label>
                <input class="form-input" id="f-cardname" placeholder="Como aparece en tu tarjeta" />
                <span class="form-error hidden" id="e-cardname">Campo requerido</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Número de tarjeta</label>
                <div class="card-input-wrap">
                  <input class="form-input" id="f-cardnum" placeholder="1234 5678 9012 3456" maxlength="19" />
                  <div class="card-icons">💳</div>
                </div>
                <span class="form-error hidden" id="e-cardnum">Número de tarjeta inválido</span>
              </div>
            </div>
            <div class="form-row cols2">
              <div class="form-group">
                <label class="form-label">Fecha de expiración</label>
                <input class="form-input" id="f-expiry" placeholder="MM / AA" maxlength="7" />
                <span class="form-error hidden" id="e-expiry">Fecha inválida</span>
              </div>
              <div class="form-group">
                <label class="form-label">CVV</label>
                <input class="form-input" id="f-cvv" placeholder="123" maxlength="4" type="password" />
                <span class="form-error hidden" id="e-cvv">CVV inválido</span>
              </div>
            </div>

            <div style="margin-top:8px;padding:12px;background:var(--cyan-dim);border:1px solid rgba(0,229,255,0.2);border-radius:var(--radius);font-size:0.82rem;color:var(--text-muted)">
              🔒 Tus datos están protegidos con encriptación SSL de 256 bits. Nunca almacenamos información de tu tarjeta.
            </div>
          </div>
        </div>

        <div>
          <div class="order-summary" style="position:sticky;top:calc(var(--nav-h) + 24px)">
            <div class="order-summary-title">Tu pedido</div>
            ${summaryItems}
            <div class="summary-line"><span>Cargo por servicio</span><span>${formatPrice(service)}</span></div>
            <div class="summary-line total"><span>Total</span><span class="val">${formatPrice(total)}</span></div>
            <button class="btn btn-pink btn-full btn-lg" id="pay-btn" style="margin-top:20px">
              🔒 Pagar ${formatPrice(total)}
            </button>
            <p style="text-align:center;font-size:0.75rem;color:var(--text-dim);margin-top:12px">
              Al continuar aceptas los Términos de Servicio y la Política de Privacidad de NeonStage.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── CONFIRMATION PAGE ──────────────────────────── */
function renderConfirmation() {
  const order = State.orders[State.orders.length - 1];
  if (!order) { navigate('/'); return ''; }

  const ticketsHTML = order.items.map(item => {
    const c = CONCERTS.find(x => x.id === item.concertId);
    if (!c) return '';
    const dateStr = new Date(c.date + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
    return `
    <div class="digital-ticket">
      <div class="dt-header" style="background:linear-gradient(135deg,${c.color}99,${c.accent}33)">
        <div style="font-size:1.6rem;font-family:var(--font-display);letter-spacing:0.03em">${c.artist}</div>
        <div class="dt-event">${c.tour}</div>
        <div class="dt-type" style="color:${item.type === 'VIP' || item.type.includes('VIP') ? 'var(--gold)' : 'var(--cyan)'}">${item.type}</div>
      </div>
      <hr class="dt-divider" />
      <div class="dt-body">
        <div class="dt-row"><span class="label">Fecha</span><span class="val">${dateStr}</span></div>
        <div class="dt-row"><span class="label">Hora</span><span class="val">${c.time} hrs</span></div>
        <div class="dt-row"><span class="label">Venue</span><span class="val">${c.venue}</span></div>
        <div class="dt-row"><span class="label">Cantidad</span><span class="val">${item.qty} ${item.qty > 1 ? 'tickets' : 'ticket'}</span></div>
        <div class="dt-barcode">
          <div class="barcode-img">▌▊▌▌▊▌▊▌▌▊▌</div>
          <div class="barcode-num">${item.ticketCode}</div>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="page">
    <div class="confirm-page container">
      <div class="confirm-icon">🎉</div>
      <h1 class="confirm-title">¡COMPRA EXITOSA!</h1>
      <p class="confirm-sub">
        Tu orden <strong>${order.id}</strong> ha sido confirmada.<br>
        Recibirás tus tickets en <strong>${order.email}</strong> en los próximos minutos.
      </p>
      <div class="tickets-container">${ticketsHTML}</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
        <button class="btn btn-primary btn-lg" data-route="/profile">Ver mis tickets</button>
        <button class="btn btn-ghost btn-lg" data-route="/events">Seguir comprando</button>
      </div>
    </div>
  </div>`;
}

/* ── AUTH PAGE ──────────────────────────────────── */
function renderAuth(tab = 'login') {
  return `
  <div class="page auth-page">
    <div class="auth-card">
      <div class="auth-logo">NEONSTAGE</div>
      <p class="auth-tagline">Tu destino para los mejores conciertos</p>
      <div class="tab-row">
        <button class="tab-btn ${tab === 'login' ? 'active' : ''}" id="tab-login">Iniciar sesión</button>
        <button class="tab-btn ${tab === 'register' ? 'active' : ''}" id="tab-register">Crear cuenta</button>
      </div>

      <!-- Login Form -->
      <div id="form-login" ${tab !== 'login' ? 'style="display:none"' : ''}>
        <button class="social-btn" id="google-login-btn">
          <span style="font-size:1.1rem">G</span> Continuar con Google
        </button>
        <div class="auth-separator">o</div>
        <div class="form-group mb16">
          <label class="form-label">Correo electrónico</label>
          <input class="form-input" id="login-email" type="email" placeholder="correo@ejemplo.com" />
          <span class="form-error hidden" id="login-email-err">Correo inválido</span>
        </div>
        <div class="form-group mb16">
          <label class="form-label">Contraseña</label>
          <input class="form-input" id="login-pass" type="password" placeholder="••••••••" />
          <span class="form-error hidden" id="login-pass-err">Contraseña incorrecta</span>
        </div>
        <button class="btn btn-primary btn-full btn-lg" id="login-btn">Iniciar sesión</button>
        <p style="text-align:center;font-size:0.82rem;color:var(--text-muted);margin-top:16px">
          ¿No tienes cuenta? <a style="color:var(--cyan);cursor:pointer" id="switch-to-register">Regístrate gratis</a>
        </p>
      </div>

      <!-- Register Form -->
      <div id="form-register" ${tab !== 'register' ? 'style="display:none"' : ''}>
        <div class="form-group mb16">
          <label class="form-label">Nombre completo</label>
          <input class="form-input" id="reg-name" placeholder="Tu nombre completo" />
          <span class="form-error hidden" id="reg-name-err">Nombre requerido</span>
        </div>
        <div class="form-group mb16">
          <label class="form-label">Correo electrónico</label>
          <input class="form-input" id="reg-email" type="email" placeholder="correo@ejemplo.com" />
          <span class="form-error hidden" id="reg-email-err">Correo inválido o ya registrado</span>
        </div>
        <div class="form-group mb16">
          <label class="form-label">Contraseña</label>
          <input class="form-input" id="reg-pass" type="password" placeholder="Mínimo 6 caracteres" />
          <span class="form-error hidden" id="reg-pass-err">Mínimo 6 caracteres</span>
        </div>
        <button class="btn btn-primary btn-full btn-lg" id="register-btn">Crear cuenta gratis</button>
        <p style="text-align:center;font-size:0.82rem;color:var(--text-muted);margin-top:16px">
          ¿Ya tienes cuenta? <a style="color:var(--cyan);cursor:pointer" id="switch-to-login">Inicia sesión</a>
        </p>
      </div>
    </div>
  </div>`;
}

/* ── PROFILE PAGE ───────────────────────────────── */
function renderProfile(activeTab = 'orders') {
  if (!State.user) { navigate('/login'); return ''; }

  const userOrders = State.orders.filter(o => o.userId === State.user.id);
  const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
  const totalTickets = userOrders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0);

  const ordersHTML = userOrders.length === 0
    ? `<div class="no-results"><div class="no-results-icon">🎟️</div><div class="no-results-title">Sin compras aún</div><p>Explora nuestros eventos y compra tus primeros tickets.</p><button class="btn btn-primary mt24" data-route="/events">Ver eventos</button></div>`
    : userOrders.slice().reverse().map(order => {
        const itemsHTML = order.items.map(item => {
          const c = CONCERTS.find(x => x.id === item.concertId);
          return `<div class="order-item-row"><span>${c?.artist || 'Concierto'} — ${item.type} ×${item.qty}</span><span>${formatPrice(item.price * item.qty)}</span></div>`;
        }).join('');
        return `
        <div class="order-card">
          <div class="order-card-header">
            <div>
              <div class="order-id">${order.id}</div>
              <div style="font-size:0.82rem;color:var(--text-muted)">${new Date(order.date).toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'})}</div>
              <div class="order-total" style="margin-top:4px">${formatPrice(order.total)}</div>
            </div>
            <span class="order-status confirmed">✓ Confirmada</span>
          </div>
          <div class="order-items">${itemsHTML}</div>
        </div>`;
      }).join('');

  const ticketsHTML = userOrders.length === 0
    ? `<div class="no-results"><div class="no-results-icon">🎫</div><div class="no-results-title">Sin tickets</div><p>Compra tu primer ticket para verlo aquí.</p></div>`
    : userOrders.slice().reverse().flatMap(o => o.items.map(item => {
        const c = CONCERTS.find(x => x.id === item.concertId);
        if (!c) return '';
        const dateStr = new Date(c.date + 'T00:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'});
        return `
        <div class="order-card" style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
          <img src="${c.image}" style="width:80px;height:80px;object-fit:cover;border-radius:var(--radius);flex-shrink:0" alt="${c.artist}"/>
          <div style="flex:1">
            <div style="font-family:var(--font-display);font-size:1.3rem">${c.artist}</div>
            <div style="color:var(--cyan);font-size:0.82rem;font-weight:700">${item.type}</div>
            <div style="font-size:0.82rem;color:var(--text-muted)">${dateStr} · ${c.venue}</div>
          </div>
          <div style="text-align:right;font-family:monospace;font-size:0.75rem;color:var(--text-dim)">${item.ticketCode}</div>
        </div>`;
      })).join('');

  return `
  <div class="page profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="profile-avatar">${State.user.name[0].toUpperCase()}</div>
        <div>
          <div class="profile-name">${State.user.name}</div>
          <div class="profile-email">${State.user.email}</div>
          <div class="profile-stats">
            <div>
              <div class="profile-stat-val">${userOrders.length}</div>
              <div class="profile-stat-lbl">Compras</div>
            </div>
            <div>
              <div class="profile-stat-val">${totalTickets}</div>
              <div class="profile-stat-lbl">Tickets</div>
            </div>
            <div>
              <div class="profile-stat-val">${formatPrice(totalSpent)}</div>
              <div class="profile-stat-lbl">Total gastado</div>
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" style="margin-left:auto;align-self:flex-start" id="logout-btn">Cerrar sesión</button>
      </div>

      <div class="profile-tabs">
        <button class="profile-tab ${activeTab === 'orders' ? 'active' : ''}" data-profile-tab="orders">📋 Historial de compras</button>
        <button class="profile-tab ${activeTab === 'tickets' ? 'active' : ''}" data-profile-tab="tickets">🎟️ Mis tickets</button>
      </div>

      <div id="profile-content">
        ${activeTab === 'orders' ? ordersHTML : ticketsHTML}
      </div>
    </div>
  </div>`;
}

/* ── 404 Page ───────────────────────────────────── */
function render404() {
  return `
  <div class="page">
    <div class="container" style="text-align:center;padding:100px 20px">
      <div style="font-size:8rem;line-height:1">🎵</div>
      <h1 style="font-family:var(--font-display);font-size:5rem;color:var(--pink)">404</h1>
      <p style="color:var(--text-muted);margin:16px 0 32px">Esta página no existe... ¡pero los conciertos sí!</p>
      <button class="btn btn-primary btn-lg" data-route="/">Volver al inicio</button>
    </div>
  </div>`;
}

/* ── Event Binding ──────────────────────────────── */
function bindEvents(route, param) {
  const app = document.getElementById('app');

  // ── Global delegation
  app.addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    const r = e.target.closest('[data-route]');

    if (r) { navigate(r.dataset.route); return; }

    if (t) {
      const action = t.dataset.action;
      if (action === 'goto-home')    navigate('/');
      if (action === 'goto-events')  navigate('/events');
      if (action === 'goto-cart')    navigate('/cart');
      if (action === 'goto-login')   navigate('/login');
      if (action === 'goto-profile') navigate('/profile');
      if (action === 'go-back')      window.history.back();
      if (action === 'goto-event')   navigate(`/event/${t.dataset.id}`);
      if (action === 'remove-cart-item') {
        removeFromCart(t.dataset.key);
      }
    }
  });

  // ── Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('nav-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      drawer.classList.toggle('open');
    });
  }

  // ── Home filter pills
  if (route === '/') {
    const pills = document.getElementById('home-pills');
    if (pills) {
      pills.addEventListener('click', e => {
        const pill = e.target.closest('.pill');
        if (!pill) return;
        pills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const genre = pill.dataset.genre;
        const grid  = document.getElementById('home-grid');
        let list = genre === 'all' ? CONCERTS.slice(0, 6)
          : CONCERTS.filter(c => c.genre.toLowerCase().includes(genre.toLowerCase())).slice(0, 6);
        grid.innerHTML = list.map(renderConcertCard).join('');
        // Re-bind card clicks inside grid
        grid.querySelectorAll('[data-action="goto-event"]').forEach(el => {
          el.addEventListener('click', () => navigate(`/event/${el.dataset.id}`));
        });
      });
    }
  }

  // ── Events page filters
  if (route === '/events') {
    filterAndRenderEvents();
    ['search-input','genre-select','sort-select'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', filterAndRenderEvents);
      document.getElementById(id)?.addEventListener('change', filterAndRenderEvents);
    });
  }

  // ── Event detail page
  if (route === '/event') {
    const concertId = parseInt(param);
    const concert   = CONCERTS.find(c => c.id === concertId);
    if (!concert) return;

    let selectedIdx = concert.tickets.findIndex(t => t.available > 0);
    if (selectedIdx < 0) selectedIdx = 0;
    let qty = 1;

    const updateTotal = () => {
      const t = concert.tickets[selectedIdx];
      const totalEl = document.getElementById('ticket-total');
      if (totalEl) totalEl.textContent = formatPrice(t.price * qty);
    };

    // Select ticket type
    document.querySelectorAll('.ticket-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.ticket-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedIdx = parseInt(opt.dataset.ticketIdx);
        qty = 1;
        const qtyVal = document.getElementById('qty-val');
        if (qtyVal) qtyVal.textContent = 1;
        updateTotal();
      });
    });

    // Quantity controls
    document.getElementById('qty-minus')?.addEventListener('click', () => {
      if (qty > 1) { qty--; document.getElementById('qty-val').textContent = qty; updateTotal(); }
    });
    document.getElementById('qty-plus')?.addEventListener('click', () => {
      const maxQty = Math.min(10, concert.tickets[selectedIdx].available);
      if (qty < maxQty) { qty++; document.getElementById('qty-val').textContent = qty; updateTotal(); }
    });

    // Add to cart
    document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
      const ticket = concert.tickets[selectedIdx];
      if (ticket.available === 0) { toast('Este ticket está agotado', 'error'); return; }
      addToCart(concertId, selectedIdx, ticket.type, ticket.price, qty);
    });
  }

  // ── Cart page
  if (route === '/cart') {
    document.getElementById('coupon-btn')?.addEventListener('click', () => {
      const val = document.getElementById('coupon-input')?.value.trim().toUpperCase();
      if (val === 'NEONSTAGE10') toast('✨ Cupón aplicado: 10% de descuento', 'success');
      else toast('Cupón inválido o expirado', 'error');
    });
  }

  // ── Checkout page
  if (route === '/checkout') {
    // Format card number
    document.getElementById('f-cardnum')?.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g,'').substring(0, 16);
      e.target.value = v.replace(/(.{4})/g,'$1 ').trim();
    });
    // Format expiry
    document.getElementById('f-expiry')?.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g,'').substring(0, 4);
      if (v.length >= 2) v = v.substring(0,2) + ' / ' + v.substring(2);
      e.target.value = v;
    });
    // Pay button
    document.getElementById('pay-btn')?.addEventListener('click', processPayment);
  }

  // ── Auth page
  if (route === '/login') {
    document.getElementById('tab-login')?.addEventListener('click', () => toggleAuthTab('login'));
    document.getElementById('tab-register')?.addEventListener('click', () => toggleAuthTab('register'));
    document.getElementById('switch-to-register')?.addEventListener('click', () => toggleAuthTab('register'));
    document.getElementById('switch-to-login')?.addEventListener('click', () => toggleAuthTab('login'));
    document.getElementById('login-btn')?.addEventListener('click', doLogin);
    document.getElementById('register-btn')?.addEventListener('click', doRegister);
    document.getElementById('google-login-btn')?.addEventListener('click', doGoogleLogin);
  }

  // ── Profile page
  if (route === '/profile') {
    document.querySelectorAll('[data-profile-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('app').innerHTML =
          renderNav() + renderProfile(btn.dataset.profileTab) + renderFooter();
        bindEvents('/profile', null);
        highlightNavLink('/profile');
      });
    });
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      State.user = null;
      saveUser();
      toast('Sesión cerrada. ¡Hasta pronto!', 'info');
      navigate('/');
    });
  }
}

/* ── Cart Logic ─────────────────────────────────── */
function addToCart(concertId, ticketIdx, type, price, qty) {
  const key = `${concertId}-${ticketIdx}`;
  const existing = State.cart.find(i => i.key === key);

  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 10);
  } else {
    State.cart.push({ key, concertId, ticketIdx, type, price, qty });
  }
  saveCart();

  const concert = CONCERTS.find(c => c.id === concertId);
  toast(`🎟️ ${concert?.artist} — ${type} ×${qty} agregado al carrito`);

  // Update badge
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const count = State.cart.reduce((s, i) => s + i.qty, 0);
    let badge = navbar.querySelector('.cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      navbar.querySelector('.nav-cart-btn')?.appendChild(badge);
    }
    badge.textContent = count;
  }
}

function removeFromCart(key) {
  State.cart = State.cart.filter(i => i.key !== key);
  saveCart();
  toast('Ticket eliminado del carrito', 'info');
  // Re-render cart
  const app = document.getElementById('app');
  app.innerHTML = renderNav() + renderCart() + renderFooter();
  bindEvents('/cart', null);
  highlightNavLink('/cart');
}

/* ── Payment Processing ─────────────────────────── */
function processPayment() {
  // Validate form
  let valid = true;
  const validate = (id, errId, condition) => {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    if (el && err) {
      const ok = condition(el.value);
      err.classList.toggle('hidden', ok);
      el.classList.toggle('error', !ok);
      if (!ok) valid = false;
    }
  };

  validate('f-name',     'e-name',     v => v.trim().length > 0);
  validate('f-lastname', 'e-lastname', v => v.trim().length > 0);
  validate('f-email',    'e-email',    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  validate('f-cardname', 'e-cardname', v => v.trim().length > 1);
  validate('f-cardnum',  'e-cardnum',  v => v.replace(/\s/g,'').length === 16);
  validate('f-expiry',   'e-expiry',   v => /^\d{2}\s*\/\s*\d{2}$/.test(v));
  validate('f-cvv',      'e-cvv',      v => v.length >= 3);

  if (!valid) { toast('Por favor corrige los errores del formulario', 'error'); return; }

  // Simulate payment processing
  const payBtn = document.getElementById('pay-btn');
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.textContent = '⏳ Procesando pago...';
  }

  setTimeout(() => {
    // Create order
    const subtotal = State.cart.reduce((s, i) => s + i.price * i.qty, 0);
    const service  = Math.round(subtotal * 0.06);
    const total    = subtotal + service;

    const order = {
      id:     generateOrderId(),
      userId: State.user.id,
      email:  document.getElementById('f-email')?.value || State.user.email,
      date:   new Date().toISOString(),
      total,
      items:  State.cart.map(item => ({
        ...item,
        ticketCode: generateTicketCode()
      }))
    };

    State.orders.push(order);
    saveOrders();
    State.cart = [];
    saveCart();

    navigate('/confirmation');
  }, 2200);
}

/* ── Auth Logic ─────────────────────────────────── */
function toggleAuthTab(tab) {
  document.getElementById('form-login').style.display    = tab === 'login'    ? '' : 'none';
  document.getElementById('form-register').style.display = tab === 'register' ? '' : 'none';
  document.getElementById('tab-login').classList.toggle('active',    tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
}

function doLogin() {
  const email = document.getElementById('login-email')?.value.trim();
  const pass  = document.getElementById('login-pass')?.value;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById('login-email-err')?.classList.toggle('hidden', emailOk);
  document.getElementById('login-email')?.classList.toggle('error', !emailOk);
  if (!emailOk) return;

  const user = State.users.find(u => u.email === email && u.password === pass);
  if (!user) {
    document.getElementById('login-pass-err')?.classList.remove('hidden');
    document.getElementById('login-pass')?.classList.add('error');
    toast('Correo o contraseña incorrectos', 'error');
    return;
  }

  State.user = { id: user.id, name: user.name, email: user.email };
  saveUser();
  toast(`¡Bienvenido de nuevo, ${user.name.split(' ')[0]}! 🎉`);
  navigate('/');
}

function doRegister() {
  const name  = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();
  const pass  = document.getElementById('reg-pass')?.value;

  let valid = true;
  if (!name) { document.getElementById('reg-name-err')?.classList.remove('hidden'); valid = false; }
  else document.getElementById('reg-name-err')?.classList.add('hidden');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !State.users.find(u => u.email === email);
  if (!emailOk) { document.getElementById('reg-email-err')?.classList.remove('hidden'); valid = false; }
  else document.getElementById('reg-email-err')?.classList.add('hidden');

  const passOk = pass.length >= 6;
  if (!passOk) { document.getElementById('reg-pass-err')?.classList.remove('hidden'); valid = false; }
  else document.getElementById('reg-pass-err')?.classList.add('hidden');

  if (!valid) return;

  const newUser = { id: Date.now(), name, email, password: pass, joined: new Date().toISOString() };
  State.users.push(newUser);
  saveUsers();

  State.user = { id: newUser.id, name, email };
  saveUser();
  toast(`¡Cuenta creada! Bienvenido, ${name.split(' ')[0]} 🎉`);
  navigate('/');
}

function doGoogleLogin() {
  // Simulado: crea un usuario Google ficticio
  const mockName  = 'Usuario Google';
  const mockEmail = 'usuario@gmail.com';
  let user = State.users.find(u => u.email === mockEmail);
  if (!user) {
    user = { id: Date.now(), name: mockName, email: mockEmail, password: '', joined: new Date().toISOString() };
    State.users.push(user);
    saveUsers();
  }
  State.user = { id: user.id, name: user.name, email: user.email };
  saveUser();
  toast(`¡Bienvenido, ${mockName.split(' ')[0]}! 🎉`);
  navigate('/');
}
