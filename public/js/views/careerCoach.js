// LABEXP - Módulo D: Asistente IA de Orientación Profesional (Career Coach)
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.careerCoach = {
  chatHistory: [
    {
      role: 'assistant',
      text: '¡Hola! Soy tu Asesor IA de Orientación Profesional en LABEXP. Mi función es guiarte para que tu transición de la universidad al mundo laboral sea clara, segura y exitosa, sin importar que aún no tengas experiencia en empresas. ¿Qué duda o situación profesional te gustaría revisar hoy?'
    }
  ],

  render: function() {
    const config = window.LABEXP_CONFIG;

    return `
      <div style="display:flex; flex-direction:column; gap:1.5rem; max-width:950px; margin:0 auto; width:100%;">
        <!-- Header -->
        <div class="card" style="padding:1.25rem 1.75rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="brand-icon" style="width:42px; height:42px;">
              ${LABEXP_COMPONENTS.icons.aiBot}
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <h1 style="font-size:1.3rem; font-weight:800; color:var(--text-main);">Asesor de Orientación y Empleabilidad IA</h1>
                <span class="badge badge-emerald">En línea</span>
              </div>
              <p style="font-size:0.8rem; color:var(--text-muted);">
                Consejos reales sobre primer empleo, cartas de motivación, negociación salarial y entrevistas en México.
              </p>
            </div>
          </div>
        </div>

        <!-- Chat Container -->
        <div class="chat-container">
          <div class="chat-header">
            <div class="chat-partner">
              <div class="chat-partner-avatar">
                🎓
              </div>
              <div>
                <div style="font-size:0.88rem; font-weight:700; color:var(--text-main);">Coach de Carrera LABEXP</div>
                <div style="font-size:0.72rem; color:var(--emerald-600); font-weight:600;">Supervisado por expertos en reclutamiento universitario</div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="LABEXP_VIEWS.careerCoach.resetConversation()" title="Reiniciar conversación">
              🔄 Nueva charla
            </button>
          </div>

          <!-- Messages Stream -->
          <div id="coach-messages-stream" class="chat-messages">
            ${this.chatHistory.map(msg => `
              <div class="chat-bubble ${msg.role}">
                ${msg.text.replace(/\n/g, '<br/>')}
              </div>
            `).join('')}
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="chat-suggestions">
            <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); align-self:center;">Preguntas frecuentes:</span>
            <button class="suggestion-chip" onclick="LABEXP_VIEWS.careerCoach.sendPresetQuestion('¿Cómo destaco en una postulación si no tengo experiencia laboral?')">
              ¿Cómo destaco sin experiencia laboral?
            </button>
            <button class="suggestion-chip" onclick="LABEXP_VIEWS.careerCoach.sendPresetQuestion('¿Qué rango de sueldo debo esperar para mi primer empleo o prácticas en México?')">
              Rango de sueldo para mi primer empleo
            </button>
            <button class="suggestion-chip" onclick="LABEXP_VIEWS.careerCoach.sendPresetQuestion('¿Cómo puedo calmar los nervios y prepararme para una primera entrevista?')">
              ¿Cómo calmar nervios en entrevistas?
            </button>
            <button class="suggestion-chip" onclick="LABEXP_VIEWS.careerCoach.sendPresetQuestion('¿Cómo redactar una carta de presentación para un recién egresado?')">
              Carta de presentación efectiva
            </button>
          </div>

          <!-- Chat Input -->
          <form class="chat-input-area" onsubmit="LABEXP_VIEWS.careerCoach.handleSubmit(event)">
            <input type="text" id="coach-input-field" class="form-input" placeholder="Pregúntale cualquier duda sobre tu inserción laboral o tus opciones profesionales..." autocomplete="off" />
            <button type="submit" id="coach-send-btn" class="btn btn-primary" style="padding:0.7rem 1.25rem;">
              Enviar
            </button>
          </form>
        </div>
      </div>
    `;
  },

  handleSubmit: async function(e) {
    e.preventDefault();
    const input = document.getElementById('coach-input-field');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    this.addMessage('user', msg);

    const btn = document.getElementById('coach-send-btn');
    btn.disabled = true;

    // Loading indicator
    const stream = document.getElementById('coach-messages-stream');
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'chat-bubble assistant';
    loadingBubble.id = 'coach-loading-indicator';
    loadingBubble.innerHTML = '<em>Escribiendo respuesta...</em>';
    stream.appendChild(loadingBubble);
    stream.scrollTop = stream.scrollHeight;

    try {
      const res = await LABEXP_API.askCareerCoach(
        msg,
        this.chatHistory,
        LABEXP_STATE.currentProfile
      );

      loadingBubble.remove();
      this.addMessage('assistant', res.reply);
    } catch (err) {
      loadingBubble.remove();
      this.addMessage('assistant', `Lo siento, ocurrió un inconveniente temporal: ${err.message}. Por favor intenta formular tu duda nuevamente.`);
    } finally {
      btn.disabled = false;
    }
  },

  sendPresetQuestion: function(question) {
    const input = document.getElementById('coach-input-field');
    if (input) {
      input.value = question;
      document.querySelector('.chat-input-area').dispatchEvent(new Event('submit'));
    }
  },

  addMessage: function(role, text) {
    this.chatHistory.push({ role, text });
    const stream = document.getElementById('coach-messages-stream');
    if (stream) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${role}`;
      bubble.innerHTML = text.replace(/\n/g, '<br/>');
      stream.appendChild(bubble);
      stream.scrollTop = stream.scrollHeight;
    }
  },

  resetConversation: function() {
    this.chatHistory = [
      {
        role: 'assistant',
        text: 'Hemos iniciado una nueva conversación. ¿En qué aspecto de tu preparación profesional te puedo orientar?'
      }
    ];
    LABEXP_STATE.setView('careerCoach');
  }
};
