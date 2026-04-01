/* inventory.js — two-tier category/tag filter system */
(function () {
  const gsList   = document.getElementById('gs-items');
  const catTabs  = document.querySelectorAll('.cat-tab');
  const panels   = document.querySelectorAll('.sub-panel');
  const subLinks = document.querySelectorAll('.sub-link');

  // Helper: clear all filters
  function clearFilters() {
    if (!gsList) return;
    gsList.removeAttribute('category');
    gsList.removeAttribute('tags');
  }

  // Helper: apply a tag filter
  function applyTag(tag) {
    if (!gsList) return;
    gsList.removeAttribute('category');
    gsList.removeAttribute('tags');
    if (tag) gsList.setAttribute('tags', tag);
  }

  // Helper: update the URL
  function updateURL(tag) {
    const url = new URL(window.location);
    url.searchParams.delete('category');
    url.searchParams.delete('tags');
    if (tag) url.searchParams.set('tags', tag);
    window.history.pushState({}, '', url);
  }

  // ── Read URL params on load ──
  const params  = new URLSearchParams(window.location.search);
  const initTag = params.get('tags') || '';

  if (initTag && gsList) {
    gsList.setAttribute('tags', initTag);
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

      // Always show all items when clicking a category tab
      clearFilters();
      updateURL('');

      // Open the relevant sub-panel (except for "all")
      if (group !== 'all') {
        const target = document.querySelector(`.sub-panel[data-panel="${group}"]`);
        if (target) target.classList.add('open');
      }
    });
  });

  // ── Sub-link clicks — this is where the actual filtering happens ──
  subLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = link.dataset.tag;

      // Highlight this sub-link only
      subLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Filter to this single tag
      applyTag(tag);
      updateURL(tag);
    });
  });
})();
