// LABEXP - Módulo B: Bolsa de Trabajo
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.jobs = {
  render: async function() {
    const user = LABEXP_STATE.currentUser;
    const filters = LABEXP_STATE.jobFilters;

    let vacancies = [];
    let savedJobs = [];

    try {
      const [vRes, sRes] = await Promise.all([
        LABEXP_API.getJobs(filters),
        LABEXP_API.getSavedJobs(user?.id)
      ]);
      vacancies = vRes.vacancies || [];
      savedJobs = sRes.savedVacancies || [];
      LABEXP_STATE.vacancies = vacancies;
      LABEXP_STATE.savedJobs = savedJobs;
    } catch (e) {
      console.warn('Error fetching jobs:', e);
    }

    const categoriesList = [
      { id: 'all', name: 'Todas las categorías' },
      { id: 'Primer empleo', name: 'Primer empleo' },
      { id: 'Prácticas profesionales', name: 'Prácticas profesionales' },
      { id: 'Servicio social', name: 'Servicio social' },
      { id: 'Becarios', name: 'Becarios' },
      { id: 'Programas trainee', name: 'Programas trainee' },
      { id: 'Medio tiempo', name: 'Medio tiempo' },
      { id: 'Tiempo completo', name: 'Tiempo completo' },
      { id: 'Oportunidades temporales', name: 'Oportunidades temporales' }
    ];

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <!-- Header & Search Toolbar -->
        <div class="card" style="padding:1.5rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);">
          <div style="margin-bottom:1.25rem;">
            <h1 style="font-size:1.45rem; font-weight:800; color:var(--text-main); margin-bottom:4px;">
              Bolsa de Empleo para Estudiantes y Egresados
            </h1>
            <p style="font-size:0.85rem; color:var(--text-muted);">
              Todas las ofertas están seleccionadas para perfiles jóvenes. Cero años de experiencia laboral exigida.
            </p>
          </div>

          <!-- Main Search Bar -->
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1rem;">
            <div style="flex:1; min-width:260px; position:relative;">
              <span style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--text-muted); width:18px; height:18px;">
                ${LABEXP_COMPONENTS.icons.search}
              </span>
              <input type="text" id="jobs-search-input" class="form-input" style="padding-left:2.5rem;" placeholder="Buscar por puesto, tecnología o palabra clave (ej. React, Trainee, QA)..." value="${filters.q || ''}" onkeydown="if(event.key==='Enter') LABEXP_VIEWS.jobs.applyFilters()" />
            </div>

            <button class="btn btn-primary" onclick="LABEXP_VIEWS.jobs.applyFilters()">
              ${LABEXP_COMPONENTS.icons.search} Buscar
            </button>
            <button class="btn btn-outline" onclick="LABEXP_VIEWS.jobs.resetFilters()">
              Limpiar filtros
            </button>
          </div>

          <!-- Quick Category Filters Pills -->
          <div style="display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:4px;">
            ${categoriesList.map(cat => `
              <button class="role-pill ${filters.category === cat.id ? 'active' : ''}" style="white-space:nowrap;" onclick="LABEXP_VIEWS.jobs.filterByCategory('${cat.id}')">
                ${cat.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Secondary Filters Bar -->
        <div class="card" style="padding:1rem 1.25rem; display:flex; gap:1rem; flex-wrap:wrap; align-items:center; background:var(--bg-surface);">
          <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.8rem; font-weight:700; color:var(--text-muted);">
            ${LABEXP_COMPONENTS.icons.filter} Filtros:
          </div>

          <!-- Modalidad -->
          <select id="filter-workmode" class="form-select" style="width:auto; padding:0.4rem 0.8rem; font-size:0.82rem;" onchange="LABEXP_VIEWS.jobs.applyFilters()">
            <option value="all" ${filters.workMode === 'all' ? 'selected' : ''}>Todas las modalidades</option>
            <option value="Remoto" ${filters.workMode === 'Remoto' ? 'selected' : ''}>Remoto</option>
            <option value="Híbrido" ${filters.workMode === 'Híbrido' ? 'selected' : ''}>Híbrido</option>
            <option value="Presencial" ${filters.workMode === 'Presencial' ? 'selected' : ''}>Presencial</option>
          </select>

          <!-- Jornada -->
          <select id="filter-jobtype" class="form-select" style="width:auto; padding:0.4rem 0.8rem; font-size:0.82rem;" onchange="LABEXP_VIEWS.jobs.applyFilters()">
            <option value="all" ${filters.jobType === 'all' ? 'selected' : ''}>Tipo de jornada</option>
            <option value="Tiempo completo" ${filters.jobType === 'Tiempo completo' ? 'selected' : ''}>Tiempo completo</option>
            <option value="Medio tiempo" ${filters.jobType === 'Medio tiempo' ? 'selected' : ''}>Medio tiempo</option>
          </select>

          <!-- Ubicación -->
          <select id="filter-location" class="form-select" style="width:auto; padding:0.4rem 0.8rem; font-size:0.82rem;" onchange="LABEXP_VIEWS.jobs.applyFilters()">
            <option value="all" ${filters.location === 'all' ? 'selected' : ''}>Cualquier ubicación</option>
            <option value="Ciudad de México" ${filters.location === 'Ciudad de México' ? 'selected' : ''}>Ciudad de México</option>
            <option value="Guadalajara" ${filters.location === 'Guadalajara' ? 'selected' : ''}>Guadalajara</option>
            <option value="Monterrey" ${filters.location === 'Monterrey' ? 'selected' : ''}>Monterrey</option>
            <option value="Querétaro" ${filters.location === 'Querétaro' ? 'selected' : ''}>Querétaro</option>
            <option value="Remoto" ${filters.location === 'Remoto' ? 'selected' : ''}>Remoto Nacional</option>
          </select>

          <div style="margin-left:auto; font-size:0.82rem; color:var(--text-muted);">
            Mostrando <strong>${vacancies.length}</strong> vacantes activas
          </div>
        </div>

        <!-- Jobs Grid List -->
        ${vacancies.length === 0 ? `
          <div class="card" style="text-align:center; padding:3.5rem 1.5rem;">
            <div style="font-size:3rem; margin-bottom:1rem;">🔍</div>
            <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">No se encontraron vacantes con los filtros seleccionados</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); max-width:450px; margin:0 auto 1.5rem;">
              Prueba cambiando la modalidad o el término de búsqueda. En LABEXP todas las vacantes están abiertas a talento joven.
            </p>
            <button class="btn btn-primary" onclick="LABEXP_VIEWS.jobs.resetFilters()">Restablecer filtros</button>
          </div>
        ` : `
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:1.5rem;">
            ${vacancies.map(v => {
              const isSaved = savedJobs.some(s => s.id === v.id);
              return LABEXP_COMPONENTS.renderJobCard(v, isSaved);
            }).join('')}
          </div>
        `}
      </div>
    `;
  },

  applyFilters: function() {
    const qInput = document.getElementById('jobs-search-input');
    const wmSelect = document.getElementById('filter-workmode');
    const jtSelect = document.getElementById('filter-jobtype');
    const locSelect = document.getElementById('filter-location');

    LABEXP_STATE.jobFilters.q = qInput ? qInput.value.trim() : '';
    LABEXP_STATE.jobFilters.workMode = wmSelect ? wmSelect.value : 'all';
    LABEXP_STATE.jobFilters.jobType = jtSelect ? jtSelect.value : 'all';
    LABEXP_STATE.jobFilters.location = locSelect ? locSelect.value : 'all';

    LABEXP_STATE.setView('jobs');
  },

  filterByCategory: function(catId) {
    LABEXP_STATE.jobFilters.category = catId;
    LABEXP_STATE.setView('jobs');
  },

  resetFilters: function() {
    LABEXP_STATE.jobFilters = {
      q: '',
      category: 'all',
      workMode: 'all',
      jobType: 'all',
      location: 'all'
    };
    LABEXP_STATE.setView('jobs');
  },

  // Modal de Detalle de Vacante
  showDetailModal: function(vacancyId) {
    const vacancy = LABEXP_STATE.vacancies.find(v => v.id === vacancyId);
    if (!vacancy) return;

    LABEXP_COMPONENTS.openModal({
      title: vacancy.title,
      size: 'lg',
      body: `
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          <!-- Header Banner -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; border-bottom:1px solid var(--border-light); padding-bottom:1rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:4px;">
                <span style="font-size:1rem; font-weight:700; color:var(--primary-700);">${vacancy.companyName}</span>
                ${vacancy.verifiedSource ? `<span class="badge-verified">Verificada</span>` : ''}
              </div>
              <p style="font-size:0.85rem; color:var(--text-muted);">
                📍 ${vacancy.location} • 💼 ${vacancy.jobType} • 🌐 ${vacancy.workMode}
              </p>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-emerald" style="font-size:0.8rem; margin-bottom:4px;">⭐ Sin experiencia laboral requerida</span>
              <div style="font-size:1.1rem; font-weight:800; color:var(--primary-800);">${vacancy.salary || 'A convenir'}</div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">Descripción del Puesto</h4>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">${vacancy.description}</p>
          </div>

          <!-- Responsibilities -->
          <div>
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">Responsabilidades Principales</h4>
            <ul style="padding-left:1.25rem; font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
              ${(vacancy.responsibilities || []).map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>

          <!-- Requirements -->
          <div>
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">Requisitos para Estudiantes y Egresados</h4>
            <ul style="padding-left:1.25rem; font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
              ${(vacancy.requirements || []).map(req => `<li>${req}</li>`).join('')}
            </ul>
          </div>

          <!-- Benefits -->
          <div>
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">Beneficios y Aprendizaje</h4>
            <ul style="padding-left:1.25rem; font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
              ${(vacancy.benefits || []).map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>

          <!-- ATS Match Preview Banner -->
          <div style="background:var(--primary-50); border:1px solid var(--primary-200); border-radius:var(--radius-md); padding:1rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.85rem; font-weight:700; color:var(--primary-800);">¿Quieres saber qué tan compatible es tu perfil con esta vacante?</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">El Asistente de Compatibilidad compara tus materias y habilidades con los requerimientos.</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="LABEXP_COMPONENTS.closeModal(); LABEXP_VIEWS.jobs.openCompatibilityView('${vacancy.id}')">
              ⚡ Analizar Compatibilidad
            </button>
          </div>
        </div>
      `,
      footer: `
        <button class="btn btn-outline" onclick="LABEXP_COMPONENTS.closeModal()">Cerrar</button>
        <button class="btn btn-primary" onclick="LABEXP_COMPONENTS.closeModal(); LABEXP_VIEWS.jobs.showApplyModal('${vacancy.id}')">
          Postularme a esta Vacante
        </button>
      `
    });
  },

  // Modal de Postulación Interactiva
  showApplyModal: function(vacancyId) {
    const vacancy = LABEXP_STATE.vacancies.find(v => v.id === vacancyId);
    if (!vacancy) return;
    const user = LABEXP_STATE.currentUser;
    const profile = LABEXP_STATE.currentProfile || {};

    LABEXP_COMPONENTS.openModal({
      title: `Postularse a: ${vacancy.title}`,
      body: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Empresa receptora</div>
            <div style="font-size:1rem; font-weight:700; color:var(--text-main);">${vacancy.companyName}</div>
            <div style="font-size:0.8rem; color:var(--primary-700); margin-top:2px;">${vacancy.category} • ${vacancy.workMode}</div>
          </div>

          <div>
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-bottom:0.25rem;">Perfil que se adjuntará:</div>
            <div style="font-size:0.82rem; color:var(--text-secondary);">
              🎓 <strong>${user?.fullName}</strong> • ${profile.degree || 'Ingeniería en Computación'} (${profile.university || 'UNAM'})
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="apply-cover-note">Nota de Presentación o Motivación (Recomendado)</label>
            <textarea id="apply-cover-note" class="form-textarea" rows="4" placeholder="Platícale al reclutador qué proyectos universitarios realizaste afines a este puesto y por qué te entusiasma colaborar con ellos..."></textarea>
            <div class="form-hint">Una nota personalizada multiplica por 3 las probabilidades de ser llamado a entrevista.</div>
          </div>

          <div style="font-size:0.75rem; color:var(--text-muted); background:var(--bg-surface); padding:0.5rem; border:1px solid var(--border-light); border-radius:var(--radius-sm);">
            🛡️ Al postularte autorizas que ${vacancy.companyName} revise tus datos académicos en estricto cumplimiento con la LFPDPPP.
          </div>
        </div>
      `,
      footer: `
        <button class="btn btn-outline" onclick="LABEXP_COMPONENTS.closeModal()">Cancelar</button>
        <button class="btn btn-primary" id="confirm-apply-btn" onclick="LABEXP_VIEWS.jobs.submitApplication('${vacancy.id}')">
          🚀 Confirmar y Enviar Postulación
        </button>
      `
    });
  },

  submitApplication: async function(vacancyId) {
    const btn = document.getElementById('confirm-apply-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Enviando...';
    }

    const note = document.getElementById('apply-cover-note')?.value || '';
    const userId = LABEXP_STATE.currentUser?.id;

    try {
      const res = await LABEXP_API.applyToJob(vacancyId, userId, note);
      LABEXP_COMPONENTS.closeModal();
      LABEXP_COMPONENTS.showToast('success', '¡Postulación Enviada!', 'El reclutador ha recibido tu perfil. Monitorea los avances en "Mis postulaciones".');
      LABEXP_STATE.setView('applications');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'No se pudo postular', err.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Confirmar y Enviar Postulación';
      }
    }
  },

  toggleSave: async function(vacancyId) {
    const userId = LABEXP_STATE.currentUser?.id;
    try {
      const res = await LABEXP_API.toggleSaveJob(vacancyId, userId);
      LABEXP_COMPONENTS.showToast('info', res.isSaved ? 'Guardada' : 'Removida', res.message);
      // Reload current view
      LABEXP_STATE.setView('jobs');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error al guardar', err.message);
    }
  },

  openCompatibilityView: function(vacancyId) {
    window.LABEXP_SELECTED_VACANCY_FOR_COMPAT = vacancyId;
    LABEXP_STATE.setView('compatibility');
  }
};
