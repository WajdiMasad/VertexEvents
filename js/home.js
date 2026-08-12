/* ============================================================
   Vertex Events — home.js (Generic Slider Logic)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000); // 5 seconds per slide
  }

  function resetSlider() {
    clearInterval(slideInterval);
    startSlider();
  }

  // Event Listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetSlider();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetSlider();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      showSlide(index);
      resetSlider();
    });
  });

  // Init
  startSlider();
});
