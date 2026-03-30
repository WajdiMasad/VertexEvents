/* ============================================================
   Vertex Events — Premium UX Scripts (main.js)
   ============================================================ */

const html = document.documentElement;

// ── 1. LENIS SMOOTH SCROLL ──
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ── 2. PRELOADER & STARTUP ──
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  
  if (preloader && typeof gsap !== 'undefined') {
    // Prevent scrolling while preloader is active
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        if (lenis) lenis.start();
        document.body.style.overflow = '';
        preloader.style.display = 'none';
        initScrollReveals();
      }
    });

    tl.to('.p-vertex', { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" })
      .to('.p-events', { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, "-=0.6")
      .to('.preloader-brand', { opacity: 0, duration: 0.4, delay: 0.3 })
      .to('.preloader', { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.2");
  } else {
    // No preloader on this page
    initScrollReveals();
  }
});

// ── 3. CUSTOM MAGNETIC CURSOR ──
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let cursorX = mouseX, cursorY = mouseY;
  let followerX = mouseX, followerY = mouseY;
  
  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Only show cursor after first move (avoids it sitting middle of screen)
    if (!document.body.classList.contains('has-custom-cursor')) {
      document.body.classList.add('has-custom-cursor');
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    }
  });

  // Lerp loop for follower
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states
  document.querySelectorAll('a, button, .theme-toggle, input, select, textarea, gspro-wishlist-button').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('active'));
    el.addEventListener('mouseleave', () => follower.classList.remove('active'));
  });

  // Magnetic Buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - (rect.height / 2);
      
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
      follower.classList.add('magnetic');
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      follower.classList.remove('magnetic');
    });
  });
})();

// ── 4. SCROLL REVEALS (GSAP + SplitType) ──
function initScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Split Typography Reveals
  if (typeof SplitType !== 'undefined') {
    const splitText = new SplitType('h1, h2.section-title', { types: 'words, chars' });
    
    // Group animations by the original element so they trigger when that element enters
    document.querySelectorAll('h1, h2.section-title').forEach(heading => {
      const chars = heading.querySelectorAll('.char');
      if (chars.length) {
        gsap.fromTo(chars, 
          { y: 50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: heading,
              start: "top 90%",
              toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            stagger: 0.015,
            duration: 0.8,
            ease: "back.out(1.4)"
          }
        );
      }
    });
  }

  // Standard Fade-ups
  const fadeEls = document.querySelectorAll('.fade-up');
  fadeEls.forEach(el => {
    let delay = 0;
    if (el.classList.contains('delay-1')) delay = 0.1;
    if (el.classList.contains('delay-2')) delay = 0.2;
    if (el.classList.contains('delay-3')) delay = 0.3;

    gsap.fromTo(el, 
      { opacity: 0, y: 40 },
      {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 0,
        opacity: 1,
        duration: 1,
        delay: delay,
        ease: "power3.out"
      }
    );
  });

  // Parallax Images
  document.querySelectorAll('.svc-row-img img, .hero-img').forEach(img => {
    gsap.fromTo(img, 
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { 
          trigger: img.parentElement, 
          start: "top bottom", 
          end: "bottom top", 
          scrub: true 
        }
      }
    );
  });
}

// ── 5. THEME TOGGLE ──
(function initTheme() {
  const DARK = 'dark';
  const KEY  = 'vx-theme';
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
    setToggleState(html.getAttribute('data-theme') === DARK);
    document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme));
  });
})();

// ── 6. NAVBAR & MOBILE MENU ──
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn  = document.getElementById('mobile-close');
  if (hamburger && mobileMenu) {
    const open  = () => { mobileMenu.classList.add('open'); if(lenis) lenis.stop(); else document.body.style.overflow = 'hidden'; };
    const close = () => { mobileMenu.classList.remove('open'); if(lenis) lenis.start(); else document.body.style.overflow = ''; };
    hamburger.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }
})();
