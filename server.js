// LABEXP - Core Server & REST API
// Pure Node.js implementation: zero external dependencies, ultra-fast, robust.
// Serves static web frontend and provides all API services.

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const config = require('./config');
const aiService = require('./services/aiService');

const DB_PATH = path.join(__dirname, 'data', 'database.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for static asset delivery
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Thread-safe / sync database helper
function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database.json:', err);
    return null;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing database.json:', err);
    return false;
  }
}

// Body parser helper
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Formato JSON inválido'));
      }
    });
    req.on('error', err => reject(err));
  });
}

// Response helpers
function jsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function errorResponse(res, statusCode, message, details = null) {
  jsonResponse(res, statusCode, {
    success: false,
    error: message,
    details: details
  });
}

// Static file server
function serveStaticFile(req, res, pathname) {
  let safePath = pathname === '/' ? '/index.html' : pathname;
  // Security: prevent directory traversal
  const normalized = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, normalized);

  if (!fs.existsSync(filePath)) {
    // Fallback to index.html for SPA router
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Archivo no encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // API Router
  if (pathname.startsWith('/api/')) {
    try {
      const db = readDb();
      if (!db) {
        return errorResponse(res, 500, 'Error interno: no se pudo cargar la base de datos.');
      }

      // ==========================================
      // GET /api/config
      // ==========================================
      if (pathname === '/api/config' && method === 'GET') {
        return jsonResponse(res, 200, {
          success: true,
          appName: db.settings?.appName || config.APP_NAME,
          tagline: config.APP_TAGLINE,
          compliance: config.COMPLIANCE,
          aiStatus: aiService.getAiStatus()
        });
      }

      // ==========================================
      // POST /api/auth/login
      // ==========================================
      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, password } = body;

        if (!email || !password) {
          return errorResponse(res, 400, 'Debes ingresar correo electrónico y contraseña.');
        }

        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user || user.passwordHash !== password) {
          return errorResponse(res, 401, 'Credenciales incorrectas. Verifica tu correo y contraseña.');
        }

        const profile = db.profiles.find(p => p.userId === user.id) || null;
        const company = user.companyId ? db.companies.find(c => c.id === user.companyId) : null;

        return jsonResponse(res, 200, {
          success: true,
          message: 'Inicio de sesión exitoso',
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            avatar: user.avatar,
            companyId: user.companyId,
            company: company
          },
          profile: profile
        });
      }

      // ==========================================
      // POST /api/auth/register
      // ==========================================
      if (pathname === '/api/auth/register' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { fullName, email, password, confirmPassword, role, privacyConsent, companyName } = body;

        // Validation
        if (!fullName || !email || !password) {
          return errorResponse(res, 400, 'Todos los campos obligatorios deben ser completados.');
        }
        if (password.length < 6) {
          return errorResponse(res, 400, 'La contraseña debe tener al menos 6 caracteres.');
        }
        if (password !== confirmPassword) {
          return errorResponse(res, 400, 'Las contraseñas no coinciden.');
        }
        if (!privacyConsent) {
          return errorResponse(res, 400, 'Debes aceptar los términos de uso y el aviso de privacidad.');
        }

        const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (existing) {
          return errorResponse(res, 400, 'Ya existe una cuenta registrada con este correo electrónico.');
        }

        const newUserId = 'usr-' + Date.now();
        let companyId = null;

        if (role === 'recruiter') {
          companyId = 'comp-' + Date.now();
          const newCompany = {
            id: companyId,
            name: companyName || fullName + ' Co.',
            legalName: companyName || fullName + ' Empresa',
            industry: 'General',
            logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
            verified: false,
            verificationDate: null,
            location: 'México',
            description: 'Empresa registrada recientemente en LABEXP.',
            website: '',
            foundedYear: new Date().getFullYear(),
            size: '1-10 colaboradores'
          };
          db.companies.push(newCompany);
        }

        const newUser = {
          id: newUserId,
          email: email.toLowerCase().trim(),
          passwordHash: password,
          fullName: fullName.trim(),
          role: role || 'candidate',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
          companyId: companyId,
          status: 'active',
          createdAt: new Date().toISOString(),
          privacyConsent: true,
          privacyConsentDate: new Date().toISOString()
        };

        db.users.push(newUser);

        // Create initial default profile if candidate
        if (newUser.role === 'candidate') {
          const newProfile = {
            userId: newUserId,
            headline: 'Estudiante en búsqueda de desarrollo profesional',
            bio: 'Estudiante con entusiasmo por aprender y aplicar competencias en proyectos reales.',
            phone: '',
            location: 'México',
            university: '',
            degree: '',
            academicLevel: 'Licenciatura en curso',
            currentSemester: '',
            graduationYear: '',
            interestArea: '',
            preferredWorkMode: 'Híbrido',
            preferredJobType: 'Primer empleo',
            completionPercentage: 35,
            shareProfileWithRecruiters: true,
            technicalSkills: [],
            softSkills: ['Trabajo en equipo', 'Comunicación asertiva'],
            languages: [{ language: 'Español', level: 'Nativo' }],
            academicCompetencies: [],
            academicProjects: [],
            extracurriculars: [],
            certifications: [],
            workExperience: []
          };
          db.profiles.push(newProfile);

          // Create default CV template
          const newCv = {
            id: 'cv-' + newUserId,
            userId: newUserId,
            title: `Currículum - ${fullName}`,
            template: 'modern-purple',
            updatedAt: new Date().toISOString(),
            data: {
              personal: {
                fullName: fullName,
                headline: 'Estudiante Universitario',
                email: email,
                phone: '',
                location: '',
                summary: 'Estudiante motivado por incorporarse al ámbito laboral mediante el aporte de conocimientos teóricos y prácticos adquiridos durante mi formación académica.'
              },
              education: [],
              academicProjects: [],
              skills: { technical: [], soft: ['Trabajo en equipo', 'Proactividad'] },
              languages: [{ name: 'Español', proficiency: 'Nativo' }],
              extracurriculars: []
            }
          };
          db.curriculums.push(newCv);
        }

        writeDb(db);

        return jsonResponse(res, 201, {
          success: true,
          message: 'Registro completado con éxito.',
          user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role,
            avatar: newUser.avatar,
            companyId: newUser.companyId
          }
        });
      }

      // ==========================================
      // GET /api/profile
      // ==========================================
      if (pathname === '/api/profile' && method === 'GET') {
        const userId = parsedUrl.query.userId || 'usr-cand-1';
        const profile = db.profiles.find(p => p.userId === userId);
        const user = db.users.find(u => u.id === userId);

        if (!profile) {
          return errorResponse(res, 404, 'Perfil no encontrado.');
        }

        return jsonResponse(res, 200, {
          success: true,
          profile: {
            ...profile,
            fullName: user?.fullName,
            email: user?.email,
            avatar: user?.avatar
          }
        });
      }

      // ==========================================
      // PUT /api/profile
      // ==========================================
      if (pathname === '/api/profile' && method === 'PUT') {
        const body = await parseJsonBody(req);
        const userId = body.userId || 'usr-cand-1';

        let profileIdx = db.profiles.findIndex(p => p.userId === userId);
        if (profileIdx === -1) {
          return errorResponse(res, 404, 'Perfil no encontrado.');
        }

        // Calculate dynamic completion percentage based on student-centric fields
        const p = { ...db.profiles[profileIdx], ...body };
        let points = 0;
        if (p.university && p.degree) points += 25;
        if (p.technicalSkills && p.technicalSkills.length > 0) points += 20;
        if (p.softSkills && p.softSkills.length > 0) points += 15;
        if (p.academicProjects && p.academicProjects.length > 0) points += 20;
        if (p.extracurriculars && p.extracurriculars.length > 0) points += 10;
        if (p.bio && p.bio.length > 20) points += 10;
        p.completionPercentage = Math.min(100, points);

        db.profiles[profileIdx] = p;

        // If fullName or avatar was updated, reflect in user table
        if (body.fullName) {
          const userObj = db.users.find(u => u.id === userId);
          if (userObj) userObj.fullName = body.fullName;
        }

        writeDb(db);

        return jsonResponse(res, 200, {
          success: true,
          message: 'Perfil profesional actualizado correctamente.',
          profile: p
        });
      }

      // ==========================================
      // GET /api/jobs (Bolsa de trabajo con filtros)
      // ==========================================
      if (pathname === '/api/jobs' && method === 'GET') {
        const query = parsedUrl.query;
        let list = [...db.vacancies];

        // Search text filter
        if (query.q) {
          const term = query.q.toLowerCase().trim();
          list = list.filter(v =>
            v.title.toLowerCase().includes(term) ||
            v.description.toLowerCase().includes(term) ||
            v.companyName.toLowerCase().includes(term) ||
            (v.area && v.area.toLowerCase().includes(term))
          );
        }

        // Category filter
        if (query.category && query.category !== 'all') {
          list = list.filter(v => v.category.toLowerCase() === query.category.toLowerCase());
        }

        // Work mode filter (Remoto, Híbrido, Presencial)
        if (query.workMode && query.workMode !== 'all') {
          list = list.filter(v => v.workMode.toLowerCase() === query.workMode.toLowerCase());
        }

        // Job type filter (Tiempo completo, Medio tiempo)
        if (query.jobType && query.jobType !== 'all') {
          list = list.filter(v => v.jobType.toLowerCase() === query.jobType.toLowerCase());
        }

        // Location filter
        if (query.location && query.location !== 'all') {
          const loc = query.location.toLowerCase();
          list = list.filter(v => v.location.toLowerCase().includes(loc));
        }

        // Company filter
        if (query.companyId) {
          list = list.filter(v => v.companyId === query.companyId);
        }

        return jsonResponse(res, 200, {
          success: true,
          total: list.length,
          vacancies: list
        });
      }

      // ==========================================
      // GET /api/jobs/:id
      // ==========================================
      if (pathname.startsWith('/api/jobs/') && method === 'GET') {
        const id = pathname.replace('/api/jobs/', '');
        const vacancy = db.vacancies.find(v => v.id === id);
        if (!vacancy) {
          return errorResponse(res, 404, 'Vacante no encontrada.');
        }
        const company = db.companies.find(c => c.id === vacancy.companyId) || null;
        return jsonResponse(res, 200, {
          success: true,
          vacancy: { ...vacancy, company }
        });
      }

      // ==========================================
      // POST /api/jobs (Crear vacante - Reclutador)
      // ==========================================
      if (pathname === '/api/jobs' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { title, companyId, category, jobType, workMode, location, salary, description, requirements, responsibilities, benefits, area } = body;

        if (!title || !category || !description) {
          return errorResponse(res, 400, 'Título, categoría y descripción son campos requeridos.');
        }

        const comp = db.companies.find(c => c.id === companyId) || db.companies[0];
        const newVac = {
          id: 'vac-' + Date.now(),
          title: title.trim(),
          companyId: comp.id,
          companyName: comp.name,
          category: category,
          jobType: jobType || 'Tiempo completo',
          workMode: workMode || 'Híbrido',
          location: location || 'México',
          salary: salary || 'A convenir / No especificado',
          academicLevel: 'Estudiantes o recién egresados',
          experienceRequired: 'Sin experiencia previa requerida.',
          area: area || 'Tecnología y Negocios',
          publishedAt: new Date().toISOString(),
          isDemo: true,
          verifiedSource: comp.verified,
          description: description,
          responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n') : []),
          requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n') : []),
          benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split('\n') : []),
          matchingKeywords: [title, category, workMode]
        };

        db.vacancies.unshift(newVac);
        writeDb(db);

        return jsonResponse(res, 201, {
          success: true,
          message: 'Vacante publicada exitosamente en LABEXP.',
          vacancy: newVac
        });
      }

      // ==========================================
      // POST /api/jobs/:id/save (Guardar / desguardar)
      // ==========================================
      if (pathname.includes('/save') && method === 'POST') {
        const match = pathname.match(/\/api\/jobs\/([^\/]+)\/save/);
        const vacancyId = match ? match[1] : null;
        const body = await parseJsonBody(req);
        const userId = body.userId || 'usr-cand-1';

        const existingIdx = db.savedJobs.findIndex(s => s.userId === userId && s.vacancyId === vacancyId);
        let isSaved = false;

        if (existingIdx !== -1) {
          db.savedJobs.splice(existingIdx, 1);
          isSaved = false;
        } else {
          db.savedJobs.push({
            id: 'save-' + Date.now(),
            userId: userId,
            vacancyId: vacancyId,
            savedAt: new Date().toISOString()
          });
          isSaved = true;
        }

        writeDb(db);
        return jsonResponse(res, 200, {
          success: true,
          isSaved: isSaved,
          message: isSaved ? 'Vacante guardada en tus favoritos.' : 'Vacante removida de tus favoritos.'
        });
      }

      // ==========================================
      // GET /api/saved-jobs
      // ==========================================
      if (pathname === '/api/saved-jobs' && method === 'GET') {
        const userId = parsedUrl.query.userId || 'usr-cand-1';
        const userSaved = db.savedJobs.filter(s => s.userId === userId);
        const savedVacancies = userSaved.map(s => {
          const v = db.vacancies.find(vac => vac.id === s.vacancyId);
          return { ...v, savedAt: s.savedAt };
        }).filter(Boolean);

        return jsonResponse(res, 200, {
          success: true,
          total: savedVacancies.length,
          savedVacancies: savedVacancies
        });
      }

      // ==========================================
      // POST /api/applications (Registrar postulación)
      // ==========================================
      if (pathname === '/api/applications' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { vacancyId, userId = 'usr-cand-1', coverNote = '' } = body;

        const vacancy = db.vacancies.find(v => v.id === vacancyId);
        if (!vacancy) {
          return errorResponse(res, 404, 'La vacante seleccionada no existe.');
        }

        const user = db.users.find(u => u.id === userId);
        const profile = db.profiles.find(p => p.userId === userId);

        // Check if already applied
        const existingApp = db.applications.find(a => a.userId === userId && a.vacancyId === vacancyId);
        if (existingApp) {
          return errorResponse(res, 400, 'Ya te has postulado previamente a esta vacante.');
        }

        const newApp = {
          id: 'app-' + Date.now(),
          userId: userId,
          vacancyId: vacancy.id,
          vacancyTitle: vacancy.title,
          companyId: vacancy.companyId,
          companyName: vacancy.companyName,
          status: 'Enviada', // Initial state in the 8-state pipeline
          appliedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          candidateName: user?.fullName || 'Candidato LABEXP',
          candidateEmail: user?.email || '',
          candidateUniversity: profile ? `${profile.university || ''} (${profile.degree || ''})` : 'Universidad no especificada',
          coverNote: coverNote,
          interviewScheduledFor: null,
          interviewType: null,
          recruiterNotes: 'Postulación recibida en plataforma.'
        };

        db.applications.unshift(newApp);

        // Add automatic notification for candidate
        db.notifications.unshift({
          id: 'notif-' + Date.now(),
          userId: userId,
          title: `Postulación enviada: ${vacancy.title}`,
          message: `Tu perfil fue remitido exitosamente a ${vacancy.companyName}. Puedes monitorear el estado en 'Mis postulaciones'.`,
          type: 'application',
          read: false,
          createdAt: new Date().toISOString(),
          link: 'applications'
        });

        writeDb(db);

        return jsonResponse(res, 201, {
          success: true,
          message: '¡Tu postulación ha sido enviada exitosamente!',
          application: newApp
        });
      }

      // ==========================================
      // GET /api/applications (Listar postulaciones)
      // ==========================================
      if (pathname === '/api/applications' && method === 'GET') {
        const userId = parsedUrl.query.userId;
        const companyId = parsedUrl.query.companyId;

        let list = [...db.applications];
        if (userId) {
          list = list.filter(a => a.userId === userId);
        } else if (companyId) {
          list = list.filter(a => a.companyId === companyId);
        }

        return jsonResponse(res, 200, {
          success: true,
          total: list.length,
          applications: list
        });
      }

      // ==========================================
      // PUT /api/applications/:id/status (Actualizar estado de selección)
      // Estados: Guardada, Enviada, Recibida, En revisión, Entrevista programada, En proceso, Seleccionado, No seleccionado
      // ==========================================
      if (pathname.includes('/status') && method === 'PUT') {
        const match = pathname.match(/\/api\/applications\/([^\/]+)\/status/);
        const appId = match ? match[1] : null;
        const body = await parseJsonBody(req);
        const { status, recruiterNotes, interviewScheduledFor, interviewType } = body;

        const validStatuses = [
          'Guardada', 'Enviada', 'Recibida', 'En revisión',
          'Entrevista programada', 'En proceso', 'Seleccionado', 'No seleccionado'
        ];

        if (!validStatuses.includes(status)) {
          return errorResponse(res, 400, 'Estado de postulación inválido.');
        }

        const appIdx = db.applications.findIndex(a => a.id === appId);
        if (appIdx === -1) {
          return errorResponse(res, 404, 'Postulación no encontrada.');
        }

        const app = db.applications[appIdx];
        app.status = status;
        app.updatedAt = new Date().toISOString();
        if (recruiterNotes) app.recruiterNotes = recruiterNotes;
        if (interviewScheduledFor) app.interviewScheduledFor = interviewScheduledFor;
        if (interviewType) app.interviewType = interviewType;

        // Push notification to candidate
        db.notifications.unshift({
          id: 'notif-' + Date.now(),
          userId: app.userId,
          title: `Actualización de postulación: ${app.vacancyTitle}`,
          message: `El estado de tu proceso en ${app.companyName} cambió a: "${status}".`,
          type: status === 'Entrevista programada' ? 'interview' : 'application',
          read: false,
          createdAt: new Date().toISOString(),
          link: 'applications'
        });

        writeDb(db);

        return jsonResponse(res, 200, {
          success: true,
          message: `Estado de la postulación actualizado a "${status}".`,
          application: app
        });
      }

      // ==========================================
      // GET /api/courses (13 categorías solicitadas)
      // ==========================================
      if (pathname === '/api/courses' && method === 'GET') {
        const query = parsedUrl.query;
        let list = [...db.courses];

        if (query.category && query.category !== 'all') {
          list = list.filter(c => c.category.toLowerCase() === query.category.toLowerCase());
        }
        if (query.search) {
          const s = query.search.toLowerCase();
          list = list.filter(c => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));
        }

        return jsonResponse(res, 200, {
          success: true,
          total: list.length,
          courses: list
        });
      }

      // ==========================================
      // PUT /api/courses/:id/progress (Actualizar avance de curso)
      // ==========================================
      if (pathname.includes('/progress') && method === 'PUT') {
        const match = pathname.match(/\/api\/courses\/([^\/]+)\/progress/);
        const courseId = match ? match[1] : null;
        const body = await parseJsonBody(req);
        const { progress = 0, enrolled = true } = body;

        const cIdx = db.courses.findIndex(c => c.id === courseId);
        if (cIdx === -1) {
          return errorResponse(res, 404, 'Curso no encontrado.');
        }

        db.courses[cIdx].enrolled = enrolled;
        db.courses[cIdx].progress = Math.min(100, Math.max(0, Number(progress)));
        writeDb(db);

        return jsonResponse(res, 200, {
          success: true,
          message: 'Progreso del curso actualizado.',
          course: db.courses[cIdx]
        });
      }

      // ==========================================
      // GET /api/cv & PUT /api/cv (Creador de CV)
      // ==========================================
      if (pathname === '/api/cv' && method === 'GET') {
        const userId = parsedUrl.query.userId || 'usr-cand-1';
        let cv = db.curriculums.find(c => c.userId === userId);
        if (!cv) {
          cv = db.curriculums[0];
        }
        return jsonResponse(res, 200, { success: true, cv });
      }

      if (pathname === '/api/cv' && method === 'PUT') {
        const body = await parseJsonBody(req);
        const userId = body.userId || 'usr-cand-1';

        let cvIdx = db.curriculums.findIndex(c => c.userId === userId);
        if (cvIdx === -1) {
          const newCv = {
            id: 'cv-' + Date.now(),
            userId: userId,
            title: body.title || 'Mi Currículum LABEXP',
            template: body.template || 'modern-purple',
            updatedAt: new Date().toISOString(),
            data: body.data || {}
          };
          db.curriculums.push(newCv);
          cvIdx = db.curriculums.length - 1;
        } else {
          db.curriculums[cvIdx] = {
            ...db.curriculums[cvIdx],
            ...body,
            updatedAt: new Date().toISOString()
          };
        }

        writeDb(db);
        return jsonResponse(res, 200, {
          success: true,
          message: 'Currículum vitae guardado exitosamente.',
          cv: db.curriculums[cvIdx]
        });
      }

      // ==========================================
      // POST /api/ai/cv-optimize (Servicio IA 1: Optimización de CV)
      // ==========================================
      if (pathname === '/api/ai/cv-optimize' && method === 'POST') {
        const body = await parseJsonBody(req);
        const result = await aiService.optimizeCv(body);
        return jsonResponse(res, 200, result);
      }

      // ==========================================
      // POST /api/ai/career-coach (Servicio IA 2: Orientación Profesional)
      // ==========================================
      if (pathname === '/api/ai/career-coach' && method === 'POST') {
        const body = await parseJsonBody(req);
        const result = await aiService.careerCoach(body);
        return jsonResponse(res, 200, result);
      }

      // ==========================================
      // POST /api/ai/interview-simulator (Servicio IA 3: Simulador de Entrevistas)
      // ==========================================
      if (pathname === '/api/ai/interview-simulator' && method === 'POST') {
        const body = await parseJsonBody(req);
        const result = await aiService.processInterviewTurn(body);
        return jsonResponse(res, 200, result);
      }

      // ==========================================
      // POST /api/ai/compatibility (Servicio IA 4: Análisis de Compatibilidad ATS)
      // ==========================================
      if (pathname === '/api/ai/compatibility' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { vacancyId, userId = 'usr-cand-1' } = body;

        const vacancy = db.vacancies.find(v => v.id === vacancyId);
        const profile = db.profiles.find(p => p.userId === userId);

        if (!vacancy) {
          return errorResponse(res, 404, 'Vacante no encontrada.');
        }

        const analysis = aiService.analyzeCompatibility(profile, vacancy);
        return jsonResponse(res, 200, {
          success: true,
          analysis
        });
      }

      // ==========================================
      // GET /api/notifications & PUT /api/notifications/:id/read
      // ==========================================
      if (pathname === '/api/notifications' && method === 'GET') {
        const userId = parsedUrl.query.userId || 'usr-cand-1';
        const notifs = db.notifications.filter(n => n.userId === userId);
        return jsonResponse(res, 200, {
          success: true,
          total: notifs.length,
          unread: notifs.filter(n => !n.read).length,
          notifications: notifs
        });
      }

      if (pathname.includes('/read') && method === 'PUT') {
        const match = pathname.match(/\/api\/notifications\/([^\/]+)\/read/);
        const notifId = match ? match[1] : null;

        if (notifId === 'all') {
          const userId = parsedUrl.query.userId || 'usr-cand-1';
          db.notifications.forEach(n => {
            if (n.userId === userId) n.read = true;
          });
        } else {
          const n = db.notifications.find(item => item.id === notifId);
          if (n) n.read = true;
        }

        writeDb(db);
        return jsonResponse(res, 200, { success: true, message: 'Notificación marcada como leída.' });
      }

      // ==========================================
      // GET /api/companies & PUT /api/companies/:id/verify
      // ==========================================
      if (pathname === '/api/companies' && method === 'GET') {
        return jsonResponse(res, 200, {
          success: true,
          companies: db.companies
        });
      }

      if (pathname.includes('/verify') && method === 'PUT') {
        const match = pathname.match(/\/api\/companies\/([^\/]+)\/verify/);
        const compId = match ? match[1] : null;
        const body = await parseJsonBody(req);

        const comp = db.companies.find(c => c.id === compId);
        if (!comp) {
          return errorResponse(res, 404, 'Empresa no encontrada.');
        }

        comp.verified = body.verified !== undefined ? body.verified : true;
        comp.verificationDate = comp.verified ? new Date().toISOString() : null;

        db.auditLogs.unshift({
          id: 'log-' + Date.now(),
          action: comp.verified ? 'COMPANY_VERIFIED' : 'COMPANY_UNVERIFIED',
          adminId: 'usr-adm-1',
          target: `${comp.id} (${comp.name})`,
          details: comp.verified ? 'Verificación otorgada tras revisión documental.' : 'Verificación revocada.',
          timestamp: new Date().toISOString()
        });

        writeDb(db);
        return jsonResponse(res, 200, {
          success: true,
          message: `Estado de verificación de "${comp.name}" actualizado.`,
          company: comp
        });
      }

      // ==========================================
      // GET /api/admin/metrics & audit logs
      // ==========================================
      if (pathname === '/api/admin/metrics' && method === 'GET') {
        return jsonResponse(res, 200, {
          success: true,
          metrics: {
            totalUsers: db.users.length,
            candidates: db.users.filter(u => u.role === 'candidate').length,
            recruiters: db.users.filter(u => u.role === 'recruiter').length,
            totalCompanies: db.companies.length,
            verifiedCompanies: db.companies.filter(c => c.verified).length,
            totalVacancies: db.vacancies.length,
            totalApplications: db.applications.length,
            totalCourses: db.courses.length,
            aiStatus: aiService.getAiStatus()
          },
          auditLogs: db.auditLogs || []
        });
      }

      // ==========================================
      // POST /api/settings/ai-key (Configurar clave API en caliente)
      // ==========================================
      if (pathname === '/api/settings/ai-key' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { apiKey } = body;
        const status = aiService.setRuntimeApiKey(apiKey);
        db.settings.aiApiKeyConfigured = status.configured;
        db.settings.aiProvider = status.provider;
        writeDb(db);

        return jsonResponse(res, 200, {
          success: true,
          message: status.configured 
            ? 'API Key de Google Gemini configurada y activa con éxito.' 
            : 'Se ha restablecido al Motor Inteligente Local (Modo Demostración).',
          aiStatus: aiService.getAiStatus()
        });
      }

      // Default API 404
      return errorResponse(res, 404, `Endpoint de API no encontrado: ${method} ${pathname}`);

    } catch (err) {
      console.error('Unhandled API error:', err);
      return errorResponse(res, 500, 'Error interno del servidor.', err.message);
    }
  }

  // If not API, serve static UI files
  serveStaticFile(req, res, pathname);
});

// Start listening
const PORT = config.PORT;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ${config.APP_NAME} Server iniciado exitosamente`);
  console.log(`📡 URL Local: http://localhost:${PORT}`);
  console.log(`🛡️  Cumplimiento LFPDPPP: Activo`);
  console.log(`🧠 Motor IA: ${aiService.getAiStatus().provider}`);
  console.log(`====================================================`);
});
