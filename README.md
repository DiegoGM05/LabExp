# LABEXP - Plataforma Integral de Empleo y Desarrollo Profesional

> **Propuesta de valor:** *"Conectar oportunidades, desarrollar talento y transformar el potencial profesional en nuevas posibilidades de empleo".*

---

## 1. Visión y Perspectiva del Equipo Multidisciplinario

Esta plataforma fue concebida y desarrollada por un equipo multidisciplinario con roles especializados:

*   **Diseñadores UX/UI:** Desarrollaron una identidad visual moderna, minimalista, profesional y juvenil basada en la paleta de **Morado** (profesionalismo, confianza y estabilidad) y **Blanco** (claridad y limpieza visual), con navegación responsive de doble nivel (barra lateral persistente en escritorio y barra inferior compacta en móviles).
*   **Desarrolladores de Software:** Crearon una arquitectura full-stack pura en **Node.js**, sin dependencias externas frágiles, con persistencia relacional íntegra, API RESTful segura y una aplicación web interactiva (SPA) ultra rápida.
*   **Especialistas en Inteligencia Artificial:** Implementaron 4 servicios modulares desacoplados ejecutados estrictamente en el servidor (Optimizador de CV, Coach de Carrera, Simulador de Entrevistas y Analizador de Compatibilidad ATS), con soporte tanto para llamadas en vivo a la API de **Google Gemini** como para un **Motor Inteligente Local** para entornos de demostración sin claves API expuestas en el navegador.
*   **Expertos en Reclutamiento:** Definieron las taxonomías de competencias, el pipeline de 8 etapas de selección, los filtros de vacantes sin barrera de experiencia y la matriz de evaluación STAR en 7 criterios cuantitativos.
*   **Profesionales en Experiencia de Usuario:** Garantizaron que **no existan botones decorativos ni funciones simuladas**: cada acción en los formularios, modales, filtros, postulaciones y simulaciones produce un cambio real y persistente en el sistema.

---

## 2. Diferenciador Clave: Inserción Laboral Sin Experiencia Previa

A diferencia de las bolsas de trabajo corporativas convencionales que descartan perfiles por falta de trayectoria laboral formal, **LABEXP** está diseñada específicamente para que los estudiantes universitarios y recién egresados demuestren su valor a través de:
*   Proyectos universitarios y tareas finales de semestre.
*   Servicio social y voluntariado comunitario.
*   Participación en capítulos estudiantiles y hackathones.
*   Competencias académicas estructuradas.
*   Habilidades blandas (trabajo en equipo, asertividad, resolución de problemas).

---

## 3. Tipos de Cuentas y Control de Accesos

La plataforma maneja tres tipos de roles claramente diferenciados:
1.  **Estudiante o Candidato:** Crea su perfil académico, optimiza su CV con IA, busca y guarda vacantes en 11 categorías, se postula, practica entrevistas con evaluación 1-10, toma cursos en 13 áreas y consulta sus postulaciones en 8 etapas.
2.  **Empresa o Reclutador:** Registra su empresa, publica convocatorias para talento joven, revisa currículums autorizados y actualiza el estado de selección de los postulantes.
3.  **Administrador:** Supervisa la plataforma, valida legalmente a las empresas, modera las vacantes y consulta los registros de auditoría y métricas globales.

> ⚡ **Selector de Roles Rápido:** En la barra superior de la aplicación se encuentra un selector con un solo clic (`👩‍🎓 Candidata` | `🏢 Reclutador` | `🛡️ Admin`) para que cualquier evaluador pueda explorar todas las perspectivas del sistema instantáneamente.

---

## 4. Estructura de Módulos y Pantallas

*   **Pantalla 1 (Bienvenida / Landing):** Marca configurable (`LABEXP`), propuesta de valor, pilares diferenciales, accesos rápidos y selector de perfiles demo.
*   **Pantalla 2 (Registro):** Validación de datos, selección de rol, aviso de privacidad conforme a la LFPDPPP de México.
*   **Pantalla 3 (Inicio de Sesión):** Inicio seguro, precarga de credenciales demo y recuperación de contraseña.
*   **Pantalla 4 (Panel Principal / Dashboard):** Saludo personalizado, indicador de completitud del perfil, vacantes recomendadas, postulaciones activas, cursos recomendados y accesos directos a herramientas de IA.
*   **Módulo A (Perfil Profesional):** Edición de universidad, carrera, semestre, proyectos escolares, idiomas y competencias sin obligar experiencia laboral.
*   **Módulo B (Bolsa de Trabajo):** 11 categorías (Primer empleo, Prácticas, Servicio social, Becarios, Trainee, etc.), filtros por modalidad (Remoto, Híbrido, Presencial), modal detallado, guardado de favoritos y postulación interactiva.
*   **Módulo C (Asistente IA para CV):** Editor por secciones, optimizador de redacción con verbos de acción, diagnóstico para reclutadores, selección de plantilla y descarga/impresión directa en PDF.
*   **Módulo D (Asistente IA de Orientación):** Coach conversacional con preguntas sugeridas (sueldos en México, cartas de presentación, control de nervios, etc.).
*   **Módulo E (Simulador de Entrevistas con IA):** Configuración de puesto, tipo y dificultad; reclutador virtual que interactúa paso a paso y genera un reporte cuantitativo con puntuación 1 al 10 en **7 criterios**:
    1. Claridad en la exposición
    2. Coherencia estructural
    3. Habilidades de comunicación
    4. Argumentación y método
    5. Capacidad de resolución de problemas
    6. Identificación de habilidades
    7. Relación con el puesto
*   **Módulo F (Biblioteca de Capacitación):** Cursos en las **13 áreas solicitadas**: Ofimática, Habilidades digitales, Ingeniería, Liderazgo, Medicina, Trabajo en equipo, Administración, Finanzas, Marketing, Recursos humanos, Idiomas, Herramientas tecnológicas y Preparación laboral.
*   **Módulo G (Análisis de Compatibilidad ATS):** Comparador de perfil contra requisitos de cualquier vacante, con porcentaje formativo explicable y cursos recomendados para cerrar la brecha.
*   **Módulo H (Mis Postulaciones):** Pipeline en **8 estados**: *Guardada, Enviada, Recibida, En revisión, Entrevista programada, En proceso, Seleccionado, No seleccionado*.
*   **Módulo I (Panel Empresarial):** Publicación de nuevas vacantes, visualización de candidatos postulados y actualización del estado de selección.
*   **Módulo J (Notificaciones):** Centro de notificaciones con conteo de no leídas y redirección directa.
*   **Módulo K (Configuración y Privacidad):** Edición de contraseña, cumplimiento de la LFPDPPP, modificación en caliente del nombre comercial de la marca y configuración de API Key de Google Gemini.

---

## 5. Arquitectura Técnica y Ejecución

*   **Servidor:** Node.js v24 (HTTP nativo + REST API) en `server.js`.
*   **Puerto por defecto:** `http://localhost:3000`
*   **Base de datos:** `data/database.json` estructurada relacionalmente.
*   **Frontend:** HTML5 semántico, CSS3 con variables de diseño en `public/css/` y JavaScript modular en `public/js/`.

### Comandos de Ejecución

Para iniciar el servidor:
```powershell
node server.js
```

Para ejecutar las pruebas automatizadas de endpoints y flujo de postulaciones:
```powershell
node test_endpoints.js
node test_workflow.js
```
