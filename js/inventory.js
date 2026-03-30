/* ============================================================
   Vertex Events — inventory.js  (category filter)
   ============================================================ */

(function () {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const gsList      = document.getElementById('gs-items');

  // Apply category from URL param on load
  const urlParams = new URLSearchParams(window.location.search);
  const initCat   = urlParams.get('category') || '';

  if (initCat && gsList) {
    gsList.setAttribute('data-category', initCat);
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === initCat);
    });
  }

  // Filter button clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      if (gsList) {
        if (cat) {
          gsList.setAttribute('data-category', cat);
        } else {
          gsList.removeAttribute('data-category');
        }
      }

      // Update URL without reload
      const url = new URL(window.location);
      if (cat) {
        url.searchParams.set('category', cat);
      } else {
        url.searchParams.delete('category');
      }
      window.history.pushState({}, '', url);
    });
  });
})();
