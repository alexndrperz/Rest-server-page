/* ==========================================================================
   MANJARES DEL EDÉN — interacciones
   Vanilla JS · sin dependencias
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     1 · Entrada del titular
     --------------------------------------------------------------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('ready'); });
  });

  /* ---------------------------------------------------------------
     2 · Navegación: fondo al hacer scroll y menú móvil
     --------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');

  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });
  document.querySelectorAll('#menu a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ---------------------------------------------------------------
     3 · Aparición al entrar en pantalla
     --------------------------------------------------------------- */
  var io = null;
  if (!reduced && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }
  document.querySelectorAll('.reveal').forEach(function (el) {
    if (!io) { el.classList.add('is-in'); return; }
    var siblings = el.parentElement.querySelectorAll(':scope > .reveal');
    var i = Array.prototype.indexOf.call(siblings, el);
    el.style.transitionDelay = Math.min(i, 6) * 80 + 'ms';
    io.observe(el);
  });

  /* ---------------------------------------------------------------
     4 · Hover del hero: hojas y planta siguen al cursor
     --------------------------------------------------------------- */
  var art = document.getElementById('hero-art');
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    art.addEventListener('mousemove', function (e) {
      var r = art.getBoundingClientRect();
      art.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      art.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    });
    art.addEventListener('mouseleave', function () {
      art.style.setProperty('--mx', 0);
      art.style.setProperty('--my', 0);
    });
  }

  /* ---------------------------------------------------------------
     5 · Filtros del catálogo
     --------------------------------------------------------------- */
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.card');

  function applyFilter(cat) {
    filters.forEach(function (f) {
      var on = f.dataset.filter === cat;
      f.classList.toggle('is-active', on);
      f.setAttribute('aria-pressed', on);
    });
    cards.forEach(function (c) {
      var show = cat === 'todas' || c.dataset.cat === cat;
      c.classList.toggle('is-hidden', !show);
      if (show) c.classList.add('is-in');
    });
  }
  filters.forEach(function (f) {
    f.addEventListener('click', function () { applyFilter(f.dataset.filter); });
  });
  // Las tarjetas de colecciones llevan al catálogo ya filtrado.
  document.querySelectorAll('[data-filter-link]').forEach(function (a) {
    a.addEventListener('click', function () { applyFilter(a.dataset.filterLink); });
  });

  /* ---------------------------------------------------------------
     6 · Boletín (sin backend: solo valida y confirma)
     --------------------------------------------------------------- */
  var form = document.getElementById('news-form');
  var email = document.getElementById('news-email');
  var status = document.getElementById('news-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = email.checkValidity() && email.value.trim() !== '';
    email.classList.toggle('is-invalid', !ok);
    if (!ok) {
      status.textContent = 'Escribe un correo válido.';
      return;
    }
    status.textContent = '¡Gracias! Te escribiremos pronto con novedades.';
    form.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
