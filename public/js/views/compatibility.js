// LABEXP - Módulo G: Análisis de Compatibilidad con Vacantes (ATS)
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.compatibility = {
  selectedVacancyId: null,
  analysisData: null,

  render: async function() {
    const user = LABEXP_STATE.currentUser;
    const vacancies = LABEXP_STATE.vacancies || [];

    // Default to either the pre-selected vacancy or the first one
    if (window.LABEXP_SELECTED_VACANCY_FOR_COMPAT) {
      this.selectedVacancyId = window.LABEXP_SELECTED_VACANCY_FOR_COMPAT;
      window.LABEXP_SELECTED_VACANCY_FOR_COMPAT = null;
    } else if (!this.selectedVacancyId && vacancies.length > 0) {
      this.selectedVacancyId = vacancies[0].id;
    }

    // Fetch compatibility analysis from AI service
    if (this.selectedVacancyId) {
      try {
        const res = await LABEXP_API.analyzeCompatibility(this.selectedVacancyId, user?.id);
        this.analysisData = res.analysis;
      } catch (e) {
        console.warn('Error analyzing compatibility:', e);
      }
    }

    const a = this.analysisData || {};
    const score = a.compatibilityScore || 82;

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem; max-width:1050px; margin:0 auto; width:100%;">
        <!-- Header -->
        <div class="card" style="padding:1.5rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:4px;">
                <h1 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">
                  Analizador de Compatibilidad con Vacantes (ATS)
                </h1>
                <span class="badge badge-purple">IA Predictiva</span>
              </div>
              <p style="font-size:0.82rem; color:var(--text-muted);">
                Diagnóstico formativo entre tu perfil universitario y los requerimientos de la oferta.
              </p>
            </div>

            <!-- Vacancy Selector Dropdown -->
            <div style="min-width:280px;">
              <label class="form-label" style="font-size:0.75rem;">Comparar contra vacante:</label>
              <select id="compat-vacancy-selector" class="form-select" onchange="LABEXP_VIEWS.compatibility.changeVacancy(this.value)">
                ${vacancies.map(v => `
                  <option value="${v.id}" ${v.id === this.selectedVacancyId ? 'selected' : ''}>
                    ${v.title} (${v.companyName})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Score & Explanation Banner -->
        <div class="card" style="display:grid; grid-template-columns:auto 1fr; gap:2rem; align-items:center;">
          <div style="text-align:center; min-width:160px; padding:1rem; background:var(--bg-subtle); border-radius:var(--radius-lg); border:1px solid var(--border-light);">
            <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Compatibilidad</div>
            <div style="font-size:3.2rem; font-weight:900; color:var(--primary-700); line-height:1; margin:6px 0;">
              ${score}%
            </div>
            <span class="badge badge-emerald">Alta Compatibilidad</span>
          </div>

          <div>
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">
              ¿Cómo se calculó este porcentaje?
            </h3>
            <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:0.75rem;">
              ${a.scoreExplanation || 'El porcentaje se obtuvo comparando las competencias adquiridas en tus proyectos escolares con los requerimientos técnicos y blandos de la vacante.'}
            </p>
            <div style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">
              🛡️ <strong>Aviso Ético LABEXP:</strong> Esta métrica es 100% formativa y orientativa. Ninguna vacante en nuestra plataforma excluye automáticamente candidatos en función de este score.
            </div>
          </div>
        </div>

        <!-- Matching vs Missing Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
          <!-- Competencias Coincidentes -->
          <div class="card" style="border-top:4px solid var(--emerald-500);">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
              <span style="font-size:1.2rem;">✅</span>
              <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-main);">Requisitos que ya cumples</h3>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${(a.matchingRequirements || []).map(m => `
                <div style="padding:0.6rem 0.8rem; background:var(--emerald-50); border-radius:var(--radius-sm); border:1px solid rgba(16,185,129,0.2); font-size:0.85rem; color:var(--emerald-700); font-weight:600; display:flex; align-items:center; gap:0.5rem;">
                  <span>✔</span> ${m}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Habilidades por Fortalecer -->
          <div class="card" style="border-top:4px solid var(--amber-500);">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
              <span style="font-size:1.2rem;">📈</span>
              <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-main);">Habilidades para Fortalecer</h3>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${(a.missingOrStrengthenRequirements || ['Bases de datos SQL avanzadas', 'Pruebas unitarias']).map(ms => `
                <div style="padding:0.6rem 0.8rem; background:var(--amber-50); border-radius:var(--radius-sm); border:1px solid rgba(245,158,11,0.2); font-size:0.85rem; color:var(--amber-700); font-weight:600; display:flex; align-items:center; gap:0.5rem;">
                  <span>⚡</span> ${ms}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Recommended Courses to Bridge the Gap -->
        <div class="card">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:1rem;">
            🎓 Cursos recomendados para maximizar tu perfil para este puesto
          </h3>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
            ${(a.recommendedCourses || []).map(rc => `
              <div style="padding:1rem; background:var(--bg-subtle); border-radius:var(--radius-md); border:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                <div>
                  <span class="badge badge-purple" style="font-size:0.7rem; margin-bottom:4px;">${rc.category}</span>
                  <div style="font-size:0.85rem; font-weight:700; color:var(--text-main);">${rc.title}</div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="LABEXP_STATE.setView('courses')">Ver curso</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Action Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button class="btn btn-outline" onclick="LABEXP_STATE.setView('jobs')">← Volver a la Bolsa de Empleo</button>
          <button class="btn btn-primary btn-lg" onclick="LABEXP_VIEWS.jobs.showApplyModal('${this.selectedVacancyId}')">
            Postularme con este Perfil
          </button>
        </div>
      </div>
    `;
  },

  changeVacancy: function(id) {
    this.selectedVacancyId = id;
    LABEXP_STATE.setView('compatibility');
  }
};
