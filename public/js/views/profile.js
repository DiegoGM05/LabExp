// LABEXP - Módulo A: Perfil Profesional
window.LABEXP_VIEWS = window.LABEXP_VIEWS || {};

window.LABEXP_VIEWS.profile = {
  render: async function() {
    const user = LABEXP_STATE.currentUser;
    let profile = LABEXP_STATE.currentProfile;

    if (!profile) {
      try {
        const res = await LABEXP_API.getProfile(user?.id);
        profile = res.profile;
        LABEXP_STATE.currentProfile = profile;
      } catch (e) {
        console.warn('Error fetching profile:', e);
        profile = {};
      }
    }

    const completion = profile.completionPercentage || 85;

    return `
      <div style="display:flex; flex-direction:column; gap:2rem;">
        <!-- Header & Completion Gauge -->
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.25rem; background:linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%); border-color:var(--primary-200);">
          <div style="display:flex; align-items:center; flex-wrap:wrap; gap:1rem; width:100%; max-width:100%;">
            <img src="${user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}" alt="Avatar" style="width:64px; height:64px; border-radius:var(--radius-full); object-fit:cover; border:3px solid var(--primary-500); box-shadow:var(--shadow-md); flex-shrink:0;" />
            <div style="flex:1; min-width:180px;">
              <div style="display:flex; align-items:center; flex-wrap:wrap; gap:0.4rem; margin-bottom:4px;">
                <h1 style="font-size:clamp(1.15rem, 4vw, 1.4rem); font-weight:800; color:var(--text-main); word-break:break-word;">${user?.fullName || 'Estudiante'}</h1>
                <span class="badge badge-purple" style="white-space:normal; font-size:0.72rem; line-height:1.2;">Estudiante Universitario</span>
              </div>
              <p style="font-size:0.83rem; color:var(--text-muted); line-height:1.3;">${profile.degree || 'Ingeniería en Computación'} • ${profile.university || 'UNAM'}</p>
              <p style="font-size:0.75rem; color:var(--primary-700); margin-top:2px;">📍 ${profile.location || 'Ciudad de México, México'}</p>
            </div>
          </div>

          <div style="flex:1; min-width:min(100%, 240px); width:100%; background:var(--bg-surface); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-light); box-shadow:var(--shadow-sm);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Completitud del Perfil</span>
              <span style="font-size:1rem; font-weight:800; color:var(--primary-700);">${completion}%</span>
            </div>
            <div class="progress-bar-container" style="height:8px; margin-bottom:0.5rem;">
              <div class="progress-bar-fill" style="width:${completion}%"></div>
            </div>
            <p style="font-size:0.72rem; color:var(--text-secondary); line-height:1.3;">
              💡 <em>No requieres experiencia laboral formal para alcanzar el 100%. Tus proyectos escolares y servicio social suman el máximo valor.</em>
            </p>
          </div>
        </div>

        <!-- Profile Form Tabs -->
        <form id="profile-edit-form" onsubmit="LABEXP_VIEWS.profile.saveProfile(event)">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.75rem;">
            
            <!-- 1. Datos Académicos y Personales -->
            <div class="card">
              <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:1.25rem; display:flex; align-items:center; gap:0.5rem;">
                🎓 Formación Académica
              </h3>

              <div class="form-group">
                <label class="form-label">Nombre Completo</label>
                <input type="text" id="prof-fullname" class="form-input" value="${user?.fullName || ''}" required />
              </div>

              <div class="form-group">
                <label class="form-label">Institución o Universidad *</label>
                <input type="text" id="prof-university" class="form-input" value="${profile.university || ''}" placeholder="Ej. Universidad Nacional Autónoma de México (UNAM)" required />
              </div>

              <div class="form-group">
                <label class="form-label">Carrera o Licenciatura *</label>
                <input type="text" id="prof-degree" class="form-input" value="${profile.degree || ''}" placeholder="Ej. Ingeniería en Computación / Derecho / Medicina" required />
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                <div class="form-group">
                  <label class="form-label">Semestre Actual *</label>
                  <input type="text" id="prof-semester" class="form-input" value="${profile.currentSemester || '8vo Semestre'}" placeholder="Ej. 8vo Semestre o Recién Egresado" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Año de Egreso Estimado</label>
                  <input type="text" id="prof-gradyear" class="form-input" value="${profile.graduationYear || '2027'}" placeholder="Ej. 2027" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Nivel Académico</label>
                <select id="prof-academiclevel" class="form-select">
                  <option value="Licenciatura en curso" ${profile.academicLevel === 'Licenciatura en curso' ? 'selected' : ''}>Licenciatura en curso</option>
                  <option value="Recién egresado" ${profile.academicLevel === 'Recién egresado' ? 'selected' : ''}>Recién egresado (menos de 2 años)</option>
                  <option value="Técnico Superior Universitario" ${profile.academicLevel === 'Técnico Superior Universitario' ? 'selected' : ''}>Técnico Superior Universitario</option>
                  <option value="Maestría en curso" ${profile.academicLevel === 'Maestría en curso' ? 'selected' : ''}>Maestría en curso</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Área Profesional de Mayor Interés</label>
                <input type="text" id="prof-interest" class="form-input" value="${profile.interestArea || ''}" placeholder="Ej. Tecnología, Finanzas, Salud, Marketing" />
              </div>
            </div>

            <!-- 2. Preferencias Laborales y Contacto -->
            <div class="card">
              <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:1.25rem; display:flex; align-items:center; gap:0.5rem;">
                💼 Preferencias y Contacto
              </h3>

              <div class="form-group">
                <label class="form-label">Teléfono de Contacto</label>
                <input type="tel" id="prof-phone" class="form-input" value="${profile.phone || '+52 55 4123 9876'}" placeholder="+52 55 0000 0000" />
              </div>

              <div class="form-group">
                <label class="form-label">Ubicación (Ciudad y Estado) *</label>
                <input type="text" id="prof-location" class="form-input" value="${profile.location || 'Ciudad de México, México'}" required />
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                <div class="form-group">
                  <label class="form-label">Modalidad Preferida</label>
                  <select id="prof-workmode" class="form-select">
                    <option value="Híbrido" ${profile.preferredWorkMode === 'Híbrido' ? 'selected' : ''}>Híbrido</option>
                    <option value="Remoto" ${profile.preferredWorkMode === 'Remoto' ? 'selected' : ''}>Remoto</option>
                    <option value="Presencial" ${profile.preferredWorkMode === 'Presencial' ? 'selected' : ''}>Presencial</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Tipo de Oportunidad</label>
                  <select id="prof-jobtype" class="form-select">
                    <option value="Primer empleo">Primer empleo</option>
                    <option value="Prácticas profesionales">Prácticas profesionales</option>
                    <option value="Servicio social">Servicio social</option>
                    <option value="Becarios">Becario / Medio tiempo</option>
                    <option value="Programas trainee">Programa Trainee</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Biografía y Resumen Personal</label>
                <textarea id="prof-bio" class="form-textarea" rows="4" placeholder="Describe brevemente tus intereses y lo que te apasiona de tu carrera...">${profile.bio || ''}</textarea>
              </div>

              <div class="form-group">
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.82rem; color:var(--text-secondary); cursor:pointer;">
                  <input type="checkbox" id="prof-share" ${profile.shareProfileWithRecruiters ? 'checked' : ''} />
                  <span>Permitir que reclutadores verificados encuentren mi perfil académico para vacantes junior</span>
                </label>
              </div>
            </div>

            <!-- 3. Habilidades Técnicas y Personales -->
            <div class="card" style="grid-column: 1 / -1;">
              <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                ⚡ Competencias y Habilidades
              </h3>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
                <div class="form-group">
                  <label class="form-label">Habilidades Técnicas (separadas por comas)</label>
                  <input type="text" id="prof-tech-skills" class="form-input" value="${(profile.technicalSkills || []).join(', ')}" placeholder="Ej. JavaScript, Python, Excel, SQL, Autocad, React" />
                  <div class="form-hint">Herramientas, software, lenguajes o conocimientos aprendidos en tus materias.</div>
                </div>

                <div class="form-group">
                  <label class="form-label">Habilidades Personales / Blandas (separadas por comas)</label>
                  <input type="text" id="prof-soft-skills" class="form-input" value="${(profile.softSkills || []).join(', ')}" placeholder="Ej. Trabajo en equipo, Pensamiento analítico, Asertividad, Adaptabilidad" />
                  <div class="form-hint">Competencias socioemocionales y de trabajo colaborativo.</div>
                </div>
              </div>

              <div class="form-group" style="margin-top:1rem;">
                <label class="form-label">Competencias Desarrolladas Durante tu Formación Universitaria</label>
                <textarea id="prof-academic-comp" class="form-textarea" rows="2" placeholder="Ej. Diseño de algoritmos, Metodologías ágiles Scrum en aula, Modelado de bases de datos">${(profile.academicCompetencies || []).join('\n')}</textarea>
                <div class="form-hint">Escribe una competencia por línea para que los algoritmos de compatibilidad las identifiquen.</div>
              </div>
            </div>

            <!-- 4. Proyectos Académicos y Voluntariado (El Diferenciador Clave) -->
            <div class="card" style="grid-column: 1 / -1; border-left:4px solid var(--primary-600);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div>
                  <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main);">
                    🚀 Proyectos Académicos y Experiencia Universitaria
                  </h3>
                  <p style="font-size:0.8rem; color:var(--text-muted);">
                    El elemento clave para postularte sin experiencia previa: proyectos finales, hackathones, servicio social y voluntariado.
                  </p>
                </div>
              </div>

              <div id="academic-projects-list" style="display:flex; flex-direction:column; gap:1rem; margin-bottom:1rem;">
                ${(profile.academicProjects || []).map((proj, idx) => `
                  <div style="padding:1rem; background:var(--bg-subtle); border-radius:var(--radius-md); border:1px solid var(--border-light);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                      <h4 style="font-weight:700; font-size:0.95rem; color:var(--text-main);">${proj.title}</h4>
                      <span class="badge badge-purple">${proj.period || 'Académico'}</span>
                    </div>
                    <div style="font-size:0.82rem; color:var(--primary-700); font-weight:600; margin-bottom:4px;">Rol: ${proj.role}</div>
                    <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.4; margin-bottom:0.5rem;">${proj.description}</p>
                    <div style="font-size:0.75rem; color:var(--emerald-700); font-weight:600;">Impacto o logro: ${proj.outcomes || 'Concluido exitosamente'}</div>
                  </div>
                `).join('')}
              </div>

              <!-- Experiencia laboral opcional -->
              <div style="border-top:1px dashed var(--border-light); padding-top:1rem; margin-top:1rem;">
                <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.35rem;">
                  Experiencia Laboral en Empresas (Opcional)
                </div>
                <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.5rem;">
                  Si has trabajado formalmente, puedes registrarlo; si no tienes experiencia previa, este apartado puede quedar vacío sin afectar tu calificación.
                </p>
                <textarea id="prof-work-exp" class="form-textarea" rows="2" placeholder="Opcional: Si cuentas con empleos previos o pasantías, descríbelos aquí. De lo contrario, déjalo en blanco.">${(profile.workExperience || []).map(w => `${w.company}: ${w.role}`).join('\n')}</textarea>
              </div>
            </div>

          </div>

          <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:2rem;">
            <button type="button" class="btn btn-outline" onclick="LABEXP_STATE.setView('dashboard')">Cancelar</button>
            <button type="submit" id="save-profile-btn" class="btn btn-primary btn-lg">
              💾 Guardar Cambios en mi Perfil
            </button>
          </div>
        </form>
      </div>
    `;
  },

  saveProfile: async function(e) {
    e.preventDefault();
    const btn = document.getElementById('save-profile-btn');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    const user = LABEXP_STATE.currentUser;
    const fullName = document.getElementById('prof-fullname').value.trim();
    const university = document.getElementById('prof-university').value.trim();
    const degree = document.getElementById('prof-degree').value.trim();
    const currentSemester = document.getElementById('prof-semester').value.trim();
    const graduationYear = document.getElementById('prof-gradyear').value.trim();
    const academicLevel = document.getElementById('prof-academiclevel').value;
    const interestArea = document.getElementById('prof-interest').value.trim();
    const phone = document.getElementById('prof-phone').value.trim();
    const location = document.getElementById('prof-location').value.trim();
    const preferredWorkMode = document.getElementById('prof-workmode').value;
    const bio = document.getElementById('prof-bio').value.trim();
    const shareProfileWithRecruiters = document.getElementById('prof-share').checked;

    const technicalSkills = document.getElementById('prof-tech-skills').value.split(',').map(s => s.trim()).filter(Boolean);
    const softSkills = document.getElementById('prof-soft-skills').value.split(',').map(s => s.trim()).filter(Boolean);
    const academicCompetencies = document.getElementById('prof-academic-comp').value.split('\n').map(s => s.trim()).filter(Boolean);

    try {
      const payload = {
        userId: user?.id,
        fullName,
        university,
        degree,
        currentSemester,
        graduationYear,
        academicLevel,
        interestArea,
        phone,
        location,
        preferredWorkMode,
        bio,
        shareProfileWithRecruiters,
        technicalSkills,
        softSkills,
        academicCompetencies
      };

      const res = await LABEXP_API.updateProfile(payload);
      LABEXP_STATE.currentProfile = res.profile;
      if (fullName) {
        user.fullName = fullName;
        LABEXP_STATE.setUser(user, res.profile);
      }

      LABEXP_COMPONENTS.showToast('success', 'Perfil Actualizado', `Tu información académica fue guardada. Completitud: ${res.profile.completionPercentage}%.`);
      LABEXP_STATE.setView('dashboard');
    } catch (err) {
      LABEXP_COMPONENTS.showToast('error', 'Error al guardar', err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '💾 Guardar Cambios en mi Perfil';
    }
  }
};
