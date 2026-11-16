// LABEXP - Client-side Brand & App Configuration
// Configurable commercial brand name and global strings
window.LABEXP_CONFIG = {
  APP_NAME: 'LABEXP',
  APP_LEGAL_NAME: 'LABEXP Tecnologías de Empleabilidad S.A.S.',
  APP_TAGLINE: 'Conectar oportunidades, desarrollar talento y transformar el potencial profesional en nuevas posibilidades de empleo.',
  APP_BADGE: 'Plataforma para Estudiantes y Egresados',
  APP_VERSION: '1.0.0',
  API_BASE_URL: '/api',
  
  // Brand color identity
  COLORS: {
    primary: '#6D28D9',       // Deep purple / Violet
    primaryHover: '#5B21B6',  // Dark violet
    primaryLight: '#EDE9FE',  // Very soft purple tint
    secondary: '#8B5CF6',    // Bright violet
    accent: '#10B981',       // Emerald green for success / match
    textMain: '#0F172A',     // Slate 900
    textMuted: '#64748B',    // Slate 500
    bgLight: '#F8FAFC',      // Crisp light slate
    white: '#FFFFFF'
  },

  // Compliance statement for Mexican privacy law
  COMPLIANCE_TEXT: 'Plataforma en cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP). Tus datos académicos y de contacto solo se comparten con reclutadores previa autorización tuya.',

  // Helper method to set dynamic brand name if needed at runtime
  setBrandName: function(newName) {
    this.APP_NAME = newName;
    document.querySelectorAll('[data-brand-name]').forEach(el => {
      el.textContent = newName;
    });
    document.title = `${newName} | Empleo y Desarrollo Profesional`;
  }
};
