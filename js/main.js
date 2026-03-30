/* ============================================================
   Vertex Events — main.js (shared)
   ============================================================ */

// ── THEME TOGGLE (light = default) ──
(function () {
  const html    = document.documentElement;
  const DARK    = 'dark';
  const KEY     = 'vx-theme';

  // Apply saved preference (default = light, so only set if user chose dark)
  const saved = localStorage.getItem(KEY);
  if (saved === DARK) html.setAttribute('data-theme', DARK);

  function setToggleState(isDark) {
    document.querySelectorAll('.theme-toggle-icon').forEach((el, i) => {
      if (i === 0) el.textContent = isDark ? '🌙' : '☀️';
    });
  }

  function toggleTheme() {
    const isDark = html.getAttribute('data-theme') === DARK;
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem(KEY, 'light');
      setToggleState(false);
    } else {
      html.setAttribute('data-theme', DARK);
      localStorage.setItem(KEY, DARK);
      setToggleState(true);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const isDark = html.getAttribute('data-theme') === DARK;
    setToggleState(isDark);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });
})();

// ── NAVBAR scroll ──
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── MOBILE MENU ──
(function () {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn   = document.getElementById('mobile-close');
  if (!hamburger || !mobileMenu) return;

  const open  = () => { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

// ── SCROLL REVEAL ──
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach(el => observer.observe(el));
})();

// ── HERO IMAGE Ken Burns ──
(function () {
  const img = document.querySelector('.hero-img');
  if (!img) return;
  img.addEventListener('load', () => img.classList.add('loaded'));
  if (img.complete) img.classList.add('loaded');
})();
