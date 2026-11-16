// LABEXP - Main Application Controller & Router
window.LABEXP_APP = {
  // Navigation Menu Registry (10 Required Items)
  menuItems: [
    { id: 'dashboard', label: 'Inicio', icon: 'home', roles: ['candidate', 'recruiter', 'admin'] },
    { id: 'profile', label: 'Mi perfil', icon: 'profile', roles: ['candidate'] },
    { id: 'jobs', label: 'Buscar empleo', icon: 'jobs', roles: ['candidate', 'recruiter', 'admin'] },
    { id: 'cvBuilder', label: 'Mi currículum', icon: 'cv', roles: ['candidate'] },
    { id: 'careerCoach', label: 'Asistente IA', icon: 'aiBot', roles: ['candidate'] },
    { id: 'interviewSimulator', label: 'Simulador de entrevistas', icon: 'interview', roles: ['candidate'] },
    { id: 'courses', label: 'Capacitación', icon: 'courses', roles: ['candidate', 'recruiter', 'admin'] },
    { id: 'applications', label: 'Mis postulaciones', icon: 'applications', roles: ['candidate'] },
    { id: 'companyPortal', label: 'Panel de empresa', icon: 'jobs', roles: ['recruiter'] },
    { id: 'adminPortal', label: 'Panel de administración', icon: 'sparkles', roles: ['admin'] },
    { id: 'notifications', label: 'Notificaciones', icon: 'notifications', roles: ['candidate', 'recruiter', 'admin'] },
    { id: 'settings', label: 'Configuración', icon: 'settings', roles: ['candidate', 'recruiter', 'admin'] }
  ],

  init: async function() {
    console.log('🚀 Inicializando LABEXP...');

    // Fetch initial config from server
    try {
      const cfgRes = await LABEXP_API.getConfig();
      if (cfgRes.appName) {
        window.LABEXP_CONFIG.setBrandName(cfgRes.appName);
      }
      LABEXP_STATE.aiStatus = cfgRes.aiStatus;
    } catch (e) {
      console.warn('Config fetch error, using defaults:', e);
    }

    // Subscribe to state changes to re-render
    LABEXP_STATE.subscribe(this.render.bind(this));

    // Global event listeners
    this.attachGlobalEvents();

    // Initial render
    this.render(LABEXP_STATE);
  },

  render: async function(state) {
    const appEl = document.getElementById('app');
    const viewName = state.currentView;

    // 1. Landing / Public Views
    if (viewName === 'landing') {
      appEl.innerHTML = window.LABEXP_VIEWS.landing.render();
      return;
    }
    if (viewName === 'login') {
      appEl.innerHTML = window.LABEXP_VIEWS.auth.renderLogin();
      return;
    }
    if (viewName === 'register') {
      appEl.innerHTML = window.LABEXP_VIEWS.auth.renderRegister();
      return;
    }

    // 2. Authenticated Frame Layout
    const user = state.currentUser;
    const role = state.currentRole || 'candidate';
    const config = window.LABEXP_CONFIG;

    // Filter menu items for current role
    const allowedMenu = this.menuItems.filter(item => item.roles.includes(role));

    // View title mappings
    const titleMap = {
      dashboard: { title: 'Panel Principal', subtitle: 'Resumen de tu actividad y recomendaciones' },
      profile: { title: 'Mi Perfil Profesional', subtitle: 'Información académica, competencias y proyectos' },
      jobs: { title: 'Bolsa de Empleo', subtitle: 'Oportunidades de primer empleo, prácticas y trainees' },
      cvBuilder: { title: 'Mi Currículum Vitae', subtitle: 'Creador y optimizador con Asistente IA' },
      careerCoach: { title: 'Asistente IA de Orientación', subtitle: 'Asesoría y consultas de empleabilidad' },
      interviewSimulator: { title: 'Simulador de Entrevistas', subtitle: 'Práctica conversacional y evaluación objetiva' },
      courses: { title: 'Biblioteca de Capacitación', subtitle: 'Cursos formativos en 13 áreas profesionales' },
      applications: { title: 'Mis Postulaciones', subtitle: 'Seguimiento de procesos en 8 etapas' },
      companyPortal: { title: 'Panel Empresarial', subtitle: 'Gestión de convocatorias y candidatos' },
      adminPortal: { title: 'Panel de Administración', subtitle: 'Supervisión y verificación institucional' },
      notifications: { title: 'Notificaciones', subtitle: 'Avisos y actualizaciones de tus procesos' },
      settings: { title: 'Configuración y Privacidad', subtitle: 'Seguridad, IA y cumplimiento LFPDPPP' },
      compatibility: { title: 'Análisis de Compatibilidad (ATS)', subtitle: 'Diagnóstico formativo entre perfil y vacante' }
    };

    const currentMeta = titleMap[viewName] || { title: 'LABEXP', subtitle: '' };

    appEl.innerHTML = `
      <div class="dashboard-layout">
        <!-- Desktop Sidebar -->
        <aside class="app-sidebar" id="app-sidebar">
          <div class="sidebar-header">
            <a href="javascript:void(0)" onclick="LABEXP_STATE.setView('dashboard')" class="sidebar-brand">
              <div class="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              </div>
              <div>
                <span class="brand-title" data-brand-name>${config.APP_NAME}</span>
                <span class="brand-badge">${role === 'recruiter' ? 'Empresa' : (role === 'admin' ? 'Admin' : 'Estudiante')}</span>
              </div>
            </a>
          </div>

          <nav class="sidebar-nav">
            <div class="nav-section-title">Navegación Principal</div>
            ${allowedMenu.map(item => `
              <a href="javascript:void(0)" class="nav-item ${viewName === item.id ? 'active' : ''}" onclick="LABEXP_STATE.setView('${item.id}')">
                ${LABEXP_COMPONENTS.icons[item.icon] || LABEXP_COMPONENTS.icons.home}
                <span>${item.label}</span>
                ${item.id === 'notifications' && state.unreadNotificationsCount > 0 
                  ? `<span class="nav-badge">${state.unreadNotificationsCount}</span>` 
                  : ''}
              </a>
            `).join('')}
          </nav>

          <div class="sidebar-footer">
            <div class="user-quick-profile">
              <img src="${user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}" alt="User Avatar" class="user-quick-avatar" />
              <div class="user-quick-meta">
                <div class="user-quick-name">${user?.fullName || 'Usuario'}</div>
                <div class="user-quick-role">${role === 'recruiter' ? 'Reclutador' : (role === 'admin' ? 'Administradora' : 'Candidata')}</div>
              </div>
              <button class="btn-ghost btn-sm" onclick="LABEXP_VIEWS.settings.logout()" title="Cerrar sesión" style="padding:4px; color:var(--text-muted);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </button>
            </div>
          </div>
        </aside>

        <!-- Mobile Drawer Backdrop Dimmer Overlay -->
        <div class="sidebar-backdrop" id="sidebar-backdrop" onclick="LABEXP_APP.toggleMobileMenu(true)"></div>

        <!-- Main Workspace Area -->
        <div class="main-wrapper">
          <!-- Sticky Top Header -->
          <header class="app-header">
            <div class="header-left">
              <button class="mobile-menu-toggle" onclick="LABEXP_APP.toggleMobileMenu()" title="Abrir menú">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
              </button>
              <div class="header-title-wrapper">
                <h2 class="header-view-title">${currentMeta.title}</h2>
                <span class="header-view-subtitle">${currentMeta.subtitle}</span>
              </div>
            </div>

            <div class="header-right">
              <!-- Evaluator Multi-Role Switcher Pills -->
              <div class="role-switcher" title="Cambiar rol para evaluar la plataforma">
                <button class="role-pill ${role === 'candidate' ? 'active' : ''}" onclick="LABEXP_STATE.setRole('candidate'); LABEXP_STATE.setView('dashboard'); LABEXP_COMPONENTS.showToast('info', 'Rol Activo: Candidata', 'Viendo la plataforma como Sofía Ramírez (Estudiante)');">
                  👩‍🎓 <span>Candidata</span>
                </button>
                <button class="role-pill ${role === 'recruiter' ? 'active' : ''}" onclick="LABEXP_STATE.setRole('recruiter'); LABEXP_STATE.setView('companyPortal'); LABEXP_COMPONENTS.showToast('info', 'Rol Activo: Reclutador', 'Viendo la plataforma como TechInnova México');">
                  🏢 <span>Reclutador</span>
                </button>
                <button class="role-pill ${role === 'admin' ? 'active' : ''}" onclick="LABEXP_STATE.setRole('admin'); LABEXP_STATE.setView('adminPortal'); LABEXP_COMPONENTS.showToast('info', 'Rol Activo: Administradora', 'Viendo la plataforma con permisos globales');">
                  🛡️ <span>Admin</span>
                </button>
              </div>

              <!-- Notifications Trigger -->
              <button class="header-icon-btn" onclick="LABEXP_STATE.setView('notifications')" title="Notificaciones">
                ${LABEXP_COMPONENTS.icons.notifications}
                ${state.unreadNotificationsCount > 0 ? `<span class="badge-dot"></span>` : ''}
              </button>
            </div>
          </header>

          <!-- Main Dynamic Body -->
          <main class="content-body" id="main-content-body">
            <div style="text-align:center; padding:3rem;"><div class="spinner"></div></div>
          </main>
        </div>

        <!-- Mobile Bottom Compact Navigation (Material 3 style) -->
        <nav class="mobile-bottom-nav">
          ${role === 'recruiter' ? `
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'dashboard' ? 'active' : ''}" onclick="LABEXP_STATE.setView('dashboard')">
              ${LABEXP_COMPONENTS.icons.home}
              <span>Inicio</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'companyPortal' ? 'active' : ''}" onclick="LABEXP_STATE.setView('companyPortal')">
              ${LABEXP_COMPONENTS.icons.jobs}
              <span>Empresa</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'jobs' ? 'active' : ''}" onclick="LABEXP_STATE.setView('jobs')">
              ${LABEXP_COMPONENTS.icons.search}
              <span>Vacantes</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'courses' ? 'active' : ''}" onclick="LABEXP_STATE.setView('courses')">
              ${LABEXP_COMPONENTS.icons.courses}
              <span>Cursos</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'settings' ? 'active' : ''}" onclick="LABEXP_STATE.setView('settings')">
              ${LABEXP_COMPONENTS.icons.settings}
              <span>Ajustes</span>
            </a>
          ` : (role === 'admin' ? `
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'dashboard' ? 'active' : ''}" onclick="LABEXP_STATE.setView('dashboard')">
              ${LABEXP_COMPONENTS.icons.home}
              <span>Inicio</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'adminPortal' ? 'active' : ''}" onclick="LABEXP_STATE.setView('adminPortal')">
              ${LABEXP_COMPONENTS.icons.sparkles}
              <span>Admin</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'jobs' ? 'active' : ''}" onclick="LABEXP_STATE.setView('jobs')">
              ${LABEXP_COMPONENTS.icons.jobs}
              <span>Vacantes</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'courses' ? 'active' : ''}" onclick="LABEXP_STATE.setView('courses')">
              ${LABEXP_COMPONENTS.icons.courses}
              <span>Cursos</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'settings' ? 'active' : ''}" onclick="LABEXP_STATE.setView('settings')">
              ${LABEXP_COMPONENTS.icons.settings}
              <span>Ajustes</span>
            </a>
          ` : `
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'dashboard' ? 'active' : ''}" onclick="LABEXP_STATE.setView('dashboard')">
              ${LABEXP_COMPONENTS.icons.home}
              <span>Inicio</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'jobs' ? 'active' : ''}" onclick="LABEXP_STATE.setView('jobs')">
              ${LABEXP_COMPONENTS.icons.jobs}
              <span>Empleo</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'cvBuilder' ? 'active' : ''}" onclick="LABEXP_STATE.setView('cvBuilder')">
              ${LABEXP_COMPONENTS.icons.cv}
              <span>Mi CV</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'interviewSimulator' ? 'active' : ''}" onclick="LABEXP_STATE.setView('interviewSimulator')">
              ${LABEXP_COMPONENTS.icons.interview}
              <span>Entrevista</span>
            </a>
            <a href="javascript:void(0)" class="mobile-nav-item ${viewName === 'profile' ? 'active' : ''}" onclick="LABEXP_STATE.setView('profile')">
              ${LABEXP_COMPONENTS.icons.profile}
              <span>Perfil</span>
            </a>
          `)}
        </nav>
      </div>
    `;

    // Render active view into #main-content-body
    const container = document.getElementById('main-content-body');
    if (!container) return;

    try {
      if (window.LABEXP_VIEWS[viewName] && typeof window.LABEXP_VIEWS[viewName].render === 'function') {
        const viewHtml = await window.LABEXP_VIEWS[viewName].render();
        container.innerHTML = viewHtml;
      } else {
        container.innerHTML = `<div class="card"><h3>Vista "${viewName}" en preparación</h3></div>`;
      }
    } catch (err) {
      console.error(`Error rendering view [${viewName}]:`, err);
      container.innerHTML = `
        <div class="card" style="border-left:4px solid var(--rose-500); padding:2rem;">
          <h3 style="color:var(--rose-600); margin-bottom:0.5rem;">Error al cargar la vista</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">${err.message}</p>
          <button class="btn btn-primary btn-sm" onclick="LABEXP_STATE.setView('dashboard')">Regresar al inicio</button>
        </div>
      `;
    }
  },

  toggleMobileMenu: function(forceClose = false) {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) {
      if (forceClose) {
        sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
      } else {
        const isOpen = sidebar.classList.toggle('mobile-open');
        if (backdrop) backdrop.classList.toggle('active', isOpen);
      }
    }
  },

  attachGlobalEvents: function() {
    // Delegated click listeners
    document.addEventListener('click', (e) => {
      // Close mobile sidebar if clicked outside
      const sidebar = document.getElementById('app-sidebar');
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && !e.target.closest('.mobile-menu-toggle')) {
          sidebar.classList.remove('mobile-open');
        }
      }

      // Close modal on overlay click
      const overlay = document.getElementById('global-modal-overlay');
      if (overlay && e.target === overlay) {
        LABEXP_COMPONENTS.closeModal();
      }

      // Job Detail buttons
      const detailBtn = e.target.closest('.view-job-detail-btn');
      if (detailBtn) {
        const vacId = detailBtn.dataset.vacancyId;
        if (vacId && window.LABEXP_VIEWS.jobs) {
          window.LABEXP_VIEWS.jobs.showDetailModal(vacId);
        }
      }

      // Job Apply buttons
      const applyBtn = e.target.closest('.apply-job-btn');
      if (applyBtn) {
        const vacId = applyBtn.dataset.vacancyId;
        if (vacId && window.LABEXP_VIEWS.jobs) {
          window.LABEXP_VIEWS.jobs.showApplyModal(vacId);
        }
      }

      // Job Save / Favorite buttons
      const saveBtn = e.target.closest('.save-job-btn');
      if (saveBtn) {
        const vacId = saveBtn.dataset.vacancyId;
        if (vacId && window.LABEXP_VIEWS.jobs) {
          window.LABEXP_VIEWS.jobs.toggleSave(vacId);
        }
      }

      // Course detail buttons
      const courseBtn = e.target.closest('.view-course-detail-btn');
      if (courseBtn) {
        const crsId = courseBtn.dataset.courseId;
        if (crsId && window.LABEXP_VIEWS.courses) {
          window.LABEXP_VIEWS.courses.showCourseDetail(crsId);
        }
      }

      // Toggle course enrollment
      const enrollBtn = e.target.closest('.toggle-course-btn');
      if (enrollBtn) {
        const crsId = enrollBtn.dataset.courseId;
        if (crsId && window.LABEXP_VIEWS.courses) {
          window.LABEXP_VIEWS.courses.showCourseDetail(crsId);
        }
      }
    });
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.LABEXP_APP.init();
});
