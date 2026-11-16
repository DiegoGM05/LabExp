// LABEXP - Módulo H: Mis Postulaciones (8 Estados de Selección)
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.applications = {
  activeStatusFilter: 'all',

  render: async function() {
    const user = LABEXP_STATE.currentUser;
    let applications = [];

    try {
      const res = await LABEXP_API.getApplications({ userId: user?.id });
      applications = res.applications || [];
      LABEXP_STATE.applications = applications;
    } catch (e) {
      console.warn('Error fetching applications:', e);
    }

    let filtered = [...applications];
    if (this.activeStatusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === this.activeStatusFilter);
    }

    const statusesList = [
      'all', 'Guardada', 'Enviada', 'Recibida', 'En revisión',
      'Entrevista programada', 'En proceso', 'Seleccionado', 'No seleccionado'
    ];

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <!-- Header -->
        <div class="card" style="padding:1.5rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
            <div class="brand-icon" style="width:40px; height:40px;">
              ${LABEXP_COMPONENTS.icons.applications}
            </div>
            <div>
              <h1 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">
                Seguimiento de Procesos de Selección
              </h1>
              <p style="font-size:0.82rem; color:var(--text-muted);">
                Monitorea en tiempo real las respuestas de las empresas en las 8 etapas del pipeline de contratación.
              </p>
            </div>
          </div>

          <!-- Status Filter Pills -->
          <div style="display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:6px;">
            ${statusesList.map(st => `
              <button class="role-pill ${this.activeStatusFilter === st ? 'active' : ''}" style="white-space:nowrap;" onclick="LABEXP_VIEWS.applications.filterByStatus('${st}')">
                ${st === 'all' ? 'Todas las postulaciones' : st}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Applications Pipeline List -->
        ${filtered.length === 0 ? `
          <div class="card" style="text-align:center; padding:3.5rem 1.5rem;">
            <div style="font-size:3rem; margin-bottom:1rem;">📬</div>
            <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">No tienes postulaciones con este estado</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); max-width:450px; margin:0 auto 1.5rem;">
              Revisa nuestras vacantes activas y postúlate a puestos pensados para perfiles universitarios.
            </p>
            <button class="btn btn-primary" onclick="LABEXP_STATE.setView('jobs')">Explorar vacantes</button>
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            ${filtered.map(app => {
              const appliedDate = new Date(app.appliedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
              const updatedDate = new Date(app.updatedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

              return `
                <div class="card" style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem;">
                    <div>
                      <div style="font-size:0.82rem; font-weight:600; color:var(--text-muted);">${app.companyName}</div>
                      <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main);">${app.vacancyTitle}</h3>
                      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
                        Postulado el: ${appliedDate} • Última actualización: ${updatedDate}
                      </div>
                    </div>
                    <div>
                      ${LABEXP_COMPONENTS.renderApplicationBadge(app.status)}
                    </div>
                  </div>

                  <!-- Notes & Scheduled Interview Section -->
                  ${app.status === 'Entrevista programada' && app.interviewScheduledFor ? `
                    <div style="background:var(--emerald-50); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-md); padding:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                      <div>
                        <div style="font-size:0.85rem; font-weight:700; color:var(--emerald-700);">
                          🗓️ ¡Entrevista agendada por el reclutador!
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">
                          Fecha: <strong>${new Date(app.interviewScheduledFor).toLocaleString('es-MX')}</strong>
                        </div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">
                          Tipo: ${app.interviewType || 'Videollamada por Google Meet'}
                        </div>
                      </div>
                      <button class="btn btn-emerald btn-sm" onclick="LABEXP_STATE.setView('interviewSimulator')">
                        🎙️ Ensayar en el Simulador
                      </button>
                    </div>
                  ` : ''}

                  <!-- Cover Note & Recruiter Feedback -->
                  <div style="background:var(--bg-subtle); padding:0.9rem 1.1rem; border-radius:var(--radius-md); font-size:0.82rem; color:var(--text-secondary);">
                    ${app.coverNote ? `
                      <div style="margin-bottom:0.5rem;">
                        <strong>Tu nota de postulación:</strong> "${app.coverNote}"
                      </div>
                    ` : ''}
                    <div>
                      <strong>Comentarios del reclutador:</strong> ${app.recruiterNotes || 'Tu postulación se encuentra registrada en el portal corporativo.'}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  },

  filterByStatus: function(status) {
    this.activeStatusFilter = status;
    LABEXP_STATE.setView('applications');
  }
};
