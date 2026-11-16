// LABEXP - Reactive Application State
window.LABEXP_STATE = {
  // Current logged in user & role
  currentUser: null,
  currentProfile: null,
  currentRole: 'candidate', // 'candidate' | 'recruiter' | 'admin'
  currentView: 'dashboard', // default view
  
  // Cache for fetched entities
  vacancies: [],
  courses: [],
  applications: [],
  savedJobs: [],
  notifications: [],
  unreadNotificationsCount: 0,
  companies: [],
  activeCv: null,
  aiStatus: { provider: 'local_intelligent_engine', isLiveConfigured: false },

  // Filters state for job board
  jobFilters: {
    q: '',
    category: 'all',
    workMode: 'all',
    jobType: 'all',
    location: 'all'
  },

  // Listeners for reactivity
  listeners: [],

  // Init from localStorage
  init: function() {
    try {
      const savedUser = localStorage.getItem('labexp_user');
      const savedRole = localStorage.getItem('labexp_role');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.currentRole = savedRole || this.currentUser.role || 'candidate';
      } else {
        // Default seed user for smooth demonstration (Sofía Ramírez, candidate)
        this.currentUser = {
          id: 'usr-cand-1',
          email: 'sofia.ramirez@alumnos.unam.mx',
          fullName: 'Sofía Ramírez Galindo',
          role: 'candidate',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
        };
        this.currentRole = 'candidate';
        localStorage.setItem('labexp_user', JSON.stringify(this.currentUser));
        localStorage.setItem('labexp_role', 'candidate');
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  setUser: function(user, profile = null) {
    this.currentUser = user;
    this.currentRole = user ? user.role : 'candidate';
    if (profile) this.currentProfile = profile;
    if (user) {
      localStorage.setItem('labexp_user', JSON.stringify(user));
      localStorage.setItem('labexp_role', this.currentRole);
    } else {
      localStorage.removeItem('labexp_user');
      localStorage.removeItem('labexp_role');
    }
    this.notify();
  },

  setRole: function(newRole) {
    this.currentRole = newRole;
    localStorage.setItem('labexp_role', newRole);
    
    // Switch default user representation if switching roles for demonstration
    if (newRole === 'recruiter') {
      this.currentUser = {
        id: 'usr-rec-1',
        email: 'reclutamiento@techinnovamx.com',
        fullName: 'Carlos Mendoza Alarcón',
        role: 'recruiter',
        companyId: 'comp-1',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
      };
    } else if (newRole === 'admin') {
      this.currentUser = {
        id: 'usr-adm-1',
        email: 'admin@labexp.mx',
        fullName: 'Lic. Valeria Morales',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
      };
    } else {
      this.currentUser = {
        id: 'usr-cand-1',
        email: 'sofia.ramirez@alumnos.unam.mx',
        fullName: 'Sofía Ramírez Galindo',
        role: 'candidate',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
      };
    }
    localStorage.setItem('labexp_user', JSON.stringify(this.currentUser));
    this.notify();
  },

  setView: function(viewName) {
    this.currentView = viewName;
    if (window.LABEXP_APP && window.LABEXP_APP.toggleMobileMenu) {
      window.LABEXP_APP.toggleMobileMenu(true);
    }
    this.notify();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  subscribe: function(listener) {
    this.listeners.push(listener);
  },

  notify: function() {
    this.listeners.forEach(fn => fn(this));
  }
};

window.LABEXP_STATE.init();
