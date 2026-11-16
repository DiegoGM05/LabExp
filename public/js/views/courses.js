// LABEXP - Módulo F: Biblioteca de Capacitación (13 Categorías)
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.courses = {
  activeCategory: 'all',

  render: async function() {
    let courses = [];
    try {
      const res = await LABEXP_API.getCourses({ category: this.activeCategory });
      courses = res.courses || [];
      LABEXP_STATE.courses = courses;
    } catch (e) {
      console.warn('Error fetching courses:', e);
    }

    const categories = [
      { id: 'all', name: 'Todas las áreas' },
      { id: 'Preparación laboral', name: 'Preparación laboral' },
      { id: 'Habilidades digitales', name: 'Habilidades digitales' },
      { id: 'Ofimática', name: 'Ofimática' },
      { id: 'Ingeniería', name: 'Ingeniería' },
      { id: 'Medicina', name: 'Medicina' },
      { id: 'Trabajo en equipo', name: 'Trabajo en equipo' },
      { id: 'Liderazgo', name: 'Liderazgo' },
      { id: 'Finanzas', name: 'Finanzas' },
      { id: 'Administración', name: 'Administración' },
      { id: 'Marketing', name: 'Marketing' },
      { id: 'Recursos humanos', name: 'Recursos humanos' },
      { id: 'Idiomas', name: 'Idiomas' },
      { id: 'Herramientas tecnológicas', name: 'Herramientas tecnológicas' }
    ];

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <!-- Header -->
        <div class="card" style="padding:1.5rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
            <div class="brand-icon" style="width:40px; height:40px;">
              ${LABEXP_COMPONENTS.icons.courses}
            </div>
            <div>
              <h1 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">
                Biblioteca de Capacitación y Competencias
              </h1>
              <p style="font-size:0.82rem; color:var(--text-muted);">
                13 áreas formativas diseñadas para complementar tu formación universitaria y hacer match con vacantes.
              </p>
            </div>
          </div>

          <!-- Category Filter Bar (13 Categories) -->
          <div style="display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:6px;">
            ${categories.map(cat => `
              <button class="role-pill ${this.activeCategory === cat.id ? 'active' : ''}" style="white-space:nowrap;" onclick="LABEXP_VIEWS.courses.filterByCategory('${cat.id}')">
                ${cat.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Courses Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
          ${courses.map(course => LABEXP_COMPONENTS.renderCourseCard(course)).join('')}
        </div>
      </div>
    `;
  },

  filterByCategory: function(catId) {
    this.activeCategory = catId;
    LABEXP_STATE.setView('courses');
  },

  showCourseDetail: function(courseId) {
    const course = LABEXP_STATE.courses.find(c => c.id === courseId);
    if (!course) return;

    LABEXP_COMPONENTS.openModal({
      title: course.title,
      size: 'lg',
      body: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div style="height:180px; border-radius:var(--radius-md); background-image:url('${course.image}'); background-size:cover; background-position:center; position:relative;">
            <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(15,23,42,0.85), transparent); border-radius:var(--radius-md); display:flex; align-items:flex-end; padding:1.25rem;">
              <span class="badge badge-purple" style="font-size:0.8rem;">${course.category}</span>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; border-bottom:1px solid var(--border-light); padding-bottom:1rem;">
            <div>
              <div style="font-size:0.8rem; color:var(--text-muted);">Institución o Proveedor</div>
              <div style="font-size:1rem; font-weight:700; color:var(--text-main);">${course.provider}</div>
            </div>
            <div style="display:flex; gap:1rem; font-size:0.85rem; color:var(--text-secondary);">
              <div>⏱️ <strong>${course.duration}</strong></div>
              <div>📊 Nivel: <strong>${course.level}</strong></div>
              <div>🌐 <strong>${course.modality}</strong></div>
            </div>
          </div>

          <div>
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">Objetivo del Curso</h4>
            <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">${course.objectives}</p>
          </div>

          <div>
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">Contenido Temático</h4>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${(course.content || []).map((mod, i) => `
                <div style="padding:0.75rem; background:var(--bg-subtle); border-radius:var(--radius-sm); border:1px solid var(--border-light); font-size:0.85rem; color:var(--text-main); font-weight:500;">
                  ${mod}
                </div>
              `).join('')}
            </div>
          </div>

          ${course.enrolled ? `
            <div style="background:var(--emerald-50); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-md); padding:1rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <span style="font-size:0.85rem; font-weight:700; color:var(--emerald-700);">Tu progreso actual: ${course.progress}%</span>
                <button class="btn btn-emerald btn-sm" onclick="LABEXP_VIEWS.courses.incrementProgress('${course.id}')">
                  + Avanzar Módulo (+25%)
                </button>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill emerald" style="width:${course.progress}%"></div>
              </div>
            </div>
          ` : ''}
        </div>
      `,
      footer: `
        <button class="btn btn-outline" onclick="LABEXP_COMPONENTS.closeModal()">Cerrar</button>
        <button class="btn ${course.enrolled ? 'btn-secondary' : 'btn-primary'}" onclick="LABEXP_VIEWS.courses.toggleEnrollment('${course.id}')">
          ${course.enrolled ? 'Abandonar curso' : 'Inscribirme gratis'}
        </button>
      `
    });
  },

  toggleEnrollment: async function(courseId) {
    const course = LABEXP_STATE.courses.find(c => c.id === courseId);
    if (!course) return;

    const newEnrolled = !course.enrolled;
    const newProgress = newEnrolled ? 25 : 0;

    try {
      await LABEXP_API.updateCourseProgress(courseId, newProgress, newEnrolled);
      LABEXP_COMPONENTS.closeModal();
      LABEXP_COMPONENTS.showToast('success', newEnrolled ? 'Inscripción exitosa' : 'Baja realizada', newEnrolled ? `Te has inscrito a "${course.title}".` : 'Has dejado el curso.');
      LABEXP_STATE.setView('courses');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error al actualizar', err.message);
    }
  },

  incrementProgress: async function(courseId) {
    const course = LABEXP_STATE.courses.find(c => c.id === courseId);
    if (!course) return;

    const newProgress = Math.min(100, (course.progress || 0) + 25);
    try {
      await LABEXP_API.updateCourseProgress(courseId, newProgress, true);
      LABEXP_COMPONENTS.closeModal();
      LABEXP_COMPONENTS.showToast('success', '¡Módulo Completado!', `Tu progreso en el curso ahora es del ${newProgress}%.`);
      LABEXP_STATE.setView('courses');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error al registrar avance', err.message);
    }
  }
};
