// ===== SCROLL REVEAL ANIMATIONS =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  observer.observe(el);
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ===== PARALLAX EFFECT =====
const parallaxBg = document.getElementById('parallaxBg');

window.addEventListener('scroll', () => {
  if (parallaxBg) {
    const rect = parallaxBg.parentElement.getBoundingClientRect();
    const speed = 0.4;
    const yPos = rect.top * speed;
    parallaxBg.style.transform = `translateY(${yPos}px)`;
  }
});

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== MENU CATEGORY FILTER =====
const menuCards = document.querySelectorAll('.menu-card');
const menuGrid = document.querySelector('.menu-grid');

document.querySelectorAll('.menu-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const toHide = [];
    const toShow = [];
    
        // // Lock grid height to prevent layout shift
        // menuGrid.style.minHeight = menuGrid.offsetHeight + 'px';

    menuCards.forEach(card => {
      const matches = filter === 'all' || card.dataset.category === filter;
      if (matches) toShow.push(card);
      else if (card.style.display !== 'none') toHide.push(card);
    });

    // Phase 1: fade out non-matching cards
    toHide.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
    });

    // Phase 2: after fade-out, swap visibility and fade in
    setTimeout(() => {
      toHide.forEach(card => { card.style.display = 'none'; });

      toShow.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.display = '';
      });

      // Force reflow then animate in
      menuGrid.offsetHeight;

      toShow.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      });

      // Release grid height after entries animate in
      setTimeout(() => {
        menuGrid.style.minHeight = '';
      }, toShow.length * 60 + 300);
    }, 300);
  });
});

// ===== SMOOTH COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat h3');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const text = target.textContent;
      const hasPlus = text.includes('+');
      const num = parseInt(text);

      if (isNaN(num)) return;

      let current = 0;
      const increment = num / 40;
      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          current = num;
          clearInterval(timer);
        }
        target.textContent = Math.floor(current) + (hasPlus ? '+' : '');
      }, 30);

      counterObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ===== RESERVATION FORM =====
document.querySelector('.reservation-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thank you! Your reservation request has been submitted.');
});
