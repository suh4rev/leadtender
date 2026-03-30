/* ===================================================================
   LEADTENDER — Catalog Page Logic
   Depends on: data.js (CATALOG_CATEGORIES, PRODUCTS), components.js (iconChevronDown)
   =================================================================== */

'use strict';

/* ---------- State ---------- */

var catalogState = {
  openCat: null,   // currently expanded category id
  activeSub: null, // currently selected subcategory id
  searchQuery: ''  // search input text
};

/* ---------- Category SVG Icons ---------- */

function getCategoryIcon(id, size) {
  size = size || 20;
  var s = ' xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var icons = {
    'abrasive':  '<svg' + s + '><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>',
    'power':     '<svg' + s + '><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'hand':      '<svg' + s + '><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    'fasteners': '<svg' + s + '><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    'safety':    '<svg' + s + '><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'welding':   '<svg' + s + '><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
  };
  return icons[id] || icons['abrasive'];
}

/* ---------- Category gradient colors ---------- */

function getCategoryGradient(catParent) {
  var gradients = {
    'abrasive':  'linear-gradient(135deg, #DC2626, #991B1B)',
    'power':     'linear-gradient(135deg, #2563EB, #1E40AF)',
    'hand':      'linear-gradient(135deg, #059669, #047857)',
    'fasteners': 'linear-gradient(135deg, #475569, #334155)',
    'safety':    'linear-gradient(135deg, #D97706, #B45309)',
    'welding':   'linear-gradient(135deg, #1E293B, #0F172A)'
  };
  return gradients[catParent] || gradients['abrasive'];
}

/* ---------- Pluralize helper ---------- */

function pluralize(n, one, few, many) {
  var abs = Math.abs(n) % 100;
  var abs10 = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (abs10 > 1 && abs10 < 5) return few;
  if (abs10 === 1) return one;
  return many;
}

/* ---------- Render Sidebar ---------- */

function renderSidebar() {
  var sidebar = document.getElementById('catalog-sidebar');
  if (!sidebar) return;

  var html = '';
  CATALOG_CATEGORIES.forEach(function (cat) {
    var isOpen = catalogState.openCat === cat.id;

    html += '<button class="catalog-cat-btn' + (isOpen ? ' active' : '') + '" data-cat="' + cat.id + '">' +
      '<span class="catalog-cat-icon' + (isOpen ? ' active' : '') + '">' + getCategoryIcon(cat.id, 18) + '</span>' +
      '<span class="catalog-cat-name">' + cat.name + '</span>' +
      '<span class="catalog-chevron">' + iconChevronDown(14) + '</span>' +
    '</button>';

    html += '<div class="catalog-sub-list' + (isOpen ? ' open' : '') + '">';
    cat.sub.forEach(function (sub) {
      var isSubActive = catalogState.activeSub === sub.id;
      html += '<button class="catalog-sub-btn' + (isSubActive ? ' active' : '') + '" data-sub="' + sub.id + '" data-parent="' + cat.id + '">' +
        sub.name +
      '</button>';
    });
    html += '</div>';
  });

  sidebar.innerHTML = html;
}

/* ---------- Render Mobile Pills ---------- */

function renderMobilePills() {
  var container = document.getElementById('catalog-pills');
  if (!container) return;

  var html = '<button class="catalog-pill' + (!catalogState.openCat ? ' active' : '') + '" data-pill="all">Все</button>';
  CATALOG_CATEGORIES.forEach(function (cat) {
    var isActive = catalogState.openCat === cat.id;
    html += '<button class="catalog-pill' + (isActive ? ' active' : '') + '" data-pill="' + cat.id + '">' + cat.name + '</button>';
  });

  container.innerHTML = html;
}

/* ---------- Filter Products ---------- */

function getFilteredProducts() {
  var result;
  if (catalogState.activeSub) {
    result = PRODUCTS.filter(function (p) { return p.cat === catalogState.activeSub; });
  } else if (catalogState.openCat) {
    result = PRODUCTS.filter(function (p) { return p.catParent === catalogState.openCat; });
  } else {
    result = PRODUCTS.slice();
  }

  var q = catalogState.searchQuery.trim().toLowerCase();
  if (!q) return result;

  var words = q.split(/\s+/);
  return result.filter(function (p) {
    var haystack = (p.name + ' ' + (p.description || '') + ' ' + Object.values(p.specs || {}).join(' ')).toLowerCase();
    return words.every(function (w) { return haystack.indexOf(w) !== -1; });
  });
}

/* ---------- Find subcategory name ---------- */

function getSubName(subId) {
  var name = '';
  CATALOG_CATEGORIES.forEach(function (cat) {
    cat.sub.forEach(function (sub) {
      if (sub.id === subId) name = sub.name;
    });
  });
  return name;
}

/* ---------- Render Product Grid ---------- */

function renderProductGrid() {
  var grid = document.getElementById('catalog-grid');
  var empty = document.getElementById('catalog-empty');
  if (!grid) return;

  var filtered = getFilteredProducts();

  if (filtered.length === 0) {
    grid.style.display = 'none';
    if (empty) {
      empty.style.display = '';
      var emptyText = empty.querySelector('p');
      if (emptyText) {
        emptyText.textContent = catalogState.searchQuery.trim()
          ? 'По запросу «' + catalogState.searchQuery.trim() + '» ничего не найдено'
          : 'Товары в этой категории скоро появятся';
      }
    }
    return;
  }

  grid.style.display = '';
  if (empty) empty.style.display = 'none';

  var html = '';
  filtered.forEach(function (product, index) {
    var subName = getSubName(product.cat);
    var gradient = getCategoryGradient(product.catParent);
    var delay = (index % 9) * 50;

    var imageContent = product.image
      ? '<img src="' + product.image + '" alt="' + product.name + '" style="width:100%; height:100%; object-fit:contain; padding:16px;">'
      : '<span class="product-card-icon">' + getCategoryIcon(product.catParent, 40) + '</span>';

    html += '<a href="product.html?id=' + product.id + '" class="product-card">' +
      '<div class="product-card-image" style="background: #fff; border-bottom: 1px solid #f0f0f0;">' +
        imageContent +
      '</div>' +
      '<div class="product-card-body">' +
        '<span class="badge badge-primary">' + subName + '</span>' +
        '<div class="product-card-name">' + product.name + '</div>' +
      '</div>' +
    '</a>';
  });

  grid.innerHTML = html;

  if (typeof AOS !== 'undefined') AOS.refresh();
}

/* ---------- Render Breadcrumbs ---------- */

function renderBreadcrumbs() {
  var bc = document.getElementById('catalog-breadcrumbs');
  if (!bc) return;

  var html = '<a href="index.html">Главная</a><span class="separator">/</span>';

  if (!catalogState.openCat) {
    html += '<span class="current">Продукция</span>';
  } else {
    html += '<a href="catalog.html" data-breadcrumb="all">Продукция</a>';
    var cat = CATALOG_CATEGORIES.find(function (c) { return c.id === catalogState.openCat; });
    if (cat) {
      html += '<span class="separator">/</span>';
      if (catalogState.activeSub) {
        html += '<a href="#" data-breadcrumb-cat="' + cat.id + '">' + cat.name + '</a>';
        var sub = cat.sub.find(function (s) { return s.id === catalogState.activeSub; });
        if (sub) {
          html += '<span class="separator">/</span>';
          html += '<span class="current">' + sub.name + '</span>';
        }
      } else {
        html += '<span class="current">' + cat.name + '</span>';
      }
    }
  }

  bc.innerHTML = html;
}

/* ---------- Render Toolbar ---------- */

function renderToolbar() {
  var toolbar = document.getElementById('catalog-toolbar');
  if (!toolbar) return;

  var filtered = getFilteredProducts();
  var title = 'Все товары';

  if (catalogState.activeSub) {
    title = getSubName(catalogState.activeSub);
  } else if (catalogState.openCat) {
    var cat = CATALOG_CATEGORIES.find(function (c) { return c.id === catalogState.openCat; });
    if (cat) title = cat.name;
  }

  var count = filtered.length;
  var word = pluralize(count, 'товар', 'товара', 'товаров');

  var searchInfo = catalogState.searchQuery.trim()
    ? ' <span style="font-size:14px;font-weight:400;color:var(--color-text-muted);">по запросу «' + catalogState.searchQuery.trim() + '»</span>'
    : '';

  toolbar.innerHTML =
    '<div class="catalog-toolbar-title">' + title + searchInfo + '</div>' +
    '<div class="catalog-toolbar-count">' + count + ' ' + word + '</div>';
}

/* ---------- Update All ---------- */

function updateCatalog() {
  renderSidebar();
  renderMobilePills();
  renderProductGrid();
  renderBreadcrumbs();
  renderToolbar();
}

/* ---------- URL Handling ---------- */

function parseURLParams() {
  var params = new URLSearchParams(window.location.search);
  var cat = params.get('cat');
  var sub = params.get('sub');

  if (cat) {
    var found = CATALOG_CATEGORIES.find(function (c) { return c.id === cat; });
    if (found) {
      catalogState.openCat = cat;
      if (sub) {
        var foundSub = found.sub.find(function (s) { return s.id === sub; });
        if (foundSub) catalogState.activeSub = sub;
      }
    }
  }
}

function updateURL() {
  var params = new URLSearchParams();
  if (catalogState.openCat) params.set('cat', catalogState.openCat);
  if (catalogState.activeSub) params.set('sub', catalogState.activeSub);
  var qs = params.toString();
  var newURL = 'catalog.html' + (qs ? '?' + qs : '');
  history.pushState(null, '', newURL);
}

/* ---------- Events ---------- */

function initCatalogEvents() {
  document.addEventListener('click', function (e) {
    // Sidebar category button
    var catBtn = e.target.closest('.catalog-cat-btn');
    if (catBtn) {
      var catId = catBtn.getAttribute('data-cat');
      if (catalogState.openCat === catId) {
        catalogState.openCat = null;
        catalogState.activeSub = null;
      } else {
        catalogState.openCat = catId;
        catalogState.activeSub = null;
      }
      updateCatalog();
      updateURL();
      return;
    }

    // Sidebar subcategory button
    var subBtn = e.target.closest('.catalog-sub-btn');
    if (subBtn) {
      var subId = subBtn.getAttribute('data-sub');
      var parentId = subBtn.getAttribute('data-parent');
      if (catalogState.activeSub === subId) {
        catalogState.activeSub = null;
      } else {
        catalogState.openCat = parentId;
        catalogState.activeSub = subId;
      }
      updateCatalog();
      updateURL();
      return;
    }

    // Mobile pill
    var pill = e.target.closest('.catalog-pill');
    if (pill) {
      var pillCat = pill.getAttribute('data-pill');
      if (pillCat === 'all') {
        catalogState.openCat = null;
        catalogState.activeSub = null;
      } else {
        if (catalogState.openCat === pillCat) {
          catalogState.openCat = null;
          catalogState.activeSub = null;
        } else {
          catalogState.openCat = pillCat;
          catalogState.activeSub = null;
        }
      }
      updateCatalog();
      updateURL();
      return;
    }

    // Breadcrumb: back to all
    var bcAll = e.target.closest('[data-breadcrumb="all"]');
    if (bcAll) {
      e.preventDefault();
      catalogState.openCat = null;
      catalogState.activeSub = null;
      updateCatalog();
      updateURL();
      return;
    }

    // Breadcrumb: back to category
    var bcCat = e.target.closest('[data-breadcrumb-cat]');
    if (bcCat) {
      e.preventDefault();
      catalogState.activeSub = null;
      updateCatalog();
      updateURL();
      return;
    }
  });

  // Search input
  var searchInput = document.getElementById('catalog-search');
  var searchClear = document.getElementById('catalog-search-clear');
  var searchTimer;

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var val = searchInput.value;
      if (searchClear) searchClear.classList.toggle('visible', val.length > 0);
      searchTimer = setTimeout(function () {
        catalogState.searchQuery = val;
        renderProductGrid();
        renderToolbar();
      }, 200);
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      catalogState.searchQuery = '';
      renderProductGrid();
      renderToolbar();
      searchInput.focus();
    });
  }

  // Browser back/forward
  window.addEventListener('popstate', function () {
    catalogState.openCat = null;
    catalogState.activeSub = null;
    catalogState.searchQuery = '';
    if (searchInput) { searchInput.value = ''; }
    if (searchClear) { searchClear.classList.remove('visible'); }
    parseURLParams();
    updateCatalog();
  });
}

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', function () {
  parseURLParams();
  updateCatalog();
  initCatalogEvents();
});
