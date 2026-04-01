/* inventory.js — two-tier category/tag filter system */
(function () {
  const gsList   = document.getElementById('gs-items');
  const catTabs  = document.querySelectorAll('.cat-tab');
  const panels   = document.querySelectorAll('.sub-panel');
  const subLinks = document.querySelectorAll('.sub-link');

  // Helper: get all tags from a panel's sub-links
  function getPanelTags(group) {
    const panel = document.querySelector(`.sub-panel[data-panel="${group}"]`);
    if (!panel) return '';
    const links = panel.querySelectorAll('.sub-link[data-tag]');
    return Array.from(links).map(l => l.dataset.tag).join(',');
  }

  // Helper: apply a filter to Goodshuffle
  function applyFilter(tag) {
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
          catTabs.forEach(t => {
            t.classList.toggle('active', t.dataset.group === group);
          });
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

      if (group === 'all') {
        // Show everything
        applyFilter('');
        updateURL('');
      } else {
        // Open the sub-panel
        const target = document.querySelector(`.sub-panel[data-panel="${group}"]`);
        if (target) target.classList.add('open');

        // Show ALL items in this category by combining all its tags
        const allTags = getPanelTags(group);
        applyFilter(allTags);
        updateURL(allTags);
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
      applyFilter(tag);
      updateURL(tag);
    });
  });
})();
