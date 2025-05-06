// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Handle navbar highlighting
    handleNavHighlighting();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Smooth scrolling
    initSmoothScroll();
    
    // Form validation
    initFormValidation();
    
    // Header scroll effect
    handleHeaderScroll();
  });
  
  /**
   * Check if an element is in the viewport
   * @param element - The DOM element to check
   * @param offset - Optional offset to trigger earlier
   * @returns boolean - True if element is in viewport
   */
  function isElementInViewport(element, offset = 100) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.bottom >= 0 &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) + offset &&
      rect.right >= 0
    );
  }
  
  /**
   * Initialize scroll animations for sections
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-animation');
    
    // Initial check on page load
    animatedElements.forEach(element => {
      if (isElementInViewport(element)) {
        element.classList.add('visible');
      }
    });
    
    // Check on scroll
    window.addEventListener('scroll', () => {
      animatedElements.forEach(element => {
        if (isElementInViewport(element)) {
          element.classList.add('visible');
        }
      });
    });
  }
  
  /**
   * Handle active navigation link highlighting
   */
  function handleNavHighlighting() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateNavLinks() {
      const scrollPosition = window.scrollY;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    
    // Check active section on load and scroll
    window.addEventListener('scroll', updateNavLinks);
    updateNavLinks();
  }
  
  /**
   * Mobile menu toggle functionality
   */
  function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('#mobile-nav a');
    
    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', () => {
        mobileNav.style.display = mobileNav.style.display === 'block' ? 'none' : 'block';
      });
      
      // Close menu when clicking a link
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.style.display = 'none';
        });
      });
    }
  }
  
  /**
   * Smooth scrolling for navigation links
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  /**
   * Form validation
   */
  function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const messageError = document.getElementById('message-error');
      
      // Helper function to validate email format
      function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
      
      // Validate name field on blur
      nameInput.addEventListener('blur', () => {
        if (!nameInput.value.trim()) {
          nameError.style.display = 'block';
          nameInput.style.borderColor = '#ef4444';
        } else {
          nameError.style.display = 'none';
          nameInput.style.borderColor = '#cbd5e1';
        }
      });
      
      // Validate email field on blur
      emailInput.addEventListener('blur', () => {
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
          emailError.style.display = 'block';
          emailInput.style.borderColor = '#ef4444';
        } else {
          emailError.style.display = 'none';
          emailInput.style.borderColor = '#cbd5e1';
        }
      });
      
      // Validate message field on blur
      messageInput.addEventListener('blur', () => {
        if (!messageInput.value.trim()) {
          messageError.style.display = 'block';
          messageInput.style.borderColor = '#ef4444';
        } else {
          messageError.style.display = 'none';
          messageInput.style.borderColor = '#cbd5e1';
        }
      });
      
      // Form submission handler
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        // Validate name
        if (!nameInput.value.trim()) {
          nameError.style.display = 'block';
          nameInput.style.borderColor = '#ef4444';
          isValid = false;
        }
        
        // Validate email
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
          emailError.style.display = 'block';
          emailInput.style.borderColor = '#ef4444';
          isValid = false;
        }
        
        // Validate message
        if (!messageInput.value.trim()) {
          messageError.style.display = 'block';
          messageInput.style.borderColor = '#ef4444';
          isValid = false;
        }
        
        if (isValid) {
          // For demonstration purposes, show an alert
          alert('Thank you for your message! I will get back to you soon.');
          
          // Reset form
          contactForm.reset();
        }
      });
    }
  }
  
  /**
   * Header scroll effect
   */
  function handleHeaderScroll() {
    const header = document.querySelector('header');
    
    function updateHeader() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader();
  }
