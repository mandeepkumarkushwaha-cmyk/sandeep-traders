/* ============================================
   SANDEEP TRADERS - Main JavaScript
   All interactivity: slider, nav, scroll, etc.
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- AUTO IMAGE SLIDER ---- */
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let current = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(n) {
    slides[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4500);
  }

  prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); startAuto(); });

  // Pause on hover
  const sliderWrapper = document.querySelector('.slider-wrapper');
  sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
  sliderWrapper.addEventListener('mouseleave', startAuto);

  // Touch/swipe support
  let touchStartX = 0;
  sliderWrapper.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  sliderWrapper.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
  });

  startAuto();


  /* ---- HAMBURGER MOBILE NAV ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.classList.toggle('active', open);
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });


  /* ---- STICKY NAVBAR SHADOW ON SCROLL ---- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  /* ---- SCROLL TO TOP BUTTON ---- */
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---- ACTIVE NAV LINK (HIGHLIGHT ON SCROLL) ---- */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => {
          a.classList.remove('active-nav');
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.classList.add('active-nav');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));


  /* ---- CONTACT FORM SUBMIT ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Enquiry';
        btn.disabled = false;
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1500);
    });
  }


  /* ---- PRODUCT CARD SCROLL ANIMATION ---- */
  const productCards = document.querySelectorAll('.product-card');

  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.style.animationPlayState = 'running';
        }, parseInt(delay));
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  productCards.forEach(card => {
    card.style.animationPlayState = 'paused';
    cardObserver.observe(card);
  });


  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ---- OWNER CARD ENTRANCE ANIMATION ---- */
  const ownerCards = document.querySelectorAll('.owner-card');
  const ownerObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 200);
        ownerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  ownerCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    ownerObserver.observe(card);
  });


  /* ---- REVIEW CARD ENTRANCE ANIMATION ---- */
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 100);
        reviewObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reviewCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    reviewObserver.observe(card);
  });


  /* ---- STATS COUNTER ANIMATION ---- */
  const stats = document.querySelectorAll('.stat strong');
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const num = parseInt(text);
        if (!isNaN(num) && num > 1) {
          let start = 0;
          const step = Math.ceil(num / 60);
          const suffix = text.replace(/[0-9]/g, '');
          const timer = setInterval(() => {
            start += step;
            if (start >= num) { start = num; clearInterval(timer); }
            el.textContent = start + suffix;
          }, 25);
        }
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => statObserver.observe(s));

});
