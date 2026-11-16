// LABEXP - Panel de Administración & Supervisión
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.adminPortal = {
  render: async function() {
    let metrics = {};
    let auditLogs = [];
    let companies = [];

    try {
      const [mRes, cRes] = await Promise.all([
        LABEXP_API.getAdminMetrics(),
        LABEXP_API.getCompanies()
      ]);
      metrics = mRes.metrics || {};
      auditLogs = mRes.auditLogs || [];
      companies = cRes.companies || [];
    } catch (e) {
      console.warn('Error fetching admin data:', e);
    }

    const aiStatus = metrics.aiStatus || {};

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <!-- Header -->
        <div class="card" style="padding:1.5rem 2rem; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.15); padding:3px 10px; border-radius:var(--radius-full); font-size:0.75rem; font-weight:700; margin-bottom:0.5rem;">
              <span>🛡️ Módulo de Supervisión y Auditoría</span>
            </div>
            <h1 style="font-size:1.4rem; font-weight:800;">Panel de Control Administrativo</h1>
            <p style="font-size:0.82rem; opacity:0.85;">
              Supervisión de usuarios, moderación de vacantes y verificación documental de empresas.
            </p>
          </div>

          <!-- AI Status Pill -->
          <div style="background:rgba(255,255,255,0.1); padding:0.75rem 1.25rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.2); text-align:right;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; opacity:0.8;">Motor IA de la Plataforma</div>
            <div style="font-size:0.95rem; font-weight:800; color:${aiStatus.isLiveConfigured ? '#34d399' : '#a78bfa'};">
              ${aiStatus.isLiveConfigured ? '🟢 Google Gemini (Live API)' : '🟣 Motor Local Inteligente'}
            </div>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.25rem;">
          <div class="card" style="padding:1.25rem;">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Candidatos Jóvenes</span>
            <div style="font-size:1.8rem; font-weight:800; color:var(--primary-700); margin:4px 0;">${metrics.candidates || 1}</div>
            <span style="font-size:0.75rem; color:var(--emerald-600);">● Perfiles universitarios activos</span>
          </div>

          <div class="card" style="padding:1.25rem;">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Empresas Aliadas</span>
            <div style="font-size:1.8rem; font-weight:800; color:var(--text-main); margin:4px 0;">${metrics.totalCompanies || 5}</div>
            <span style="font-size:0.75rem; color:var(--emerald-600);">● ${metrics.verifiedCompanies || 4} verificadas formalmente</span>
          </div>

          <div class="card" style="padding:1.25rem;">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Vacantes Publicadas</span>
            <div style="font-size:1.8rem; font-weight:800; color:var(--primary-700); margin:4px 0;">${metrics.totalVacancies || 6}</div>
            <span style="font-size:0.75rem; color:var(--text-muted);">Sin barrera de experiencia</span>
          </div>

          <div class="card" style="padding:1.25rem;">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Postulaciones Totales</span>
            <div style="font-size:1.8rem; font-weight:800; color:var(--emerald-600); margin:4px 0;">${metrics.totalApplications || 2}</div>
            <span style="font-size:0.75rem; color:var(--text-muted);">En las 8 etapas del pipeline</span>
          </div>
        </div>

        <!-- Verification of Companies Table -->
        <div class="card" style="padding:1.75rem;">
          <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">
            🏢 Gestión y Verificación Legal de Empresas
          </h3>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1.25rem;">
            Garantiza que las ofertas de empleo procedan de razones sociales legítimas para proteger a los jóvenes.
          </p>

          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
              <thead>
                <tr style="border-bottom:2px solid var(--border-light); color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">
                  <th style="padding:0.75rem;">Empresa</th>
                  <th style="padding:0.75rem;">Giro / Industria</th>
                  <th style="padding:0.75rem;">Ubicación</th>
                  <th style="padding:0.75rem;">Estado Legal</th>
                  <th style="padding:0.75rem; text-align:right;">Acción</th>
                </tr>
              </thead>
              <tbody>
                ${companies.map(c => `
                  <tr style="border-bottom:1px solid var(--border-light);">
                    <td style="padding:0.85rem; font-weight:700; color:var(--text-main);">
                      ${c.name}
                      <div style="font-size:0.72rem; color:var(--text-muted); font-weight:normal;">${c.legalName || ''}</div>
                    </td>
                    <td style="padding:0.85rem; color:var(--text-secondary);">${c.industry}</td>
                    <td style="padding:0.85rem; color:var(--text-muted);">${c.location}</td>
                    <td style="padding:0.85rem;">
                      ${c.verified ? `<span class="badge badge-emerald">✔ Verificada</span>` : `<span class="badge badge-amber">⚠️ Pendiente de revisión</span>`}
                    </td>
                    <td style="padding:0.85rem; text-align:right;">
                      <button class="btn ${c.verified ? 'btn-outline' : 'btn-emerald'} btn-sm" onclick="LABEXP_VIEWS.adminPortal.toggleVerifyCompany('${c.id}', ${!c.verified})">
                        ${c.verified ? 'Revocar Verificación' : 'Aprobar Verificación'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Audit Trail Logs -->
        <div class="card" style="padding:1.75rem;">
          <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">
            📜 Registro de Auditoría y Cumplimiento Normativo
          </h3>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1.25rem;">
            Trazabilidad de acciones de moderación y verificación en cumplimiento con la legislación mexicana.
          </p>

          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${auditLogs.map(log => `
              <div style="padding:0.75rem 1rem; background:var(--bg-subtle); border-radius:var(--radius-sm); border:1px solid var(--border-light); font-size:0.8rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                  <span class="badge badge-purple" style="font-size:0.7rem; margin-right:6px;">${log.action}</span>
                  <strong>${log.target}</strong>: ${log.details}
                </div>
                <span style="color:var(--text-muted); font-size:0.75rem;">${new Date(log.timestamp).toLocaleString('es-MX')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  toggleVerifyCompany: async function(companyId, verified) {
    try {
      await LABEXP_API.verifyCompany(companyId, verified);
      LABEXP_COMPONENTS.showToast('success', 'Estado modificado', verified ? 'Empresa verificada exitosamente.' : 'Verificación revocada.');
      LABEXP_STATE.setView('adminPortal');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error al verificar', err.message);
    }
  }
};
