/* ==========================================================================
   LUIS ADRIÁN MONTOYA — interacciones
   Vanilla JS · sin dependencias
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     1 · Navegación compacta al hacer scroll
     --------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     2 · Aparición al entrar en pantalla + contadores
     --------------------------------------------------------------- */
  function count(el) {
    var target = +el.dataset.count, start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / 900, 1);
      el.textContent = Math.round(target * p);
      if (p < 1) requestAnimationFrame(step);
    }
    reduced ? (el.textContent = target) : requestAnimationFrame(step);
  }

  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('[data-count]').forEach(count);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        e.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     3 · Parallax suave de las figuras alrededor de la foto
     --------------------------------------------------------------- */
  var portrait = document.getElementById('portrait');
  if (portrait && !reduced && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      portrait.style.setProperty('--mx', x.toFixed(3));
      portrait.style.setProperty('--my', y.toFixed(3));
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
