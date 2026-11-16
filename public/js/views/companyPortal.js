// LABEXP - Módulo I: Panel Empresarial y de Reclutamiento
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.companyPortal = {
  activeTab: 'applications', // 'applications' | 'jobs' | 'post_job' | 'candidates'

  render: async function() {
    const user = LABEXP_STATE.currentUser;
    const companyId = user?.companyId || 'comp-1';

    let company = null;
    let companyApps = [];
    let companyJobs = [];

    try {
      const [cRes, aRes, jRes] = await Promise.all([
        LABEXP_API.getCompanies(),
        LABEXP_API.getApplications({ companyId }),
        LABEXP_API.getJobs({ companyId })
      ]);
      company = (cRes.companies || []).find(c => c.id === companyId) || cRes.companies?.[0];
      companyApps = aRes.applications || [];
      companyJobs = jRes.vacancies || [];
    } catch (e) {
      console.warn('Error fetching company portal data:', e);
    }

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <!-- Company Banner -->
        <div class="card" style="padding:1.5rem 2rem; background:linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color:#ffffff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:1.25rem;">
            <div style="width:60px; height:60px; border-radius:var(--radius-md); background:#ffffff; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:4px;">
              <img src="${company?.logo || ''}" alt="Logo" style="max-width:100%; max-height:100%; object-fit:contain;" />
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:4px;">
                <h1 style="font-size:1.4rem; font-weight:800;">${company?.name || 'TechInnova México'}</h1>
                ${company?.verified ? `<span class="badge-verified">Empresa Verificada</span>` : `<span class="badge badge-amber">En Verificación</span>`}
              </div>
              <p style="font-size:0.85rem; opacity:0.85;">
                ${company?.industry || 'Tecnología'} • ${company?.location || 'CDMX'} • Reclutador: <strong>${user?.fullName || 'Carlos Mendoza'}</strong>
              </p>
            </div>
          </div>

          <button class="btn btn-emerald" onclick="LABEXP_VIEWS.companyPortal.switchTab('post_job')">
            + Publicar Nueva Vacante Joven
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="role-switcher" style="padding:4px; max-width:650px;">
          <button class="role-pill ${this.activeTab === 'applications' ? 'active' : ''}" onclick="LABEXP_VIEWS.companyPortal.switchTab('applications')">
            Postulaciones Recibidas (${companyApps.length})
          </button>
          <button class="role-pill ${this.activeTab === 'jobs' ? 'active' : ''}" onclick="LABEXP_VIEWS.companyPortal.switchTab('jobs')">
            Vacantes Publicadas (${companyJobs.length})
          </button>
          <button class="role-pill ${this.activeTab === 'post_job' ? 'active' : ''}" onclick="LABEXP_VIEWS.companyPortal.switchTab('post_job')">
            Publicar Vacante
          </button>
          <button class="role-pill ${this.activeTab === 'candidates' ? 'active' : ''}" onclick="LABEXP_VIEWS.companyPortal.switchTab('candidates')">
            Buscar Talento Universitario
          </button>
        </div>

        <!-- Tab Contents -->
        ${this.renderActiveTabContent(companyApps, companyJobs, company)}
      </div>
    `;
  },

  renderActiveTabContent: function(apps, jobs, company) {
    if (this.activeTab === 'post_job') {
      return this.renderPostJobForm(company);
    }
    if (this.activeTab === 'jobs') {
      return this.renderJobsList(jobs);
    }
    if (this.activeTab === 'candidates') {
      return this.renderCandidateSearch();
    }
    return this.renderApplicationsManager(apps);
  },

  // 1. Applications Manager (Actualizar pipeline de selección)
  renderApplicationsManager: function(apps) {
    if (apps.length === 0) {
      return `
        <div class="card" style="text-align:center; padding:3rem 1.5rem;">
          <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem;">Aún no hay postulaciones recibidas para tus vacantes.</p>
          <button class="btn btn-primary btn-sm" onclick="LABEXP_VIEWS.companyPortal.switchTab('post_job')">Publicar convocatoria</button>
        </div>
      `;
    }

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        ${apps.map(app => `
          <div class="card" style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
              <div>
                <span class="badge badge-purple" style="font-size:0.75rem; margin-bottom:4px;">${app.vacancyTitle}</span>
                <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-main);">${app.candidateName}</h3>
                <div style="font-size:0.82rem; color:var(--primary-700); font-weight:600;">
                  🎓 ${app.candidateUniversity}
                </div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
                  Contacto: ${app.candidateEmail} • Postulado el: ${new Date(app.appliedAt).toLocaleDateString('es-MX')}
                </div>
              </div>

              <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.5rem;">
                ${LABEXP_COMPONENTS.renderApplicationBadge(app.status)}
                <div style="display:flex; gap:0.5rem;">
                  <button class="btn btn-outline btn-sm" onclick="LABEXP_VIEWS.companyPortal.showCandidateCvModal('${app.userId}')">
                    Ver CV del Candidato
                  </button>
                  <button class="btn btn-primary btn-sm" onclick="LABEXP_VIEWS.companyPortal.showStatusModal('${app.id}', '${app.status}')">
                    Cambiar Estado
                  </button>
                </div>
              </div>
            </div>

            ${app.coverNote ? `
              <div style="background:var(--bg-subtle); padding:0.85rem 1rem; border-radius:var(--radius-md); font-size:0.82rem; color:var(--text-secondary); border-left:3px solid var(--primary-600);">
                <strong>Nota del postulante:</strong> "${app.coverNote}"
              </div>
            ` : ''}

            <div style="font-size:0.78rem; color:var(--text-muted);">
              <strong>Comentarios del equipo:</strong> ${app.recruiterNotes || 'Sin comentarios registrados aún.'}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // 2. Formulario de Publicación de Vacantes
  renderPostJobForm: function(company) {
    return `
      <div class="card" style="max-width:850px; padding:2rem;">
        <h2 style="font-size:1.25rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">
          Publicar Vacante Inclusiva para Estudiantes y Egresados
        </h2>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1.5rem;">
          En LABEXP promovemos la inserción laboral joven sin barreras injustas de experiencia previa.
        </p>

        <form id="post-job-form" onsubmit="LABEXP_VIEWS.companyPortal.handleCreateJob(event)">
          <div class="form-group">
            <label class="form-label" for="job-title">Título del Puesto *</label>
            <input type="text" id="job-title" class="form-input" placeholder="Ej. Desarrollador Web Trainee / Practicante de Datos" required />
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
            <div class="form-group">
              <label class="form-label" for="job-category">Categoría de Empleo *</label>
              <select id="job-category" class="form-select" required>
                <option value="Primer empleo">Primer empleo</option>
                <option value="Prácticas profesionales">Prácticas profesionales</option>
                <option value="Servicio social">Servicio social</option>
                <option value="Becarios">Becarios</option>
                <option value="Programas trainee">Programas trainee</option>
                <option value="Medio tiempo">Medio tiempo</option>
                <option value="Tiempo completo">Tiempo completo</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="job-workmode">Modalidad *</label>
              <select id="job-workmode" class="form-select">
                <option value="Híbrido">Híbrido</option>
                <option value="Remoto">Remoto Nacional</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="job-salary">Sueldo o Apoyo Económico</label>
              <input type="text" id="job-salary" class="form-input" placeholder="Ej. $15,000 - $18,000 MXN mensuales" />
            </div>

            <div class="form-group">
              <label class="form-label" for="job-location">Ubicación</label>
              <input type="text" id="job-location" class="form-input" placeholder="Ej. CDMX / Guadalajara / Remoto" value="Ciudad de México" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="job-desc">Descripción del Puesto y Proyecto *</label>
            <textarea id="job-desc" class="form-textarea" rows="3" placeholder="Explica el objetivo de la vacante y qué aprenderá el candidato..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="job-reqs">Requisitos Académicos y Habilidades (Uno por línea) *</label>
            <textarea id="job-reqs" class="form-textarea" rows="3" placeholder="Estudiante o egresado de Computación o afín&#10;Ganas de aprender y proactividad&#10;Conocimientos básicos de JavaScript" required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="job-benefits">Beneficios y Prestaciones (Uno por línea)</label>
            <textarea id="job-benefits" class="form-textarea" rows="3" placeholder="Plan de capacitación y mentoría continua&#10;Seguro de gastos médicos&#10;Horario flexible de estudio"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:1.5rem;">
            <button type="button" class="btn btn-outline" onclick="LABEXP_VIEWS.companyPortal.switchTab('applications')">Cancelar</button>
            <button type="submit" id="submit-post-job-btn" class="btn btn-primary btn-lg">
              🚀 Publicar Vacante en LABEXP
            </button>
          </div>
        </form>
      </div>
    `;
  },

  handleCreateJob: async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-post-job-btn');
    btn.disabled = true;
    btn.textContent = 'Publicando...';

    const user = LABEXP_STATE.currentUser;
    const title = document.getElementById('job-title').value.trim();
    const category = document.getElementById('job-category').value;
    const workMode = document.getElementById('job-workmode').value;
    const salary = document.getElementById('job-salary').value.trim();
    const location = document.getElementById('job-location').value.trim();
    const description = document.getElementById('job-desc').value.trim();
    const requirements = document.getElementById('job-reqs').value.split('\n').filter(Boolean);
    const benefits = document.getElementById('job-benefits').value.split('\n').filter(Boolean);

    try {
      await LABEXP_API.createJob({
        title,
        companyId: user?.companyId || 'comp-1',
        category,
        workMode,
        salary,
        location,
        description,
        requirements,
        benefits,
        area: 'Tecnología e Innovación'
      });

      LABEXP_COMPONENTS.showToast('success', '¡Vacante Publicada!', 'Tu oferta ya es visible para los estudiantes en la bolsa de trabajo.');
      this.activeTab = 'jobs';
      LABEXP_STATE.setView('companyPortal');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error al publicar', err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '🚀 Publicar Vacante en LABEXP';
    }
  },

  // 3. Lista de Vacantes Publicadas
  renderJobsList: function(jobs) {
    return `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
        ${jobs.map(j => `
          <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; gap:1rem;">
            <div>
              <span class="badge badge-purple" style="margin-bottom:0.5rem;">${j.category}</span>
              <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main);">${j.title}</h3>
              <p style="font-size:0.8rem; color:var(--text-muted); margin:4px 0 0.75rem;">
                📍 ${j.location} • 🌐 ${j.workMode} • 💰 ${j.salary}
              </p>
              <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                ${j.description}
              </p>
            </div>
            <div style="border-top:1px solid var(--border-light); padding-top:0.75rem; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.75rem; color:var(--emerald-600); font-weight:600;">● Vacante activa</span>
              <button class="btn btn-outline btn-sm" onclick="LABEXP_VIEWS.jobs.showDetailModal('${j.id}')">
                Ver oferta
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // 4. Búsqueda de Talento Universitario
  renderCandidateSearch: function() {
    return `
      <div class="card" style="padding:2rem;">
        <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">
          Búsqueda de Talento Universitario y Semilleros Profesionales
        </h3>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1.5rem;">
          Filtra candidatos autorizados por universidad, carrera y competencias adquiridas en proyectos escolares.
        </p>

        <div style="display:flex; gap:0.75rem; margin-bottom:1.5rem; flex-wrap:wrap;">
          <input type="text" class="form-input" style="flex:1; min-width:260px;" placeholder="Buscar por habilidad o carrera (ej. React, UNAM, Ingeniería, SQL)..." value="React" />
          <button class="btn btn-primary" onclick="LABEXP_COMPONENTS.showToast('info', 'Filtro aplicado', 'Mostrando perfiles disponibles con consentimiento LFPDPPP.')">Buscar candidatos</button>
        </div>

        <div style="padding:1.25rem; background:var(--bg-subtle); border-radius:var(--radius-md); border:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" style="width:50px; height:50px; border-radius:var(--radius-full); object-fit:cover;" />
            <div>
              <div style="font-size:0.95rem; font-weight:700; color:var(--text-main);">Sofía Ramírez Galindo</div>
              <div style="font-size:0.8rem; color:var(--primary-700); font-weight:600;">Ingeniería en Computación (8vo semestre) • UNAM</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
                Competencias: JavaScript, Python, React, SQL, Metodologías ágiles
              </div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="LABEXP_VIEWS.companyPortal.showCandidateCvModal('usr-cand-1')">
            Consultar Currículum
          </button>
        </div>
      </div>
    `;
  },

  switchTab: function(tab) {
    this.activeTab = tab;
    LABEXP_STATE.setView('companyPortal');
  },

  // Modal para cambiar estado de selección (8 estados)
  showStatusModal: function(appId, currentStatus) {
    LABEXP_COMPONENTS.openModal({
      title: 'Actualizar Estado del Proceso de Selección',
      body: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div class="form-group">
            <label class="form-label" for="update-app-status">Nuevo Estado del Candidato *</label>
            <select id="update-app-status" class="form-select">
              <option value="Recibida" ${currentStatus === 'Recibida' ? 'selected' : ''}>Recibida por reclutador</option>
              <option value="En revisión" ${currentStatus === 'En revisión' ? 'selected' : ''}>En revisión de perfil</option>
              <option value="Entrevista programada" ${currentStatus === 'Entrevista programada' ? 'selected' : ''}>Entrevista programada</option>
              <option value="En proceso" ${currentStatus === 'En proceso' ? 'selected' : ''}>En proceso de selección</option>
              <option value="Seleccionado" ${currentStatus === 'Seleccionado' ? 'selected' : ''}>Seleccionado (Oferta extendida)</option>
              <option value="No seleccionado" ${currentStatus === 'No seleccionado' ? 'selected' : ''}>No seleccionado (Agradecimiento)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="update-app-notes">Comentarios o Mensaje para el Candidato</label>
            <textarea id="update-app-notes" class="form-textarea" rows="3" placeholder="Escribe retroalimentación constructiva o instrucciones para los siguientes pasos..."></textarea>
          </div>

          <div class="form-group" id="interview-date-group" style="display:block;">
            <label class="form-label">Fecha y Hora de la Entrevista (si aplica)</label>
            <input type="datetime-local" id="update-app-date" class="form-input" />
          </div>
        </div>
      `,
      footer: `
        <button class="btn btn-outline" onclick="LABEXP_COMPONENTS.closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="LABEXP_VIEWS.companyPortal.submitStatusChange('${appId}')">
          Actualizar y Notificar al Candidato
        </button>
      `
    });
  },

  submitStatusChange: async function(appId) {
    const status = document.getElementById('update-app-status')?.value;
    const notes = document.getElementById('update-app-notes')?.value;
    const date = document.getElementById('update-app-date')?.value;

    try {
      await LABEXP_API.updateApplicationStatus(appId, {
        status,
        recruiterNotes: notes,
        interviewScheduledFor: date ? new Date(date).toISOString() : null,
        interviewType: 'Videollamada con Reclutador (LABEXP Meet)'
      });

      LABEXP_COMPONENTS.closeModal();
      LABEXP_COMPONENTS.showToast('success', 'Estado Actualizado', `La postulación cambió a "${status}" y el candidato ha sido notificado.`);
      LABEXP_STATE.setView('companyPortal');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error al actualizar', err.message);
    }
  },

  showCandidateCvModal: function(userId) {
    LABEXP_STATE.setView('cvBuilder');
    LABEXP_COMPONENTS.showToast('info', 'Visualizando CV', 'Mostrando currículum universitario autorizado.');
  }
};
