// LABEXP - Reusable UI Components & Helpers
window.LABEXP_COMPONENTS = {
  // SVG Icons Library
  icons: {
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
    jobs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    cv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
    aiBot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4"/><path d="m4.93 10.93 2.83-2.83"/><path d="M2 18h4"/><path d="M20 18h2"/><path d="m19.07 10.93-2.83-2.83"/><rect width="16" height="12" x="4" y="8" rx="2"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/></svg>`,
    interview: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>`,
    courses: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    applications: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="m9 14 2 2 4-4"/></svg>`,
    notifications: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
    bookmarkFill: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
    building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    dollar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
  },

  // Modal Manager
  openModal: function({ title, body, footer, size = '' }) {
    const overlay = document.getElementById('global-modal-overlay');
    const dialog = document.getElementById('global-modal-dialog');
    const titleEl = document.getElementById('global-modal-title');
    const bodyEl = document.getElementById('global-modal-body');
    const footerEl = document.getElementById('global-modal-footer');

    dialog.className = `modal-dialog ${size}`;
    titleEl.textContent = title || '';
    bodyEl.innerHTML = body || '';
    
    if (footer) {
      footerEl.innerHTML = footer;
      footerEl.style.display = 'flex';
    } else {
      footerEl.style.display = 'none';
    }

    overlay.classList.add('active');
  },

  closeModal: function() {
    const overlay = document.getElementById('global-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  },

  // Toast Notifications
  showToast: function(type = 'info', title = '', message = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  },

  // Job Card Generator
  renderJobCard: function(vacancy, isSaved = false) {
    const verifiedBadge = vacancy.verifiedSource 
      ? `<span class="badge-verified"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Verificada</span>`
      : '';

    return `
      <div class="card card-clickable job-card" data-vacancy-id="${vacancy.id}" style="display:flex; flex-direction:column; justify-content:space-between; gap:1rem; position:relative;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; margin-bottom:0.75rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:4px;">
                <span style="font-size:0.82rem; font-weight:600; color:var(--text-muted);">${vacancy.companyName}</span>
                ${verifiedBadge}
              </div>
              <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-main); line-height:1.3;">${vacancy.title}</h3>
            </div>
            <button class="btn-ghost btn-sm save-job-btn" data-vacancy-id="${vacancy.id}" title="${isSaved ? 'Remover de favoritos' : 'Guardar vacante'}" style="padding:4px; color:${isSaved ? 'var(--primary-600)' : 'var(--text-muted)'};">
              ${isSaved ? this.icons.bookmarkFill : this.icons.bookmark}
            </button>
          </div>

          <p style="font-size:0.83rem; color:var(--text-secondary); line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:1rem;">
            ${vacancy.description}
          </p>

          <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:0.75rem;">
            <span class="badge badge-purple">${vacancy.category}</span>
            <span class="badge badge-sky">${vacancy.workMode}</span>
            <span class="badge badge-gray">${vacancy.jobType}</span>
            <span class="badge badge-emerald">⭐ Sin experiencia previa</span>
          </div>
        </div>

        <div style="border-top:1px solid var(--border-light); padding-top:0.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <div style="font-size:0.72rem; color:var(--text-muted);">Apoyo o salario</div>
            <div style="font-size:0.88rem; font-weight:700; color:var(--primary-800);">${vacancy.salary || 'A convenir'}</div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm view-job-detail-btn" data-vacancy-id="${vacancy.id}">Detalles</button>
            <button class="btn btn-primary btn-sm apply-job-btn" data-vacancy-id="${vacancy.id}">Postularme</button>
          </div>
        </div>
      </div>
    `;
  },

  // Course Card Generator
  renderCourseCard: function(course) {
    const isEnrolled = course.enrolled;
    const progress = course.progress || 0;

    return `
      <div class="card course-card" style="display:flex; flex-direction:column; overflow:hidden; padding:0;">
        <div style="height:140px; background-image:url('${course.image}'); background-size:cover; background-position:center; position:relative;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(15,23,42,0.8), transparent);"></div>
          <span class="badge badge-purple" style="position:absolute; top:12px; left:12px;">${course.category}</span>
          ${isEnrolled ? `<span class="badge badge-emerald" style="position:absolute; top:12px; right:12px;">Inscrito</span>` : ''}
        </div>
        <div style="padding:1.25rem; display:flex; flex-direction:column; flex:1; justify-content:space-between; gap:1rem;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">${course.provider}</div>
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem; line-height:1.3;">${course.title}</h4>
            <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
              ${course.objectives}
            </p>
          </div>

          <div>
            ${isEnrolled ? `
              <div style="margin-bottom:0.75rem;">
                <div style="display:flex; justify-content:space-between; font-size:0.72rem; margin-bottom:4px;">
                  <span style="color:var(--text-muted);">Progreso del curso</span>
                  <span style="font-weight:700; color:var(--primary-700);">${progress}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill emerald" style="width:${progress}%"></div>
                </div>
              </div>
            ` : `
              <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.75rem;">
                ⏱️ Duración: <strong>${course.duration}</strong> • Nivel: <strong>${course.level}</strong>
              </div>
            `}

            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-outline btn-sm view-course-detail-btn" data-course-id="${course.id}" style="flex:1;">Ver programa</button>
              <button class="btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'} btn-sm toggle-course-btn" data-course-id="${course.id}">
                ${isEnrolled ? 'Continuar' : 'Inscribirme'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Application Pipeline Status Badge
  renderApplicationBadge: function(status) {
    const statusMap = {
      'Guardada': { cls: 'badge-gray', label: 'Guardada' },
      'Enviada': { cls: 'badge-purple', label: 'Enviada a la empresa' },
      'Recibida': { cls: 'badge-sky', label: 'Recibida por reclutador' },
      'En revisión': { cls: 'badge-amber', label: 'En revisión de perfil' },
      'Entrevista programada': { cls: 'badge-emerald', label: '¡Entrevista programada!' },
      'En proceso': { cls: 'badge-sky', label: 'En proceso de selección' },
      'Seleccionado': { cls: 'badge-emerald', label: '¡Seleccionado! 🎉' },
      'No seleccionado': { cls: 'badge-rose', label: 'Proceso concluido' }
    };
    const s = statusMap[status] || { cls: 'badge-gray', label: status };
    return `<span class="badge ${s.cls}" style="font-size:0.76rem; padding:4px 10px;">${s.label}</span>`;
  },

  // 7-Criteria Score Bar Matrix for Interview Simulation
  renderInterviewScoreMatrix: function(scores) {
    const criteria = [
      { key: 'clarity', label: 'Claridad en la exposición' },
      { key: 'coherence', label: 'Coherencia estructural' },
      { key: 'communication', label: 'Habilidades de comunicación' },
      { key: 'argumentation', label: 'Argumentación y método' },
      { key: 'problemSolving', label: 'Resolución de problemas' },
      { key: 'skillsIdentification', label: 'Identificación de fortalezas' },
      { key: 'jobRelevance', label: 'Alineación con el puesto' }
    ];

    return criteria.map(c => {
      const val = scores[c.key] || 8.0;
      const pct = (val / 10) * 100;
      return `
        <div class="score-metric-row">
          <span class="score-metric-name">${c.label}</span>
          <div class="score-metric-bar">
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width:${pct}%"></div>
            </div>
          </div>
          <span class="score-metric-val">${val.toFixed(1)} / 10</span>
        </div>
      `;
    }).join('');
  }
};
