// LABEXP - Módulo E: Simulador de Entrevistas con IA
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.interviewSimulator = {
  // Simulator State
  inProgress: false,
  isFinished: false,
  config: {
    role: 'Desarrollador Junior / Trainee',
    area: 'Ingeniería y Tecnologías de Información',
    type: 'primer_empleo',
    difficulty: 'media'
  },
  currentQuestionIndex: 0,
  totalQuestions: 5,
  conversation: [],
  evaluationReport: null,

  render: function() {
    if (this.isFinished && this.evaluationReport) {
      return this.renderEvaluationReport();
    }

    if (this.inProgress) {
      return this.renderInterviewChat();
    }

    return this.renderSetupScreen();
  },

  // Pantalla de Configuración Inicial
  renderSetupScreen: function() {
    return `
      <div style="max-width:850px; margin:0 auto; display:flex; flex-direction:column; gap:1.75rem;">
        <div class="card" style="padding:1.5rem 2rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%); border-color:var(--primary-200);">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem;">
            <div class="brand-icon" style="width:42px; height:42px;">
              ${LABEXP_COMPONENTS.icons.interview}
            </div>
            <div>
              <h1 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">Simulador de Entrevistas Laborales con IA</h1>
              <p style="font-size:0.82rem; color:var(--text-muted);">
                Practica con un reclutador virtual que evaluará tus respuestas objetivamente según el método STAR.
              </p>
            </div>
          </div>
        </div>

        <div class="card" style="padding:2rem;">
          <h2 style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin-bottom:1.5rem;">
            ⚙️ Personaliza tu sesión de práctica
          </h2>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
            <div class="form-group">
              <label class="form-label" for="sim-role">Puesto o Vacante a Simular *</label>
              <input type="text" id="sim-role" class="form-input" value="${this.config.role}" placeholder="Ej. Trainee de Desarrollo Web, Becario de Calidad, etc." required />
            </div>

            <div class="form-group">
              <label class="form-label" for="sim-type">Tipo de Entrevista *</label>
              <select id="sim-type" class="form-select">
                <option value="primer_empleo" ${this.config.type === 'primer_empleo' ? 'selected' : ''}>Entrevista para Primer Empleo (Enfocada en potencial y materias)</option>
                <option value="competencias" ${this.config.type === 'competencias' ? 'selected' : ''}>Entrevista por Competencias (Situaciones pasadas y método STAR)</option>
                <option value="tecnica" ${this.config.type === 'tecnica' ? 'selected' : ''}>Entrevista Técnica Inicial (Fundamentos y resolución lógica)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="sim-diff">Nivel de Dificultad</label>
              <select id="sim-diff" class="form-select">
                <option value="facil">Básica (Cálida y guiada para ganar confianza)</option>
                <option value="media" selected>Media (Estándar de reclutamiento profesional corporativo)</option>
                <option value="retadora">Avanzada / Retadora (Preguntas de seguimiento profundo)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Modalidad de Interacción</label>
              <select id="sim-input-mode" class="form-select">
                <option value="text">Escrita por teclado (Ideal para estructurar argumentos)</option>
                <option value="speech">Dictado por voz (Reconocimiento del navegador preparado)</option>
              </select>
            </div>
          </div>

          <div style="background:var(--bg-subtle); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-light); margin-bottom:1.75rem;">
            <h4 style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-bottom:0.25rem;">
              📋 Rúbrica de Evaluación Observable:
            </h4>
            <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.5;">
              Al finalizar se generará un reporte cuantitativo del 1 al 10 en: Claridad, Coherencia, Comunicación, Argumentación, Resolución de problemas, Identificación de habilidades y Relación con el puesto. No afirmamos medir lenguaje corporal ni emociones no observables.
            </p>
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button class="btn btn-primary btn-lg" onclick="LABEXP_VIEWS.interviewSimulator.startSimulation()">
              🎙️ Iniciar Simulación de Entrevista
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Pantalla de la Entrevista en Vivo
  renderInterviewChat: function() {
    return `
      <div style="max-width:900px; margin:0 auto; width:100%; display:flex; flex-direction:column; gap:1.25rem;">
        <!-- Status Bar -->
        <div class="card" style="padding:1rem 1.5rem; display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface);">
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Entrevista en curso</span>
            <div style="font-size:1.05rem; font-weight:700; color:var(--primary-800);">${this.config.role}</div>
          </div>

          <div style="display:flex; align-items:center; gap:1rem;">
            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:var(--text-muted);">Pregunta</span>
              <div style="font-size:0.95rem; font-weight:700; color:var(--text-main);">
                ${this.currentQuestionIndex + 1} de ${this.totalQuestions}
              </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="LABEXP_VIEWS.interviewSimulator.endInterviewPrematurely()">
              Finalizar y Evaluar
            </button>
          </div>
        </div>

        <!-- Chat Container -->
        <div class="chat-container" style="height:540px;">
          <div class="chat-header">
            <div class="chat-partner">
              <div class="chat-partner-avatar" style="background:linear-gradient(135deg, var(--primary-700), var(--primary-900));">
                👔
              </div>
              <div>
                <div style="font-size:0.88rem; font-weight:700; color:var(--text-main);">Reclutador LABEXP (Rol IA)</div>
                <div style="font-size:0.72rem; color:var(--emerald-600); font-weight:600;">Evaluando respuestas estructuradas</div>
              </div>
            </div>
          </div>

          <!-- Messages Stream -->
          <div id="sim-messages-stream" class="chat-messages">
            ${this.conversation.map(m => `
              <div class="chat-bubble ${m.role}">
                ${m.text.replace(/\n/g, '<br/>')}
              </div>
            `).join('')}
          </div>

          <!-- Chat Input -->
          <form class="chat-input-area" onsubmit="LABEXP_VIEWS.interviewSimulator.submitAnswer(event)">
            <textarea id="sim-answer-field" class="form-textarea" rows="2" placeholder="Escribe tu respuesta con la mayor claridad posible (puedes mencionar materias, proyectos o situaciones escolares)..." style="resize:none;" onkeydown="if(event.key==='Enter' && !event.shiftKey){ event.preventDefault(); LABEXP_VIEWS.interviewSimulator.submitAnswer(event); }"></textarea>
            <button type="submit" id="sim-send-btn" class="btn btn-primary" style="padding:0.7rem 1.5rem;">
              Responder
            </button>
          </form>
        </div>
      </div>
    `;
  },

  startSimulation: async function() {
    this.config.role = document.getElementById('sim-role')?.value || 'Trainee';
    this.config.type = document.getElementById('sim-type')?.value || 'primer_empleo';
    this.config.difficulty = document.getElementById('sim-diff')?.value || 'media';

    this.inProgress = true;
    this.isFinished = false;
    this.currentQuestionIndex = 0;
    this.conversation = [];
    this.evaluationReport = null;

    try {
      const step = await LABEXP_API.interviewStep({
        type: this.config.type,
        role: this.config.role,
        questionIndex: 0,
        candidateAnswer: ''
      });

      this.totalQuestions = step.totalQuestions || 5;
      this.conversation.push({
        role: 'assistant',
        text: step.currentQuestion
      });

      LABEXP_STATE.setView('interviewSimulator');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error al iniciar simulación', err.message);
      this.inProgress = false;
    }
  },

  submitAnswer: async function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const field = document.getElementById('sim-answer-field');
    const answer = field.value.trim();
    if (!answer) return;

    field.value = '';
    this.conversation.push({ role: 'user', text: answer });

    const btn = document.getElementById('sim-send-btn');
    if (btn) btn.disabled = true;

    // Show typing
    const stream = document.getElementById('sim-messages-stream');
    const loading = document.createElement('div');
    loading.className = 'chat-bubble assistant';
    loading.id = 'sim-loading-bubble';
    loading.innerHTML = '<em>El reclutador está analizando tu respuesta...</em>';
    if (stream) {
      stream.appendChild(loading);
      stream.scrollTop = stream.scrollHeight;
    }

    try {
      const step = await LABEXP_API.interviewStep({
        type: this.config.type,
        role: this.config.role,
        questionIndex: this.currentQuestionIndex,
        candidateAnswer: answer
      });

      loading.remove();

      if (step.finished && step.evaluation) {
        this.isFinished = true;
        this.inProgress = false;
        this.evaluationReport = step.evaluation;
        LABEXP_STATE.setView('interviewSimulator');
        LABEXP_COMPONENTS.showToast('success', '¡Simulación Completada!', 'Tu reporte de evaluación ya está listo.');
        return;
      }

      this.currentQuestionIndex = step.questionIndex;
      if (step.recruiterFeedback) {
        this.conversation.push({
          role: 'assistant',
          text: `💬 *Observación:* ${step.recruiterFeedback}\n\n${step.currentQuestion}`
        });
      } else {
        this.conversation.push({
          role: 'assistant',
          text: step.currentQuestion
        });
      }

      LABEXP_STATE.setView('interviewSimulator');
    } catch (err) {
      loading.remove();
      LABEXP_COMPONENTS.showToast('error', 'Error en el simulador', err.message);
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  endInterviewPrematurely: async function() {
    this.isFinished = true;
    this.inProgress = false;
    
    // Generate evaluation from backend
    try {
      const step = await LABEXP_API.interviewStep({
        type: this.config.type,
        role: this.config.role,
        questionIndex: 99,
        candidateAnswer: 'Cierre anticipado del candidato.'
      });
      this.evaluationReport = step.evaluation;
      LABEXP_STATE.setView('interviewSimulator');
    } catch (e) {
      LABEXP_STATE.setView('interviewSimulator');
    }
  },

  // Pantalla de Reporte de Evaluación (1 a 10 en 7 Criterios)
  renderEvaluationReport: function() {
    const report = this.evaluationReport || {};
    const scores = report.scores || {};
    const overall = scores.overall || 8.5;

    return `
      <div style="max-width:950px; margin:0 auto; display:flex; flex-direction:column; gap:2rem;">
        <!-- Evaluation Hero Banner -->
        <div class="card" style="padding:2rem; background:linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); color:#ffffff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem;">
          <div>
            <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; letter-spacing:0.05em; opacity:0.9;">
              Reporte de Desempeño Profesional
            </span>
            <h1 style="font-size:1.8rem; font-weight:800; margin:4px 0 8px;">
              Evaluación de Entrevista Simulada
            </h1>
            <p style="font-size:0.88rem; opacity:0.9;">
              Puesto: <strong>${this.config.role}</strong> • Tipo: <strong>${this.config.type}</strong>
            </p>
          </div>

          <div style="background:rgba(255,255,255,0.15); backdrop-filter:blur(8px); padding:1.25rem 2rem; border-radius:var(--radius-lg); text-align:center; border:1px solid rgba(255,255,255,0.25);">
            <div style="font-size:0.78rem; text-transform:uppercase; font-weight:700; opacity:0.9;">Calificación Global</div>
            <div style="font-size:2.8rem; font-weight:900; line-height:1; margin:6px 0;">${overall}</div>
            <div style="font-size:0.75rem; opacity:0.85;">Escala de 1 a 10</div>
          </div>
        </div>

        <!-- 7-Criteria Score Breakdown Matrix -->
        <div class="card">
          <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin-bottom:1rem;">
            📊 Desglose Cuantitativo en los 7 Criterios Evaluados
          </h3>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1.5rem;">
            Basado exclusivamente en la información observable de tus argumentos, coherencia y evidencia escolar proporcionada.
          </p>

          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            ${LABEXP_COMPONENTS.renderInterviewScoreMatrix(scores)}
          </div>
        </div>

        <!-- Strengths & Improvements -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
          <!-- Fortalezas -->
          <div class="card" style="border-top:4px solid var(--emerald-500);">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
              <span style="font-size:1.2rem;">🌟</span>
              <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-main);">Fortalezas Observadas</h3>
            </div>
            <ul style="padding-left:1.25rem; font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
              ${(report.strengths || []).map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>

          <!-- Áreas por Mejorar -->
          <div class="card" style="border-top:4px solid var(--amber-500);">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
              <span style="font-size:1.2rem;">🎯</span>
              <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-main);">Aspectos por Mejorar (STAR)</h3>
            </div>
            <ul style="padding-left:1.25rem; font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
              ${(report.improvements || []).map(imp => `<li>${imp}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Practical Recommendations for Real Interviews -->
        <div class="card">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:1rem;">
            💡 Consejos Prácticos para tus Próximas Entrevistas Reales
          </h3>
          <ul style="padding-left:1.25rem; font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:1.5rem;">
            ${(report.recommendations || []).map(r => `<li>${r}</li>`).join('')}
          </ul>

          <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
            <div style="font-size:0.82rem; font-weight:700; color:var(--primary-800); margin-bottom:0.25rem;">
              Ejemplo de Respuesta Mejorada (Método STAR):
            </div>
            <p style="font-size:0.82rem; color:var(--text-secondary); font-style:italic;">
              "${report.improvedAnswerExamples?.[0]?.suggestedResponse || 'En mis proyectos escolares he demostrado compromiso, entrega puntual y trabajo en equipo comprobable...'}"
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button class="btn btn-outline" onclick="LABEXP_STATE.setView('dashboard')">
            ← Volver al Dashboard
          </button>
          <button class="btn btn-primary" onclick="LABEXP_VIEWS.interviewSimulator.startNewSession()">
            🎙️ Practicar Otra Entrevista
          </button>
        </div>
      </div>
    `;
  },

  startNewSession: function() {
    this.inProgress = false;
    this.isFinished = false;
    this.evaluationReport = null;
    LABEXP_STATE.setView('interviewSimulator');
  }
};
