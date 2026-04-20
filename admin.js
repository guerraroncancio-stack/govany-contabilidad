// Script del panel administrativo demo.
// Implementa autenticación básica simulada, sesiones y gestión local de servicios, mensajes y blog.
document.addEventListener('DOMContentLoaded', () => {
  const DEMO_USER = 'admin';
  const DEMO_PASS = 'Govany2026*';
  const SESSION_KEY = 'govany_admin_session';
  const SERVICES_KEY = 'govany_services';
  const BLOG_KEY = 'govany_blog';
  const loginPanel = document.getElementById('loginPanel');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('loginForm');
  const loginStatus = document.getElementById('loginStatus');
  const logoutBtn = document.getElementById('logoutBtn');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const contentForm = document.getElementById('contentForm');
  const contentStatus = document.getElementById('contentStatus');
  const servicesList = document.getElementById('servicesList');
  const messagesList = document.getElementById('messagesList');
  const blogList = document.getElementById('blogList');
  const addServiceBtn = document.getElementById('addServiceBtn');
  const addPostBtn = document.getElementById('addPostBtn');
  seedData();
  refreshAuthView();
  renderServices();
  renderMessages();
  renderBlog();
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      if (username === DEMO_USER && password === DEMO_PASS) {
        sessionStorage.setItem(SESSION_KEY, 'active');
        loginStatus.textContent = 'Acceso concedido.';
        loginStatus.style.color = '#1f8f6a';
        refreshAuthView();
      } else {
        loginStatus.textContent = 'Usuario o contraseña incorrectos.';
        loginStatus.style.color = '#c63d3d';
      }
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      refreshAuthView();
    });
  }
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabPanels.forEach((panel) => panel.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(`tab-${target}`).classList.add('active');
    });
  });
  if (contentForm) {
    contentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      contentStatus.textContent = 'Cambios guardados localmente como demostración.';
      contentStatus.style.color = '#1f8f6a';
    });
  }
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
      const title = prompt('Nombre del nuevo servicio:');
      if (!title) return;
      const description = prompt('Descripción breve del servicio:') || 'Descripción pendiente.';
      const services = getStorageArray(SERVICES_KEY);
      services.push({ id: Date.now(), title, description });
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
      renderServices();
    });
  }
  if (addPostBtn) {
    addPostBtn.addEventListener('click', () => {
      const title = prompt('Título del artículo:');
      if (!title) return;
      const category = prompt('Categoría del artículo:') || 'General';
      const excerpt = prompt('Resumen breve del artículo:') || 'Contenido pendiente.';
      const posts = getStorageArray(BLOG_KEY);
      posts.push({ id: Date.now(), title, category, excerpt });
      localStorage.setItem(BLOG_KEY, JSON.stringify(posts));
      renderBlog();
    });
  }
  function refreshAuthView() {
    const isLoggedIn = sessionStorage.getItem(SESSION_KEY) === 'active';
    loginPanel.classList.toggle('hidden', isLoggedIn);
    dashboard.classList.toggle('hidden', !isLoggedIn);
  }
  function seedData() {
    if (!localStorage.getItem(SERVICES_KEY)) {
      localStorage.setItem(
        SERVICES_KEY,
        JSON.stringify([
          { id: 1, title: 'Contabilidad general', description: 'Registro, control y análisis de la información contable.' },
          { id: 2, title: 'Declaración de impuestos', description: 'Preparación y presentación de obligaciones tributarias.' },
          { id: 3, title: 'Asesoría financiera', description: 'Orientación profesional para decisiones financieras.' },
          { id: 4, title: 'Auditorías', description: 'Revisión y control para mejorar transparencia.' },
          { id: 5, title: 'Gestión de nómina', description: 'Control de pagos, aportes y novedades laborales.' }
        ])
      );
    }
    if (!localStorage.getItem(BLOG_KEY)) {
      localStorage.setItem(
        BLOG_KEY,
        JSON.stringify([
          { id: 1, title: 'Qué revisar antes de presentar una declaración tributaria', category: 'Impuestos', excerpt: 'Recomendaciones para declarar con mayor tranquilidad.' },
          { id: 2, title: 'Indicadores básicos para entender la salud financiera', category: 'Finanzas', excerpt: 'Métricas sencillas para tomar mejores decisiones.' }
        ])
      );
    }
  }
  function renderServices() {
    const services = getStorageArray(SERVICES_KEY);
    if (!servicesList) return;
    if (!services.length) {
      servicesList.innerHTML = '<p class="item-meta">No hay servicios registrados.</p>';
      return;
    }
    servicesList.innerHTML = services
      .map(
        (service) => `
          <article class="stack-item">
            <h4>${escapeHtml(service.title)}</h4>
            <p class="item-meta">${escapeHtml(service.description)}</p>
            <div class="stack-actions">
              <button class="btn btn-danger" data-delete-service="${service.id}">Eliminar</button>
            </div>
          </article>
        `
      )
      .join('');
    servicesList.querySelectorAll('[data-delete-service]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.deleteService);
        const filtered = getStorageArray(SERVICES_KEY).filter((service) => service.id !== id);
        localStorage.setItem(SERVICES_KEY, JSON.stringify(filtered));
        renderServices();
      });
    });
  }
  function renderMessages() {
    const messages = JSON.parse(localStorage.getItem('contapro_messages') || '[]');
    if (!messagesList) return;
    if (!messages.length) {
      messagesList.innerHTML = '<p class="item-meta">Aún no hay mensajes enviados desde el formulario.</p>';
      return;
    }
    messagesList.innerHTML = messages
      .map(
        (message) => `
          <article class="stack-item">
            <h4>${escapeHtml(message.name)}</h4>
            <p class="item-meta">${escapeHtml(message.email)} · ${escapeHtml(message.createdAt)}</p>
            <p>${escapeHtml(message.message)}</p>
          </article>
        `
      )
      .join('');
  }
  function renderBlog() {
    const posts = getStorageArray(BLOG_KEY);
    if (!blogList) return;
    if (!posts.length) {
      blogList.innerHTML = '<p class="item-meta">No hay artículos publicados.</p>';
      return;
    }
    blogList.innerHTML = posts
      .map(
        (post) => `
          <article class="stack-item">
            <h4>${escapeHtml(post.title)}</h4>
            <p class="item-meta">${escapeHtml(post.category)}</p>
            <p>${escapeHtml(post.excerpt)}</p>
            <div class="stack-actions">
              <button class="btn btn-danger" data-delete-post="${post.id}">Eliminar</button>
            </div>
          </article>
        `
      )
      .join('');
    blogList.querySelectorAll('[data-delete-post]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.deletePost);
        const filtered = getStorageArray(BLOG_KEY).filter((post) => post.id !== id);
        localStorage.setItem(BLOG_KEY, JSON.stringify(filtered));
        renderBlog();
      });
    });
  }
  function getStorageArray(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
