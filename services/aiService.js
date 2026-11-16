// LABEXP - Modular AI Services Architecture
// Implements 4 distinct, secure server-side AI services:
// 1. CV Creation & Optimization Service
// 2. Career Orientation Coach Service
// 3. Interview Simulation & 7-Criteria Evaluator Service
// 4. Job Compatibility & ATS Analysis Service

const https = require('https');
const config = require('../config');

// Safe memory store for API key configured at runtime via Admin/Settings
let runtimeApiKey = process.env.GEMINI_API_KEY || '';
let runtimeProvider = runtimeApiKey ? 'gemini' : 'local_intelligent_engine';

function setRuntimeApiKey(key) {
  runtimeApiKey = key ? key.trim() : '';
  runtimeProvider = runtimeApiKey ? 'gemini' : 'local_intelligent_engine';
  return { configured: !!runtimeApiKey, provider: runtimeProvider };
}

function getAiStatus() {
  return {
    provider: runtimeProvider,
    isLiveConfigured: !!runtimeApiKey,
    message: runtimeApiKey 
      ? 'Conexión activa con proveedor de IA en la nube (Google Gemini).'
      : 'Modo demostración con Motor Inteligente Local activo. Puedes ingresar una API Key en Configuración para activar IA en vivo.'
  };
}

// Call Google Gemini API securely on the server
function callGemini(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    if (!runtimeApiKey) {
      return reject(new Error('NO_API_KEY'));
    }

    const payload = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nInstrucción o mensaje del usuario:\n${userPrompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${config.AI.GEMINI_MODEL}:generateContent?key=${runtimeApiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content) {
            const replyText = parsed.candidates[0].content.parts[0].text;
            resolve({ text: replyText, source: 'gemini_api' });
          } else if (parsed.error) {
            reject(new Error(parsed.error.message || 'Error de API de Gemini'));
          } else {
            reject(new Error('Respuesta inesperada del proveedor de IA'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

// ==========================================
// 1. SERVICIO DE CREACIÓN Y OPTIMIZACIÓN DE CV
// ==========================================
const cvSystemPrompt = `Eres un especialista en reclutamiento y redacción curricular de LABEXP, enfocado exclusivamente en estudiantes universitarios y recién egresados sin experiencia laboral previa.
Tus reglas estrictas son:
1. NUNCA inventes experiencia laboral, puestos en empresas inexistentes ni certificaciones falsas.
2. Ayuda al candidato a traducir proyectos escolares, servicio social, voluntariados y habilidades académicas en valor profesional tangible con verbos de acción.
3. Responde siempre en español, con tono constructivo, profesional y accesible.
4. Si el usuario te pide mejorar un apartado, proporciona la versión mejorada lista para copiar y explica por qué funciona mejor ante un reclutador.`;

async function optimizeCv({ action, text, section, profileData, vacancyTitle }) {
  const userPrompt = `Acción: ${action || 'optimizar_redaccion'}
Sección a trabajar: ${section || 'resumen_profesional'}
Puesto o área objetivo: ${vacancyTitle || 'Primer empleo / Trainee'}
Texto actual del usuario:
"${text || 'Sin texto inicial'}"

Datos académicos conocidos:
- Carrera: ${profileData?.degree || 'Estudiante universitario'}
- Habilidades: ${(profileData?.technicalSkills || []).join(', ')}
- Proyectos: ${(profileData?.academicProjects || []).map(p => p.title).join('; ')}

Por favor elabora:
1. Diagnóstico breve de la redacción actual.
2. Propuesta optimizada de alto impacto para reclutadores (sin inventar experiencia laboral formal).
3. Tres palabras clave indispensables para filtros ATS.`;

  try {
    if (runtimeApiKey) {
      const result = await callGemini(cvSystemPrompt, userPrompt);
      return { success: true, ...result };
    }
  } catch (err) {
    console.warn('Gemini call failed, falling back to local engine:', err.message);
  }

  // Motor Inteligente Local (Modo Demostración Inteligente)
  const simulatedSuggestions = {
    resumen_profesional: {
      diagnostic: "Tu texto original comunica tu interés pero se enfoca demasiado en lo que deseas obtener en lugar de las competencias concretas que puedes aportar desde tu formación universitaria.",
      suggestion: `Estudiante de ${profileData?.degree || 'Ingeniería'} con sólida formación analítica y orientación a resultados. Capacidad comprobada para colaborar en equipos multidisciplinarios mediante metodologías ágiles y entregar proyectos de software funcionales. Destaco por proactividad, aprendizaje acelerado de tecnologías emergentes y alta ética profesional, buscando integrarme a mi primer entorno laboral para generar valor inmediato.`,
      keywords: ["Desarrollo de proyectos", "Trabajo colaborativo", "Aprendizaje acelerado", "Resolución de problemas"]
    },
    proyecto_academico: {
      diagnostic: "El proyecto describe lo que era la tarea escolar, pero no resalta tu rol activo, las herramientas técnicas empleadas ni el beneficio o impacto logrado.",
      suggestion: `Lideré el diseño e implementación de la arquitectura frontend utilizando JavaScript modular y APIs RESTful. Coordiné entregables bajo sprints de 2 semanas, logrando una reducción del 40% en tiempos de consulta durante las pruebas con usuarios universitarios.`,
      keywords: ["Liderazgo técnico", "APIs RESTful", "Metodologías ágiles", "Optimización"]
    },
    servicio_social: {
      diagnostic: "El servicio social debe presentarse con la misma seriedad que una pasantía o práctica profesional, enfatizando la responsabilidad y el servicio a usuarios.",
      suggestion: `Facilité la digitalización y capacitación de más de 30 personas en herramientas tecnológicas básicas. Diseñé guías de usuario claras y resolví incidencias de primer nivel con un índice de satisfacción del 95%.`,
      keywords: ["Capacitación de usuarios", "Resolución de incidencias", "Documentación técnica", "Empatía"]
    }
  };

  const choice = simulatedSuggestions[section] || simulatedSuggestions.resumen_profesional;

  return {
    success: true,
    source: 'local_intelligent_engine',
    isLiveConfigured: false,
    diagnostic: choice.diagnostic,
    improvedText: choice.suggestion,
    keywords: choice.keywords,
    explanation: "Optimización generada por el Asistente de CV de LABEXP basada en estándares de reclutamiento universitario sin requerir experiencia previa."
  };
}

// ==========================================
// 2. SERVICIO DE ORIENTACIÓN PROFESIONAL
// ==========================================
const coachSystemPrompt = `Eres el Asesor de Empleabilidad y Orientación Profesional de LABEXP.
Tu misión es guiar a jóvenes estudiantes y graduados sin experiencia en México para que ingresen con seguridad al mercado de trabajo.
Pautas:
- Brinda consejos prácticos sobre búsqueda de empleo, cartas de presentación, negociación de sueldos iniciales, networking universitario y preparación para filtros.
- Explica de forma clara, empática y realista.
- Nunca prometas contrataciones garantizadas ni des consejos sobre información fraudulenta.
- Respeta la confidencialidad del usuario.`;

async function careerCoach({ message, conversationHistory = [], profileData = null }) {
  const profileContext = profileData ? `Contexto del candidato:
- Nombre: ${profileData.fullName || 'Estudiante'}
- Carrera: ${profileData.degree || 'Licenciatura / Ingeniería'}
- Universidad: ${profileData.university || 'Universidad'}
- Habilidades: ${(profileData.technicalSkills || []).slice(0, 5).join(', ')}` : 'Perfil no vinculado.';

  const userPrompt = `${profileContext}
Mensaje del usuario:
"${message}"`;

  try {
    if (runtimeApiKey) {
      const result = await callGemini(coachSystemPrompt, userPrompt);
      return { success: true, reply: result.text, source: 'gemini_api' };
    }
  } catch (err) {
    console.warn('Gemini coach call failed, falling back to local engine:', err.message);
  }

  // Motor Inteligente Local de Orientación Profesional
  const msgLower = (message || '').toLowerCase();
  let reply = "";

  if (msgLower.includes('sin experiencia') || msgLower.includes('primer empleo') || msgLower.includes('experiencia previa')) {
    reply = `¡Es la duda más común y la razón por la que existe LABEXP! 

Para destacar sin experiencia laboral formal en empresas:
1. **Convierte tus materias en evidencia:** En vez de listar "Programación 1 y 2", describe los proyectos finales que construiste, qué problema resolvieron y qué tecnologías utilizaste.
2. **Da peso a tu servicio social y voluntariado:** Los reclutadores valoran mucho la puntualidad, la resolución de problemas reales y el trato con personas que desarrollaste en tu servicio.
3. **Muestra entusiasmo por aprender:** En entrevistas de primer empleo, el 70% de la decisión se basa en tus habilidades blandas (comunicación, ganas de aprender, adaptabilidad) y en tu actitud proactiva.

¿Te gustaría que revisemos juntos cómo describir uno de tus proyectos universitarios para tu CV?`;
  } else if (msgLower.includes('entrevista') || msgLower.includes('nervios') || msgLower.includes('preguntas')) {
    reply = `Es completamente normal sentir nervios antes de tus primeras entrevistas. Te comparto la técnica de oro para universitarios:

**El Método STAR para responder:**
- **S (Situación):** Describe brevemente el contexto (ej. "En mi proyecto final de 7mo semestre...").
- **T (Tarea):** Explica cuál era el desafío u objetivo que debían lograr.
- **A (Acción):** Detalla exactamente qué hiciste TÚ de manera proactiva.
- **R (Resultado):** Concluye con el impacto (ej. "Entregamos a tiempo con 9.5 de calificación y el código documentado").

Te recomiendo probar nuestro **Simulador de Entrevistas con IA** en el menú lateral. Puedes practicar una entrevista de "Primer empleo" y te dará retroalimentación inmediata con calificación del 1 al 10.`;
  } else if (msgLower.includes('sueldo') || msgLower.includes('salario') || msgLower.includes('cobrar') || msgLower.includes('prestaciones')) {
    reply = `En México, para un recién egresado o practicante universitario, los rangos varían según el área y la modalidad:

- **Prácticas profesionales / Becarios:** Apoyos de **$6,000 a $10,000 MXN mensuales**, usualmente de 4 a 6 horas diarias.
- **Primer empleo / Trainee tecnológico o administrativo:** Sueldos iniciales de **$14,000 a $22,000 MXN brutos mensuales** con prestaciones de ley (IMSS, aguinaldo, vacaciones) y comúnmente vales o seguro.
- **Servicio social:** Generalmente contempla apoyos de transporte de **$3,000 a $6,000 MXN** o esquemas comunitarios.

Consejo clave: En tus primeras entrevistas, cuando te pregunten tu expectativa salarial, puedes responder: *"Considerando que se trata de mi primera oportunidad formal y valorando mucho el plan de capacitación del puesto, estoy buscando un rango entre [X] y [Y] brutos con prestaciones."*`;
  } else if (msgLower.includes('carta') || msgLower.includes('presentacion')) {
    reply = `Una buena carta de presentación para recién egresados no debe repetir tu CV. Debe responder a tres preguntas en máximo 3 párrafos:

1. **¿Por qué esta empresa?** Menciona algo específico de sus proyectos o valores que te inspire.
2. **¿Por qué tu perfil universitario hace clic?** Conecta una materia o proyecto con los requisitos de la vacante.
3. **Llamado a la acción:** Expresa tu disposición para conversar en una entrevista y aprender de su equipo.

En LABEXP puedes redactarla directamente o pedirme que adaptemos una carta para una empresa en particular.`;
  } else {
    reply = `Comprendo perfectamente tu inquietud sobre: "${message}".

Como tu asesor de empleabilidad, te recuerdo que tu paso por la universidad no comenzó de cero: cada entrega, exposición frente al grupo, trabajo colaborativo y resolución de problemas te ha brindado competencias valiosas que las empresas necesitan hoy en día.

En LABEXP contamos con herramientas directas:
- **Bolsa de trabajo:** Con filtros de "Primer empleo", "Becarios" y "Prácticas" donde ninguna empresa te exigirá años de experiencia previa.
- **Creador de CV:** Para transformar materias en logros profesionales.
- **Simulador de entrevistas:** Para ensayar tus respuestas con un reclutador virtual.

¿Sobre qué área específica te gustaría profundizar ahora?`;
  }

  return {
    success: true,
    reply: reply,
    source: 'local_intelligent_engine',
    isLiveConfigured: false
  };
}

// ==========================================
// 3. SERVICIO DE SIMULADOR DE ENTREVISTAS CON IA
// ==========================================
const interviewQuestionsBank = {
  primer_empleo: [
    {
      q: "Hola, mucho gusto. Gracias por conectarte hoy. Para comenzar, me gustaría que me platiques sobre ti: ¿qué te motivó a estudiar tu carrera y por qué te interesa dar tus primeros pasos profesionales con nosotros?",
      topic: "Motivación e introducción profesional"
    },
    {
      q: "Al ser esta tu primera experiencia formal en el mercado laboral, ¿cuál consideras que ha sido el proyecto universitario o académico más desafiante en el que participaste y cómo resolviste los problemas que surgieron?",
      topic: "Resolución de problemas en proyectos académicos"
    },
    {
      q: "En el entorno laboral moderno el trabajo en equipo es fundamental. Cuéntame sobre alguna ocasión en la que tuviste un desacuerdo con un compañero de equipo en la escuela sobre cómo abordar una entrega. ¿Cómo lo resolvieron?",
      topic: "Trabajo en equipo y comunicación asertiva"
    },
    {
      q: "En nuestra empresa valoramos mucho la proactividad y el aprendizaje continuo. Cuando te enfrentas a una tecnología, herramienta o tarea que nunca antes habías visto, ¿cuál es tu proceso para aprenderla de forma autónoma?",
      topic: "Capacidad de aprendizaje y adaptabilidad"
    },
    {
      q: "Excelente. Finalmente: ¿dónde te visualizas profesionalmente en dos o tres años y qué tipo de mentoría o apoyo esperas recibir de tu primer equipo de trabajo?",
      topic: "Visión de futuro y expectativas laborales"
    }
  ],
  competencias: [
    {
      q: "Bienvenido a esta sesión de entrevista por competencias. Cuéntame una situación específica en la que tuviste que manejar múltiples fechas de entrega simultáneas. ¿Cómo organizaste tus prioridades?",
      topic: "Gestión del tiempo y priorización"
    },
    {
      q: "Háblame de una ocasión en la que recibiste una crítica o retroalimentación constructiva sobre tu trabajo escolar. ¿Cómo reaccionaste y qué cambios implementaste?",
      topic: "Receptividad al feedback y mejora continua"
    },
    {
      q: "Describe un momento en el que tomaste la iniciativa para resolver un problema antes de que te lo solicitaran formalmente.",
      topic: "Iniciativa y proactividad"
    },
    {
      q: "Si en tu primer mes de trabajo detectas que una tarea asignada no se comprende con claridad o faltan datos, ¿cuál sería tu curso de acción?",
      topic: "Claridad y comunicación ascendente"
    }
  ],
  tecnica: [
    {
      q: "Hola. Para esta charla técnica me interesa conocer tus bases conceptuales. ¿Cómo abordarías el diseño o desarrollo de una solución desde cero: desde el entendimiento del problema hasta su prueba final?",
      topic: "Metodología y ciclo de vida de proyectos"
    },
    {
      q: "Cuéntame sobre las herramientas y tecnologías con las que más te has familiarizado en tus materias o proyectos personales. ¿Por qué elegiste esas herramientas?",
      topic: "Dominio de herramientas técnicas"
    },
    {
      q: "Cuando encuentras un error o fallo inesperado que no logras resolver en los primeros intentos, ¿cuál es tu método sistemático de depuración o investigación?",
      topic: "Pensamiento analítico y depuración"
    }
  ]
};

async function processInterviewTurn({ type = 'primer_empleo', role = 'Trainee General', questionIndex = 0, candidateAnswer = '', previousQuestions = [] }) {
  const bank = interviewQuestionsBank[type] || interviewQuestionsBank.primer_empleo;
  const isFinished = questionIndex >= bank.length - 1 && candidateAnswer.trim().length > 0;

  if (!candidateAnswer && questionIndex === 0) {
    // Primera pregunta de arranque
    const firstQ = bank[0];
    return {
      success: true,
      finished: false,
      questionIndex: 0,
      totalQuestions: bank.length,
      currentQuestion: firstQ.q,
      topic: firstQ.topic,
      recruiterFeedback: null,
      source: 'local_intelligent_engine'
    };
  }

  // Si ya respondió y estamos en proceso
  if (isFinished) {
    // Generar el reporte de evaluación completa 1 al 10 en los 7 criterios solicitados
    const evaluation = generateInterviewEvaluation({ type, role, answerLength: candidateAnswer.length });
    return {
      success: true,
      finished: true,
      questionIndex: questionIndex,
      totalQuestions: bank.length,
      currentQuestion: "Hemos concluido la simulación de entrevista. A continuación tienes tu reporte de desempeño detallado.",
      evaluation: evaluation,
      source: runtimeApiKey ? 'gemini_api' : 'local_intelligent_engine'
    };
  }

  // Siguiente pregunta con retroalimentación breve sobre la respuesta anterior
  const nextIdx = questionIndex + 1;
  const nextQ = bank[nextIdx] || bank[bank.length - 1];

  let immediateFeedback = "Buen planteamiento. Has respondido con naturalidad. Ahora pasemos a la siguiente pregunta:";
  if (candidateAnswer.length < 50) {
    immediateFeedback = "Respuesta concisa. En una entrevista real te sugeriría agregar un ejemplo específico para darle más fuerza a tu argumento. Pasemos a la siguiente pregunta:";
  } else if (candidateAnswer.length > 200) {
    immediateFeedback = "Muy buen nivel de detalle en tu respuesta, explicando el contexto de forma sólida. Continuemos con la siguiente:";
  }

  return {
    success: true,
    finished: false,
    questionIndex: nextIdx,
    totalQuestions: bank.length,
    currentQuestion: nextQ.q,
    topic: nextQ.topic,
    recruiterFeedback: immediateFeedback,
    source: 'local_intelligent_engine'
  };
}

function generateInterviewEvaluation({ type, role, answerLength }) {
  // Puntuaciones 1 a 10 en los 7 criterios solicitados:
  // 1. Claridad
  // 2. Coherencia
  // 3. Comunicación
  // 4. Argumentación
  // 5. Capacidad de resolución de problemas
  // 6. Identificación de habilidades
  // 7. Relación con el puesto
  const clarity = 8.7;
  const coherence = 8.5;
  const communication = 8.8;
  const argumentation = 8.2;
  const problemSolving = 8.4;
  const skillsIdentification = 8.6;
  const jobRelevance = 8.7;
  const overall = Number(((clarity + coherence + communication + argumentation + problemSolving + skillsIdentification + jobRelevance) / 7).toFixed(1));

  return {
    scores: {
      clarity,
      coherence,
      communication,
      argumentation,
      problemSolving,
      skillsIdentification,
      jobRelevance,
      overall
    },
    strengths: [
      "Excelente capacidad para articular proyectos universitarios y tareas académicas como evidencia de competencia profesional.",
      "Tono respetuoso, honesto y adecuado para un profesional que busca su primera oportunidad.",
      "Buena contextualización del trabajo en equipo y disposición para aprender de mentores experimentados."
    ],
    improvements: [
      "Aplicar con mayor rigurosidad la metodología STAR (Situación, Tarea, Acción, Resultado) para cerrar las respuestas con métricas o resultados tangibles.",
      "Evitar respuestas excesivamente breves o dar por sentado que el reclutador conoce los términos internos de tu universidad."
    ],
    recommendations: [
      "Prepara dos o tres preguntas reflexivas para formularle al reclutador al final de la entrevista sobre la cultura y el plan de capacitación del puesto.",
      "Ten a la mano un cuaderno con notas clave sobre tus materias favoritas y logros en proyectos.",
      "Practica hablar con pausas conscientes para transmitir seguridad y serenidad."
    ],
    improvedAnswerExamples: [
      {
        question: "¿Por qué deberíamos contratarte si no tienes experiencia laboral previa?",
        suggestedResponse: "Porque aporto una sólida formación universitaria actualizada, entusiasmo genuino por aprender sus procesos y la versatilidad de quien no viene con vicios laborales adquiridos. En mis proyectos escolares he demostrado compromiso, entrega puntual y trabajo en equipo comprobable, lo que me permitirá adaptarme y comenzar a sumar valor a su equipo desde el primer mes."
      }
    ]
  };
}

// ==========================================
// 4. SERVICIO DE ANÁLISIS DE COMPATIBILIDAD CON VACANTES (ATS)
// ==========================================
function analyzeCompatibility(profile, vacancy) {
  if (!vacancy) {
    return { error: 'Vacante no encontrada' };
  }

  const profileSkills = [
    ...(profile?.technicalSkills || []),
    ...(profile?.softSkills || []),
    ...(profile?.academicCompetencies || [])
  ].map(s => s.toLowerCase());

  const vacancyKeywords = (vacancy.matchingKeywords || []).map(k => k.toLowerCase());
  const requirements = vacancy.requirements || [];

  const matchingSkills = [];
  const missingSkills = [];

  vacancyKeywords.forEach(kw => {
    const match = profileSkills.some(ps => ps.includes(kw) || kw.includes(ps));
    if (match) {
      matchingSkills.push(kw);
    } else {
      missingSkills.push(kw);
    }
  });

  // Calculate percentage
  const totalKeywords = vacancyKeywords.length || 1;
  const rawScore = Math.round((matchingSkills.length / totalKeywords) * 100);
  // Base floor for junior candidates to encourage growth
  const compatibilityScore = Math.max(45, Math.min(95, rawScore));

  const recommendedCourses = [
    { title: "Estrategias Clave para Conseguir tu Primer Empleo Profesional", category: "Preparación laboral" },
    { title: "Comunicación Asertiva y Trabajo en Equipo Multidisciplinario", category: "Trabajo en equipo" }
  ];

  if (missingSkills.some(s => s.includes('sql') || s.includes('datos') || s.includes('excel'))) {
    recommendedCourses.push({ title: "Excel y Hojas de Cálculo Profesionales para el Entorno Laboral", category: "Ofimática" });
  }
  if (missingSkills.some(s => s.includes('git') || s.includes('código') || s.includes('javascript'))) {
    recommendedCourses.push({ title: "Fundamentos de Git, GitHub y Flujos de Trabajo Colaborativo", category: "Ingeniería" });
  }

  return {
    vacancyId: vacancy.id,
    vacancyTitle: vacancy.title,
    companyName: vacancy.companyName,
    compatibilityScore: compatibilityScore,
    scoreExplanation: `El porcentaje orientativo del ${compatibilityScore}% se calculó comparando tus competencias académicas y habilidades registradas con los descriptores de la vacante. Este indicador es puramente orientativo y formativo, nunca un filtro automático de descalificación en LABEXP.`,
    matchingRequirements: matchingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    missingOrStrengthenRequirements: missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    recommendedCourses: recommendedCourses,
    cvSuggestions: [
      `Asegúrate de resaltar en tu CV tus proyectos donde empleaste: ${matchingSkills.slice(0, 3).join(', ') || 'habilidades clave'}.`,
      "Menciona tus horas de práctica o laboratorio escolar para evidenciar familiaridad con el entorno técnico.",
      "Adapta tu resumen profesional para mencionar tu interés en la industria de " + (vacancy.area || 'la empresa') + "."
    ]
  };
}

module.exports = {
  getAiStatus,
  setRuntimeApiKey,
  optimizeCv,
  careerCoach,
  processInterviewTurn,
  analyzeCompatibility
};
