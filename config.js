// LABEXP - Configuration module
// Commercial brand name and system constants are configured here.
// Change APP_NAME to update the branding across the entire platform.

module.exports = {
  APP_NAME: 'LABEXP',
  APP_LEGAL_NAME: 'LABEXP Plataforma de Empleabilidad y Desarrollo Profesional S.A.S.',
  APP_TAGLINE: 'Conectar oportunidades, desarrollar talento y transformar el potencial profesional en nuevas posibilidades de empleo.',
  APP_VERSION: '1.0.0',
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  ENV: process.env.NODE_ENV || 'development',
  
  // Mexican privacy and labor data compliance
  COMPLIANCE: {
    LAW: 'Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP - México)',
    DPO_EMAIL: 'privacidad@labexp.mx',
    TERMS_VERSION: '2026.1'
  },

  // AI Configuration
  AI: {
    PROVIDER: process.env.AI_PROVIDER || 'gemini', // 'gemini' | 'openai' | 'local_simulator'
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    DEFAULT_TEMPERATURE: 0.7,
    MAX_TOKENS: 2048
  }
};
