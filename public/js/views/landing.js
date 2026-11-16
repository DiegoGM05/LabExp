// LABEXP - Pantalla 1: Página de Bienvenida (Landing Page)
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.landing = {
  render: function() {
    const config = window.LABEXP_CONFIG;

    return `
      <div class="public-layout">
        <!-- Landing Top Navbar -->
        <header class="landing-header">
          <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <div class="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              </div>
              <span class="brand-title" data-brand-name>${config.APP_NAME}</span>
              <span class="brand-badge">Jóvenes & Universitarios</span>
            </div>

            <div style="display:flex; align-items:center; gap:1rem;">
              <button class="btn btn-ghost" onclick="LABEXP_STATE.setView('login')">Iniciar sesión</button>
              <button class="btn btn-primary" onclick="LABEXP_STATE.setView('register')">Crear cuenta gratis</button>
            </div>
          </div>
        </header>

        <!-- Hero Section -->
        <section style="background:linear-gradient(180deg, #ede9fe 0%, #f8fafc 100%); padding:4.5rem 1.5rem 3.5rem; text-align:center;">
          <div style="max-width:860px; margin:0 auto;">
            <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(124, 58, 237, 0.1); color:var(--primary-700); padding:6px 14px; border-radius:var(--radius-full); font-size:0.82rem; font-weight:700; margin-bottom:1.5rem;">
              <span>🚀 Diseñado para estudiantes y egresados sin experiencia laboral previa</span>
            </div>
            
            <h1 style="font-size:clamp(2rem, 5vw, 3.2rem); font-weight:800; color:var(--text-main); line-height:1.15; margin-bottom:1.25rem; letter-spacing:-0.03em;">
              Transforma tu potencial universitario en tu <span style="color:var(--primary-600); text-decoration:underline decoration-primary-300;">primer empleo</span>
            </h1>

            <p style="font-size:clamp(1rem, 2vw, 1.2rem); color:var(--text-secondary); line-height:1.6; margin-bottom:2rem; max-width:720px; margin-left:auto; margin-right:auto;">
              ${config.APP_TAGLINE}
            </p>

            <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:2.5rem;">
              <button class="btn btn-primary btn-lg" onclick="LABEXP_STATE.setView('register')">
                Comenzar mi perfil profesional 🎓
              </button>
              <button class="btn btn-outline btn-lg" onclick="LABEXP_STATE.setView('jobs')">
                Explorar vacantes activas 💼
              </button>
            </div>

            <!-- Instant Demo Switcher Bar for Evaluators -->
            <div style="background:var(--bg-surface); border:1px solid var(--border-medium); border-radius:var(--radius-lg); padding:1.25rem; box-shadow:var(--shadow-md); display:inline-block; max-width:700px; width:100%;">
              <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.75rem;">
                ⚡ Acceso rápido de demostración interactiva (selecciona un perfil):
              </div>
              <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
                <button class="btn btn-secondary btn-sm" onclick="LABEXP_STATE.setRole('candidate'); LABEXP_STATE.setView('dashboard'); LABEXP_COMPONENTS.showToast('info', 'Sesión iniciada', 'Bienvenida Sofía Ramírez (Candidata)');">
                  👩‍🎓 Entrar como Candidata (Sofía)
                </button>
                <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setRole('recruiter'); LABEXP_STATE.setView('companyPortal'); LABEXP_COMPONENTS.showToast('info', 'Sesión iniciada', 'Acceso a Panel Empresa (TechInnova México)');">
                  🏢 Entrar como Reclutador (TechInnova)
                </button>
                <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setRole('admin'); LABEXP_STATE.setView('adminPortal'); LABEXP_COMPONENTS.showToast('info', 'Sesión iniciada', 'Acceso como Administradora');">
                  🛡️ Entrar como Administrador
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Pillars of Value Section -->
        <section style="padding:4rem 1.5rem; max-width:1200px; margin:0 auto; width:100%;">
          <div style="text-align:center; margin-bottom:3rem;">
            <h2 style="font-size:1.85rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">
              ¿Por qué <span data-brand-name>${config.APP_NAME}</span> es diferente a una bolsa de empleo tradicional?
            </h2>
            <p style="font-size:1rem; color:var(--text-muted); max-width:650px; margin:0 auto;">
              No te cerramos la puerta por no tener experiencia en empresas. Evaluamos tu talento a través de lo que ya sabes hacer.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.75rem;">
            <div class="card" style="display:flex; flex-direction:column; gap:1rem;">
              <div style="width:48px; height:48px; border-radius:var(--radius-md); background:var(--primary-100); color:var(--primary-700); display:flex; align-items:center; justify-content:center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <h3 style="font-size:1.2rem; font-weight:700;">Empleo Joven Sin Filtros Injustos</h3>
              <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5;">
                Accede a vacantes de Primer empleo, Prácticas profesionales, Servicio social, Becarios y Trainee donde las empresas valoran tus materias, proyectos y ganas de superarte.
              </p>
              <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setView('jobs')" style="align-self:flex-start;">Ver ofertas ></button>
            </div>

            <div class="card" style="display:flex; flex-direction:column; gap:1rem;">
              <div style="width:48px; height:48px; border-radius:var(--radius-md); background:var(--emerald-50); color:var(--emerald-600); display:flex; align-items:center; justify-content:center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
              </div>
              <h3 style="font-size:1.2rem; font-weight:700;">Creador de CV con Asistente IA</h3>
              <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5;">
                Traduce tus proyectos escolares, hackathones y actividades extracurriculares a lenguaje que entusiasme a los reclutadores. Exporta en PDF con plantillas limpias.
              </p>
              <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setView('cvBuilder')" style="align-self:flex-start;">Crear mi currículum ></button>
            </div>

            <div class="card" style="display:flex; flex-direction:column; gap:1rem;">
              <div style="width:48px; height:48px; border-radius:var(--radius-md); background:var(--sky-50); color:var(--sky-600); display:flex; align-items:center; justify-content:center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>
              </div>
              <h3 style="font-size:1.2rem; font-weight:700;">Simulador de Entrevistas</h3>
              <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5;">
                Entrena con un reclutador virtual con IA que te hace preguntas progresivas adaptadas a tu carrera y genera un reporte de evaluación cuantitativo (1-10) en 7 criterios.
              </p>
              <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setView('interviewSimulator')" style="align-self:flex-start;">Iniciar simulación ></button>
            </div>

            <div class="card" style="display:flex; flex-direction:column; gap:1rem;">
              <div style="width:48px; height:48px; border-radius:var(--radius-md); background:var(--amber-50); color:var(--amber-600); display:flex; align-items:center; justify-content:center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <h3 style="font-size:1.2rem; font-weight:700;">Biblioteca de Capacitación</h3>
              <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5;">
                Cursos en 13 áreas profesionales clave (Ofimática, Habilidades digitales, Ingeniería, Finanzas, Liderazgo, Medicina y más) para fortalecer tu perfil.
              </p>
              <button class="btn btn-outline btn-sm" onclick="LABEXP_STATE.setView('courses')" style="align-self:flex-start;">Explorar cursos ></button>
            </div>
          </div>
        </section>

        <!-- Compliance & Footer -->
        <footer style="background:var(--bg-surface); border-top:1px solid var(--border-light); padding:2.5rem 1.5rem; margin-top:auto;">
          <div style="max-width:1200px; margin:0 auto; display:flex; flex-direction:column; gap:1.5rem; text-align:center;">
            <div style="display:flex; justify-content:center; align-items:center; gap:0.5rem;">
              <span class="brand-title" data-brand-name>${config.APP_NAME}</span>
              <span style="color:var(--text-muted); font-size:0.85rem;">• ${config.APP_LEGAL_NAME}</span>
            </div>
            <p style="font-size:0.78rem; color:var(--text-muted); max-width:800px; margin:0 auto; line-height:1.6;">
              ${config.COMPLIANCE_TEXT}
            </p>
            <div style="font-size:0.75rem; color:var(--text-subtle);">
              © 2026 <span data-brand-name>${config.APP_NAME}</span>. Todos los derechos reservados. Plataforma configurable para inclusión laboral joven.
            </div>
          </div>
        </footer>
      </div>
    `;
  }
};
