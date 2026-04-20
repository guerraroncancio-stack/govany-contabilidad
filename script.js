// Script principal del sitio público.
// Controla navegación móvil, animaciones por scroll, carrusel de testimonios,
// efecto visual ligero en tarjetas y validación del formulario.
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .zoom-in');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  revealItems.forEach((item) => observer.observe(item));
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
  setupTestimonials();
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      let isValid = true;
      isValid = validateRequired(name, 'Por favor ingresa tu nombre.') && isValid;
      isValid = validateEmail(email, 'Ingresa un correo electrónico válido.') && isValid;
      isValid = validateRequired(message, 'Por favor escribe tu mensaje.') && isValid;
      if (!isValid) {
        formStatus.textContent = 'Revisa los campos marcados antes de enviar.';
        formStatus.style.color = '#d93f3f';
        return;
      }
      const storedMessages = JSON.parse(localStorage.getItem('contapro_messages') || '[]');
      storedMessages.unshift({
        id: Date.now(),
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        createdAt: new Date().toLocaleString('es-CO')
      });
      localStorage.setItem('contapro_messages', JSON.stringify(storedMessages));
      contactForm.reset();
      clearFieldState(name);
      clearFieldState(email);
      clearFieldState(message);
      formStatus.textContent = 'Mensaje enviado correctamente. Te contactaremos pronto.';
      formStatus.style.color = '#1f8f6a';
    });
  }
});
function setupTestimonials() {
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const dotsContainer = document.getElementById('sliderDots');
  const prevButton = document.getElementById('prevTestimonial');
  const nextButton = document.getElementById('nextTestimonial');
  if (!slides.length || !dotsContainer || !prevButton || !nextButton) {
    return;
  }
  let currentIndex = 0;
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = index === 0 ? 'slider-dot active' : 'slider-dot';
    dot.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.querySelectorAll('.slider-dot'));
  function showSlide(index) {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
    currentIndex = index;
  }
  prevButton.addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  });
  nextButton.addEventListener('click', () => {
    const newIndex = (currentIndex + 1) % slides.length;
    showSlide(newIndex);
  });
  setInterval(() => {
    const newIndex = (currentIndex + 1) % slides.length;
    showSlide(newIndex);
  }, 5000);
}
function validateRequired(field, errorText) {
  const value = field.value.trim();
  if (!value) {
    setFieldError(field, errorText);
    return false;
  }
  clearFieldState(field);
  return true;
}
function validateEmail(field, errorText) {
  const value = field.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!value) {
    setFieldError(field, 'Por favor ingresa tu correo electrónico.');
    return false;
  }
  if (!emailRegex.test(value)) {
    setFieldError(field, errorText);
    return false;
  }
  clearFieldState(field);
  return true;
}
function setFieldError(field, message) {
  const wrapper = field.closest('.form-group');
  const errorMessage = wrapper.querySelector('.error-message');
  wrapper.classList.add('error');
  errorMessage.textContent = message;
}
function clearFieldState(field) {
  const wrapper = field.closest('.form-group');
  const errorMessage = wrapper.querySelector('.error-message');
  wrapper.classList.remove('error');
  errorMessage.textContent = '';
}
