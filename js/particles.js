/* ============================================
   TheTastyFood — Particle System
   Canvas-based mouse-following warm particles
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouseX = -1000, mouseY = -1000;
  let particles = [];
  const PARTICLE_COUNT = 40;
  const COLORS = [
    'rgba(232, 119, 46, ',   // Orange
    'rgba(240, 156, 74, ',   // Light orange
    'rgba(192, 57, 43, ',    // Red
    'rgba(212, 168, 83, ',   // Gold
    'rgba(224, 96, 48, ',    // Warm
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }, { passive: true });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 0.8;
      this.baseSize = this.size;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.baseAlpha = this.alpha;
      this.colorIndex = Math.floor(Math.random() * COLORS.length);
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.008 + Math.random() * 0.01;
    }

    update() {
      // Gentle drift
      this.x += this.vx;
      this.y += this.vy;

      // Subtle pulse
      this.pulsePhase += this.pulseSpeed;
      const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
      this.alpha = this.baseAlpha * pulse;

      // Mouse interaction — gentle attraction/glow
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200) {
        const force = (200 - dist) / 200;
        // Gentle pull toward mouse
        this.vx += dx * force * 0.0003;
        this.vy += dy * force * 0.0003;
        // Brighten near cursor
        this.alpha = Math.min(this.baseAlpha + force * 0.35, 0.7);
        this.size = this.baseSize + force * 2;
      } else {
        this.size += (this.baseSize - this.size) * 0.05;
      }

      // Damping
      this.vx *= 0.995;
      this.vy *= 0.995;

      // Wrap around edges
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[this.colorIndex] + this.alpha + ')';
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Draw connections between close particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = dx * dx + dy * dy; // squared distance for perf

        if (dist < 22500) { // 150px radius squared
          const alpha = (1 - dist / 22500) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(232, 119, 46, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  let animationId;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();

    animationId = requestAnimationFrame(animate);
  }

  // Start when page is visible, pause when hidden
  function startParticles() {
    if (!animationId) animate();
  }

  function stopParticles() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopParticles();
    } else {
      startParticles();
    }
  });

  // Reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Static particles, no animation
    particles.forEach(p => p.draw());
  } else {
    startParticles();
  }

})();
