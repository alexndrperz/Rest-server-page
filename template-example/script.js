/**
 * script.js — Sofia Ramírez Portfolio
 *
 * Sections:
 *  1. Nav scroll   — shadow on nav + active link tracking
 *  2. Reveal       — IntersectionObserver fade-up for .reveal elements
 *  3. Counter      — rAF-based ease-out counter for hero stats
 *  4. Filter tabs  — portfolio category filter toggle
 *  5. Form submit  — visual feedback on contact form submission
 */

(function () {

  /* ── 1. Nav scroll ─────────────────────────────────────────
   * Adds .scrolled to <nav> for shadow when page is not at top.
   * Also highlights the nav link matching the current section.
   */
  var navbar   = document.getElementById('navbar');
  var sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {

    // Toggle shadow on nav
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Highlight nav link for the section currently in view
    var current = '';
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });

    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

  });


  /* ── 2. Reveal ─────────────────────────────────────────────
   * Watches all .reveal elements. Adds .visible when they
   * enter the viewport, triggering the CSS fade-up animation.
   */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ── 3. Counter ────────────────────────────────────────────
   * Animates .stat-num elements from 0 to their target value
   * using requestAnimationFrame with a cubic ease-out curve.
   * Runs once when the .hero-stats container enters view.
   */
  function animateCounter(el, target, suffix) {
    var startTime = null;
    var duration  = 1200; // ms

    function step(timestamp) {
      if (!startTime) startTime = timestamp;

      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out

      el.textContent = Math.floor(eased * target) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix; // ensure exact final value
      }
    }

    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(function (el) {
          var raw    = el.textContent;
          var value  = parseInt(raw, 10);
          var suffix = raw.replace(/[0-9]/g, ''); // e.g. "+" from "120+"
          animateCounter(el, value, suffix);
        });
        statsObserver.unobserve(entry.target); // run only once
      }
    });
  }, { threshold: 0.5 });

  var heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);


  /* ── 4. Filter tabs ────────────────────────────────────────
   * Toggles the .active class on portfolio filter buttons.
   * Visual only — actual filtering would require extra logic.
   */
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
    });
  });


  /* ── 5. Form submit ────────────────────────────────────────
   * Shows a temporary success state on the submit button.
   * Replace this with a real form handler (fetch/FormData) when ready.
   */
  var submitBtn = document.getElementById('formSubmitBtn');

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      submitBtn.textContent    = 'Mensaje enviado';
      submitBtn.style.background = 'var(--sage)';
      submitBtn.disabled       = true;

      setTimeout(function () {
        submitBtn.textContent    = 'Enviar mensaje →';
        submitBtn.style.background = '';
        submitBtn.disabled       = false;
      }, 3000);
    });
  }

})();
