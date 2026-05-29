/* ============================================
   TheTastyFood — Gallery Page JavaScript
   Lightbox, Navigation & Keyboard Controls
   ============================================ */

(function () {
  'use strict';

  // ── DOM Elements ──
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  // ── Collect all gallery images ──
  const images = [];
  galleryItems.forEach(function (item) {
    const img = item.querySelector('img');
    if (img) {
      images.push({
        src: img.src,
        alt: img.alt
      });
    }
  });

  let currentIndex = 0;

  // ── Helper: Update lightbox display ──
  function updateLightbox() {
    if (!images[currentIndex]) return;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  // ── Open Lightbox ──
  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ── Close Lightbox ──
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ── Navigate Previous ──
  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }

  // ── Navigate Next ──
  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }

  // ── Event: Click gallery items ──
  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  // ── Event: Close button ──
  lightboxClose.addEventListener('click', closeLightbox);

  // ── Event: Prev / Next buttons ──
  lightboxPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    showPrev();
  });

  lightboxNext.addEventListener('click', function (e) {
    e.stopPropagation();
    showNext();
  });

  // ── Event: Click backdrop (outside image) to close ──
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrap')) {
      closeLightbox();
    }
  });

  // ── Event: Keyboard navigation ──
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });
})();
