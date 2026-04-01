/* inventory.js — two-tier category/tag filter system */
(function () {
  const gsList   = document.getElementById('gs-items');
  const catTabs  = document.querySelectorAll('.cat-tab');
  const panels   = document.querySelectorAll('.sub-panel');
  const subLinks = document.querySelectorAll('.sub-link');

  // Helper: apply a filter to Goodshuffle
  function applyFilter(opts) {
    if (!gsList) return;
    gsList.removeAttribute('category');
    gsList.removeAttribute('tags');
    if (opts.category) gsList.setAttribute('category', opts.category);
    if (opts.tag) gsList.setAttribute('tags', opts.tag);
  }

  // Helper: update the URL
  function updateURL(opts) {
    const url = new URL(window.location);
    url.searchParams.delete('category');
    url.searchParams.delete('tags');
    if (opts.category) url.searchParams.set('category', opts.category);
    if (opts.tag) url.searchParams.set('tags', opts.tag);
    window.history.pushState({}, '', url);
  }

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
          catTabs.forEach(t => t.classList.toggle('active', t.dataset.group === group));
          panels.forEach(p => p.classList.remove('open'));
          panel.classList.add('open');
        }
      }
    });
  }

  // If a category param is present, find the matching tab and activate it
  if (initCat) {
    catTabs.forEach(tab => {
      if (tab.dataset.category === initCat) {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const group = tab.dataset.group;
        panels.forEach(p => p.classList.remove('open'));
        const panel = document.querySelector(`.sub-panel[data-panel="${group}"]`);
        if (panel) panel.classList.add('open');
      }
    });
  }

  // ── Top-level tab clicks ──
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.group;
      const category = tab.dataset.category || '';

      // Update active tab
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Clear sub-link highlights
      subLinks.forEach(l => l.classList.remove('active'));

      // Show/hide sub-panels
      panels.forEach(p => p.classList.remove('open'));

      if (group === 'all') {
        // Show everything
        applyFilter({});
        updateURL({});
      } else {
        // Open the sub-panel
        const target = document.querySelector(`.sub-panel[data-panel="${group}"]`);
        if (target) target.classList.add('open');

        if (category) {
          // Use the Goodshuffle category slug to show all items in this group
          applyFilter({ category: category });
          updateURL({ category: category });
        }
      }
    });
  });

  // ── Sub-link clicks ──
  subLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = link.dataset.tag;

      // Highlight this sub-link only
      subLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Filter to this single tag
      applyFilter({ tag: tag });
      updateURL({ tag: tag });
    });
  });
})();
