document.addEventListener('DOMContentLoaded', () => {

  // --- 1. MOBILE NAVIGATION MENU ---
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const primaryNav = document.getElementById('primary-navigation');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggleBtn && primaryNav && navOverlay) {
    const toggleMenu = (open) => {
      menuToggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        primaryNav.classList.add('open');
        navOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        primaryNav.classList.remove('open');
        navOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    };

    menuToggleBtn.addEventListener('click', () => {
      const isOpened = menuToggleBtn.getAttribute('aria-expanded') === 'true';
      toggleMenu(!isOpened);
    });

    navOverlay.addEventListener('click', () => {
      toggleMenu(false);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });
  }


  // --- 2. FAQ ACCORDION INTERACTIVITY ---
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isOpen = item.classList.contains('active');

      // Close all other accordions for a clean single-open behavior
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          otherContent.style.maxHeight = null;
          otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
          otherContent.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current accordion
      if (isOpen) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
      }
    });
  });


  // --- 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      root: null,
      threshold: 0.12, // Trigger when 12% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }


  // --- 4. HEADER SCROLL & SECTION INDICATOR ---
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header scroll background change
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting based on scroll position
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120; // adjust offset for header height
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });


  // --- 5. RIPPLE BUTTON EFFECT (Micro-animation) ---
  const rippleButtons = document.querySelectorAll('.ripple');

  rippleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.background = 'rgba(255, 255, 255, 0.25)';
      ripple.style.width = '100px';
      ripple.style.height = '100px';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.pointerEvents = 'none';
      ripple.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      ripple.classList.add('ripple-span');

      this.appendChild(ripple);

      // Trigger animation
      setTimeout(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(4)';
        ripple.style.opacity = '0';
      }, 0);

      // Clean up after animation finishes
      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });

});
