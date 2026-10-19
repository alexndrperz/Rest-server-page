/* ==========================================================================
   LUIS ADRIÁN MONTOYA — interacciones
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
     2 · Aparición al entrar en pantalla
     --------------------------------------------------------------- */
  var items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    // Escalonado entre hermanos que entran juntos.
    items.forEach(function (el) {
      var siblings = el.parentElement.querySelectorAll(':scope > .reveal');
      var i = Array.prototype.indexOf.call(siblings, el);
      el.style.transitionDelay = Math.min(i, 6) * 80 + 'ms';
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     3 · Efectos ligados al scroll (un solo rAF por frame)
     --------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('progress');
  var timeline = document.getElementById('timeline');
  var shapes = document.querySelectorAll('.shape[data-speed]');
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;

    nav.classList.toggle('is-scrolled', y > 30);
    progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

    if (reduced) return;

    // Figuras alrededor de la foto: parallax a distinta velocidad.
    shapes.forEach(function (s) {
      s.style.transform = 'translate3d(0,' + (y * s.dataset.speed).toFixed(1) + 'px,0)';
    });

    // Línea de la experiencia que se dibuja al bajar.
    var t = timeline.getBoundingClientRect();
    var p = (vh * 0.75 - t.top) / t.height;
    timeline.style.setProperty('--draw', Math.max(0, Math.min(1, p)).toFixed(3));
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---------------------------------------------------------------
     4 · Hover de la foto: imagen y figuras siguen al cursor
     --------------------------------------------------------------- */
  var portrait = document.getElementById('portrait');
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    portrait.addEventListener('mousemove', function (e) {
      var r = portrait.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      portrait.style.setProperty('--mx', x.toFixed(3));
      portrait.style.setProperty('--my', y.toFixed(3));
    });
    portrait.addEventListener('mouseleave', function () {
      portrait.style.setProperty('--mx', 0);
      portrait.style.setProperty('--my', 0);
    });
  }

  /* ---------------------------------------------------------------
     5 · Formulario de contacto
     --------------------------------------------------------------- */
  // Sitio estático sin backend: el formulario arma un correo con los
  // datos y lo abre en el cliente de correo del visitante.
  var form = document.getElementById('contacto');
  var status = document.getElementById('form-status');
  var TO = 'lama96088@gmail.com';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('input, textarea').forEach(function (f) {
      var valid = f.checkValidity() && f.value.trim() !== '';
      f.closest('.field').classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      status.textContent = 'Completa todos los campos con un correo válido.';
      return;
    }

    var d = form.elements;
    var subject = 'Contacto desde la web — ' + d.nombre.value.trim();
    var body = d.mensaje.value.trim() + '\n\n' + d.nombre.value.trim() + '\n' + d.correo.value.trim();
    window.location.href = 'mailto:' + TO +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    status.textContent = 'Abriendo tu aplicación de correo…';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
