/* inventory.js — clean URL-based filtering, no live attribute manipulation */
(function () {
  const gsList   = document.getElementById('gs-items');
  const catTabs  = document.querySelectorAll('.cat-tab');
  const panels   = document.querySelectorAll('.sub-panel');
  const subLinks = document.querySelectorAll('.sub-link');

  // Read what's in the URL right now
  const params  = new URLSearchParams(window.location.search);
  const initTag = params.get('tags') || '';
  const initCat = params.get('category') || '';

  // Apply on page load — component reads these once and works correctly
  if (gsList) {
    if (initCat) gsList.setAttribute('category', initCat);
    if (initTag) gsList.setAttribute('tags', initTag);
  }

  // Highlight active tab based on URL
  if (initCat) {
    catTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.category === initCat);
    });
    const activeTab = document.querySelector(`.cat-tab[data-category="${initCat}"]`);
    if (activeTab) {
      const panel = document.querySelector(`.sub-panel[data-panel="${activeTab.dataset.group}"]`);
      if (panel) panel.classList.add('open');
    }
  } else if (initTag) {
    subLinks.forEach(link => {
      if (link.dataset.tag === initTag) {
        link.classList.add('active');
        const panel = link.closest('.sub-panel');
        if (panel) {
          panel.classList.add('open');
          const group = panel.dataset.panel;
          catTabs.forEach(t => t.classList.toggle('active', t.dataset.group === group));
        }
      }
    });
  } else {
    // No filter — All Items is active
    document.querySelector('.cat-tab[data-group="all"]')?.classList.add('active');
  }

  // ── Category tab clicks — navigate to page with default sub-tag ──
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group      = tab.dataset.group;
      const defaultTag = tab.dataset.defaultTag || '';

      if (group === 'all') {
        window.location.href = 'inventory.html';
        return;
      }

      // Navigate with the default tag for this category
      if (defaultTag) {
        window.location.href = `inventory.html?tags=${encodeURIComponent(defaultTag)}`;
        return;
      }

      // Fallback: just open the sub-panel without filtering
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach(p => p.classList.remove('open'));
      const target = document.querySelector(`.sub-panel[data-panel="${group}"]`);
      if (target) target.classList.add('open');
    });
  });

  // ── Sub-link clicks — navigate with tags param ──
  subLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = link.dataset.tag;
      window.location.href = `inventory.html?tags=${encodeURIComponent(tag)}`;
    });
  });
})();
