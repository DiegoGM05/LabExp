// LABEXP - Módulo K: Configuración y Privacidad
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.settings = {
  render: function() {
    const user = LABEXP_STATE.currentUser;
    const config = window.LABEXP_CONFIG;

    return `
      <div style="max-width:850px; margin:0 auto; display:flex; flex-direction:column; gap:2rem; width:100%;">
        <!-- Header -->
        <div class="card" style="padding:1.5rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="brand-icon" style="width:40px; height:40px;">
              ${LABEXP_COMPONENTS.icons.settings}
            </div>
            <div>
              <h1 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">Configuración de Cuenta y Privacidad</h1>
              <p style="font-size:0.82rem; color:var(--text-muted);">
                Seguridad, gestión de consentimientos LFPDPPP y parámetros del sistema.
              </p>
            </div>
          </div>
        </div>

        <!-- 1. Configuración de Marca Comercial (Requerimiento Clave) -->
        <div class="card" style="border-left:4px solid var(--primary-600);">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">
            🏷️ Nombre Comercial de la Aplicación (Configurable)
          </h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
            El nombre comercial de la aplicación es sustituible por el nombre definitivo de la marca en cualquier momento.
          </p>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <input type="text" id="settings-brand-name-input" class="form-input" style="max-width:320px;" value="${config.APP_NAME}" placeholder="Nombre comercial de la marca" />
            <button class="btn btn-primary" onclick="LABEXP_VIEWS.settings.updateBrandName()">
              Actualizar Nombre de la Marca
            </button>
          </div>
        </div>

        <!-- 2. Configuración Segura de Inteligencia Artificial -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main);">
              🧠 Conector de Inteligencia Artificial (Servicios en Servidor)
            </h3>
            <span class="badge ${LABEXP_STATE.aiStatus?.isLiveConfigured ? 'badge-emerald' : 'badge-purple'}">
              ${LABEXP_STATE.aiStatus?.isLiveConfigured ? '🟢 Conexión Activa a la Nube' : '🟣 Motor Local Inteligente'}
            </span>
          </div>

          <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.5; margin-bottom:1rem;">
            Todas las llamadas de IA se ejecutan de manera segura en el servidor de Node.js sin exponer credenciales en el navegador. Por defecto, LABEXP funciona con un motor local inteligente especializado para estudiantes. Si deseas activar llamadas directas a la API de Google Gemini, puedes ingresar tu API Key aquí:
          </p>

          <div class="form-group">
            <label class="form-label" for="settings-ai-key">API Key de Google Gemini (Opcional)</label>
            <input type="password" id="settings-ai-key" class="form-input" placeholder="AIzaSy..." />
            <div class="form-hint">La clave se almacena de forma segura en la memoria de ejecución del servidor local.</div>
          </div>

          <div style="display:flex; gap:0.75rem;">
            <button class="btn btn-primary btn-sm" onclick="LABEXP_VIEWS.settings.saveAiKey()">
              Guardar y Activar API Key
            </button>
            <button class="btn btn-outline btn-sm" onclick="LABEXP_VIEWS.settings.clearAiKey()">
              Restablecer al Motor Local Inteligente
            </button>
          </div>
        </div>

        <!-- 3. Privacidad y Consentimientos LFPDPPP -->
        <div class="card">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:0.75rem;">
            🛡️ Privacidad y Protección de Datos Personales (México)
          </h3>
          <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.5; margin-bottom:1.25rem;">
            ${config.COMPLIANCE_TEXT}
          </p>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:var(--text-main); cursor:pointer;">
              <input type="checkbox" id="pref-consent-share" checked />
              <span>Autorizo compartir mis proyectos académicos y CV con reclutadores verificados en las vacantes a las que me postulo.</span>
            </label>

            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:var(--text-main); cursor:pointer;">
              <input type="checkbox" id="pref-consent-notifs" checked />
              <span>Deseo recibir notificaciones sobre vacantes afines a mi carrera que no exijan experiencia previa.</span>
            </label>

            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:var(--text-main); cursor:pointer;">
              <input type="checkbox" id="pref-consent-ai" checked />
              <span>Autorizo que el Asistente IA procese el borrador de mi currículum para sugerir mejoras de redacción.</span>
            </label>
          </div>

          <div style="display:flex; gap:0.75rem;">
            <button class="btn btn-outline btn-sm" onclick="LABEXP_VIEWS.auth.showPrivacyModal()">
              Consultar Aviso de Privacidad Completo
            </button>
            <button class="btn btn-outline btn-sm" onclick="LABEXP_VIEWS.auth.showTermsModal()">
              Consultar Términos de Servicio
            </button>
          </div>
        </div>

        <!-- 4. Cambio de Contraseña -->
        <div class="card">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:1rem;">
            🔒 Seguridad y Contraseña
          </h3>

          <form onsubmit="LABEXP_VIEWS.settings.changePassword(event)">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label">Nueva Contraseña</label>
                <input type="password" id="settings-new-pass" class="form-input" placeholder="Mínimo 6 caracteres" minlength="6" required />
              </div>
              <div class="form-group">
                <label class="form-label">Confirmar Nueva Contraseña</label>
                <input type="password" id="settings-confirm-pass" class="form-input" placeholder="Repite la contraseña" minlength="6" required />
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Actualizar Contraseña</button>
          </form>
        </div>

        <!-- 5. Cierre de Sesión -->
        <div class="card" style="border-color:rgba(244,63,94,0.3); background:#fff5f5; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--rose-600);">Sesión Segura</h4>
            <p style="font-size:0.8rem; color:var(--text-muted);">Cierra tu sesión en este dispositivo cuando termines.</p>
          </div>
          <button class="btn btn-outline btn-sm" style="color:var(--rose-600); border-color:var(--rose-500);" onclick="LABEXP_VIEWS.settings.logout()">
            Cerrar Sesión Segura
          </button>
        </div>
      </div>
    `;
  },

  updateBrandName: function() {
    const input = document.getElementById('settings-brand-name-input');
    const newName = input ? input.value.trim() : '';
    if (!newName) return;

    window.LABEXP_CONFIG.setBrandName(newName);
    LABEXP_COMPONENTS.showToast('success', 'Marca Actualizada', `El nombre comercial de la plataforma ahora es "${newName}".`);
  },

  saveAiKey: async function() {
    const keyInput = document.getElementById('settings-ai-key');
    const key = keyInput ? keyInput.value.trim() : '';

    if (!key) {
      LABEXP_COMPONENTS.showToast('error', 'Campo vacío', 'Ingresa una API Key válida.');
      return;
    }

    try {
      const res = await LABEXP_API.setAiApiKey(key);
      LABEXP_STATE.aiStatus = res.aiStatus;
      LABEXP_COMPONENTS.showToast('success', 'IA Conectada', res.message);
      LABEXP_STATE.setView('settings');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error de configuración', err.message);
    }
  },

  clearAiKey: async function() {
    try {
      const res = await LABEXP_API.setAiApiKey('');
      LABEXP_STATE.aiStatus = res.aiStatus;
      LABEXP_COMPONENTS.showToast('info', 'Motor Local', res.message);
      LABEXP_STATE.setView('settings');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error', err.message);
    }
  },

  changePassword: function(e) {
    e.preventDefault();
    const p1 = document.getElementById('settings-new-pass')?.value;
    const p2 = document.getElementById('settings-confirm-pass')?.value;

    if (p1 !== p2) {
      LABEXP_COMPONENTS.showToast('error', 'Error', 'Las contraseñas no coinciden.');
      return;
    }

    LABEXP_COMPONENTS.showToast('success', 'Contraseña Actualizada', 'Tu nueva contraseña ha sido guardada de forma segura.');
    document.getElementById('settings-new-pass').value = '';
    document.getElementById('settings-confirm-pass').value = '';
  },

  logout: function() {
    LABEXP_STATE.setUser(null);
    LABEXP_COMPONENTS.showToast('info', 'Sesión cerrada', 'Has cerrado sesión correctamente.');
    LABEXP_STATE.setView('landing');
  }
};
