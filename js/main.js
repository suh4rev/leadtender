/**
 * LEADTENDER — main.js
 * Site-wide functionality: scroll progress, back-to-top, smooth scroll, AOS, preloader.
 * Vanilla JS ES6+. No dependencies (AOS is optional).
 */

'use strict';

/* --------------------------------------------------------
   1. Scroll Progress Bar
   ------------------------------------------------------ */
function initScrollProgress() {
  let bar = document.querySelector('.scroll-progress');

  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
  }

  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/* --------------------------------------------------------
   2. Back-to-Top Button
   ------------------------------------------------------ */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Наверх');
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>`;
  document.body.appendChild(btn);

  let ticking = false;

  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(toggleVisibility);
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleVisibility();
}

/* --------------------------------------------------------
   3. Smooth Scroll for Anchors
   ------------------------------------------------------ */
function initSmoothScroll() {
  const HEADER_OFFSET = 72;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"], a[href*="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    // Only handle same-page anchors
    const url = new URL(link.href, window.location.origin);
    if (url.pathname !== window.location.pathname && url.pathname !== '/') return;

    const hash = url.hash;
    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();

    const targetTop = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    // Update URL hash without jump
    if (history.pushState) {
      history.pushState(null, '', hash);
    }
  });
}

/* --------------------------------------------------------
   4. AOS.js Initialization
   ------------------------------------------------------ */
function initAOS() {
  try {
    if (typeof AOS !== 'undefined' && AOS.init) {
      AOS.init({
        duration: 700,
        easing: 'ease-out',
        once: true,
        offset: 80,
        disable: () => window.innerWidth <= 640
      });
    }
  } catch (_) {
    // AOS is not loaded — silently skip
  }
}

/* --------------------------------------------------------
   5. Preloader
   ------------------------------------------------------ */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add('hide');

    setTimeout(() => {
      preloader.remove();
    }, 500);
  }, 500);
}

/* --------------------------------------------------------
   Init
   ------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initBackToTop();
  initSmoothScroll();
  initAOS();
  initPreloader();
});
