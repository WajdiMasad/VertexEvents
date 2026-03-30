/* ============================================================
   Vertex Events — home.js  (homepage particle effect)
   ============================================================ */

(function () {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 28;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left    = Math.random() * 100 + '%';
    p.style.top     = (40 + Math.random() * 55) + '%';
    p.style.setProperty('--dur',   (6 + Math.random() * 7) + 's');
    p.style.setProperty('--delay', (Math.random() * 6) + 's');
    p.style.width   = p.style.height = (2 + Math.random() * 3) + 'px';
    p.style.opacity = 0;
    container.appendChild(p);
  }
})();
