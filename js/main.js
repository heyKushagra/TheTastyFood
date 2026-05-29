/* ============================================
   TheTastyFood — Main JavaScript
   Shared: loader, navbar, cursor, scroll reveals, parallax
   ============================================ */

(function () {
  'use strict';

  /* ---- Loading Screen ---- */
  const loader = document.querySelector('.loader');

  function hideLoader() {
    if (loader) {
      loader.classList.add('loaded');
      document.body.style.overflow = '';
    }
  }

  window.addEventListener('load', () => {
    setTimeout(hideLoader, 1200);
  });

  // Failsafe: hide loader after 4s even if images still loading
  setTimeout(hideLoader, 4000);

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';


  /* ---- Navbar Scroll Behavior ---- */
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let ticking = false;

  function onNavScroll() {
    const scrollY = window.scrollY;
    if (navbar) {
      if (scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onNavScroll);
      ticking = true;
    }
  }, { passive: true });


  /* ---- Mobile Menu Toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  }


  /* ---- Custom Cursor ---- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorGlow = document.querySelector('.cursor-glow');

  if (cursorDot && cursorGlow) {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      // Dot follows tightly (lerp 0.25 for snappy feel)
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      cursorDot.style.transform = `translate(${dotX - 3.5}px, ${dotY - 3.5}px)`;

      // Glow follows smoothly (lerp 0.12 for gentle lag)
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      cursorGlow.style.transform = `translate(${glowX - 140}px, ${glowY - 140}px)`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .food-card, .gallery-item');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
    });
  }


  /* ---- Scroll Reveal (IntersectionObserver) ---- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }


  /* ---- Parallax Effect ---- */
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  let parallaxTicking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const parent = el.parentElement;
      const rect = parent.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Only animate if section is in or near viewport
      if (rect.bottom > -100 && rect.top < windowH + 100) {
        const progress = (rect.top + rect.height / 2) / (windowH + rect.height);
        const offset = (progress - 0.5) * 60; // max 30px movement
        el.style.transform = `translateY(${offset}px)`;
      }
    });
    parallaxTicking = false;
  }

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }


  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  /* ---- Smooth Scroll for Anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
