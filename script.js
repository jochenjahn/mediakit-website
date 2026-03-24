/* ==========================================
   KRAMMER JAHN — MAIN JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- HEADER SCROLL BEHAVIOR ---
  const header = document.getElementById('header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });

  // --- DROPDOWN MENU ---
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.contains('open');
      dropdownMenu.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    });

    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // --- MOBILE MENU ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileOverlay.classList.toggle('open');
      document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
    });

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- HERO SLIDER ---
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  // --- SERVICE CARD ACCORDIONS ---
  document.querySelectorAll('.service-card-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.service-card');
      const body = card.querySelector('.service-card-body');
      const isOpen = header.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.service-card-header').forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        h.closest('.service-card').querySelector('.service-card-body').classList.remove('open');
      });

      if (!isOpen) {
        header.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // --- STATS COUNT-UP ANIMATION ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(update);
    });
  }

  // --- TEAM CAROUSEL ---
  const teamTrack = document.querySelector('.team-track');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (teamTrack && prevBtn && nextBtn) {
    let carouselPos = 0;
    const cards = teamTrack.querySelectorAll('.team-card');

    function getVisibleCards() {
      const width = window.innerWidth;
      if (width <= 768) return 1;
      if (width <= 1024) return 2;
      return 3;
    }

    function updateCarousel() {
      const visible = getVisibleCards();
      const maxPos = Math.max(0, cards.length - visible);
      carouselPos = Math.min(carouselPos, maxPos);
      const gap = 16;
      const cardWidth = teamTrack.parentElement.offsetWidth / visible - (gap * (visible - 1) / visible);
      const offset = carouselPos * (cardWidth + gap);
      teamTrack.style.transform = `translateX(-${offset}px)`;
    }

    prevBtn.addEventListener('click', () => {
      if (carouselPos > 0) {
        carouselPos--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      const visible = getVisibleCards();
      const maxPos = Math.max(0, cards.length - visible);
      if (carouselPos < maxPos) {
        carouselPos++;
        updateCarousel();
      }
    });

    window.addEventListener('resize', () => {
      updateCarousel();
    });
  }

  // --- INTERSECTION OBSERVER (Scroll animations & stats trigger) ---
  const observerOptions = { threshold: 0.2 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger stats if stats section
        if (entry.target.classList.contains('stats-section')) {
          animateStats();
        }
      }
    });
  }, observerOptions);

  // Observe sections for fade-in
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // Also observe stats section specifically
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);

  // --- SMOOTH SCROLL for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

});
