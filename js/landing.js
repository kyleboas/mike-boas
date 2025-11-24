/**
 * Landing Page Interactive Features
 * Handles scroll animations, flashlight effects, and marquee controls
 */

(function() {
  'use strict';

  /* ========================================================================
     SCROLL ANIMATION OBSERVER
     ======================================================================== */

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px'
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* ========================================================================
     FLASHLIGHT CARD EFFECT
     ======================================================================== */

  function initFlashlightCards() {
    const flashlightCards = document.querySelectorAll('[data-flashlight]');

    if (!flashlightCards.length) return;

    flashlightCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  /* ========================================================================
     LOGO MARQUEE DUPLICATION
     ======================================================================== */

  function initLogoMarquee() {
    const marqueeContent = document.getElementById('logoMarquee');

    if (!marqueeContent) return;

    // Clone the content twice to create seamless loop
    const originalItems = marqueeContent.innerHTML;
    marqueeContent.innerHTML = originalItems + originalItems + originalItems;
  }

  /* ========================================================================
     TESTIMONIALS MARQUEE
     ======================================================================== */

  function initTestimonialsMarquee() {
    const marqueeContent = document.getElementById('testimonialsMarquee');
    const toggleButton = document.getElementById('marqueeToggle');

    if (!marqueeContent || !toggleButton) return;

    // Clone testimonials for seamless loop
    const originalContent = marqueeContent.innerHTML;
    marqueeContent.innerHTML = originalContent + originalContent;

    // Toggle pause/play
    let isPaused = false;

    toggleButton.addEventListener('click', () => {
      isPaused = !isPaused;

      if (isPaused) {
        marqueeContent.classList.add('paused');
        toggleButton.querySelector('.play-icon').classList.remove('hidden');
        toggleButton.querySelector('.pause-icon').classList.add('hidden');
        toggleButton.querySelector('.toggle-text').textContent = 'Resume';
      } else {
        marqueeContent.classList.remove('paused');
        toggleButton.querySelector('.play-icon').classList.add('hidden');
        toggleButton.querySelector('.pause-icon').classList.remove('hidden');
        toggleButton.querySelector('.toggle-text').textContent = 'Pause';
      }
    });
  }

  /* ========================================================================
     EMAIL FORM HANDLING (OPTIONAL)
     ======================================================================== */

  function initEmailForm() {
    const emailForm = document.querySelector('.hero-email-form');

    if (!emailForm) return;

    const emailInput = emailForm.querySelector('.hero-email-input');
    const emailButton = emailForm.querySelector('.hero-email-button');

    if (!emailInput || !emailButton) return;

    emailButton.addEventListener('click', (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (!email) {
        alert('Please enter your email address');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Here you would normally send the email to your backend
      console.log('Email submitted:', email);
      alert('Thank you for subscribing!');
      emailInput.value = '';
    });
  }

  /* ========================================================================
     CTA BUTTON HANDLERS (OPTIONAL)
     ======================================================================== */

  function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.button-3d');

    if (!ctaButtons.length) return;

    ctaButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        // Here you would normally navigate to a contact page or open a modal
        console.log('CTA button clicked');
        alert('Contact form would open here!');
      });
    });
  }

  /* ========================================================================
     SMOOTH SCROLL (OPTIONAL)
     ======================================================================== */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href === '#') return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /* ========================================================================
     INITIALIZE ON DOM READY
     ======================================================================== */

  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    initScrollAnimations();
    initFlashlightCards();
    initLogoMarquee();
    initTestimonialsMarquee();
    initEmailForm();
    initCTAButtons();
    initSmoothScroll();

    // Add a small delay to ensure CSS is loaded
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
  }

  // Start initialization
  init();

})();

  /* ========================================================================
     HERO SUNRISE
     ======================================================================== */
     
window.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-section');
  const content = document.querySelector('.hero-content');
  if (!hero || !content) return;

  // set starting states
  hero.style.setProperty('--sunrise-opacity', 1);
  content.style.opacity = 0;

  requestAnimationFrame(() => {
    hero.style.transition = '--sunrise-opacity 1.6s ease';
    hero.style.setProperty('--sunrise-opacity', 0.70);

    // fade in hero content
    content.style.opacity = 1;
  });
});

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    
    // We want the darkness to fully disappear (opacity 0)
    // by the time we scroll about 60% of the hero height
    const fadeDistance = heroHeight * 0.6;
    
    // Opacity starts at 1 (Top of page) and decreases to 0 (Scrolled down)
    let newOpacity = 1 - (scrollY / fadeDistance);
    
    // Clamp values between 0 and 1 so it doesn't go negative
    newOpacity = Math.max(0, Math.min(1, newOpacity));
    
    // Update the CSS variable
    hero.style.setProperty('--sunrise-opacity', newOpacity);
});