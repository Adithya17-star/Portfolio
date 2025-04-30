// Set current year in footer with error handling
const setCurrentYear = () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    } else {
      console.warn('Year element not found');
    }
  };
  
  // Smooth scrolling with intersection observer for active link highlighting
  const setupSmoothScrolling = () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Update active class
          navLinks.forEach(nav => nav.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });
  
    // Intersection Observer for section visibility
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
            if (activeLink) {
              navLinks.forEach(nav => nav.classList.remove('active'));
              activeLink.classList.add('active');
            }
          }
        });
      },
      { threshold: 0.5 }
    );
  
    sections.forEach(section => observer.observe(section));
  };
  
  // Form submission with basic validation and async submission
  const setupFormSubmission = () => {
    const form = document.querySelector('.contact-form');
    if (!form) {
      console.warn('Contact form not found');
      return;
    }
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Basic form validation
      const formData = new FormData(form);
      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const message = formData.get('message')?.trim();
  
      if (!name || !email || !message) {
        alert('Please fill in all required fields');
        return;
      }
  
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
      }
  
      try {
        // Simulated async submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
      } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error sending your message. Please try again later.');
      }
    });
  };
  
  // Initialize all functionality
  const init = () => {
    try {
      setCurrentYear();
      setupSmoothScrolling();
      setupFormSubmission();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  };
  
  // Run initialization when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);
