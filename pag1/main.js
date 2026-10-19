/* ==========================================================================
   CARLA ORTIZ — interacciones
   Vanilla JS · sin dependencias
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     1 · Cortina de entrada
     --------------------------------------------------------------- */
  // Dos fases: 'loaded' levanta la cortina, 'ready' dispara las
  // animaciones del banner una vez la cortina ya no tapa nada.
  function open() {
    if (document.body.classList.contains('loaded')) return;
    document.body.classList.add('loaded');
    setTimeout(function () {
      document.body.classList.add('ready');
    }, reduced ? 0 : 820);
  }

  window.addEventListener('load', function () {
    setTimeout(open, reduced ? 0 : 480);
  });
  // Red de seguridad: si load tarda demasiado, abrimos igual.
  setTimeout(open, 2400);

  /* ---------------------------------------------------------------
     2 · Partir titulares en líneas enmascaradas
     --------------------------------------------------------------- */
  document.querySelectorAll('[data-lines]').forEach(function (el) {
    var lines = el.textContent.trim().split('\n')
      .map(function (l) { return l.trim(); })
      .filter(Boolean);
    el.innerHTML = lines.map(function (line, i) {
      return '<span class="line-mask" style="--ld:' + (i * 0.1) + 's"><span>' + line + '</span></span>';
    }).join('');
  });

  /* ---------------------------------------------------------------
     3 · Revelado al entrar en viewport
     --------------------------------------------------------------- */
  var targets = document.querySelectorAll('[data-reveal], [data-lines]');

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------------
     4 · (La apertura de la foto del banner la resuelve el CSS
          mediante las cortinas .veil sobre body.loaded)
     --------------------------------------------------------------- */

  /* ---------------------------------------------------------------
     5 · Contadores
     --------------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var end = parseInt(e.target.getAttribute('data-count'), 10) || 0;
        if (reduced) { e.target.textContent = end; return; }
        var t0 = performance.now(), dur = 1400;
        (function step(now) {
          var p = Math.min((now - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(end * eased);
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------------------------------------------------------------
     6 · Scroll: progreso, dock, parallax
     --------------------------------------------------------------- */
  var progress = document.getElementById('progress');
  var dock = document.getElementById('dock');
  var heroImg = document.getElementById('heroImg');
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (dock) dock.classList.toggle('is-on', y > window.innerHeight * 0.75);

    if (!reduced) {
      // parallax suave del retrato del hero
      // parallax del retrato: solo movemos la variable --py para no
      // pisar la animación de zoom que vive en .shot__zoom
      if (heroImg && y < window.innerHeight * 1.6) {
        heroImg.style.setProperty('--py', (-8 + y * 0.012).toFixed(2) + '%');
      }
      // parallax genérico
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        var amt = parseFloat(el.getAttribute('data-parallax')) || 0.05;
        var off = (r.top + r.height / 2 - window.innerHeight / 2) * amt;
        var img = el.querySelector('img') || el;
        img.style.setProperty('--py', (-off).toFixed(2) + 'px');
      });
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     7 · Menú móvil
     --------------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var sheet = document.getElementById('sheet');

  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('is-open');
    burger.classList.remove('is-x');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(function () { sheet.hidden = true; }, 420);
  }

  if (burger && sheet) {
    burger.addEventListener('click', function () {
      if (sheet.hidden) {
        sheet.hidden = false;
        requestAnimationFrame(function () { sheet.classList.add('is-open'); });
        burger.classList.add('is-x');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        closeSheet();
      }
    });
    sheet.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeSheet);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSheet();
    });
  }

  /* ---------------------------------------------------------------
     8 · Imágenes de portfolio: placeholder si aún no existen
        Deja tus posts en  /img/post-1.jpg … post-6.jpg
     --------------------------------------------------------------- */
  document.querySelectorAll('.card__media img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
      img.parentElement.classList.add('is-empty');
    });
    if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
  });

  // Imágenes con alternativa declarada (data-fallback)
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function handler() {
      img.removeEventListener('error', handler);
      img.src = img.getAttribute('data-fallback');
    });
    if (img.complete && img.naturalWidth === 0) {
      img.src = img.getAttribute('data-fallback');
    }
  });

  /* ---------------------------------------------------------------
     9 · Tilt sutil en las tarjetas (solo puntero fino)
     --------------------------------------------------------------- */
  if (!reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt] .card__media').forEach(function (media) {
      media.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
      media.addEventListener('mousemove', function (e) {
        var r = media.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        media.style.transition = 'transform .12s linear';
        media.style.transform = 'perspective(900px) rotateX(' + (-py * 3).toFixed(2) +
          'deg) rotateY(' + (px * 3).toFixed(2) + 'deg)';
      });
      media.addEventListener('mouseleave', function () {
        media.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)';
        media.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------------
     10 · Scroll suave con compensación del dock
     --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 58;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

})();
