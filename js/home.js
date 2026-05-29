/* ============================================
   TheTastyFood — Home Page JavaScript
   Hero slider + home interactions
   ============================================ */

(function () {
  'use strict';

  /* ---- Hero Image Slider ---- */
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');
  let currentSlide = 0;
  let slideInterval;
  const SLIDE_DURATION = 5500;

  function goToSlide(index) {
    // Remove active from current
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    // Set new active
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  function resetSlider() {
    clearInterval(slideInterval);
    startSlider();
  }

  if (slides.length > 1) {
    startSlider();

    // Click indicators
    indicators.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.slide, 10);
        if (index !== currentSlide) {
          goToSlide(index);
          resetSlider();
        }
      });
    });

    // Pause on tab hidden, resume on visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(slideInterval);
      } else {
        resetSlider();
      }
    });
  }

})();
