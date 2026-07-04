/* ============================================
   GHIBLI PORTFOLIO — JavaScript
   Raysa Putra Mario
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // TIME-BASED THEME DETECTION
  // ============================================
  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11)  return 'morning';
    if (hour >= 11 && hour < 15) return 'afternoon';
    if (hour >= 15 && hour < 18) return 'evening';
    return 'night';
  }

  function getGreeting() {
    const hour = new Date().getHours();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    if (hour >= 5 && hour < 11)  return `Selamat Pagi — ${timeStr}`;
    if (hour >= 11 && hour < 15) return `Selamat Siang — ${timeStr}`;
    if (hour >= 15 && hour < 18) return `Selamat Sore — ${timeStr}`;
    return `Selamat Malam — ${timeStr}`;
  }

  function applyTimeTheme() {
    const timeOfDay = getTimeOfDay();
    const body = document.body;

    // Remove all time classes
    body.classList.remove('time-morning', 'time-afternoon', 'time-evening', 'time-night');

    // Apply current time class
    body.classList.add(`time-${timeOfDay}`);

    // Update greeting
    const greetingEl = document.getElementById('time-greeting');
    if (greetingEl) {
      greetingEl.textContent = getGreeting();
    }
  }

  // Apply immediately and update every minute
  applyTimeTheme();
  setInterval(applyTimeTheme, 60000);

  // ============================================
  // TYPING ANIMATION
  // ============================================
  const typingEl = document.getElementById('typing-name');
  if (typingEl) {
    const fullText = typingEl.getAttribute('data-text');
    typingEl.textContent = '';
    let charIndex = 0;

    function typeChar() {
      if (charIndex < fullText.length) {
        typingEl.textContent += fullText[charIndex];
        charIndex++;
        setTimeout(typeChar, 80 + Math.random() * 60);
      }
    }

    setTimeout(typeChar, 800);
  }

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ============================================
  // MOBILE MENU
  // ============================================
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ============================================
  // SCROLL REVEAL
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // CERTIFICATION CAROUSEL
  // ============================================
  const carousel = document.querySelector('.cert-carousel');
  const cards = document.querySelectorAll('.cert-card');
  const prevBtn = document.querySelector('.cert-prev');
  const nextBtn = document.querySelector('.cert-next');
  const dotsContainer = document.querySelector('.cert-dots');

  if (carousel && cards.length > 0) {
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function getVisibleCards() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getCardWidth() {
      if (cards.length === 0) return 0;
      const card = cards[0];
      const style = getComputedStyle(carousel);
      const gap = parseFloat(style.gap) || 32;
      // Gunakan getBoundingClientRect untuk akurasi
      return card.getBoundingClientRect().width + gap;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getVisibleCards());
    }

    function createDots() {
      dotsContainer.innerHTML = '';
      const maxIdx = getMaxIndex();
      for (let i = 0; i <= maxIdx; i++) {
        const dot = document.createElement('button');
        dot.classList.add('cert-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.cert-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
      const offset = -currentIndex * getCardWidth();
      carousel.style.transform = `translateX(${offset}px)`;
      updateDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch/Drag
    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('mousemove', dragging);
    carousel.addEventListener('mouseup', dragEnd);
    carousel.addEventListener('mouseleave', dragEnd);
    carousel.addEventListener('touchstart', dragStart, { passive: true });
    carousel.addEventListener('touchmove', dragging, { passive: true });
    carousel.addEventListener('touchend', dragEnd);

    function getPositionX(e) {
      return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function dragStart(e) {
      isDragging = true;
      startX = getPositionX(e);
      prevTranslate = -currentIndex * getCardWidth();
      carousel.style.transition = 'none';
    }

    function dragging(e) {
      if (!isDragging) return;
      const diff = getPositionX(e) - startX;
      currentTranslate = prevTranslate + diff;
      carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      const movedBy = currentTranslate - prevTranslate;
      const threshold = getCardWidth() * 0.25;

      if (movedBy < -threshold) goToSlide(currentIndex + 1);
      else if (movedBy > threshold) goToSlide(currentIndex - 1);
      else goToSlide(currentIndex);
    }

    createDots();
    window.addEventListener('resize', () => {
      createDots();
      goToSlide(Math.min(currentIndex, getMaxIndex()));
    });
  }

  // ============================================
  // SMOOTH SCROLL NAV LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // PARALLAX — Mountains move on scroll
  // (skip on mobile for performance)
  // ============================================
  const landscape = document.querySelector('.landscape');
  const mountainFar = document.querySelector('.mountain-far');
  const mountainMid = document.querySelector('.mountain-mid');

  if (landscape && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      const heroHeight = document.querySelector('.hero').offsetHeight;

      if (scrollY < heroHeight) {
        if (mountainFar) mountainFar.style.transform = `translateY(${scrollY * 0.15}px)`;
        if (mountainMid) mountainMid.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    });
  }

  // ============================================
  // CONTACT CARD CLICK HANDLER
  // ============================================
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const link = this.querySelector('a');
      if (link && e.target.closest('a') !== link) {
        window.open(link.href, link.target || '_self');
      }
    });
  });

});
