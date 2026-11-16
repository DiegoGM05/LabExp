// LABEXP - Módulo J: Centro de Notificaciones
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.notifications = {
  render: async function() {
    const user = LABEXP_STATE.currentUser;
    let notifs = [];

    try {
      const res = await LABEXP_API.getNotifications(user?.id);
      notifs = res.notifications || [];
      LABEXP_STATE.notifications = notifs;
      LABEXP_STATE.unreadNotificationsCount = res.unread || 0;
    } catch (e) {
      console.warn('Error fetching notifications:', e);
    }

    return `
      <div style="max-width:850px; margin:0 auto; display:flex; flex-direction:column; gap:1.75rem; width:100%;">
        <!-- Header -->
        <div class="card" style="padding:1.5rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="brand-icon" style="width:40px; height:40px;">
              ${LABEXP_COMPONENTS.icons.notifications}
            </div>
            <div>
              <h1 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">
                Centro de Notificaciones
              </h1>
              <p style="font-size:0.82rem; color:var(--text-muted);">
                Avisos sobre el avance de tus postulaciones, entrevistas y vacantes sugeridas.
              </p>
            </div>
          </div>

          <button class="btn btn-outline btn-sm" onclick="LABEXP_VIEWS.notifications.markAllAsRead()">
            Marcar todas como leídas
          </button>
        </div>

        <!-- Notification List -->
        ${notifs.length === 0 ? `
          <div class="card" style="text-align:center; padding:3rem 1.5rem;">
            <p style="font-size:0.9rem; color:var(--text-muted);">No tienes notificaciones en este momento.</p>
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${notifs.map(n => {
              const iconMap = {
                interview: '🗓️',
                vacancy: '💼',
                course: '🎓',
                application: '📬'
              };
              const icon = iconMap[n.type] || '🔔';

              return `
                <div class="card" style="padding:1.25rem; display:flex; gap:1rem; align-items:flex-start; ${!n.read ? 'border-left:4px solid var(--primary-600); background:#faf5ff;' : ''}">
                  <span style="font-size:1.5rem; line-height:1;">${icon}</span>
                  <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                      <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main);">${n.title}</h4>
                      <span style="font-size:0.72rem; color:var(--text-muted);">${new Date(n.createdAt).toLocaleDateString('es-MX')}</span>
                    </div>
                    <p style="font-size:0.83rem; color:var(--text-secondary); line-height:1.4; margin-bottom:0.5rem;">
                      ${n.message}
                    </p>
                    <div style="display:flex; gap:0.5rem;">
                      <button class="btn btn-secondary btn-sm" onclick="LABEXP_VIEWS.notifications.handleAction('${n.link}', '${n.id}')">
                        Ver detalle >
                      </button>
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

  markAllAsRead: async function() {
    const user = LABEXP_STATE.currentUser;
    try {
      await LABEXP_API.markNotificationRead('all', user?.id);
      LABEXP_COMPONENTS.showToast('info', 'Notificaciones leídas', 'Todas las notificaciones fueron marcadas.');
      LABEXP_STATE.setView('notifications');
    } catch (e) {
      console.warn(e);
    }
  },

  handleAction: async function(link, notifId) {
    const user = LABEXP_STATE.currentUser;
    try {
      await LABEXP_API.markNotificationRead(notifId, user?.id);
    } catch (e) {}
    
    if (link) {
      LABEXP_STATE.setView(link);
    }
  }
};
