// LABEXP - Módulo C: Asistente IA para Crear Currículums
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.cvBuilder = {
  activeTemplate: 'modern-purple',
  cvData: null,

  render: async function() {
    const user = LABEXP_STATE.currentUser;
    let cv = LABEXP_STATE.activeCv;

    if (!cv) {
      try {
        const res = await LABEXP_API.getCv(user?.id);
        cv = res.cv;
        LABEXP_STATE.activeCv = cv;
      } catch (e) {
        console.warn('Error fetching CV:', e);
      }
    }

    this.cvData = cv ? cv.data : null;
    const personal = this.cvData?.personal || {};
    const projects = this.cvData?.academicProjects || [];
    const skills = this.cvData?.skills || { technical: [], soft: [] };
    const languages = this.cvData?.languages || [];

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <!-- Top Toolbar -->
        <div class="card" style="padding:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);">
          <div style="width:100%; max-width:100%;">
            <div style="display:flex; align-items:center; flex-wrap:wrap; gap:0.4rem; margin-bottom:4px;">
              <h1 style="font-size:clamp(1.1rem, 4vw, 1.35rem); font-weight:800; color:var(--text-main); word-break:break-word;">Creador de CV con Asistente IA</h1>
              <span class="badge badge-purple" style="white-space:normal; font-size:0.72rem; line-height:1.2;">Especializado en Universitarios</span>
            </div>
            <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.3;">
              Convierte tus proyectos y materias en evidencia profesional atractiva para reclutadores.
            </p>
          </div>

          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; width:100%; max-width:100%;">
            <select id="cv-template-select" class="form-select" style="flex:1; min-width:130px; padding:0.45rem 0.6rem; font-size:0.8rem;" onchange="LABEXP_VIEWS.cvBuilder.changeTemplate(this.value)">
              <option value="modern-purple" ${this.activeTemplate === 'modern-purple' ? 'selected' : ''}>Plantilla: Modern Purple</option>
              <option value="minimal-slate" ${this.activeTemplate === 'minimal-slate' ? 'selected' : ''}>Plantilla: Minimal Slate</option>
            </select>
            <button class="btn btn-emerald btn-sm" onclick="LABEXP_VIEWS.cvBuilder.printCv()" style="flex:1; min-width:125px; padding:0.45rem 0.65rem;" title="Descargar o imprimir PDF">
              ${LABEXP_COMPONENTS.icons.download} <span>Descargar PDF</span>
            </button>
            <button class="btn btn-primary btn-sm" onclick="LABEXP_VIEWS.cvBuilder.saveCv()" style="flex:1; min-width:105px; padding:0.45rem 0.65rem;">
              💾 Guardar CV
            </button>
          </div>
        </div>

        <!-- Split View: AI Assistant Column + Live Document Preview Column -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap:1.25rem;">
          
          <!-- Column 1: AI CV Assistant & Optimizer -->
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <!-- AI Panel Card -->
            <div class="card" style="border-top:4px solid var(--primary-600);">
              <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
                <div class="brand-icon" style="width:36px; height:36px;">
                  ${LABEXP_COMPONENTS.icons.aiBot}
                </div>
                <div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-main);">Asistente IA de Redacción Curricular</h3>
                  <div style="font-size:0.75rem; color:var(--emerald-600); font-weight:600;">● Especialista en perfiles sin experiencia laboral</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">¿Qué sección deseas crear u optimizar?</label>
                <select id="ai-cv-section-select" class="form-select" style="font-size:0.85rem;">
                  <option value="resumen_profesional">Resumen Profesional (Perfil de impacto)</option>
                  <option value="proyecto_academico">Proyecto Académico / Tarea final universitaria</option>
                  <option value="servicio_social">Servicio Social / Voluntariado</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Texto o borrador actual</label>
                <textarea id="ai-cv-input-text" class="form-textarea" rows="3" placeholder="Escribe aquí tus ideas o lo que hiciste en la universidad (ej. Hice una app en equipo para una materia y usamos JavaScript)..."></textarea>
              </div>

              <!-- Quick Action Buttons -->
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
                <button class="btn btn-secondary btn-sm" onclick="LABEXP_VIEWS.cvBuilder.quickFillPrompt('resumen')">
                  💡 Ejemplo de Resumen
                </button>
                <button class="btn btn-secondary btn-sm" onclick="LABEXP_VIEWS.cvBuilder.quickFillPrompt('proyecto')">
                  💡 Ejemplo de Proyecto
                </button>
              </div>

              <button class="btn btn-primary" id="ai-cv-optimize-btn" onclick="LABEXP_VIEWS.cvBuilder.optimizeWithAi()" style="width:100%;">
                ✨ Optimizar Redacción con IA
              </button>

              <!-- AI Output Display Box -->
              <div id="ai-cv-result-box" style="display:none; margin-top:1.25rem; padding:1.25rem; background:var(--bg-subtle); border-radius:var(--radius-md); border:1px solid var(--border-light);">
                <div style="font-size:0.75rem; font-weight:700; color:var(--primary-700); text-transform:uppercase; margin-bottom:0.5rem;">
                  Sugerencia de Optimización Generada
                </div>
                <div id="ai-cv-diagnostic" style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem; font-style:italic;"></div>
                <div id="ai-cv-improved-text" style="font-size:0.88rem; color:var(--text-main); line-height:1.5; background:#ffffff; padding:0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border-light); margin-bottom:0.75rem; font-weight:500;"></div>
                
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div id="ai-cv-keywords" style="display:flex; gap:0.35rem; flex-wrap:wrap;"></div>
                  <button class="btn btn-primary btn-sm" onclick="LABEXP_VIEWS.cvBuilder.applyAiSuggestionToCv()">
                    Copiar al CV
                  </button>
                </div>
              </div>
            </div>

            <!-- Manual Quick Editor Controls -->
            <div class="card">
              <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:1rem;">
                ✏️ Editar Campos del Currículum
              </h4>

              <div class="form-group">
                <label class="form-label">Titular Profesional</label>
                <input type="text" id="edit-cv-headline" class="form-input" value="${personal.headline || ''}" oninput="LABEXP_VIEWS.cvBuilder.syncPreview()" />
              </div>

              <div class="form-group">
                <label class="form-label">Resumen Profesional</label>
                <textarea id="edit-cv-summary" class="form-textarea" rows="4" oninput="LABEXP_VIEWS.cvBuilder.syncPreview()">${personal.summary || ''}</textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Habilidades Técnicas (separadas por comas)</label>
                <input type="text" id="edit-cv-tech" class="form-input" value="${(skills.technical || []).join(', ')}" oninput="LABEXP_VIEWS.cvBuilder.syncPreview()" />
              </div>

              <div class="form-group">
                <label class="form-label">Habilidades Blandas (separadas por comas)</label>
                <input type="text" id="edit-cv-soft" class="form-input" value="${(skills.soft || []).join(', ')}" oninput="LABEXP_VIEWS.cvBuilder.syncPreview()" />
              </div>
            </div>
          </div>

          <!-- Column 2: Printable Curriculum Document Preview -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
                📄 Vista Previa en Tiempo Real (Formato A4 / Imprimible)
              </span>
              <span style="font-size:0.75rem; color:var(--primary-700); font-weight:600;">
                Plantilla: <span id="active-template-label">${this.activeTemplate}</span>
              </span>
            </div>

            <div id="cv-paper-preview" class="cv-paper template-${this.activeTemplate}">
              <!-- Header -->
              <div style="margin-bottom:1.25rem;">
                <div class="cv-header-name" id="preview-name">${personal.fullName || user?.fullName || 'Nombre del Candidato'}</div>
                <div class="cv-header-title" id="preview-headline">${personal.headline || 'Estudiante Universitario'}</div>
                
                <div class="cv-contact-row">
                  <span>✉️ ${personal.email || user?.email || 'correo@ejemplo.com'}</span>
                  <span>📱 ${personal.phone || '+52 55 4123 9876'}</span>
                  <span>📍 ${personal.location || 'Ciudad de México, México'}</span>
                  <span>🔗 github.com/estudiante</span>
                </div>
              </div>

              <!-- Resumen -->
              <div style="margin-bottom:1.5rem;">
                <div class="cv-section-title">Perfil Profesional</div>
                <p id="preview-summary" style="font-size:0.85rem; color:#334155; line-height:1.6; text-align:justify;">
                  ${personal.summary || 'Estudiante comprometido con el desarrollo de soluciones funcionales y aprendizaje continuo.'}
                </p>
              </div>

              <!-- Formación Universitaria -->
              <div style="margin-bottom:1.5rem;">
                <div class="cv-section-title">Educación y Formación Universitaria</div>
                <div style="margin-bottom:0.75rem;">
                  <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.9rem; color:#0f172a;">
                    <span>Universidad Nacional Autónoma de México (UNAM)</span>
                    <span style="color:#64748b; font-weight:500;">2023 - 2027 (En curso)</span>
                  </div>
                  <div style="font-size:0.84rem; color:var(--primary-700); font-weight:600;">Ingeniería en Computación (8vo Semestre)</div>
                  <div style="font-size:0.78rem; color:#64748b;">Promedio destacado: 9.2 / 10.0</div>
                </div>
              </div>

              <!-- Proyectos Académicos Relevantes -->
              <div style="margin-bottom:1.5rem;">
                <div class="cv-section-title">Proyectos Académicos Destacados</div>
                ${projects.map(proj => `
                  <div style="margin-bottom:1rem;">
                    <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.88rem; color:#0f172a;">
                      <span>${proj.name}</span>
                      <span style="color:#64748b; font-weight:500; font-size:0.78rem;">${proj.period || 'Académico'}</span>
                    </div>
                    <div style="font-size:0.8rem; color:var(--primary-700); font-weight:600; margin-bottom:4px;">Rol: ${proj.role}</div>
                    <ul style="padding-left:1.25rem; font-size:0.82rem; color:#334155; line-height:1.5;">
                      ${(proj.achievements || []).map(ach => `<li>${ach}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>

              <!-- Habilidades y Competencias -->
              <div style="margin-bottom:1.5rem;">
                <div class="cv-section-title">Competencias y Habilidades</div>
                <div style="margin-bottom:0.5rem;">
                  <strong style="font-size:0.82rem; color:#0f172a;">Habilidades Técnicas:</strong>
                  <span id="preview-tech-skills" style="font-size:0.82rem; color:#475569;">
                    ${(skills.technical || []).join(' • ')}
                  </span>
                </div>
                <div>
                  <strong style="font-size:0.82rem; color:#0f172a;">Habilidades Personales:</strong>
                  <span id="preview-soft-skills" style="font-size:0.82rem; color:#475569;">
                    ${(skills.soft || []).join(' • ')}
                  </span>
                </div>
              </div>

              <!-- Idiomas y Extracurriculares -->
              <div>
                <div class="cv-section-title">Idiomas y Liderazgo Estudiantil</div>
                <div style="font-size:0.82rem; color:#334155; line-height:1.6;">
                  <div>• <strong>Español:</strong> Nativo | <strong>Inglés:</strong> B2 (Intermedio Avanzado - Comprensión técnica)</div>
                  <div>• Miembro de la Rama Estudiantil de Computación (Coordinadora de Talleres)</div>
                  <div>• Voluntariado Comunitario en Alfabetización Digital</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  syncPreview: function() {
    const hl = document.getElementById('edit-cv-headline')?.value;
    const sm = document.getElementById('edit-cv-summary')?.value;
    const tech = document.getElementById('edit-cv-tech')?.value;
    const soft = document.getElementById('edit-cv-soft')?.value;

    const prevHl = document.getElementById('preview-headline');
    const prevSm = document.getElementById('preview-summary');
    const prevTech = document.getElementById('preview-tech-skills');
    const prevSoft = document.getElementById('preview-soft-skills');

    if (prevHl && hl) prevHl.textContent = hl;
    if (prevSm && sm) prevSm.textContent = sm;
    if (prevTech && tech) prevTech.textContent = tech.split(',').map(s => s.trim()).join(' • ');
    if (prevSoft && soft) prevSoft.textContent = soft.split(',').map(s => s.trim()).join(' • ');
  },

  changeTemplate: function(tpl) {
    this.activeTemplate = tpl;
    const paper = document.getElementById('cv-paper-preview');
    const label = document.getElementById('active-template-label');
    if (paper) {
      paper.className = `cv-paper template-${tpl}`;
    }
    if (label) {
      label.textContent = tpl;
    }
  },

  quickFillPrompt: function(type) {
    const sectionSelect = document.getElementById('ai-cv-section-select');
    const inputArea = document.getElementById('ai-cv-input-text');

    if (type === 'resumen') {
      sectionSelect.value = 'resumen_profesional';
      inputArea.value = 'Soy estudiante de computación, me gusta programar en React y Python y quiero encontrar mi primer trabajo donde me enseñen y pueda ayudar.';
    } else {
      sectionSelect.value = 'proyecto_academico';
      inputArea.value = 'Hice un proyecto de fin de semestre que era una página de reciclaje para ubicar puntos verdes con mapas. Yo programé la parte de enfrente en JavaScript.';
    }
  },

  optimizeWithAi: async function() {
    const section = document.getElementById('ai-cv-section-select').value;
    const text = document.getElementById('ai-cv-input-text').value.trim();
    const btn = document.getElementById('ai-cv-optimize-btn');
    const resultBox = document.getElementById('ai-cv-result-box');

    if (!text) {
      LABEXP_COMPONENTS.showToast('error', 'Campo vacío', 'Por favor ingresa un borrador o ideas para optimizar.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Analizando con IA de LABEXP...';

    try {
      const res = await LABEXP_API.optimizeCvWithAi({
        section,
        text,
        profileData: LABEXP_STATE.currentProfile
      });

      resultBox.style.display = 'block';
      document.getElementById('ai-cv-diagnostic').textContent = `Diagnóstico: "${res.diagnostic || 'Redacción analizada'}"`;
      document.getElementById('ai-cv-improved-text').textContent = res.improvedText || res.text;
      
      const kwBox = document.getElementById('ai-cv-keywords');
      kwBox.innerHTML = (res.keywords || []).map(k => `<span class="badge badge-purple">${k}</span>`).join('');

      window.LABEXP_LAST_AI_CV_SUGGESTION = {
        section,
        text: res.improvedText || res.text
      };

      LABEXP_COMPONENTS.showToast('success', 'Optimización lista', 'Revisa la redacción mejorada y haz clic en Copiar al CV.');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error de IA', err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '✨ Optimizar Redacción con IA';
    }
  },

  applyAiSuggestionToCv: function() {
    const sugg = window.LABEXP_LAST_AI_CV_SUGGESTION;
    if (!sugg) return;

    if (sugg.section === 'resumen_profesional') {
      const editInput = document.getElementById('edit-cv-summary');
      if (editInput) {
        editInput.value = sugg.text;
        this.syncPreview();
        LABEXP_COMPONENTS.showToast('success', 'Aplicado al CV', 'Tu resumen profesional ha sido actualizado.');
      }
    } else {
      LABEXP_COMPONENTS.showToast('info', 'Texto copiado', 'Puedes pegar la redacción en la sección de tus proyectos.');
    }
  },

  saveCv: async function() {
    const user = LABEXP_STATE.currentUser;
    const headline = document.getElementById('edit-cv-headline')?.value;
    const summary = document.getElementById('edit-cv-summary')?.value;
    const tech = document.getElementById('edit-cv-tech')?.value.split(',').map(s => s.trim()).filter(Boolean);
    const soft = document.getElementById('edit-cv-soft')?.value.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const payload = {
        userId: user?.id,
        template: this.activeTemplate,
        data: {
          ...this.cvData,
          personal: {
            ...this.cvData?.personal,
            headline,
            summary
          },
          skills: {
            technical: tech,
            soft: soft
          }
        }
      };

      const res = await LABEXP_API.updateCv(payload);
      LABEXP_STATE.activeCv = res.cv;
      LABEXP_COMPONENTS.showToast('success', 'Currículum Guardado', 'Los cambios en tu CV se han guardado con éxito.');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error al guardar CV', err.message);
    }
  },

  printCv: function() {
    window.print();
  }
};
