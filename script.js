document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('nav');
  
  if (mobileToggle && nav) {
      mobileToggle.addEventListener('click', () => {
          nav.classList.toggle('active');
          mobileToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
      });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
              window.scrollTo({
                  top: target.offsetTop,
                  behavior: 'smooth'
              });
              if (nav.classList.contains('active')) {
                  nav.classList.remove('active');
                  mobileToggle.textContent = '☰';
              }
          }
      });
  });
  
  // Highlight active navigation link
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  
  window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 60) {
              current = section.getAttribute('id');
          }
      });
      
      navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').slice(1) === current) {
              link.classList.add('active');
          }
      });
  });
  
  // Back to top button visibility
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
          backToTop.classList.add('visible');
      } else {
          backToTop.classList.remove('visible');
      }
  });
  
  // Form validation
  const form = document.querySelector('.contact-form');
  if (form) {
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          let isValid = true;
          
          const fields = [
              { id: 'name', error: 'Please enter your name.' },
              { id: 'email', error: 'Please enter a valid email address.', validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
              { id: 'subject', error: 'Please enter a subject.' },
              { id: 'message', error: 'Please enter your message.' }
          ];
          
          fields.forEach(field => {
              const input = form.querySelector(`#${field.id}`);
              const errorElement = form.querySelector(`#${field.id}-error`);
              const formGroup = input.closest('.form-group');
              
              if (!input.value.trim() || (field.validate && !field.validate(input.value))) {
                  formGroup.classList.add('error');
                  isValid = false;
              } else {
                  formGroup.classList.remove('error');
              }
          });
          
          if (isValid) {
              alert('Message sent successfully! (This is a demo; integrate with a backend for actual submission.)');
              form.reset();
          }
      });
  }
});
