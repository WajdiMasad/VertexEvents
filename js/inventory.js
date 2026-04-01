/* inventory.js — two-tier category/tag filter system */
(function () {
  const gsList   = document.getElementById('gs-items');
  const catTabs  = document.querySelectorAll('.cat-tab');
  const panels   = document.querySelectorAll('.sub-panel');
  const subLinks = document.querySelectorAll('.sub-link');

  // ── Read URL params on load ──
  const params  = new URLSearchParams(window.location.search);
  const initTag = params.get('tags') || '';
  const initCat = params.get('category') || '';

  if (gsList) {
    if (initTag) gsList.setAttribute('tags', initTag);
    if (initCat) gsList.setAttribute('category', initCat);
  }

  // If a tag param is present, find which panel it belongs to and open it
  if (initTag) {
    subLinks.forEach(link => {
      if (link.dataset.tag === initTag) {
        link.classList.add('active');
        const panel = link.closest('.sub-panel');
        if (panel) {
          const group = panel.dataset.panel;
          // Activate the parent tab
          catTabs.forEach(t => {
            t.classList.toggle('active', t.dataset.group === group);
          });
          // Show the panel
          panels.forEach(p => p.classList.remove('open'));
          panel.classList.add('open');
        }
      }
    });
  }

  // ── Top-level tab clicks ──
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.group;

      // Update active tab
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Clear sub-link highlights
      subLinks.forEach(l => l.classList.remove('active'));

      // Show/hide sub-panels
      panels.forEach(p => p.classList.remove('open'));
      if (group !== 'all') {
        const target = document.querySelector(`.sub-panel[data-panel="${group}"]`);
        if (target) target.classList.add('open');
      }

      // "All Items" resets the filter
      if (group === 'all' && gsList) {
        gsList.removeAttribute('tags');
        gsList.removeAttribute('category');
        const url = new URL(window.location);
        url.searchParams.delete('tags');
        url.searchParams.delete('category');
        window.history.pushState({}, '', url);
      }
    });
  });

  // ── Sub-link clicks ──
  subLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = link.dataset.tag;

      // Highlight
      subLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Set Goodshuffle attribute
      if (gsList) {
        gsList.removeAttribute('category');
        gsList.removeAttribute('tags');
        if (tag) gsList.setAttribute('tags', tag);
      }

      // Update URL
      const url = new URL(window.location);
      url.searchParams.delete('category');
      url.searchParams.delete('tags');
      if (tag) url.searchParams.set('tags', tag);
      window.history.pushState({}, '', url);
    });
  });
})();
