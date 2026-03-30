/* ============================================================
   Vertex Events — contact.js  (form handling)
   ============================================================ */

(function () {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple client-side validation
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#f87171';
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Simulate form submission (replace with actual endpoint / Formspree etc.)
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.style.display = 'none';
      successMsg.classList.add('show');

      // Optionally reset form after delay
      setTimeout(() => {
        form.reset();
        submitBtn.style.display = '';
        submitBtn.textContent = 'Send Request';
        submitBtn.disabled = false;
        successMsg.classList.remove('show');
      }, 8000);
    }, 1200);
  });

  // Remove error highlight on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
})();
