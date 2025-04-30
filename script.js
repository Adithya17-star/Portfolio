/**
 * Advanced Portfolio Website JavaScript
 * Enhanced with modern JS practices, animation effects, and interactive features
 */

// Use an IIFE to avoid polluting the global namespace
(function() {
  'use strict';

  // Configuration options for customization
  const CONFIG = {
    scrollOffset: 80,
    intersectionThreshold: 0.2,
    animationDuration: 800,
    typingSpeed: 80,
    darkModeStorageKey: 'portfolioDarkMode',
    apiEndpoint: 'https://formspree.io/f/your-form-id', // Replace with actual endpoint
    skillsPercentages: {
      'Python': 95,
      'Machine Learning': 90,
      'JavaScript': 85,
      'React': 80,
      'Data Analysis': 85,
      'Web Development': 80
    }
  };

  // DOM elements cache
  const DOM = {};

  /**
   * Caches DOM elements for better performance
   */
  const cacheDOM = () => {
    DOM.body = document.body;
    DOM.header = document.querySelector('header');
    DOM.nav = document.querySelector('nav');
    DOM.navLinks = document.querySelectorAll('a[href^="#"]');
    DOM.sections = document.querySelectorAll('section');
    DOM.contactForm = document.querySelector('.contact-form');
    DOM.darkModeToggle = document.getElementById('darkModeToggle');
    DOM.mobileMenuToggle = document.querySelector('.mobile-toggle');
    DOM.yearElement = document.getElementById('current-year');
    DOM.typewriterElement = document.querySelector('.typewriter-text');
    DOM.preloader = document.getElementById('preloader');
    DOM.skillBars = document.querySelectorAll('.skill-progress-bar');
    DOM.projectCards = document.querySelectorAll('.project');
    DOM.toTopButton = document.getElementById('toTopButton');
  };

  /**
   * Sets the current year in the footer with error handling
   */
  const setCurrentYear = () => {
    if (DOM.yearElement) {
      DOM.yearElement.textContent = new Date().getFullYear();
    } else {
      console.warn('Year element not found');
    }
  };

  /**
   * Implements smooth scrolling with intersection observer for active link highlighting
   */
  const setupSmoothScrolling = () => {
    if (!DOM.navLinks.length) return;
    
    DOM.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Add animation class to target section
          targetElement.classList.add('scroll-focus');
          setTimeout(() => targetElement.classList.remove('scroll-focus'), CONFIG.animationDuration);
          
          window.scrollTo({
            top: targetElement.offsetTop - CONFIG.scrollOffset,
            behavior: 'smooth'
          });
          
          // Update active class
          DOM.navLinks.forEach(nav => nav.classList.remove('active'));
          link.classList.add('active');
          
          // Close mobile menu if open
          if (DOM.nav.classList.contains('active')) {
            DOM.nav.classList.remove('active');
          }
        }
      });
    });

    // Enhanced Intersection Observer for section visibility with options
    const observerOptions = {
      root: null,
      rootMargin: `-${CONFIG.scrollOffset}px 0px 0px 0px`,
      threshold: CONFIG.intersectionThreshold
    };
    
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        // Animate sections when they come into view
        if (entry.isIntersecting) {
          // Update active navigation link
          const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
          if (activeLink) {
            DOM.navLinks.forEach(nav => nav.classList.remove('active'));
            activeLink.classList.add('active');
          }
          
          // Animate section elements
          entry.target.classList.add('in-view');
          
          // Animate skill bars when skills section comes into view
          if (entry.target.id === 'skills') {
            animateSkillBars();
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    DOM.sections.forEach(section => observer.observe(section));
  };

  /**
   * Animates skill progress bars with percentage data
   */
  const animateSkillBars = () => {
    if (!DOM.skillBars.length) return;
    
    DOM.skillBars.forEach(bar => {
      const skill = bar.getAttribute('data-skill');
      const percentage = CONFIG.skillsPercentages[skill] || 70;
      
      // Animate the width
      setTimeout(() => {
        bar.style.width = `${percentage}%`;
        bar.setAttribute('aria-valuenow', percentage);
      }, 200);
    });
  };

  /**
   * Implements typewriter effect for hero section
   */
  const initTypewriterEffect = () => {
    if (!DOM.typewriterElement) return;
    
    const roles = ['Computer Science Engineer', 'AI/ML Enthusiast', 'Problem Solver', 'Full Stack Developer'];
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingTimeout;
    
    const type = () => {
      const currentRole = roles[currentRoleIndex];
      
      if (isDeleting) {
        DOM.typewriterElement.textContent = currentRole.substring(0, currentCharIndex - 1);
        currentCharIndex--;
      } else {
        DOM.typewriterElement.textContent = currentRole.substring(0, currentCharIndex + 1);
        currentCharIndex++;
      }
      
      // Speed adjustments for natural typing feel
      let typingSpeed = CONFIG.typingSpeed;
      
      if (isDeleting) {
        typingSpeed /= 2; // Faster deletion
      } else if (currentCharIndex === currentRole.length) {
        typingSpeed = CONFIG.typingSpeed * 5; // Pause at the end
        isDeleting = true;
      } else if (currentCharIndex === 0) {
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length; // Move to next role
      }
      
      typingTimeout = setTimeout(type, typingSpeed);
    };
    
    // Start the typewriter effect
    type();
    
    // Cleanup function to clear timeout when needed
    return () => clearTimeout(typingTimeout);
  };

  /**
   * Implements form submission with advanced validation, error handling and UX improvements
   */
  const setupFormSubmission = () => {
    if (!DOM.contactForm) {
      console.warn('Contact form not found');
      return;
    }
    
    // Form input elements
    const formInputs = DOM.contactForm.querySelectorAll('input, textarea');
    const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
    
    // Add validation styles on blur
    formInputs.forEach(input => {
      // Real-time validation feedback
      input.addEventListener('blur', () => {
        validateInput(input);
      });
      
      // Clear error state on focus
      input.addEventListener('focus', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
          formGroup.classList.remove('error');
          const errorMsg = formGroup.querySelector('.error-message');
          if (errorMsg) errorMsg.remove();
        }
      });
    });
    
    // Form submission handler
    DOM.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate all inputs
      let isValid = true;
      formInputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (!isValid) return;
      
      // Show loading state
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.classList.add('loading');
      
      // Prepare form data
      const formData = new FormData(DOM.contactForm);
      const formDataObj = Object.fromEntries(formData.entries());
      
      try {
        // Send the form data asynchronously - replace with actual API call
        const response = await fetch(CONFIG.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataObj)
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        
        // Show success message
        showFormMessage('success', 'Thank you for your message! I will get back to you soon.');
        DOM.contactForm.reset();
      } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('error', 'There was an error sending your message. Please try again later.');
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        submitButton.classList.remove('loading');
      }
    });
    
    // Input validation function
    function validateInput(input) {
      const value = input.value.trim();
      const formGroup = input.closest('.form-group');
      let errorMessage = '';
      
      if (!formGroup) return true;
      
      // Remove any existing error message
      const existingError = formGroup.querySelector('.error-message');
      if (existingError) existingError.remove();
      
      // Required field validation
      if (input.required && !value) {
        errorMessage = 'This field is required';
      } 
      // Email validation
      else if (input.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          errorMessage = 'Please enter a valid email address';
        }
      }
      // Name validation - minimum 2 characters
      else if (input.id === 'name' && value.length < 2) {
        errorMessage = 'Name must be at least 2 characters long';
      }
      // Message validation - minimum 10 characters
      else if (input.id === 'message' && value.length < 10) {
        errorMessage = 'Message must be at least 10 characters long';
      }
      
      // Display error message if any
      if (errorMessage) {
        formGroup.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        formGroup.appendChild(errorElement);
        return false;
      }
      
      formGroup.classList.remove('error');
      return true;
    }
    
    // Function to show form messages
    function showFormMessage(type, message) {
      // Remove any existing message
      const existingMessage = DOM.contactForm.querySelector('.form-message');
      if (existingMessage) existingMessage.remove();
      
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = `form-message ${type}`;
      messageElement.textContent = message;
      
      // Add to form
      DOM.contactForm.appendChild(messageElement);
      
      // Auto remove after delay if success
      if (type === 'success') {
        setTimeout(() => {
          messageElement.classList.add('fade-out');
          setTimeout(() => messageElement.remove(), 500);
        }, 5000);
      }
    }
  };

  /**
   * Sets up scroll-based animations and effects
   */
  const setupScrollEffects = () => {
    // Sticky header effect
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Sticky header logic
      if (scrollTop > 50) {
        DOM.header.classList.add('sticky');
        
        // Hide header on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > DOM.header.offsetHeight) {
          DOM.header.classList.add('header-hidden');
        } else {
          DOM.header.classList.remove('header-hidden');
        }
      } else {
        DOM.header.classList.remove('sticky');
      }
      
      // Show/hide scroll to top button
      if (DOM.toTopButton) {
        if (scrollTop > 500) {
          DOM.toTopButton.classList.add('visible');
        } else {
          DOM.toTopButton.classList.remove('visible');
        }
      }
      
      lastScrollTop = scrollTop;
    });
    
    // Setup scroll to top button
    if (DOM.toTopButton) {
      DOM.toTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  /**
   * Sets up project filtering and animation
   */
  const setupProjectsInteraction = () => {
    if (!DOM.projectCards.length) return;
    
    // Project hover effects
    DOM.projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
    });
    
    // Project filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length) {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const filter = button.getAttribute('data-filter');
          
          // Update active button
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          // Filter projects
          DOM.projectCards.forEach(card => {
            if (filter === 'all') {
              card.style.display = 'block';
              setTimeout(() => card.classList.remove('hidden'), 50);
            } else {
              const categories = card.getAttribute('data-categories').split(' ');
              if (categories.includes(filter)) {
                card.style.display = 'block';
                setTimeout(() => card.classList.remove('hidden'), 50);
              } else {
                card.classList.add('hidden');
                setTimeout(() => card.style.display = 'none', 500);
              }
            }
          });
        });
      });
    }
  };

  /**
   * Implements lazy loading for images
   */
  const setupLazyLoading = () => {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      const lazyLoad = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const windowHeight = window.innerHeight;
        
        lazyImages.forEach(img => {
          const rect = img.getBoundingClientRect();
          if (rect.top <= windowHeight && rect.bottom >= 0) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
          }
        });
      };
      
      // Initial check
      lazyLoad();
      
      // Check on scroll
      window.addEventListener('scroll', lazyLoad);
    }
  };

  /**
   * Implements dark mode toggle functionality
   */
  const setupDarkMode = () => {
    if (!DOM.darkModeToggle) return;
    
    // Check for saved preference and system preference
    const savedDarkMode = localStorage.getItem(CONFIG.darkModeStorageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize dark mode state
    if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDark)) {
      document.documentElement.classList.add('dark-mode');
      DOM.darkModeToggle.checked = true;
    }
    
    // Toggle event
    DOM.darkModeToggle.addEventListener('change', () => {
      if (DOM.darkModeToggle.checked) {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem(CONFIG.darkModeStorageKey, 'true');
      } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem(CONFIG.darkModeStorageKey, 'false');
      }
    });
  };

  /**
   * Sets up mobile menu toggle functionality
   */
  const setupMobileMenu = () => {
    if (!DOM.mobileMenuToggle || !DOM.nav) return;
    
    DOM.mobileMenuToggle.addEventListener('click', () => {
      DOM.nav.classList.toggle('active');
      DOM.mobileMenuToggle.classList.toggle('active');
      
      // Update ARIA attributes for accessibility
      const expanded = DOM.nav.classList.contains('active');
      DOM.mobileMenuToggle.setAttribute('aria-expanded', expanded);
      
      // Prevent scrolling when menu is open
      if (expanded) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (DOM.nav.classList.contains('active') && 
          !DOM.nav.contains(e.target) && 
          !DOM.mobileMenuToggle.contains(e.target)) {
        DOM.nav.classList.remove('active');
        DOM.mobileMenuToggle.classList.remove('active');
        DOM.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  };

  /**
   * Initializes custom cursor effect
   */
  const setupCustomCursor = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      // Main cursor with lag effect
      cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      
      // Dot cursor follows immediately
      cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    });
    
    // Add hover effect for clickable elements
    const clickables = document.querySelectorAll('a, button, input, textarea, .project, .social-link');
    clickables.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      });
    });
  };

  /**
   * Preloader animation
   */
  const setupPreloader = () => {
    if (!DOM.preloader) return;
    
    // Hide preloader after content is loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        DOM.preloader.classList.add('preloader-hidden');
        setTimeout(() => {
          DOM.preloader.style.display = 'none';
        }, 500);
      }, 500);
    });
  };

  /**
   * Adds smooth parallax effect to hero section
   */
  const setupParallaxEffect = () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      const bgShapes = heroSection.querySelector('.bg-shapes');
      
      if (bgShapes) {
        // Parallax effect
        bgShapes.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      }
      
      // Fade effect for hero content
      const heroContent = heroSection.querySelector('.hero-content');
      if (heroContent) {
        const opacity = 1 - (scrollPosition * 0.003);
        heroContent.style.opacity = opacity > 0 ? opacity : 0;
      }
    });
  };

  /**
   * Initializes a portfolio filter gallery
   */
  const initPortfolioGallery = () => {
    // Project modal popup
    const projectLinks = document.querySelectorAll('.project-link');
    const modalContainer = document.getElementById('project-modal');
    
    if (projectLinks.length && modalContainer) {
      projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          const projectId = link.getAttribute('data-project-id');
          
          // Here you would typically fetch project details based on ID
          // For simplicity, using a hardcoded example:
          const projectData = {
            title: link.closest('.project').querySelector('h3').textContent,
            description: link.closest('.project').querySelector('p').textContent,
            image: link.closest('.project').querySelector('.project-img').innerHTML,
            tags: Array.from(link.closest('.project').querySelectorAll('.tag')).map(tag => tag.textContent)
          };
          
          // Populate and show modal
          document.getElementById('modal-title').textContent = projectData.title;
          document.getElementById('modal-description').textContent = projectData.description;
          document.getElementById('modal-image').innerHTML = projectData.image;
          
          modalContainer.classList.add('active');
          document.body.classList.add('modal-open');
        });
      });
      
      // Close modal on button click
      const closeButton = modalContainer.querySelector('.close-modal');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          modalContainer.classList.remove('active');
          document.body.classList.remove('modal-open');
        });
      }
      
      // Close modal on outside click
      modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
          modalContainer.classList.remove('active');
          document.body.classList.remove('modal-open');
        }
      });
    }
  };

  /**
   * Initialize the website analytics
   */
  const initAnalytics = () => {
    // Simple page view tracking - replace with your actual analytics code
    const trackPageView = () => {
      const pageData = {
        page: window.location.pathname,
        referrer: document.referrer,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        timestamp: new Date().toISOString()
      };
      
      // For demonstration only - would normally send to analytics service
      console.info('Page view tracked:', pageData);
    };
    
    // Track clicks on important links
    const trackLinks = () => {
      const trackableLinks = document.querySelectorAll('a[data-track]');
      trackableLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const linkData = {
            linkText: link.textContent,
            linkHref: link.getAttribute('href'),
            category: link.getAttribute('data-track'),
            timestamp: new Date().toISOString()
          };
          
          // For demonstration only
          console.info('Link click tracked:', linkData);
        });
      });
    };
    
    // Initialize tracking
    trackPageView();
    trackLinks();
  };

  /**
   * Register service worker for offline capabilities
   */
  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.info('ServiceWorker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }
  };

  /**
   * Handles error tracking and reporting
   */
  const setupErrorHandling = () => {
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error);
      
      // You could send this to an error tracking service
      const errorData = {
        message: event.error.message,
        stack: event.error.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      };
      
      // For demonstration only
      console.info('Error logged:', errorData);
    });
  };

  /**
   * Master initialization function with error handling
   */
  const init = () => {
    try {
      // First cache all DOM elements
      cacheDOM();
      
      // Setup preloader first
      setupPreloader();
      
      // Then initialize all features
      setCurrentYear();
      setupMobileMenu();
      setupSmoothScrolling();
      setupScrollEffects();
      setupDarkMode();
      setupFormSubmission();
      setupProjectsInteraction();
      setupLazyLoading();
      setupParallaxEffect();
      initTypewriterEffect();
      initPortfolioGallery();
      initAnalytics();
      registerServiceWorker();
      setupErrorHandling();
      
      // Setup custom cursor last
      if (window.matchMedia('(pointer: fine)').matches) {
        setupCustomCursor();
      }
      
      console.info('Portfolio initialization complete');
    } catch (error) {
      console.error('Portfolio initialization error:', error);
    }
  };

  // Run initialization when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);
})();
