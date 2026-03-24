/* ===================================================================
   LEADTENDER — Header & Footer Components
   Generates and injects Header / Footer HTML into every page.
   Depends on: data.js (NAV_ITEMS, COMPANY) loaded before this file.
   =================================================================== */

/* ===== SVG Icon Helpers ===== */

function iconMail(size) {
  size = size || 16;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>';
}

function iconMapPin(size) {
  size = size || 16;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
}

function iconChevronDown(size) {
  size = size || 16;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
}

function iconPhone(size) {
  size = size || 16;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
}

function iconExternalLink(size) {
  size = size || 16;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
}

function iconMenu(size) {
  size = size || 24;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
}

function iconX(size) {
  size = size || 24;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
}

/* ===== Header ===== */

function renderHeader() {
  var container = document.getElementById('header');
  if (!container) return;

  // Build desktop nav items
  var navHTML = NAV_ITEMS.map(function (item) {
    if (item.children && item.children.length > 0) {
      var dropdownLinks = item.children.map(function (child) {
        return '<a href="' + child.href + '">' + child.label + '</a>';
      }).join('');

      return '<div class="header-nav-item">' +
        '<a href="' + item.href + '" class="header-nav-link">' +
          item.label + ' ' + iconChevronDown(14) +
        '</a>' +
        '<div class="header-dropdown">' + dropdownLinks + '</div>' +
      '</div>';
    }
    return '<a href="' + item.href + '" class="header-nav-link">' + item.label + '</a>';
  }).join('');

  // Build mobile menu nav items
  var mobileNavHTML = NAV_ITEMS.map(function (item) {
    var html = '<a href="' + item.href + '" class="mobile-menu-link">' + item.label + '</a>';
    if (item.children && item.children.length > 0) {
      var subLinks = item.children.map(function (child) {
        return '<a href="' + child.href + '">' + child.label + '</a>';
      }).join('');
      html += '<div class="mobile-menu-sub">' + subLinks + '</div>';
    }
    return html;
  }).join('');

  var isSolid = container.getAttribute('data-header-style') === 'solid';
  var headerClass = isSolid ? 'header scrolled' : 'header header-transparent';

  container.innerHTML =
    '<header class="' + headerClass + '" id="site-header">' +
      '<div class="header-inner">' +

        '<a href="index.html" class="header-logo">' +
          '<img src="image/long-logo-white.png" alt="LEADTENDER" class="logo-white">' +
          '<img src="image/long-logo-black.png" alt="LEADTENDER" class="logo-black">' +
        '</a>' +

        '<nav class="header-nav">' + navHTML + '</nav>' +

        '<div class="header-right">' +
          '<a href="mailto:' + COMPANY.email + '" class="header-email">' +
            iconMail(16) + ' ' + COMPANY.email +
          '</a>' +
          '<a href="contacts.html#form" class="btn btn-primary btn-sm">\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443</a>' +
        '</div>' +

        '<div class="header-burger" id="burger">' +
          '<span></span><span></span><span></span>' +
        '</div>' +

      '</div>' +
    '</header>' +

    '<div class="mobile-menu" id="mobile-menu">' +
      mobileNavHTML +
      '<div class="mobile-menu-cta">' +
        '<a href="contacts.html#form" class="btn btn-primary w-full">\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443</a>' +
      '</div>' +
    '</div>';
}

/* ===== Footer ===== */

function renderFooter() {
  var container = document.getElementById('footer');
  if (!container) return;

  var currentYear = new Date().getFullYear();

  container.innerHTML =
    '<footer class="footer" style="position:relative;overflow:hidden;">' +
      '<div class="footer-bg-text" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:clamp(300px,35vw,600px);font-weight:900;font-style:italic;color:rgba(255,255,255,0.03);white-space:nowrap;pointer-events:none;user-select:none;letter-spacing:-0.02em;z-index:0;">TENDER</div>' +
      '<div class="container" style="position:relative;z-index:1;">' +
        '<div class="footer-grid">' +

          '<div class="footer-col">' +
            '<div class="footer-logo">' +
              '<img src="image/long-logo-white.png" alt="LEADTENDER">' +
            '</div>' +
            '<p>' + COMPANY.legalName + '<br>\u0418\u041D\u041D: ' + COMPANY.inn + '<br>\u041E\u0413\u0420\u041D: ' + COMPANY.ogrn + '<br>\u041A\u041F\u041F: ' + COMPANY.kpp + '<br>\u041E\u041A\u041F\u041E: ' + COMPANY.okpo + '</p>' +
          '</div>' +

          '<div class="footer-col">' +
            '<h4>\u0420\u0430\u0437\u0434\u0435\u043B\u044B</h4>' +
            '<ul class="footer-links">' +
              '<li><a href="index.html">\u0413\u043B\u0430\u0432\u043D\u0430\u044F</a></li>' +
              '<li><a href="catalog.html">\u041F\u0440\u043E\u0434\u0443\u043A\u0446\u0438\u044F</a></li>' +
              '<li><a href="info.html">\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F</a></li>' +
              '<li><a href="news.html">\u041D\u043E\u0432\u043E\u0441\u0442\u0438</a></li>' +
              '<li><a href="contacts.html">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</a></li>' +
            '</ul>' +
          '</div>' +

          '<div class="footer-col">' +
            '<h4>\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</h4>' +
            '<ul class="footer-links footer-contacts">' +
              '<li>' +
                '<span class="footer-contact-icon">' + iconMail(14) + '</span>' +
                '<a href="mailto:' + COMPANY.email + '">' + COMPANY.email + '</a>' +
              '</li>' +
              '<li>' +
                '<span class="footer-contact-icon">' + iconMapPin(14) + '</span>' +
                '<span>618548, \u041F\u0435\u0440\u043C\u0441\u043A\u0438\u0439 \u043A\u0440\u0430\u0439,<br>\u0433. \u0421\u043E\u043B\u0438\u043A\u0430\u043C\u0441\u043A, \u0443\u043B. \u0427\u0435\u0440\u043D\u044F\u0445\u043E\u0432\u0441\u043A\u043E\u0433\u043E,<br>\u0434. 8\u0410, \u043F\u043E\u043C. 9</span>' +
              '</li>' +
            '</ul>' +
          '</div>' +

          '<div class="footer-col">' +
            '<h4>\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B</h4>' +
            '<ul class="footer-links">' +
              '<li><a href="privacy.html">\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445</a></li>' +
            '</ul>' +
          '</div>' +

        '</div>' +

        '<div class="footer-bottom">' +
          '\u00A9 ' + currentYear + ' ' + COMPANY.legalName + '. \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B.' +
        '</div>' +

      '</div>' +
    '</footer>';
}

/* ===== Header Scroll Detection ===== */

function initHeaderScroll() {
  var header = document.getElementById('site-header');
  if (!header) return;

  var ticking = false;

  // Store the initial transparent state
  var isTransparent = header.classList.contains('header-transparent');

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
          header.classList.remove('header-transparent');
        } else {
          header.classList.remove('scrolled');
          if (isTransparent) {
            header.classList.add('header-transparent');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on load in case the page is already scrolled
  onScroll();
}

/* ===== Active Nav Item ===== */

function setActiveNavItem() {
  var path = window.location.pathname;
  var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  // Desktop nav links
  var navLinks = document.querySelectorAll('.header-nav-link');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('#')[0] === page) {
      link.classList.add('active');
    }
  });

  // Dropdown links
  var dropdownLinks = document.querySelectorAll('.header-dropdown a');
  dropdownLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('#')[0] === page) {
      link.style.color = 'var(--color-primary)';
      link.style.fontWeight = '600';
      // Also mark the parent nav link as active
      var parentItem = link.closest('.header-nav-item');
      if (parentItem) {
        var parentLink = parentItem.querySelector('.header-nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });

  // Mobile nav links
  var mobileLinks = document.querySelectorAll('.mobile-menu-link');
  mobileLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('#')[0] === page) {
      link.style.color = 'var(--color-primary)';
    }
  });

  var mobileSubLinks = document.querySelectorAll('.mobile-menu-sub a');
  mobileSubLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('#')[0] === page) {
      link.style.color = 'var(--color-primary)';
      link.style.fontWeight = '600';
    }
  });
}

/* ===== Mobile Menu (Burger Toggle) ===== */

function initMobileMenu() {
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobile-menu');
  if (!burger || !mobileMenu) return;

  function toggleMenu() {
    var isActive = burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMenu() {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', toggleMenu);

  // Close mobile menu when any link inside it is clicked
  var menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}

/* ===== Initialization ===== */

document.addEventListener('DOMContentLoaded', function () {
  renderHeader();
  renderFooter();
  initHeaderScroll();
  initMobileMenu();
  setActiveNavItem();
});
