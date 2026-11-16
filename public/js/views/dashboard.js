// LABEXP - Pantalla 4: Panel Principal del Usuario (Dashboard)
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.dashboard = {
  render: async function() {
    const user = LABEXP_STATE.currentUser;
    const profile = LABEXP_STATE.currentProfile || {};
    const config = window.LABEXP_CONFIG;

    // Load data in parallel for high speed
    let vacancies = [];
    let savedJobs = [];
    let applications = [];
    let courses = [];

    try {
      const [vRes, sRes, aRes, cRes] = await Promise.all([
        LABEXP_API.getJobs({ limit: 4 }),
        LABEXP_API.getSavedJobs(user?.id),
        LABEXP_API.getApplications({ userId: user?.id }),
        LABEXP_API.getCourses({ limit: 3 })
      ]);
      vacancies = vRes.vacancies || [];
      savedJobs = sRes.savedVacancies || [];
      applications = aRes.applications || [];
      courses = cRes.courses || [];
      
      LABEXP_STATE.vacancies = vacancies;
      LABEXP_STATE.savedJobs = savedJobs;
      LABEXP_STATE.applications = applications;
    } catch (e) {
      console.warn('Dashboard fetch error:', e);
    }

    const completion = profile.completionPercentage || 85;

    return `
      <div style="display:flex; flex-direction:column; gap:2rem;">
        <!-- Welcome Banner -->
        <div class="card" style="background:linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); color:#ffffff; padding:2rem; position:relative; overflow:hidden;">
          <div style="position:absolute; right:-20px; bottom:-30px; opacity:0.1; font-size:12rem; font-weight:900; line-height:1; pointer-events:none;">
            🎓
          </div>
          <div style="max-width:750px; position:relative; z-index:2;">
            <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.2); padding:4px 12px; border-radius:var(--radius-full); font-size:0.75rem; font-weight:700; margin-bottom:1rem; backdrop-filter:blur(4px);">
              <span>✨ Tu portal de inserción profesional joven</span>
            </div>
            <h1 style="font-size:1.85rem; font-weight:800; line-height:1.2; margin-bottom:0.75rem;">
              ¡Hola, ${user?.fullName ? user.fullName.split(' ')[0] : 'Estudiante'}! 👋
            </h1>
            <p style="font-size:0.95rem; opacity:0.95; line-height:1.5; margin-bottom:1.5rem;">
              Las empresas asociadas a <span data-brand-name>${config.APP_NAME}</span> están buscando talento con tu formación académica en <strong>${profile.degree || 'tu carrera'}</strong>. Prepara tu perfil y postúlate con confianza.
            </p>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
              <button class="btn btn-emerald btn-sm" onclick="LABEXP_STATE.setView('cvBuilder')">
                📄 Mejorar mi CV con IA
              </button>
              <button class="btn btn-secondary btn-sm" onclick="LABEXP_STATE.setView('interviewSimulator')">
                🎙️ Practicar Entrevista Simulada
              </button>
              <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setView('careerCoach')" style="background:rgba(255,255,255,0.15); color:#ffffff; border-color:rgba(255,255,255,0.3);">
                🤖 Preguntar al Asesor IA
              </button>
            </div>
          </div>
        </div>

        <!-- Metric & Profile Overview Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.25rem;">
          <!-- Profile Completion Card -->
          <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; gap:1.25rem;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <h3 style="font-size:1rem; font-weight:700; color:var(--text-main);">Completitud de tu Perfil</h3>
                <span style="font-size:1.1rem; font-weight:800; color:var(--primary-700);">${completion}%</span>
              </div>
              <div class="progress-bar-container" style="height:10px; margin-bottom:0.75rem;">
                <div class="progress-bar-fill" style="width:${completion}%"></div>
              </div>
              <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
                ${completion >= 80 
                  ? '¡Excelente avance! Tu perfil destaca por sus proyectos académicos y competencias demostradas.' 
                  : 'Agrega tus materias destacadas, proyectos escolares o servicio social para aumentar tu visibilidad.'}
              </p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:0.75rem;">
              <span style="font-size:0.75rem; color:var(--text-muted);">
                ${profile.university || 'Universidad Nacional Autónoma de México'}
              </span>
              <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setView('profile')">Editar perfil</button>
            </div>
          </div>

          <!-- Quick Stats Summary -->
          <div class="card" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:center;">
              <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Postulaciones activas</span>
              <span style="font-size:1.75rem; font-weight:800; color:var(--primary-700); margin:4px 0;">${applications.length}</span>
              <a href="javascript:void(0)" onclick="LABEXP_STATE.setView('applications')" style="font-size:0.75rem; color:var(--primary-700); text-decoration:none; font-weight:600;">Ver pipeline ></a>
            </div>
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:center;">
              <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Vacantes guardadas</span>
              <span style="font-size:1.75rem; font-weight:800; color:var(--amber-600); margin:4px 0;">${savedJobs.length}</span>
              <a href="javascript:void(0)" onclick="LABEXP_STATE.setView('jobs')" style="font-size:0.75rem; color:var(--amber-600); text-decoration:none; font-weight:600;">Revisar ></a>
            </div>
          </div>
        </div>

        <!-- Section: Recommended Vacancies for University Profile -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>
              <h2 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">Vacantes recomendadas para ti</h2>
              <p style="font-size:0.8rem; color:var(--text-muted);">Filtradas especialmente para estudiantes y perfiles en formación</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setView('jobs')">Ver todas las vacantes (${vacancies.length})</button>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
            ${vacancies.slice(0, 3).map(v => {
              const isSaved = savedJobs.some(s => s.id === v.id);
              return LABEXP_COMPONENTS.renderJobCard(v, isSaved);
            }).join('')}
          </div>
        </div>

        <!-- Grid: Recent Applications & Recommended Courses -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:1.75rem;">
          <!-- Recent Applications -->
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
              <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main);">Tus postulaciones recientes</h3>
              <a href="javascript:void(0)" onclick="LABEXP_STATE.setView('applications')" style="font-size:0.8rem; color:var(--primary-700); text-decoration:none; font-weight:600;">Ver todas</a>
            </div>

            ${applications.length === 0 ? `
              <div style="text-align:center; padding:2rem 1rem; color:var(--text-muted);">
                <p style="margin-bottom:1rem;">Aún no tienes postulaciones registradas.</p>
                <button class="btn btn-primary btn-sm" onclick="LABEXP_STATE.setView('jobs')">Explorar vacantes</button>
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:0.85rem;">
                ${applications.slice(0, 3).map(app => `
                  <div style="padding:0.9rem; background:var(--bg-subtle); border-radius:var(--radius-md); border:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                    <div>
                      <div style="font-size:0.88rem; font-weight:700; color:var(--text-main); margin-bottom:2px;">${app.vacancyTitle}</div>
                      <div style="font-size:0.78rem; color:var(--text-muted);">${app.companyName}</div>
                    </div>
                    <div>
                      ${LABEXP_COMPONENTS.renderApplicationBadge(app.status)}
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Recommended Courses -->
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
              <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main);">Capacitación recomendada</h3>
              <a href="javascript:void(0)" onclick="LABEXP_STATE.setView('courses')" style="font-size:0.8rem; color:var(--primary-700); text-decoration:none; font-weight:600;">Ver catálogo (13 áreas)</a>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              ${courses.slice(0, 2).map(c => `
                <div style="display:flex; gap:0.75rem; align-items:center; padding:0.75rem; background:var(--bg-subtle); border-radius:var(--radius-md); border:1px solid var(--border-light);">
                  <div style="width:50px; height:50px; border-radius:var(--radius-sm); background-image:url('${c.image}'); background-size:cover; background-position:center; flex-shrink:0;"></div>
                  <div style="flex:1; overflow:hidden;">
                    <div style="font-size:0.72rem; color:var(--primary-700); font-weight:600;">${c.category}</div>
                    <div style="font-size:0.85rem; font-weight:700; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.title}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">⏱️ ${c.duration}</div>
                  </div>
                  <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setView('courses')">Ver</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
