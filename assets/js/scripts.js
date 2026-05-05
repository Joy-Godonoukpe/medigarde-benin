/* ============================================================
   MÉDIGARDE BÉNIN – script.js
   Vanilla JS · DOM Manipulation · Filtering · Animations
   ============================================================ */

'use strict';

/* ====================================================
   DATA – Pharmacies dataset
   ==================================================== */
const pharmacies = [
  /* ——— COTONOU (8 pharmacies) ——— */
  { name: "Pharmacie Camps Guezo",          city: "Cotonou", area: "Akpakpa",                phone: "+229 01 21 33 10 05", day: "Lundi" },
  { name: "Pharmacie Jonquet",              city: "Cotonou", area: "Dota",                   phone: "+229 01 21 31 05 90", day: "Mardi" },
  { name: "Pharmacie La Béninoise",         city: "Cotonou", area: "Carrefour sobebra",      phone: "+229 01 21 30 42 17", day: "Mercredi" },
  { name: "Pharmacie Cristal Santé",        city: "Cotonou", area: "Cotonou",                phone: "+229 01 21 32 54 00", day: "Jeudi" },
  { name: "Pharmacie Sacré Coeur",          city: "Cotonou", area: "rue 1451",               phone: "+229 01 21 33 92 50", day: "Vendredi" },
  { name: "Pharmacie Houéyiho",             city: "Cotonou", area: "Godomey",                phone: "+229 01 21 35 44 20", day: "Samedi" },
  { name: "Pharmacie Sainte-Marie",         city: "Cotonou", area: "Gbèdjromèdji",           phone: "+229 01 21 32 88 07", day: "Dimanche" },
  { name: "Pharmacie Bien-etre",            city: "Cotonou", area: "rue 1315",               phone: "+229 01 21 31 99 60", day: "Samedi" },

  /* ——— PORTO-NOVO (6 pharmacies) ——— */
  { name: "Pharmacie Adjibadé",           city: "Porto-Novo",        area: "Houinmè",            phone: "+229 01 57 28 08 96 ", day: "Lundi" },
  { name: "Pharmacie Les Palmiers",       city: "Porto-Novo",        area: "Houinmè",            phone: "+229 01 20 21 56 42", day: "Mardi" },
  { name: "Pharmacie Kandévié",           city: "Porto-Novo",        area: "Tokpota",            phone: "+229 01 20 22 30 77", day: "Mercredi" },
  { name: "Pharmacie Boulevard Djassin",  city: "Porto-Novo",        area: "Djassin",            phone: "+229 01 20 23 55 20", day: "Jeudi" },
  { name: "Pharmacie Djègan Kpèvi",       city: "Porto-Novo",        area: "Djègan-Kpèvi",       phone: "+229 01 63 63 35 35", day: "Vendredi" },
  { name: "Pharmacie Sainte Marie",       city: "Porto-Novo",        area: "Tokpota",            phone: "+229 01 96 03 51 26", day: "Dimanche" },

  /* ——— PARAKOU (7 pharmacies) ——— */
  { name: "Pharmacie Ganou",               city: "Parakou", area: "Centre Parakou", phone: "+229 01 23 61 04 50", day: "Lundi" },
  { name: "Pharmacie Prisca",              city: "Parakou", area: "Zongo",          phone: "+229 01 23 61 55 09", day: "Mardi" },
  { name: "Pharmacie Banikanni",           city: "Parakou", area: "Alaga",          phone: "+229 01 23 61 91 38", day: "Mercredi" },
  { name: "Pharmacie De La Gare",          city: "Parakou", area: "Zongo",          phone: "+229 01 23 63 44 16", day: "Jeudi" },
  { name: "Pharmacie du Borgou",           city: "Parakou", area: "Centre Parakou", phone: "+229 01 23 61 22 83", day: "Vendredi" },
  { name: "Pharmacie La Grace",            city: "Parakou", area: "Zongo",          phone: "+229 01 23 63 82 13", day: "Samedi" },
  { name: "Pharmacie Santé Vitale",        city: "Parakou", area: "Centre Parakou", phone: "+229 01 23 61 50 31", day: "Dimanche" },
];


/* ====================================================
   DOM REFERENCES
   ==================================================== */
const header        = document.getElementById('header');
const hamburger     = document.getElementById('hamburger');
const nav           = document.getElementById('nav');

const searchCityEl  = document.getElementById('search-city');
const searchDayEl   = document.getElementById('search-day');
const btnSearch     = document.getElementById('btn-search');
const btnReset      = document.getElementById('btn-reset');

const resultsSection = document.getElementById('results-section');
const resultsGrid    = document.getElementById('results-grid');
const resultsEmpty   = document.getElementById('results-empty');
const resultsCount   = document.getElementById('results-count');

const filterCityEl  = document.getElementById('filter-city');
const filterDayEl   = document.getElementById('filter-day');
const pharmaciesGrid = document.getElementById('pharmacies-grid');
const pharmaciesEmpty= document.getElementById('pharmacies-empty');
const filterBadge   = document.getElementById('filter-count-badge');

const navLinks      = document.querySelectorAll('.nav__link');


/* ====================================================
   HERO TITLE ACCENT ANIMATION – Cycling words
   ==================================================== */
function initHeroTitleAccentAnimation() {
  const accentWords = document.querySelectorAll('.hero__title-accent');
  if (accentWords.length === 0) return;

  let currentIndex = 0;
  const totalWords = accentWords.length;
  const displayTime = 3500; // temps d'affichage
  const transitionTime = 500; // durée de l'animation

  function cycleWords() {
    // Exit animation for current word
    accentWords[currentIndex].classList.remove('active');
    accentWords[currentIndex].classList.add('exit');

    // Move to next word
    currentIndex = (currentIndex + 1) % totalWords;

    // Show next word after transition
    setTimeout(() => {
      accentWords[currentIndex].classList.remove('exit');
      accentWords[currentIndex].classList.add('active');
    }, transitionTime);
  }

  // Start cycling
  setInterval(cycleWords, displayTime);
}

// Initialize animation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroTitleAccentAnimation);
} else {
  initHeroTitleAccentAnimation();
}


/* ====================================================
   UTILITY: Build a pharmacy card HTML string
   ==================================================== */
function buildCard(pharmacy, delay = 0) {
  return `
    <article class="pharmacy-card" style="animation-delay:${delay}ms">
      <div class="card__top">
        <div class="card__info">
          <h3 class="card__name">${escapeHtml(pharmacy.name)}</h3>
          <ul class="card__meta">
            <li class="card__meta-item">
              <i class="fa-solid fa-location-dot"></i>
              ${escapeHtml(pharmacy.area)}, ${escapeHtml(pharmacy.city)}
            </li>
            <li class="card__meta-item">
              <i class="fa-regular fa-calendar-days"></i>
              Garde : ${escapeHtml(pharmacy.day)}
            </li>
          </ul>
        </div>
        <div class="card__icon">
          <i class="fa-solid fa-kit-medical"></i>
        </div>
      </div>
      <div class="card__footer">
        <span class="card__phone">
          <i class="fa-solid fa-phone"></i>
          ${escapeHtml(pharmacy.phone)}
        </span>
        <a href="tel:${pharmacy.phone.replace(/\s/g, '')}" class="btn-call" aria-label="Appeler ${pharmacy.name}">
          <i class="fa-solid fa-phone-volume"></i>
          Appeler
        </a>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

/* ====================================================
   RENDER helpers
   ==================================================== */
function renderCards(container, emptyEl, data, countEl) {
  container.innerHTML = '';
  if (data.length === 0) {
    emptyEl.hidden = false;
    if (countEl) countEl.textContent = '';
  } else {
    emptyEl.hidden = true;
    if (countEl) {
      countEl.textContent = `${data.length} pharmacie${data.length > 1 ? 's' : ''} trouvée${data.length > 1 ? 's' : ''}`;
    }
    const fragment = document.createDocumentFragment();
    const temp = document.createElement('div');
    data.forEach((p, i) => {
      temp.innerHTML = buildCard(p, i * 40);
      fragment.appendChild(temp.firstElementChild);
    });
    container.appendChild(fragment);
  }
}

/* ====================================================
   SEARCH (Hero module)
   ==================================================== */
function doSearch() {
  const city = searchCityEl.value.trim();
  const day  = searchDayEl.value.trim();

  const filtered = pharmacies.filter(p => {
    const matchCity = !city || p.city === city;
    const matchDay  = !day  || p.day  === day;
    return matchCity && matchDay;
  });

  resultsSection.hidden = false;
  renderCards(resultsGrid, resultsEmpty, filtered, resultsCount);

  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

btnSearch.addEventListener('click', doSearch);

[searchCityEl, searchDayEl].forEach(el => {
  el.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
});

btnReset.addEventListener('click', () => {
  resultsSection.hidden = true;
  resultsGrid.innerHTML = '';
  searchCityEl.value = '';
  searchDayEl.value  = '';
});


/* ====================================================
   PHARMACIES LIST SECTION – filtering
   ==================================================== */
function doFilter() {
  const city = filterCityEl.value.trim();
  const day  = filterDayEl.value.trim();

  const filtered = pharmacies.filter(p => {
    const matchCity = !city || p.city === city;
    const matchDay  = !day  || p.day  === day;
    return matchCity && matchDay;
  });

  renderCards(pharmaciesGrid, pharmaciesEmpty, filtered, null);
  filterBadge.textContent = `${filtered.length} résultat${filtered.length > 1 ? 's' : ''}`;
}

filterCityEl.addEventListener('change', doFilter);
filterDayEl.addEventListener('change', doFilter);

// Initial render: Porto-Novo default
doFilter();


/* ====================================================
   STICKY HEADER
   ==================================================== */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


/* ====================================================
   HAMBURGER MENU
   ==================================================== */
hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close nav on link click (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (!header.contains(e.target)) {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});


/* ====================================================
   ACTIVE NAV LINK on scroll
   ==================================================== */
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  let currentId = '';
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= 100) currentId = section.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === currentId);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });


/* ====================================================
   SCROLL REVEAL
   ==================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// Trigger hero reveals immediately
document.querySelectorAll('.hero .reveal').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 150 + i * 120);
});


/* ====================================================
   STAGGERED card reveal for pharmacies grid
   ==================================================== */
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05 });

function observeCards(grid) {
  grid.querySelectorAll('.pharmacy-card').forEach(card => cardObserver.observe(card));
}

// Re-observe after render
const gridObserver = new MutationObserver(() => {
  observeCards(pharmaciesGrid);
  observeCards(resultsGrid);
});
gridObserver.observe(pharmaciesGrid, { childList: true });
gridObserver.observe(resultsGrid, { childList: true });