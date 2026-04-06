(function () {
  function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.3,
      o: Math.random(),
      v: Math.random() * 0.008 + 0.002,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        s.o += s.v;
        if (s.o > 1 || s.o < 0) s.v *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.o * 0.6})`;
        ctx.fill();
      });
      window.requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars.forEach((s) => {
        s.x = Math.random() * width;
        s.y = Math.random() * height;
      });
    });
  }

  function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('nav-drawer');
    if (!hamburger || !drawer) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      drawer.classList.toggle('open');
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
      });
    });
  }

  function initFlashToasts() {
    const container = document.getElementById('toast-container');
    if (!container) return;

    container.querySelectorAll('.toast').forEach((toastEl) => {
      setTimeout(() => {
        toastEl.classList.add('removing');
        setTimeout(() => toastEl.remove(), 300);
      }, 3200);
    });
  }

  function initNavbarScrollState() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const toggleScrolled = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    toggleScrolled();
    window.addEventListener('scroll', toggleScrolled, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initHamburgerMenu();
    initFlashToasts();
    initNavbarScrollState();
  });
})();
