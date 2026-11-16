// LABEXP - Pantalla 2 (Registro) & Pantalla 3 (Inicio de Sesión)
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.auth = {
  renderLogin: function() {
    const config = window.LABEXP_CONFIG;

    return `
      <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1rem; background:linear-gradient(135deg, #ede9fe 0%, #f8fafc 100%);">
        <div class="card auth-card" style="max-width:440px; width:100%; box-shadow:var(--shadow-xl);">
          <div style="text-align:center; margin-bottom:2rem;">
            <div class="brand-icon" style="margin:0 auto 1rem; width:48px; height:48px;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            </div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-main);">Iniciar Sesión</h2>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
              Accede a tu cuenta en <span data-brand-name>${config.APP_NAME}</span>
            </p>
          </div>

          <form id="login-form" onsubmit="LABEXP_VIEWS.auth.handleLogin(event)">
            <div id="login-error-box" style="display:none; padding:0.75rem; border-radius:var(--radius-md); background:var(--rose-50); border:1px solid rgba(244,63,94,0.3); color:var(--rose-600); font-size:0.82rem; margin-bottom:1.25rem; font-weight:500;"></div>

            <div class="form-group">
              <label class="form-label" for="login-email">Correo Electrónico</label>
              <input type="email" id="login-email" class="form-input" placeholder="ejemplo@alumnos.unam.mx" required value="sofia.ramirez@alumnos.unam.mx" />
            </div>

            <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <label class="form-label" for="login-password" style="margin-bottom:0;">Contraseña</label>
                <a href="javascript:void(0)" onclick="LABEXP_VIEWS.auth.handleForgotPassword()" style="font-size:0.78rem; color:var(--primary-700); text-decoration:none; font-weight:600;">¿Olvidaste tu contraseña?</a>
              </div>
              <input type="password" id="login-password" class="form-input" placeholder="••••••••" required value="password123" />
            </div>

            <button type="submit" id="login-submit-btn" class="btn btn-primary" style="width:100%; margin-top:0.75rem; padding:0.8rem;">
              Entrar a la plataforma
            </button>
          </form>

          <div style="margin:1.75rem 0 1rem; border-top:1px solid var(--border-light); text-align:center; position:relative;">
            <span style="background:var(--bg-card); padding:0 10px; font-size:0.75rem; color:var(--text-muted); position:relative; top:-10px;">o selecciona credencial de prueba</span>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-bottom:1.25rem;">
            <button class="btn btn-outline btn-sm" onclick="LABEXP_VIEWS.auth.fillTestCredentials('sofia.ramirez@alumnos.unam.mx', 'password123', 'candidate')">
              👩‍🎓 Sofía (Candidata)
            </button>
            <button class="btn btn-outline btn-sm" onclick="LABEXP_VIEWS.auth.fillTestCredentials('reclutamiento@techinnovamx.com', 'password123', 'recruiter')">
              🏢 Carlos (Reclutador)
            </button>
          </div>

          <div style="text-align:center; font-size:0.85rem; color:var(--text-secondary);">
            ¿Aún no tienes una cuenta? 
            <a href="javascript:void(0)" onclick="LABEXP_STATE.setView('register')" style="color:var(--primary-700); font-weight:700; text-decoration:none;">Regístrate gratis</a>
          </div>

          <div style="text-align:center; margin-top:1rem;">
            <a href="javascript:void(0)" onclick="LABEXP_STATE.setView('landing')" style="font-size:0.78rem; color:var(--text-muted); text-decoration:none;">← Volver al inicio</a>
          </div>
        </div>
      </div>
    `;
  },

  renderRegister: function() {
    const config = window.LABEXP_CONFIG;

    return `
      <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1rem; background:linear-gradient(135deg, #ede9fe 0%, #f8fafc 100%);">
        <div class="card auth-card" style="max-width:520px; width:100%; box-shadow:var(--shadow-xl);">
          <div style="text-align:center; margin-bottom:1.75rem;">
            <div class="brand-icon" style="margin:0 auto 1rem; width:48px; height:48px;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-main);">Crear Cuenta</h2>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
              Conéctate a oportunidades y prepara tu camino profesional en <span data-brand-name>${config.APP_NAME}</span>
            </p>
          </div>

          <form id="register-form" onsubmit="LABEXP_VIEWS.auth.handleRegister(event)">
            <div id="register-error-box" style="display:none; padding:0.75rem; border-radius:var(--radius-md); background:var(--rose-50); border:1px solid rgba(244,63,94,0.3); color:var(--rose-600); font-size:0.82rem; margin-bottom:1.25rem; font-weight:500;"></div>

            <div class="form-group">
              <label class="form-label" for="reg-fullname">Nombre Completo *</label>
              <input type="text" id="reg-fullname" class="form-input" placeholder="Ej. Ana Victoria González" required minlength="3" />
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Correo Electrónico *</label>
              <input type="email" id="reg-email" class="form-input" placeholder="correo@ejemplo.edu.mx" required />
              <div class="form-hint">Puedes usar tu correo universitario o personal.</div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
              <div class="form-group">
                <label class="form-label" for="reg-password">Contraseña *</label>
                <input type="password" id="reg-password" class="form-input" placeholder="Mínimo 6 caracteres" required minlength="6" />
              </div>
              <div class="form-group">
                <label class="form-label" for="reg-confirm-password">Confirmar Contraseña *</label>
                <input type="password" id="reg-confirm-password" class="form-input" placeholder="Repite tu contraseña" required minlength="6" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-role">Tipo de Cuenta *</label>
              <select id="reg-role" class="form-select" onchange="LABEXP_VIEWS.auth.toggleCompanyField(this.value)">
                <option value="candidate">Estudiante o Recién Egresado (Búsqueda de empleo/desarrollo)</option>
                <option value="recruiter">Empresa o Reclutador (Publicación de vacantes y atracción de talento)</option>
              </select>
            </div>

            <div class="form-group" id="reg-company-container" style="display:none;">
              <label class="form-label" for="reg-company">Nombre de tu Empresa u Organización *</label>
              <input type="text" id="reg-company" class="form-input" placeholder="Ej. Startup Innovadora S.A.S." />
            </div>

            <div class="form-group" style="margin-top:1rem;">
              <label style="display:flex; align-items:flex-start; gap:0.5rem; font-size:0.8rem; color:var(--text-secondary); cursor:pointer;">
                <input type="checkbox" id="reg-privacy" required style="margin-top:3px;" />
                <span>
                  Acepto los <a href="javascript:void(0)" onclick="LABEXP_VIEWS.auth.showTermsModal()" style="color:var(--primary-700); font-weight:600;">Términos de Uso</a> y el <a href="javascript:void(0)" onclick="LABEXP_VIEWS.auth.showPrivacyModal()" style="color:var(--primary-700); font-weight:600;">Aviso de Privacidad</a> en cumplimiento con la LFPDPPP de México.
                </span>
              </label>
            </div>

            <button type="submit" id="reg-submit-btn" class="btn btn-primary" style="width:100%; padding:0.8rem;">
              Registrarme y Comenzar
            </button>
          </form>

          <div style="text-align:center; font-size:0.85rem; color:var(--text-secondary); margin-top:1.5rem;">
            ¿Ya tienes una cuenta? 
            <a href="javascript:void(0)" onclick="LABEXP_STATE.setView('login')" style="color:var(--primary-700); font-weight:700; text-decoration:none;">Inicia sesión</a>
          </div>

          <div style="text-align:center; margin-top:0.75rem;">
            <a href="javascript:void(0)" onclick="LABEXP_STATE.setView('landing')" style="font-size:0.78rem; color:var(--text-muted); text-decoration:none;">← Volver al inicio</a>
          </div>
        </div>
      </div>
    `;
  },

  toggleCompanyField: function(role) {
    const cont = document.getElementById('reg-company-container');
    if (cont) {
      cont.style.display = role === 'recruiter' ? 'block' : 'none';
    }
  },

  fillTestCredentials: function(email, password, role) {
    const emInput = document.getElementById('login-email');
    const pwInput = document.getElementById('login-password');
    if (emInput && pwInput) {
      emInput.value = email;
      pwInput.value = password;
      LABEXP_COMPONENTS.showToast('info', 'Credenciales cargadas', `Listo para iniciar como ${role === 'recruiter' ? 'Reclutador' : 'Candidato'}. Haz clic en Entrar.`);
    }
  },

  handleLogin: async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-submit-btn');
    const errorBox = document.getElementById('login-error-box');

    errorBox.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Verificando...';

    try {
      const res = await LABEXP_API.login(email, password);
      LABEXP_STATE.setUser(res.user, res.profile);
      LABEXP_COMPONENTS.showToast('success', '¡Bienvenido(a)!', `Sesión iniciada como ${res.user.fullName}`);
      
      if (res.user.role === 'recruiter') {
        LABEXP_STATE.setView('companyPortal');
      } else if (res.user.role === 'admin') {
        LABEXP_STATE.setView('adminPortal');
      } else {
        LABEXP_STATE.setView('dashboard');
      }
    } catch (err) {
      errorBox.textContent = err.message || 'Error al iniciar sesión';
      errorBox.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar a la plataforma';
    }
  },

  handleRegister: async function(e) {
    e.preventDefault();
    const fullName = document.getElementById('reg-fullname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const role = document.getElementById('reg-role').value;
    const companyName = document.getElementById('reg-company') ? document.getElementById('reg-company').value.trim() : '';
    const privacyConsent = document.getElementById('reg-privacy').checked;
    const btn = document.getElementById('reg-submit-btn');
    const errorBox = document.getElementById('register-error-box');

    errorBox.style.display = 'none';

    if (password !== confirmPassword) {
      errorBox.textContent = 'Las contraseñas no coinciden. Por favor verifícalas.';
      errorBox.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Creando cuenta...';

    try {
      const res = await LABEXP_API.register({
        fullName,
        email,
        password,
        confirmPassword,
        role,
        companyName,
        privacyConsent
      });

      LABEXP_STATE.setUser(res.user);
      LABEXP_COMPONENTS.showToast('success', 'Registro Exitoso', 'Tu cuenta fue creada correctamente.');
      
      if (role === 'recruiter') {
        LABEXP_STATE.setView('companyPortal');
      } else {
        LABEXP_STATE.setView('profile');
        LABEXP_COMPONENTS.showToast('info', 'Completa tu perfil', 'Agrega tu universidad y proyectos escolares para comenzar.');
      }
    } catch (err) {
      errorBox.textContent = err.message || 'Error al registrar la cuenta';
      errorBox.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Registrarme y Comenzar';
    }
  },

  handleForgotPassword: function() {
    LABEXP_COMPONENTS.openModal({
      title: 'Recuperación de Contraseña',
      body: `
        <div style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5;">
          <p style="margin-bottom:1rem;">
            Ingresa tu correo electrónico registrado y te enviaremos un enlace seguro para restablecer tu contraseña.
          </p>
          <div class="form-group">
            <label class="form-label">Correo registrado</label>
            <input type="email" id="recovery-email" class="form-input" placeholder="ejemplo@alumnos.unam.mx" value="${document.getElementById('login-email')?.value || ''}" />
          </div>
        </div>
      `,
      footer: `
        <button class="btn btn-outline" onclick="LABEXP_COMPONENTS.closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="LABEXP_VIEWS.auth.sendRecoveryLink()">Enviar Instrucciones</button>
      `
    });
  },

  sendRecoveryLink: function() {
    const email = document.getElementById('recovery-email')?.value;
    LABEXP_COMPONENTS.closeModal();
    LABEXP_COMPONENTS.showToast('success', 'Enlace enviado', `Hemos enviado un correo a ${email || 'tu dirección'} con los pasos de recuperación.`);
  },

  showTermsModal: function() {
    LABEXP_COMPONENTS.openModal({
      title: 'Términos de Uso de LABEXP',
      body: `
        <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; max-height:400px; overflow-y:auto;">
          <h4 style="color:var(--text-main); margin-bottom:0.5rem;">1. Objeto de la Plataforma</h4>
          <p style="margin-bottom:1rem;">
            LABEXP es una plataforma diseñada para facilitar la inserción laboral de estudiantes y recién egresados sin exigir experiencia laboral previa como requisito excluyente.
          </p>
          <h4 style="color:var(--text-main); margin-bottom:0.5rem;">2. Cuentas de Usuario y Veracidad</h4>
          <p style="margin-bottom:1rem;">
            El usuario se compromete a registrar información fidedigna sobre su formación académica y proyectos universitarios. La plataforma y sus asistentes de IA están diseñados para no falsificar ni inventar información curricular.
          </p>
          <h4 style="color:var(--text-main); margin-bottom:0.5rem;">3. Compromiso de las Empresas</h4>
          <p>
            Las empresas registradas se comprometen a respetar los procesos de selección inclusivos para jóvenes y brindar retroalimentación transparente a los postulantes.
          </p>
        </div>
      `,
      footer: `<button class="btn btn-primary" onclick="LABEXP_COMPONENTS.closeModal()">Entendido</button>`
    });
  },

  showPrivacyModal: function() {
    LABEXP_COMPONENTS.openModal({
      title: 'Aviso de Privacidad (LFPDPPP - México)',
      body: `
        <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; max-height:400px; overflow-y:auto;">
          <p style="margin-bottom:1rem;">
            En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> de los Estados Unidos Mexicanos, LABEXP hace de su conocimiento que los datos personales recabados (nombre, correo, historial académico, proyectos y competencias) serán tratados de forma estrictamente confidencial.
          </p>
          <h4 style="color:var(--text-main); margin-bottom:0.5rem;">Finalidades Principales:</h4>
          <ul style="padding-left:1.25rem; margin-bottom:1rem;">
            <li>Vincular el perfil del candidato con ofertas laborales de empresas verificadas.</li>
            <li>Brindar orientación profesional y optimización de currículum mediante herramientas de IA supervisadas.</li>
            <li>Monitorear el avance académico y progreso en cursos formativos.</li>
          </ul>
          <p>
            Tus datos de contacto no se comparten con terceros ni reclutadores sin tu postulación previa o tu autorización expresa en la configuración de privacidad de tu perfil.
          </p>
        </div>
      `,
      footer: `<button class="btn btn-primary" onclick="LABEXP_COMPONENTS.closeModal()">Acepto los Términos de Privacidad</button>`
    });
  }
};
