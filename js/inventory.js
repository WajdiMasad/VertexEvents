/* inventory.js — supports both category and tags filtering */
(function () {
  const catLinks = document.querySelectorAll('.cat-link');
  const gsList   = document.getElementById('gs-items');

  // Read URL params on load
  const params  = new URLSearchParams(window.location.search);
  const initCat = params.get('category') || '';
  const initTag = params.get('tags') || '';

  if (gsList) {
    if (initCat) gsList.setAttribute('category', initCat);
    if (initTag) gsList.setAttribute('tags', initTag);
  }

  // Highlight the matching nav link on load
  catLinks.forEach(link => {
    const tag = link.dataset.tag;
    if (initTag && tag === initTag) {
      catLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    } else if (initCat && tag === initCat) {
      catLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });

  // Click handler for cat links
  catLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = link.dataset.tag;

      catLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      if (gsList) {
        gsList.removeAttribute('category');
        gsList.removeAttribute('tags');
        if (tag) gsList.setAttribute('tags', tag);
      }

      const url = new URL(window.location);
      url.searchParams.delete('category');
      url.searchParams.delete('tags');
      if (tag) url.searchParams.set('tags', tag);
      window.history.pushState({}, '', url);
    });
  });
})();
