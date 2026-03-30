/* inventory.js — fix: uses category="" attribute per Goodshuffle docs */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gsList     = document.getElementById('gs-items');

  // Apply from URL param on load
  const initCat = new URLSearchParams(window.location.search).get('category') || '';
  if (initCat && gsList) {
    gsList.setAttribute('category', initCat);
    filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.cat === initCat));
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      if (gsList) {
        cat ? gsList.setAttribute('category', cat) : gsList.removeAttribute('category');
      }
      const url = new URL(window.location);
      cat ? url.searchParams.set('category', cat) : url.searchParams.delete('category');
      window.history.pushState({}, '', url);
    });
  });
})();
