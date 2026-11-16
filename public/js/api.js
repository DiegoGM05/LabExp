// LABEXP - API Client Service
window.LABEXP_API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Error en la solicitud (${response.status})`);
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth
  login: (email, password) => window.LABEXP_API.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => window.LABEXP_API.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getConfig: () => window.LABEXP_API.request('/config'),

  // Profiles
  getProfile: (userId) => window.LABEXP_API.request(`/profile?userId=${encodeURIComponent(userId)}`),
  updateProfile: (profileData) => window.LABEXP_API.request('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Jobs
  getJobs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return window.LABEXP_API.request(`/jobs?${q}`);
  },
  getJobDetail: (id) => window.LABEXP_API.request(`/jobs/${encodeURIComponent(id)}`),
  createJob: (jobData) => window.LABEXP_API.request('/jobs', { method: 'POST', body: JSON.stringify(jobData) }),
  toggleSaveJob: (vacancyId, userId) => window.LABEXP_API.request(`/jobs/${encodeURIComponent(vacancyId)}/save`, { method: 'POST', body: JSON.stringify({ userId }) }),
  getSavedJobs: (userId) => window.LABEXP_API.request(`/saved-jobs?userId=${encodeURIComponent(userId)}`),

  // Applications
  applyToJob: (vacancyId, userId, coverNote) => window.LABEXP_API.request('/applications', { method: 'POST', body: JSON.stringify({ vacancyId, userId, coverNote }) }),
  getApplications: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return window.LABEXP_API.request(`/applications?${q}`);
  },
  updateApplicationStatus: (appId, payload) => window.LABEXP_API.request(`/applications/${encodeURIComponent(appId)}/status`, { method: 'PUT', body: JSON.stringify(payload) }),

  // Courses
  getCourses: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return window.LABEXP_API.request(`/courses?${q}`);
  },
  updateCourseProgress: (courseId, progress, enrolled) => window.LABEXP_API.request(`/courses/${encodeURIComponent(courseId)}/progress`, { method: 'PUT', body: JSON.stringify({ progress, enrolled }) }),

  // CV
  getCv: (userId) => window.LABEXP_API.request(`/cv?userId=${encodeURIComponent(userId)}`),
  updateCv: (cvData) => window.LABEXP_API.request('/cv', { method: 'PUT', body: JSON.stringify(cvData) }),

  // AI Services
  optimizeCvWithAi: (payload) => window.LABEXP_API.request('/ai/cv-optimize', { method: 'POST', body: JSON.stringify(payload) }),
  askCareerCoach: (message, history, profile) => window.LABEXP_API.request('/ai/career-coach', { method: 'POST', body: JSON.stringify({ message, conversationHistory: history, profileData: profile }) }),
  interviewStep: (payload) => window.LABEXP_API.request('/ai/interview-simulator', { method: 'POST', body: JSON.stringify(payload) }),
  analyzeCompatibility: (vacancyId, userId) => window.LABEXP_API.request('/ai/compatibility', { method: 'POST', body: JSON.stringify({ vacancyId, userId }) }),

  // Notifications
  getNotifications: (userId) => window.LABEXP_API.request(`/notifications?userId=${encodeURIComponent(userId)}`),
  markNotificationRead: (id, userId) => window.LABEXP_API.request(`/notifications/${encodeURIComponent(id)}/read?userId=${encodeURIComponent(userId)}`, { method: 'PUT' }),

  // Companies & Admin
  getCompanies: () => window.LABEXP_API.request('/companies'),
  verifyCompany: (companyId, verified) => window.LABEXP_API.request(`/companies/${encodeURIComponent(companyId)}/verify`, { method: 'PUT', body: JSON.stringify({ verified }) }),
  getAdminMetrics: () => window.LABEXP_API.request('/admin/metrics'),
  setAiApiKey: (apiKey) => window.LABEXP_API.request('/settings/ai-key', { method: 'POST', body: JSON.stringify({ apiKey }) })
};
