/**
 * LEADTENDER — animations.js
 * Custom animations: animated counters and parallax-lite.
 * Does not rely on AOS or any external library.
 * Vanilla JS ES6+.
 */

'use strict';

/* --------------------------------------------------------
   1. Animated Counters
   Elements: <span data-count="700" data-suffix="+">0</span>
   ------------------------------------------------------ */
function initCounters() {
  const elements = document.querySelectorAll('[data-count]');
  if (!elements.length) return;

  // easeOutQuart
  const ease = (t) => 1 - Math.pow(1 - t, 4);

  const DURATION = 2000; // ms

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const isFloat = String(target).includes('.');
    const decimals = isFloat ? (String(target).split('.')[1] || '').length : 0;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const value = target * ease(progress);

      if (isFloat) {
        el.textContent = value.toFixed(decimals) + suffix;
      } else {
        el.textContent = Math.round(value) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure exact final value
        el.textContent = (isFloat ? target.toFixed(decimals) : target) + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    // Fallback: animate immediately
    elements.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  elements.forEach((el) => observer.observe(el));

  // Also trigger counters inside hover overlays (e.g. about-stats-overlay)
  document.querySelectorAll('.about-image-wrap').forEach((wrap) => {
    let animated = false;
    wrap.addEventListener('mouseenter', () => {
      if (animated) return;
      animated = true;
      wrap.querySelectorAll('[data-count]').forEach(animateCounter);
    });
  });
}

/* --------------------------------------------------------
   2. Parallax-lite
   Elements with data-parallax attribute.
   Value = speed factor (default 0.1).
   Desktop only (> 1024px).
   ------------------------------------------------------ */
function initParallax() {
  const elements = document.querySelectorAll('[data-parallax]');
  if (!elements.length) return;

  const isDesktop = () => window.innerWidth > 1024;

  let ticking = false;

  const update = () => {
    if (!isDesktop()) {
      // Reset transforms on non-desktop
      elements.forEach((el) => {
        el.style.transform = '';
      });
      ticking = false;
      return;
    }

    const scrollY = window.scrollY;

    elements.forEach((el) => {
      const factor = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2 + scrollY;
      const viewCenter = scrollY + window.innerHeight / 2;
      const offset = (viewCenter - elCenter) * factor;

      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // Run once on load
  update();
}

/* --------------------------------------------------------
   Init
   ------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initParallax();
});
