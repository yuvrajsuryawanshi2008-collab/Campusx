/* ==========================================================================
   CampusX — Main JavaScript
   Frontend-only version
   Security-hardened for browser/localStorage usage

   IMPORTANT:
   This frontend does NOT provide real authentication or server-side security.
   Never store passwords, authentication tokens, or secrets in localStorage.
   ========================================================================== */

/* ==========================================================================
   0. SHARED SECURITY / VALIDATION HELPERS
   ========================================================================== */

/* ==========================================================================
   CAMPUSX CONFIG & REST API CLIENT
   Centralized API base URL and endpoints for local development & production
   ========================================================================== */

function resolveCampusXApiUrl() {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  if (window.CAMPUSX_API_URL) return window.CAMPUSX_API_URL.replace(/\/+$/, '');

  try {
    const metaTag = document.querySelector('meta[name="campusx-api-url"]');
    if (metaTag && metaTag.content && metaTag.content.trim()) {
      return metaTag.content.trim().replace(/\/+$/, '');
    }
    const stored = localStorage.getItem('campusx_api_url');
    if (stored && stored.trim()) {
      return stored.trim().replace(/\/+$/, '');
    }
    if (window.location && window.location.protocol.startsWith('http')) {
      if (window.location.port === '5500') {
        return `${window.location.protocol}//${window.location.hostname}:3000`;
      }
      return window.location.origin;
    }
  } catch (e) {}

  return 'http://localhost:3000';
}

const CAMPUSX_CONFIG = {
  // Configurable base URL: resolves dynamically for dev, preview & production
  API_BASE_URL: resolveCampusXApiUrl(),
  TIMEOUT_MS: 5000
};

const CampusXAPI = {
  getBaseUrl() {
    return CAMPUSX_CONFIG.API_BASE_URL;
  },

  setBaseUrl(url) {
    if (url && typeof url === 'string') {
      CAMPUSX_CONFIG.API_BASE_URL = url.replace(/\/+$/, '');
    }
  },

  async getStatus() {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/status`, {
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async getHealth() {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/health`, {
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async getNotes() {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/notes`, {
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async createNote(noteData) {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async getProjects() {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/projects`, {
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async createProject(projectData) {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async getTeams() {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/teams`, {
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async createTeam(teamData) {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData),
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async login(credentials) {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async getMaterials() {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/materials`, {
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async createMaterial(materialData) {
    try {
      const res = await fetch(`${CAMPUSX_CONFIG.API_BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialData),
        signal: AbortSignal.timeout(CAMPUSX_CONFIG.TIMEOUT_MS)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

const CampusX = {
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');

    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const allowedTypes = new Set(['success', 'error', 'warning', 'info']);
    const safeType = allowedTypes.has(type) ? type : 'info';

    const toast = document.createElement('div');
    toast.className = `toast ${safeType}`;

    let icon = 'ℹ️';
    if (safeType === 'success') icon = '✅';
    if (safeType === 'warning') icon = '⚠️';
    if (safeType === 'error') icon = '❌';

    const iconEl = document.createElement('span');
    const messageEl = document.createElement('span');

    iconEl.textContent = icon;
    messageEl.textContent = String(message ?? '');

    toast.append(iconEl, messageEl);
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  },

  openModal(modalId) {
    if (!isSafeId(modalId)) return;

    const modal = document.getElementById(modalId);

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      const input = modal.querySelector('input, textarea, select');

      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  },

  closeModal(modalId) {
    if (!isSafeId(modalId)) return;

    const modal = document.getElementById(modalId);

    if (modal) {
      modal.classList.remove('active');
    }

    if (!document.querySelector('.modal-overlay.active')) {
      document.body.style.overflow = '';
    }
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });

    document.body.style.overflow = '';
  }
};

/* --------------------------------------------------------------------------
   Generic helpers
   -------------------------------------------------------------------------- */

function isSafeId(value) {
  return typeof value === 'string' && /^[A-Za-z][A-Za-z0-9_-]{0,100}$/.test(value);
}

function cleanString(value, maxLength = 500) {
  if (typeof value !== 'string') {
    if (value === null || value === undefined) return '';
    value = String(value);
  }

  return value
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function cleanSearchString(value, maxLength = 100) {
  return cleanString(value, maxLength).toLowerCase();
}

function cleanArray(value, maxItems = 20, maxItemLength = 100) {
  if (!Array.isArray(value)) return [];

  return value
    .filter(item => typeof item === 'string')
    .map(item => cleanString(item, maxItemLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function safeNumber(value, min = 0, max = 100000000) {
  const number = Number(value);

  if (!Number.isFinite(number)) return null;
  if (number < min || number > max) return null;

  return number;
}

function safeInteger(value, min = 0, max = 100000000) {
  const number = Number(value);

  if (!Number.isInteger(number)) return null;
  if (number < min || number > max) return null;

  return number;
}

function createId(prefix) {
  if (window.crypto?.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeHttpUrl(value) {
  const raw = cleanString(value, 500);

  if (!raw) return '';

  try {
    const url = new URL(raw);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return '';
    }

    return url.href;
  } catch {
    return '';
  }
}

function safeJsonArray(key) {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveJsonArray(key, value) {
  if (!Array.isArray(value)) return false;

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    CampusX.showToast(
      'Unable to save this information in your browser storage.',
      'error'
    );
    return false;
  }
}

function getFormValue(id, fallback = '', maxLength = 500) {
  const element = document.getElementById(id);

  if (!element) return fallback;

  return cleanString(element.value, maxLength) || fallback;
}

function markFieldError(field, message) {
  if (!field) return;

  field.classList.add('has-error');
  field.setAttribute('aria-invalid', 'true');

  let error = field.parentElement?.querySelector('.form-error');

  if (!error) {
    error = document.createElement('div');
    error.className = 'form-error';
    field.parentElement?.appendChild(error);
  }

  error.textContent = message;
}

function clearFieldError(field) {
  if (!field) return;

  field.classList.remove('has-error');
  field.removeAttribute('aria-invalid');

  const error = field.parentElement?.querySelector('.form-error');

  if (error) {
    error.remove();
  }
}

function clearFormErrors(form) {
  form?.querySelectorAll('.has-error').forEach(field => {
    clearFieldError(field);
  });

  form?.querySelectorAll('.form-error').forEach(error => {
    error.remove();
  });
}

function validateForm(form) {
  if (!form) return false;

  clearFormErrors(form);

  if (!form.checkValidity()) {
    const invalidFields = form.querySelectorAll(':invalid');

    invalidFields.forEach(field => {
      let message = field.validationMessage;

      if (field.validity.valueMissing) {
        message = 'This field is required.';
      }

      markFieldError(field, message);
    });

    invalidFields[0]?.focus();

    CampusX.showToast(
      'Please correct the highlighted fields.',
      'error'
    );

    return false;
  }

  return true;
}

function getInitials(name) {
  const cleanName = cleanString(name, 100);

  if (!cleanName) return 'ST';

  const parts = cleanName
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';

  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

function highlightMatch(text, query) {
  const safeText = String(text ?? '');
  const safeQuery = String(query ?? '');

  if (!safeQuery) return escapeHtml(safeText);

  const lowerText = safeText.toLowerCase();
  const lowerQuery = safeQuery.toLowerCase();

  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return escapeHtml(safeText);
  }

  const before = safeText.substring(0, index);
  const match = safeText.substring(index, index + safeQuery.length);
  const after = safeText.substring(index + safeQuery.length);

  return (
    escapeHtml(before) +
    `<strong style="color: var(--color-primary); background: #eef2ff;">${escapeHtml(match)}</strong>` +
    escapeHtml(after)
  );
}

function getAllowedMarketplaceCategory(category) {
  const categories = {
    calculators: {
      icon: '🧮',
      name: 'Calculators'
    },
    graphics: {
      icon: '📐',
      name: 'Engineering Graphics'
    },
    pdf: {
      icon: '📄',
      name: 'PDF Printouts'
    }
  };

  return categories[category] || {
    icon: '📦',
    name: 'Study Material'
  };
}

function getAllowedCondition(condition) {
  const conditions = {
    'Like New': 'badge-green',
    Good: 'badge-indigo',
    Fair: 'badge-amber'
  };

  const safeCondition = Object.prototype.hasOwnProperty.call(
    conditions,
    condition
  )
    ? condition
    : 'Good';

  return {
    condition: safeCondition,
    className: conditions[safeCondition]
  };
}

function getAllowedIcon(icon) {
  const allowedIcons = new Set([
    '🧮',
    '📐',
    '📄',
    '📦'
  ]);

  return allowedIcons.has(icon) ? icon : '📦';
}

function getAllowedConditionClass(className) {
  const allowedClasses = new Set([
    'badge-green',
    'badge-indigo',
    'badge-amber'
  ]);

  return allowedClasses.has(className)
    ? className
    : 'badge-indigo';
}

/* ==========================================================================
   DEFAULT SEED DATASETS (Realistic Academic Engineering Data)
   ========================================================================== */

const DEFAULT_MATERIALS = [
  {
    id: 'm_casio_991ex',
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    category: 'calculators',
    condition: 'Excellent',
    price: '₹750',
    seller: 'Rohan Patil (BE Mech)',
    location: 'Campus Central Library, Desk 14',
    email: 'rohan.patil@campusx.edu',
    phone: '+91 98901 23456',
    desc: 'Genuine solar-powered engineering scientific calculator with 552 functions, natural textbook display, and QR code visualization. Used gently for one semester.',
    icon: '🧮',
    fileUrl: ''
  },
  {
    id: 'm_omega_drafter',
    title: 'Omega Pro Engineering Mini Drafter & Scale Set',
    category: 'graphics',
    condition: 'Like New',
    price: '₹380',
    seller: 'Sneha Joshi (SE Civil)',
    location: 'Workshop Building A, Ground Floor',
    email: 'sneha.joshi@campusx.edu',
    phone: '+91 98220 34567',
    desc: 'Precision stainless steel clamp mini drafter with unbroken acrylic scales and padded carry pouch. Ideal for First & Second Year engineering graphics.',
    icon: '📐',
    fileUrl: ''
  },
  {
    id: 'm_casio_82ms',
    title: 'Casio fx-82MS Scientific Calculator',
    category: 'calculators',
    condition: 'Good',
    price: '₹320',
    seller: 'Aditya Rao (TE Comp)',
    location: 'Main College Canteen',
    email: 'aditya.rao@campusx.edu',
    phone: '+91 98330 45678',
    desc: '240-function standard scientific calculator in full working condition with protective slide cover. Great backup calculator for university examination hall.',
    icon: '🧮',
    fileUrl: ''
  },
  {
    id: 'm_drawing_kit',
    title: 'Complete Engineering Drawing Instrument Kit',
    category: 'graphics',
    condition: 'Good',
    price: '₹450',
    seller: 'Vikram Jadhav (SE Mech)',
    location: 'Mechanical Dept Lobby',
    email: 'vikram.jadhav@campusx.edu',
    phone: '+91 98440 56789',
    desc: 'Includes compass with extension bar, divider, rolling ruler (30cm), set squares, protractor, and stencil templates in secure case.',
    icon: '📐',
    fileUrl: ''
  },
  {
    id: 'm_dsa_notes_print',
    title: 'Data Structures in C++ (Horowitz & Sahni) - Spiral Notes & QB',
    category: 'pdf',
    condition: 'Excellent',
    price: '₹180',
    seller: 'Neha Kulkarni (TE IT)',
    location: 'IT Dept Floor 2, Reading Room',
    email: 'neha.kulkarni@campusx.edu',
    phone: '+91 98550 67890',
    desc: 'Spiral-bound reference notes with highlighted algorithm derivations, dry runs, and unit-wise past university questions.',
    icon: '📄',
    fileUrl: 'Sem3 Study Material/DSA/QB (1) (2).docx'
  },
  {
    id: 'm_arduino_starter',
    title: 'Arduino Uno R3 Starter Kit with Sensor Modules',
    category: 'graphics',
    condition: 'Like New',
    price: '₹850',
    seller: 'Kunal Shinde (TE EnTC)',
    location: 'Electronics Lab 3',
    email: 'kunal.shinde@campusx.edu',
    phone: '+91 98660 78901',
    desc: 'Official Arduino Uno Rev 3 board with breadboard, jumper wires, ultrasonic sensor, buzzer, relay module, and USB cable.',
    icon: '📦',
    fileUrl: ''
  },
  {
    id: 'm_organic_farming_study',
    title: 'Organic Farming CEP Seminar Dossier & Research Slides',
    category: 'pdf',
    condition: 'Like New',
    price: '₹90',
    seller: 'Yuvraj & Team (SE IT)',
    location: 'Main Academic Quad / Classroom 204',
    email: 'yuvraj@campusx.edu',
    phone: '+91 98112 44556',
    desc: 'Comprehensive community engagement report and presentation slides on sustainable agriculture, organic certification, and crop economics.',
    icon: '🌱',
    fileUrl: 'Sem3 Study Material/BUSINESS ECONOMICS/BHEESHMA ORGANICS.pdf'
  },
  {
    id: 'm_env_handbook',
    title: 'Environmental Studies Complete Assignment & Field Study Guide',
    category: 'pdf',
    condition: 'Excellent',
    price: '₹120',
    seller: 'Pooja Verma (SE EnTC)',
    location: 'Library Reference Section',
    email: 'pooja.verma@campusx.edu',
    phone: '+91 98224 55667',
    desc: 'Complete bound copy of environmental science assignments, case studies on biodiversity loss, and field survey question sets.',
    icon: '🌍',
    fileUrl: 'Sem3 Study Material/full and final asg1enviroment.pdf'
  }
];

const DEFAULT_TEAMS = [
  {
    id: 't_aarav',
    name: 'Aarav Sharma',
    initials: 'AS',
    title: 'Full Stack Developer',
    role: 'Full Stack',
    roleKey: 'fullstack',
    branch: 'Computer Engineering',
    year: '3rd Year',
    bio: 'Passionate about scalable web applications, REST APIs, and database indexing. Seeking teammates for national smart hackathons.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'TypeScript'],
    availability: 'Available for Hackathons (15 hrs/wk)',
    github: 'https://github.com/aarav-sharma',
    linkedin: 'https://linkedin.com/in/aarav-sharma',
    email: 'aarav.sharma@campusx.edu',
    phone: '+91 98234 11223'
  },
  {
    id: 't_priya',
    name: 'Priya Patel',
    initials: 'PP',
    title: 'AI / Machine Learning Researcher',
    role: 'AI / ML',
    roleKey: 'aiml',
    branch: 'Information Technology',
    year: '3rd Year',
    bio: 'Building computer vision models and fine-tuning lightweight transformers. Interested in capstone projects solving healthcare/agritech problems.',
    skills: ['Python', 'PyTorch', 'OpenCV', 'Pandas', 'FastAPI'],
    availability: 'Open to Capstone Collaborations',
    github: 'https://github.com/priyapatel-ai',
    linkedin: 'https://linkedin.com/in/priya-patel-it',
    email: 'priya.patel@campusx.edu',
    phone: '+91 98112 33445'
  },
  {
    id: 't_rohan',
    name: 'Rohan Kulkarni',
    initials: 'RK',
    title: 'Frontend Engineer & UI Designer',
    role: 'Frontend',
    roleKey: 'frontend',
    branch: 'Information Technology',
    year: '2nd Year',
    bio: 'Dedicated to pixel-perfect accessible web design, micro-interactions, and responsive typography. Experienced with modern CSS and Figma.',
    skills: ['CSS3 / Sass', 'JavaScript (ES6+)', 'Figma', 'React', 'Tailwind'],
    availability: 'Immediate (Hackathons & Web Projects)',
    github: 'https://github.com/rohankulkarni',
    linkedin: 'https://linkedin.com/in/rohan-kulkarni',
    email: 'rohan.kulkarni@campusx.edu',
    phone: '+91 97654 22334'
  },
  {
    id: 't_ananya',
    name: 'Ananya Deshmukh',
    initials: 'AD',
    title: 'Cloud & DevOps Enthusiast',
    role: 'DevOps / Cloud',
    roleKey: 'devops',
    branch: 'Computer Engineering',
    year: '4th Year',
    bio: 'Final-year engineering student working on Kubernetes clusters, CI/CD pipelines, and Linux infrastructure automation.',
    skills: ['Linux', 'Docker', 'Kubernetes', 'GitHub Actions', 'AWS'],
    availability: 'Available for Final Year Mentorship & Sprints',
    github: 'https://github.com/ananya-devops',
    linkedin: 'https://linkedin.com/in/ananya-deshmukh',
    email: 'ananya.deshmukh@campusx.edu',
    phone: '+91 99887 66554'
  },
  {
    id: 't_siddharth',
    name: 'Siddharth Mehta',
    initials: 'SM',
    title: 'Systems & Competitive Programmer',
    role: 'Backend / Systems',
    roleKey: 'backend',
    branch: 'Computer Engineering',
    year: '2nd Year',
    bio: 'Candidate Master on Codeforces, enthusiast in low-level C++, memory management, and high-performance algorithms.',
    skills: ['C++', 'Data Structures', 'Algorithms', 'Go', 'Linux C'],
    availability: 'Available for ICPC & Competitive Coding Teams',
    github: 'https://github.com/siddharth-mehta',
    linkedin: 'https://linkedin.com/in/siddharth-mehta',
    email: 'siddharth.mehta@campusx.edu',
    phone: '+91 98765 12345'
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 'p_campusx',
    title: 'CampusX Student Collaboration Platform',
    domain: 'Web Development',
    level: 'Advanced',
    tech: 'Vanilla JS, Semantic HTML5, Modular CSS, LocalStorage API',
    teamSize: '3',
    desc: 'Production-grade student portal for engineering materials, notes repository, peer team finding, and interactive learning roadmaps.',
    github: 'https://github.com/campusx-org/campusx-platform',
    reportUrl: 'https://github.com/campusx-org/campusx-platform#readme'
  },
  {
    id: 'p_ai_reviewer',
    title: 'Automated AI Code Reviewer & Security Auditing CLI',
    domain: 'Artificial Intelligence',
    level: 'Advanced',
    tech: 'Python, AST Parsing, HuggingFace Transformers, PyLint',
    teamSize: '2',
    desc: 'Static code analysis tool using lightweight language models to detect memory leaks, race conditions, and OWASP Top 10 vulnerabilities.',
    github: 'https://github.com/campusx-org/ai-security-auditor',
    reportUrl: 'https://github.com/campusx-org/ai-security-auditor#readme'
  },
  {
    id: 'p_exchange',
    title: 'Distributed Campus Marketplace & Book Swap Service',
    domain: 'Full Stack',
    level: 'Intermediate',
    tech: 'Node.js, Express, PostgreSQL, WebSockets',
    teamSize: '4',
    desc: 'Hyperlocal student exchange portal enabling direct peer-to-peer textbook and drafting tool handovers inside university premises.',
    github: 'https://github.com/campusx-org/campus-exchange',
    reportUrl: 'https://github.com/campusx-org/campus-exchange#readme'
  },
  {
    id: 'p_algo_visualizer',
    title: 'Interactive Algorithm Visualizer & Pathfinding Sandbox',
    domain: 'Algorithms',
    level: 'Intermediate',
    tech: 'JavaScript Canvas, TypeScript, CSS Grid',
    teamSize: '2',
    desc: 'Step-by-step graphical visualizer for Dijkstra, A*, QuickSort, and AVL Tree self-balancing with customizable step latency.',
    github: 'https://github.com/campusx-org/algo-visualizer',
    reportUrl: 'https://github.com/campusx-org/algo-visualizer#readme'
  },
  {
    id: 'p_iot_energy',
    title: 'IoT Smart Campus Energy Monitoring System',
    domain: 'IoT & Embedded',
    level: 'Intermediate',
    tech: 'ESP32, MQTT Protocol, InfluxDB, Grafana',
    teamSize: '3',
    desc: 'Hardware sensor nodes measuring classroom power consumption in real time and alerting campus facility administrators of idle power drains.',
    github: 'https://github.com/campusx-org/smart-campus-energy',
    reportUrl: 'https://github.com/campusx-org/smart-campus-energy#readme'
  },
  {
    id: 'p_notes_app',
    title: 'Minimalist Markdown Notes & Synopsis Generator',
    domain: 'Web Development',
    level: 'Beginner',
    tech: 'HTML5, CSS3, JavaScript, LocalStorage',
    teamSize: '1',
    desc: 'Zero-dependency browser-based markdown editor with live side-by-side rendering, word counts, and direct PDF exporting.',
    github: 'https://github.com/campusx-org/minimal-notes-app',
    reportUrl: 'https://github.com/campusx-org/minimal-notes-app#readme'
  }
];

const DEFAULT_NOTES = [
  {
    id: 'n_ai_unit1',
    title: 'Artificial Intelligence - Unit 1: Introduction & State Space Search',
    subject: 'Artificial Intelligence',
    unit: 'Unit 1',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'Dept. of IT / Faculty Notes',
    desc: 'Comprehensive overview of Artificial Intelligence fundamentals, agents, environments, state space search, and problem formulations.',
    fileUrl: 'Sem3 Study Material/ARTIFICAL INTELLIGANCE/AI Unit -1 Introduction to AI by SMM.pdf'
  },
  {
    id: 'n_ai_unit1_detailed',
    title: 'Artificial Intelligence - Unit 1 (Detailed Search Algorithms Guide)',
    subject: 'Artificial Intelligence',
    unit: 'Unit 1 (Detailed)',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'AI Study Circle',
    desc: 'In-depth exploration of heuristic search, A* algorithm, hill climbing, and agent architectures with solved examples.',
    fileUrl: 'Sem3 Study Material/ARTIFICAL INTELLIGANCE/AI Unit1(Detailed).pdf'
  },
  {
    id: 'n_ai_cce',
    title: 'Artificial Intelligence - CCE 3 & 4 Seminar Presentation Slides',
    subject: 'Artificial Intelligence',
    unit: 'Unit 3-4',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'Senior Tech Seminar Group',
    desc: 'Comprehensive presentation slides on knowledge representation, first-order logic, inference engines, and expert system rules.',
    fileUrl: 'Sem3 Study Material/ARTIFICAL INTELLIGANCE/AI CCE 3&4 Edited.pptx'
  },
  {
    id: 'n_cs_unit1',
    title: 'Cyber Security - Unit 1: Security Fundamentals & Principles',
    subject: 'Cyber Security',
    unit: 'Unit 1',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'InfoSec Student Group',
    desc: 'Foundational concepts of information security, CIA triad, threat vectors, authentication mechanisms, and access control models.',
    fileUrl: 'Sem3 Study Material/CYBER SECURITY/Unit 1.pdf'
  },
  {
    id: 'n_cs_unit2',
    title: 'Cyber Security - Unit 2: Cryptographic Algorithms & PKI',
    subject: 'Cyber Security',
    unit: 'Unit 2',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'InfoSec Student Group',
    desc: 'Symmetric and asymmetric cryptography, DES, AES, RSA, digital signatures, and public key infrastructure (PKI).',
    fileUrl: 'Sem3 Study Material/CYBER SECURITY/Cyber Security Unit -2 .pdf'
  },
  {
    id: 'n_cs_unit3',
    title: 'Cyber Security - Unit 3: Network & System Security Protocols',
    subject: 'Cyber Security',
    unit: 'Unit 3',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'InfoSec Student Group',
    desc: 'Firewalls, IDS/IPS architectures, secure socket layer (SSL/TLS), VPN tunneling, and wireless network security standards.',
    fileUrl: 'Sem3 Study Material/CYBER SECURITY/Cyber_Security_Unit3 .pdf'
  },
  {
    id: 'n_dsa_pract1',
    title: 'DSA Practical 1: Linear & Binary Search Implementation',
    subject: 'Data Structures',
    unit: 'Practicals',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'DSA Lab Assistant',
    desc: 'Practical implementation, time complexity analysis, and bench-marking of linear search and binary search in C++.',
    fileUrl: 'Sem3 Study Material/DSA/Practical/Pract1 Linear and Binary Search .pdf'
  },
  {
    id: 'n_dsa_pract2',
    title: 'DSA Practical 2: Sorting Algorithms (Bubble, Quick & Merge Sort)',
    subject: 'Data Structures',
    unit: 'Practicals',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'DSA Lab Assistant',
    desc: 'Complete implementation of Bubble, Insertion, Selection, Quick, and Merge sort algorithms with complexity derivations.',
    fileUrl: 'Sem3 Study Material/DSA/Practical/Sorting Algorithms Pract 2 .pdf'
  },
  {
    id: 'n_dsa_pract3',
    title: 'DSA Practical 3: Ticket Reservation System Using Stack & Queue',
    subject: 'Data Structures',
    unit: 'Practicals',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'DSA Lab Assistant',
    desc: 'Real-world simulation and application of stack and circular queue data structures for ticket reservation systems.',
    fileUrl: 'Sem3 Study Material/DSA/Practical/Pract3_TIcket Booking Using Stack .pdf'
  },
  {
    id: 'n_env_unit1',
    title: 'Environmental Studies - Module 1 & 2: Ecology & Biodiversity',
    subject: 'Environmental Studies',
    unit: 'Unit 1-2',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'Green Campus Cell',
    desc: 'Ecological concepts, biodiversity conservation, pollution control methods, and environmental legislation overview.',
    fileUrl: 'Sem3 Study Material/ENVIROMENTAL STUDIES/Environmental1.pdf'
  },
  {
    id: 'n_env_asg3',
    title: 'Environmental Studies - Module 3: Environmental Pollution & Control',
    subject: 'Environmental Studies',
    unit: 'Unit 3',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'Environmental Club',
    desc: 'In-depth notes on air, water, and soil pollution monitoring, effluent treatment plants, and solid waste management.',
    fileUrl: 'Sem3 Study Material/ENVIROMENTAL STUDIES/Environmentalasg3.pdf'
  },
  {
    id: 'n_biz_econ',
    title: 'Business Economics - Bheeshma Organics Case Study & Agritech Models',
    subject: 'Business Economics',
    unit: 'Case Study',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'Management & Economics Cell',
    desc: 'Real-world case analysis of agricultural supply chain economics, cost-volume-profit modeling, and rural market distribution.',
    fileUrl: 'Sem3 Study Material/BUSINESS ECONOMICS/BHEESHMA ORGANICS.pdf'
  },
  {
    id: 'n_dlco_circuits',
    title: 'Digital Logic & Computer Organization - Architectural Circuits Reference',
    subject: 'Computer Organization',
    unit: 'Unit 2-3',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'Hardware Lab Seniors',
    desc: 'Comprehensive schematic diagrams of arithmetic logic units (ALU), multiplexers, decoders, and register transfer operations.',
    fileUrl: 'Sem3 Study Material/DIGITAL LOGIC AND COMPUTER ORGANIZATION/IMG_20260915_211227.jpg.jpeg'
  },
  {
    id: 'n_cep_abstract',
    title: 'Community Engagement Project (CEP) - Official Synopsis & Abstract',
    subject: 'CEP Project',
    unit: 'Project Guide',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'CampusX CEP Team',
    desc: 'Official approved abstract document outlining community problem identification, target stakeholders, and proposed methodology.',
    fileUrl: 'Sem3 Study Material/CEP/RealAbstract.docx'
  },
  {
    id: 'n_it_syllabus_se',
    title: 'Second Year B.Tech Information Technology Syllabus 2024-25',
    subject: 'Curriculum',
    unit: 'Official Syllabus',
    year: '2nd Year',
    sem: 'Sem 3',
    contributor: 'Academic Dean Office',
    desc: 'Official approved course curriculum, unit-wise marks distribution, practical lists, and textbook references for 2024-25.',
    fileUrl: 'Sem3 Study Material/KBTCOESecond-Year-B.Tech_.-Info.-Tech.-Syllabus-2024-Pattern-V1.2202600630Final.pdf'
  }
];

const DEFAULT_PYQS = [
  {
    id: 'q_dsa_qb',
    title: 'Data Structures & Algorithms Comprehensive Question Bank',
    subject: 'Data Structures',
    examYear: '2024-25',
    examType: 'Question Bank',
    solutionStatus: 'Verified Solutions Included',
    desc: 'Extensive question bank covering Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, and algorithm analysis for Semester 3.',
    fileUrl: 'Sem3 Study Material/DSA/QB (1) (2).docx'
  },
  {
    id: 'q_env_endsem',
    title: 'Environmental Studies End-Semester University Examination Paper',
    subject: 'Environmental Studies',
    examYear: '2024',
    examType: 'End-Sem',
    solutionStatus: 'Official Exam Paper',
    desc: 'University end-semester paper with questions on ecosystem stability, environmental protection laws, and climate change case studies.',
    fileUrl: 'Sem3 Study Material/final_environmental.pdf'
  },
  {
    id: 'q_env_insem',
    title: 'Environmental Studies In-Semester Evaluation & Assessment Paper',
    subject: 'Environmental Studies',
    examYear: '2024',
    examType: 'In-Sem',
    solutionStatus: 'Model Answers Attached',
    desc: 'Mid-semester assessment exam paper covering renewable energy, air & water pollution metrics, and municipal waste management.',
    fileUrl: 'Sem3 Study Material/ENVIROMENTAL STUDIES/Envirionmentalasg2.pdf'
  },
  {
    id: 'q_env_insem3',
    title: 'Environmental Studies In-Semester Assignment 3 Test Paper',
    subject: 'Environmental Studies',
    examYear: '2024',
    examType: 'In-Sem',
    solutionStatus: 'Question Paper',
    desc: 'Assessment test covering air & noise pollution standards, environmental impact assessment (EIA), and international treaties.',
    fileUrl: 'Sem3 Study Material/ENVIROMENTAL STUDIES/Environmentalasg3.pdf'
  },
  {
    id: 'q_ai_insem',
    title: 'Artificial Intelligence In-Semester Test Paper & Problem Set',
    subject: 'Artificial Intelligence',
    examYear: '2024',
    examType: 'In-Sem',
    solutionStatus: 'Question Paper',
    desc: 'In-sem examination paper testing agent classification, uninformed search, A* heuristic functions, and game theory minimax.',
    fileUrl: 'Sem3 Study Material/ARTIFICAL INTELLIGANCE/AI Unit -1 Introduction to AI by SMM.pdf'
  },
  {
    id: 'q_cs_midsem',
    title: 'Cyber Security Mid-Term Examination Paper',
    subject: 'Cyber Security',
    examYear: '2024',
    examType: 'In-Sem',
    solutionStatus: 'Question Paper',
    desc: 'Mid-term assessment paper covering classical ciphers, DES block structure, hashing algorithms, and vulnerability assessments.',
    fileUrl: 'Sem3 Study Material/CYBER SECURITY/Unit 1.pdf'
  },
  {
    id: 'q_it_se_syllabus',
    title: 'Second Year B.Tech IT Examination Scheme & Pattern Document',
    subject: 'Curriculum',
    examYear: '2024-25',
    examType: 'Question Bank',
    solutionStatus: 'Official Pattern & Rules',
    desc: 'Approved university examination guidelines, continuous in-sem assessment rubrics, and end-semester question distribution.',
    fileUrl: 'Sem3 Study Material/KBTCOESecond-Year-B.Tech_.-Info.-Tech.-Syllabus-2024-Pattern-V1.2202600630Final.pdf'
  },
  {
    id: 'q_it_te_syllabus',
    title: 'Third Year B.Tech IT Examination Scheme & Syllabus Reference',
    subject: 'Information Technology',
    examYear: '2024-25',
    examType: 'Question Bank',
    solutionStatus: 'Exam Scheme & References',
    desc: 'Third-year curriculum, examination patterns, in-sem and end-sem mark allocations, and laboratory assessment criteria.',
    fileUrl: 'Sem3 Study Material/KBTCOEThird-Year-B.Tech_.-Information-Tech.-Syllabus-2024-Pattern-25.03.202611.08.2026f.pdf'
  }
];

function ensureSeedData() {
  try {
    // 1. Materials
    let materials = safeJsonArray('campusx_material');
    if (!materials || materials.length === 0) {
      materials = [...DEFAULT_MATERIALS];
    } else {
      DEFAULT_MATERIALS.forEach(defItem => {
        const existing = materials.find(m => m.id === defItem.id);
        if (existing) {
          if (!existing.fileUrl && defItem.fileUrl) existing.fileUrl = defItem.fileUrl;
          if (!existing.email && defItem.email) existing.email = defItem.email;
          if (!existing.phone && defItem.phone) existing.phone = defItem.phone;
        } else {
          materials.push(defItem);
        }
      });
    }
    localStorage.setItem('campusx_material', JSON.stringify(materials));

    // 2. Teams
    let teams = safeJsonArray('campusx_teams');
    if (!teams || teams.length === 0) {
      teams = [...DEFAULT_TEAMS];
    } else {
      DEFAULT_TEAMS.forEach(defItem => {
        const existing = teams.find(t => t.id === defItem.id);
        if (existing) {
          if (!existing.email && defItem.email) existing.email = defItem.email;
          if (!existing.github && defItem.github) existing.github = defItem.github;
          if (!existing.linkedin && defItem.linkedin) existing.linkedin = defItem.linkedin;
        } else {
          teams.push(defItem);
        }
      });
    }
    localStorage.setItem('campusx_teams', JSON.stringify(teams));

    // 3. Projects
    let projects = safeJsonArray('campusx_projects');
    if (!projects || projects.length === 0) {
      projects = [...DEFAULT_PROJECTS];
    } else {
      DEFAULT_PROJECTS.forEach(defItem => {
        const existing = projects.find(p => p.id === defItem.id);
        if (existing) {
          if (!existing.github && defItem.github) existing.github = defItem.github;
          if (!existing.reportUrl && defItem.reportUrl) existing.reportUrl = defItem.reportUrl;
        } else {
          projects.push(defItem);
        }
      });
    }
    localStorage.setItem('campusx_projects', JSON.stringify(projects));

    // 4. Notes
    let notes = safeJsonArray('campusx_notes');
    if (!notes || notes.length === 0) {
      notes = [...DEFAULT_NOTES];
    } else {
      DEFAULT_NOTES.forEach(defItem => {
        const existing = notes.find(n => n.id === defItem.id);
        if (existing) {
          if (!existing.fileUrl && defItem.fileUrl) existing.fileUrl = defItem.fileUrl;
        } else {
          notes.push(defItem);
        }
      });
    }
    localStorage.setItem('campusx_notes', JSON.stringify(notes));

    // 5. PYQs
    let pyqs = safeJsonArray('campusx_pyqs');
    if (!pyqs || pyqs.length === 0) {
      pyqs = [...DEFAULT_PYQS];
    } else {
      DEFAULT_PYQS.forEach(defItem => {
        const existing = pyqs.find(q => q.id === defItem.id);
        if (existing) {
          if (!existing.fileUrl && defItem.fileUrl) existing.fileUrl = defItem.fileUrl;
        } else {
          pyqs.push(defItem);
        }
      });
    }
    localStorage.setItem('campusx_pyqs', JSON.stringify(pyqs));
  } catch (err) {
    // Graceful fallback if storage disabled
  }
}

/* ==========================================================================
   USER SESSION HELPERS (Frontend browser session)
   ========================================================================== */

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('campusx_user_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) return parsed;
    }
    const demoRaw = localStorage.getItem('campusx_demo_profile');
    if (demoRaw) {
      const parsed = JSON.parse(demoRaw);
      if (parsed && parsed.name) return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

function setCurrentUser(user) {
  if (!user || typeof user !== 'object') return;
  try {
    localStorage.setItem('campusx_user_session', JSON.stringify(user));
  } catch {}
  updateAuthHeaderUI();
}

function clearCurrentUser() {
  try {
    localStorage.removeItem('campusx_user_session');
  } catch {}
  updateAuthHeaderUI();
}

function updateAuthHeaderUI() {
  const user = getCurrentUser();
  const headerActionsContainers = document.querySelectorAll('.header-actions');

  headerActionsContainers.forEach(container => {
    const authButtons = container.querySelectorAll('[data-open-auth]');
    let sessionPill = container.querySelector('.user-session-pill');

    if (user && user.name) {
      authButtons.forEach(btn => (btn.style.display = 'none'));
      const initials =
        user.avatarInitials ||
        user.name
          .split(' ')
          .map(w => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() ||
        'ST';

      if (!sessionPill) {
        sessionPill = document.createElement('div');
        sessionPill.className = 'user-session-pill';
        sessionPill.innerHTML = `
          <div class="user-avatar-small" title="Signed in as ${escapeHtml(user.name)}">${escapeHtml(initials)}</div>
          <span class="user-name-small">${escapeHtml(user.name.split(' ')[0])}</span>
          <button type="button" class="btn btn-secondary btn-sm logout-btn" title="End local session">Logout</button>
        `;
        const logoutBtn = sessionPill.querySelector('.logout-btn');
        logoutBtn?.addEventListener('click', () => {
          clearCurrentUser();
          CampusX.showToast('You have signed out of this local browser session.', 'info');
        });
        container.appendChild(sessionPill);
      } else {
        const avatarEl = sessionPill.querySelector('.user-avatar-small');
        const nameEl = sessionPill.querySelector('.user-name-small');
        if (avatarEl) avatarEl.textContent = initials;
        if (nameEl) nameEl.textContent = user.name.split(' ')[0];
        sessionPill.style.display = 'inline-flex';
      }
    } else {
      if (sessionPill) {
        sessionPill.style.display = 'none';
      }
      authButtons.forEach(btn => (btn.style.display = ''));
    }
  });
}

/* ==========================================================================
   DOM CONTENT LOADED
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  ensureSeedData();
  updateAuthHeaderUI();
  initNavigation();
  initGlobalSearch();
  initAuthModals();
  initRoadmapPage();
  initRoadmapProgress();
  initMarketplace();
  initTeamsPage();
  initProjectsPage();
  initNotesPage();
  initPYQsPage();
  initHomepagePreviews();
  initGenericModals();
  initDynamicActions();
  initCareerPage();

  // Clear validation errors live as user types or changes fields
  document.addEventListener('input', e => {
    if (e.target && e.target.classList.contains('has-error')) {
      clearFieldError(e.target);
    }
  }, true);

  document.addEventListener('change', e => {
    if (e.target && e.target.classList.contains('has-error')) {
      clearFieldError(e.target);
    }
  }, true);
});

/* ==========================================================================
   1. NAVIGATION & MOBILE DRAWER
   ========================================================================== */

function initNavigation() {
  const header = document.querySelector('.header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileBtn && mobileDrawer && mobileOverlay) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('open');

      mobileOverlay.classList.toggle('open', isOpen);

      mobileBtn.textContent = isOpen ? '✕' : '☰';

      document.body.style.overflow = isOpen
        ? 'hidden'
        : '';
    };

    mobileBtn.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileOverlay.classList.remove('open');
        mobileBtn.textContent = '☰';
        document.body.style.overflow = '';
      });
    });
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 110;

      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');

      if (
        href &&
        current &&
        (href === `#${current}` ||
          href.endsWith(`#${current}`))
      ) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. GLOBAL SEARCH
   ========================================================================== */

function initGlobalSearch() {
  const searchModal = document.getElementById('searchModal');
  const searchTriggers = document.querySelectorAll('[data-trigger-search]');
  const searchInput = document.getElementById('globalSearchInput');
  const resultsContainer = document.getElementById('globalSearchResults');

  if (!searchModal) return;

  const searchIndex = [
    { title: 'Python Roadmap', category: 'Roadmap', url: 'roadmap.html?subject=python', icon: '🐍' },
    { title: 'Data Structures & Algorithms (DSA)', category: 'Roadmap', url: 'roadmap.html?subject=dsa', icon: '⚡' },
    { title: 'Full-Stack Web Development', category: 'Roadmap', url: 'roadmap.html?subject=webdev', icon: '🌐' },
    { title: 'C++ Programming Roadmap', category: 'Roadmap', url: 'roadmap.html?subject=cpp', icon: '💻' },
    { title: 'Java Programming Roadmap', category: 'Roadmap', url: 'roadmap.html?subject=java', icon: '☕' },
    { title: 'AI / ML Roadmap', category: 'Roadmap', url: 'roadmap.html?subject=aiml', icon: '🤖' },
    { title: 'Database Management Systems (DBMS)', category: 'Roadmap', url: 'roadmap.html?subject=dbms', icon: '🗄️' },
    { title: 'Operating Systems (OS)', category: 'Roadmap', url: 'roadmap.html?subject=os', icon: '⚙️' },
    { title: 'Computer Networks (CN)', category: 'Roadmap', url: 'roadmap.html?subject=cn', icon: '📡' },
    { title: 'Cyber Security Roadmap', category: 'Roadmap', url: 'roadmap.html?subject=cyber', icon: '🛡️' },
    { title: 'Cloud Computing Roadmap', category: 'Roadmap', url: 'roadmap.html?subject=cloud', icon: '☁️' },
    { title: 'C Programming Roadmap', category: 'Roadmap', url: 'roadmap.html?subject=c', icon: '📘' },

    { title: 'Scientific Calculators', category: 'Marketplace', url: 'material.html?category=calculators', icon: '🧮' },
    { title: 'Engineering Graphics Material (Drafters & Scales)', category: 'Marketplace', url: 'material.html?category=graphics', icon: '📐' },
    { title: 'Printed Academic Notes & Question Banks', category: 'Marketplace', url: 'material.html?category=pdf', icon: '📄' },

    { title: 'Frontend Developer Teammates', category: 'Teams', url: 'teams.html?role=frontend', icon: '🤝' },
    { title: 'AI / ML Teammates', category: 'Teams', url: 'teams.html?role=aiml', icon: '🤝' },
    { title: 'Full Stack Teammates', category: 'Teams', url: 'teams.html?role=fullstack', icon: '🤝' },
    { title: 'UI/UX Designer Teammates', category: 'Teams', url: 'teams.html?role=uiux', icon: '🎨' },
    { title: 'DevOps & Cloud Teammates', category: 'Teams', url: 'teams.html?role=devops', icon: '☁️' },

    { title: 'Student Projects Library & Showcase', category: 'Projects', url: 'projects.html', icon: '💻' },
    { title: 'Study Notes & Subject Units Directory', category: 'Notes', url: 'notes.html', icon: '📚' },
    { title: 'Previous Year Papers & Question Banks (PYQs)', category: 'PYQs', url: 'pyq.html', icon: '📄' },
    { title: 'Software Engineer Career Roadmap', category: 'Career', url: 'career.html#swe', icon: '🚀' },
    { title: 'Frontend Engineer Career Roadmap', category: 'Career', url: 'career.html#frontend', icon: '🌐' },
    { title: 'Backend Engineer Career Roadmap', category: 'Career', url: 'career.html#backend', icon: '⚙️' },
    { title: 'AI / ML Engineer Career Track', category: 'Career', url: 'career.html#aiml', icon: '🤖' },
    { title: 'Cloud & DevOps Career Roadmap', category: 'Career', url: 'career.html#devops', icon: '☁️' }
  ];

  const normalizeUrl = url => {
    if (!url) return '#';
    if (url.startsWith('pages/')) {
      return url.replace('pages/', '');
    }
    return url;
  };

  const renderResults = query => {
    if (!resultsContainer) return;

    const cleanQuery = cleanSearchString(query, 100);

    if (!cleanQuery) {
      resultsContainer.innerHTML = `
        <li class="search-empty-state">
          <p style="font-size: 0.95rem; font-weight: 600; color: var(--color-text);">
            Type keywords to search CampusX
          </p>
          <p style="font-size: 0.8rem; margin-top: 0.35rem;">
            Roadmaps • Study Notes • Teams • Marketplace • PYQs
          </p>
        </li>
      `;
      return;
    }

    const filtered = searchIndex.filter(item =>
      item.title.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery)
    );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <li class="search-empty-state">
          <p>
            No results found for "<strong>${escapeHtml(query)}</strong>"
          </p>
          <p style="font-size: 0.8rem; margin-top: 0.35rem;">
            Try searching for Python, Calculator, Notes, or Teams.
          </p>
        </li>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map(item => `
      <li class="search-result-item">
        <a href="${escapeHtml(normalizeUrl(item.url))}">
          <div class="search-item-info">
            <span class="search-item-icon">${item.icon}</span>
            <div>
              <div style="font-weight: 600; font-size: 0.92rem;">
                ${highlightMatch(item.title, cleanQuery)}
              </div>
              <span class="badge badge-gray" style="font-size: 0.68rem; margin-top: 0.2rem;">
                ${escapeHtml(item.category)}
              </span>
            </div>
          </div>
          <span style="font-size: 0.78rem; color: #94a3b8;">
            Jump to →
          </span>
        </a>
      </li>
    `).join('');
  };

  searchTriggers.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      CampusX.openModal('searchModal');
      renderResults('');
    });
  });

  window.addEventListener('keydown', e => {
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === 'k'
    ) {
      e.preventDefault();

      CampusX.openModal('searchModal');
      renderResults('');
    }

    if (e.key === 'Escape') {
      CampusX.closeAllModals();
    }
  });

  searchInput?.addEventListener('input', e => {
    renderResults(e.target.value);
  });
}

/* ==========================================================================
   3. AUTH MODALS
   ========================================================================== */

function initAuthModals() {
  const authModal = document.getElementById('authModal');
  const loginTab = document.getElementById('loginTabBtn');
  const registerTab = document.getElementById('registerTabBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (!authModal) return;

  document.querySelectorAll('[data-open-auth]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();

      const mode = btn.getAttribute('data-open-auth') || 'login';

      switchAuthTab(mode);
      CampusX.openModal('authModal');
    });
  });

  function switchAuthTab(tab) {
    if (tab === 'register') {
      registerTab?.classList.add('active');
      loginTab?.classList.remove('active');

      registerForm?.style.setProperty('display', 'block');
      loginForm?.style.setProperty('display', 'none');
    } else {
      loginTab?.classList.add('active');
      registerTab?.classList.remove('active');

      loginForm?.style.setProperty('display', 'block');
      registerForm?.style.setProperty('display', 'none');
    }
  }

  loginTab?.addEventListener('click', () => {
    switchAuthTab('login');
  });

  registerTab?.addEventListener('click', () => {
    switchAuthTab('register');
  });

  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm(loginForm)) return;

    const identifier =
      document.getElementById('loginIdentifier')?.value.trim() || '';

    const password =
      document.getElementById('loginPassword')?.value || '';

    if (!identifier || !password) {
      CampusX.showToast('Please enter your login details.', 'error');
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Login';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
    }

    let apiUser = null;
    let apiSuccess = false;

    try {
      const apiRes = await CampusXAPI.login({ email: identifier, password });
      if (apiRes && apiRes.success && apiRes.user) {
        apiUser = apiRes.user;
        apiSuccess = true;
        if (apiRes.token) {
          localStorage.setItem('campusx_auth_token', apiRes.token);
        }
      } else if (apiRes && apiRes.error === 'Invalid Credentials') {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        CampusX.showToast('Invalid email or password.', 'error');
        return;
      }
    } catch (err) {
      console.warn('CampusX API login fallback:', err);
    }

    if (!apiUser) {
      // Graceful fallback to local browser session
      const cleanId = cleanString(identifier, 100);
      const displayName = cleanId.includes('@')
        ? cleanId.split('@')[0].replace(/[._]/g, ' ')
        : cleanId;

      apiUser = {
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase()}@campusx.edu`,
        role: 'Student Member',
        branch: 'Engineering',
        year: 'SE'
      };
      apiUser.avatarInitials = apiUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
    }

    setCurrentUser(apiUser);

    if (apiSuccess) {
      CampusX.showToast(`Welcome back, ${apiUser.name}! (Authenticated via CampusX API)`, 'success');
    } else {
      CampusX.showToast(`Welcome back, ${apiUser.name}! (Local browser session active)`, 'info');
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }

    CampusX.closeModal('authModal');
    loginForm.reset();
  });

  registerForm?.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm(registerForm)) return;

    const name = getFormValue('regName', '', 100);
    const email = getFormValue('regEmail', '', 254).toLowerCase();
    const mobile = getFormValue('regMobile', '', 15);
    const college = getFormValue('regCollege', '', 150);
    const branch = getFormValue('regBranch', '', 100);
    const year = getFormValue('regYear', '', 50);
    const role = getFormValue('regRole', '', 100);
    const password = document.getElementById('regPassword')?.value || '';
    const confirmPassword = document.getElementById('regConfirmPassword')?.value || '';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[6-9]\d{9}$/;

    if (!name || name.length < 2) {
      markFieldError(document.getElementById('regName'), 'Enter a valid name.');
      return;
    }

    if (!emailPattern.test(email)) {
      markFieldError(document.getElementById('regEmail'), 'Enter a valid email address.');
      return;
    }

    if (!mobilePattern.test(mobile)) {
      markFieldError(document.getElementById('regMobile'), 'Enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 8) {
      markFieldError(document.getElementById('regPassword'), 'Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      markFieldError(document.getElementById('regConfirmPassword'), 'Passwords do not match.');
      return;
    }

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Register';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
    }

    let createdUser = null;
    let registeredOnServer = false;

    try {
      const regRes = await CampusXAPI.register({
        name,
        email,
        password,
        role: role || 'Engineering Student',
        branch: branch || 'Engineering',
        year: year || 'SE',
        college: college || 'Engineering College'
      });

      if (regRes && regRes.success && regRes.user) {
        createdUser = regRes.user;
        registeredOnServer = true;
        if (regRes.token) {
          localStorage.setItem('campusx_auth_token', regRes.token);
        }
      } else if (regRes && regRes.success === false) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        CampusX.showToast(regRes.message || 'Registration failed. An account with this email may already exist.', 'error');
        return;
      }
    } catch (err) {
      console.warn('CampusX API registration fallback:', err);
    }

    if (!createdUser) {
      createdUser = {
        name,
        email,
        mobile,
        college,
        branch,
        year,
        role: role || 'Engineering Student',
        avatarInitials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST'
      };
    }

    try {
      localStorage.setItem('campusx_demo_profile', JSON.stringify(createdUser));
    } catch {}

    setCurrentUser(createdUser);

    if (registeredOnServer) {
      CampusX.showToast(`Welcome to CampusX, ${name}! Account created and authenticated via CampusX API.`, 'success');
    } else {
      CampusX.showToast(`Welcome to CampusX, ${name}! Student profile created and session is active.`, 'success');
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }

    CampusX.closeModal('authModal');
    registerForm.reset();
  });
}

/* ==========================================================================
   4. ROADMAP PROGRESS
   ========================================================================== */

function initRoadmapProgress() {
  const checkboxes = document.querySelectorAll(
    '.checklist-checkbox'
  );

  if (checkboxes.length === 0) return;

  const storageKeyPrefix = 'campusx_roadmap_';

  function updateProgressBar() {
    const total = checkboxes.length;

    let completed = 0;

    checkboxes.forEach(box => {
      if (box.checked) completed++;
    });

    const pct =
      total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const fillElem =
      document.querySelector('.progress-bar-fill');

    const textElem =
      document.querySelector('.progress-pct');

    const statElem =
      document.querySelector('.progress-stats');

    if (fillElem) {
      fillElem.style.width = `${pct}%`;
    }

    if (textElem) {
      textElem.textContent = `${pct}%`;
    }

    if (statElem) {
      statElem.textContent =
        `${completed} of ${total} topics completed`;
    }
  }

  checkboxes.forEach(checkbox => {
    const itemKey =
      checkbox.getAttribute('data-item-id') ||
      checkbox.id;

    if (!itemKey) return;

    const savedState =
      localStorage.getItem(
        storageKeyPrefix + itemKey
      );

    if (savedState === 'true') {
      checkbox.checked = true;

      checkbox
        .closest('.checklist-item')
        ?.classList.add('completed');
    }

    checkbox.addEventListener('change', () => {
      const isChecked = checkbox.checked;

      try {
        localStorage.setItem(
          storageKeyPrefix + itemKey,
          String(isChecked)
        );
      } catch {
        CampusX.showToast(
          'Unable to save roadmap progress.',
          'error'
        );
      }

      checkbox
        .closest('.checklist-item')
        ?.classList.toggle(
          'completed',
          isChecked
        );

      updateProgressBar();

      if (isChecked) {
        CampusX.showToast(
          'Topic marked as completed! 🎯',
          'success'
        );
      }
    });
  });

  updateProgressBar();

  const resetBtn =
    document.getElementById('resetRoadmapBtn');

  resetBtn?.addEventListener('click', () => {
    if (
      !window.confirm(
        'Reset your progress checklist for this roadmap?'
      )
    ) {
      return;
    }

    checkboxes.forEach(box => {
      const itemKey =
        box.getAttribute('data-item-id') ||
        box.id;

      if (itemKey) {
        localStorage.removeItem(
          storageKeyPrefix + itemKey
        );
      }

      box.checked = false;

      box
        .closest('.checklist-item')
        ?.classList.remove('completed');
    });

    updateProgressBar();

    CampusX.showToast(
      'Progress checklist reset.',
      'info'
    );
  });
}

/* ==========================================================================
   5. ROADMAP DATA
   ========================================================================== */

const ROADMAP_DATA = {
  python: {
    title: 'Python Programming Roadmap',
    tagline: 'Learn Python from foundational syntax to building backend APIs and automation pipelines.',
    overview: 'Python is a versatile, high-level language used widely in backend web development, automation, and data analysis.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Fundamentals & Syntax',
        topics: [
          { id: 'py_1', title: 'Variables & Data Types', desc: 'integers, floats, strings, booleans, type casting' },
          { id: 'py_2', title: 'Conditions & Operators', desc: 'if, elif, else, comparison and boolean operators' },
          { id: 'py_3', title: 'Loops & Iterations', desc: 'for loops, while loops, break, continue, range()' },
          { id: 'py_4', title: 'Functions & Scope', desc: 'def, parameters, return values, *args, **kwargs' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Collections & OOP',
        topics: [
          { id: 'py_5', title: 'Core Collections', desc: 'Lists, Tuples, Sets, Dictionaries and comprehensions' },
          { id: 'py_6', title: 'File Handling', desc: 'Reading and writing files with context managers' },
          { id: 'py_7', title: 'Exception Handling', desc: 'try, except, else, finally blocks' },
          { id: 'py_8', title: 'Object-Oriented Programming', desc: 'Classes, objects, inheritance, encapsulation' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Advanced Concepts',
        topics: [
          { id: 'py_9', title: 'Modules & Virtual Environments', desc: 'pip, venv, project structure' },
          { id: 'py_10', title: 'Working with APIs', desc: 'HTTP requests, JSON parsing, API consumption' },
          { id: 'py_11', title: 'Database Connectivity', desc: 'SQLite3 / PostgreSQL integration' }
        ]
      },
      {
        level: 'Projects',
        title: 'Level 4: Real-world Practice',
        topics: [
          { id: 'py_12', title: 'CLI Utility or Quiz App', desc: 'Terminal application with input handling' },
          { id: 'py_13', title: 'Automation Script', desc: 'Automated data extraction or file management' },
          { id: 'py_14', title: 'REST API Service', desc: 'CRUD endpoints with Flask or FastAPI' }
        ]
      }
    ],
    practice: {
      easy: ['Palindrome Checker', 'Prime Number Generator', 'Fibonacci Sequence'],
      medium: ['Custom CSV Parser', 'Bank Account OOP Class', 'Password Validator'],
      hard: ['Rate Limiter Decorator', 'Multi-threaded Web Worker', 'In-Memory Key-Value Store']
    },
    careerTree: ['Python Foundations', 'Backend Framework', 'Python Developer', 'Software Engineer']
  },

  dsa: {
    title: 'Data Structures & Algorithms (DSA)',
    tagline: 'Master algorithmic problem solving and essential computer science structures.',
    overview: 'DSA provides the problem-solving foundation required for technical interviews and efficient software design.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Complexity & Linear Structures',
        topics: [
          { id: 'dsa_1', title: 'Big-O Asymptotic Analysis', desc: 'Time and space complexity fundamentals' },
          { id: 'dsa_2', title: 'Arrays & Strings', desc: 'Two pointers, sliding window technique' },
          { id: 'dsa_3', title: 'Linked Lists', desc: 'Singly and doubly linked lists, reversal' },
          { id: 'dsa_4', title: 'Stacks & Queues', desc: 'LIFO, FIFO, circular queue operations' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Searching, Sorting & Recursion',
        topics: [
          { id: 'dsa_5', title: 'Binary Search', desc: 'Searching sorted spaces, peak elements' },
          { id: 'dsa_6', title: 'Sorting Algorithms', desc: 'Merge Sort, Quick Sort, stability' },
          { id: 'dsa_7', title: 'Recursion & Backtracking', desc: 'Subsets, permutations, base cases' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Trees & Graphs',
        topics: [
          { id: 'dsa_8', title: 'Binary Search Trees', desc: 'Inorder, preorder, postorder, BFS' },
          { id: 'dsa_9', title: 'Heaps & Priority Queues', desc: 'Min-heap, max-heap, Top K elements' },
          { id: 'dsa_10', title: 'Graph Algorithms', desc: 'BFS, DFS, Dijkstra shortest path' }
        ]
      },
      {
        level: 'Practice',
        title: 'Level 4: Dynamic Programming',
        topics: [
          { id: 'dsa_11', title: '1D & 2D Dynamic Programming', desc: 'Knapsack, LCS, memoization vs tabulation' },
          { id: 'dsa_12', title: 'Trie Data Structure', desc: 'Prefix trees, word search dictionary' }
        ]
      }
    ],
    practice: {
      easy: ['Two Sum', 'Valid Parentheses', 'Reverse Linked List'],
      medium: ['3Sum', 'Longest Substring Without Repeating Characters', 'Course Schedule'],
      hard: ['Trapping Rain Water', 'Word Ladder', 'Merge K Sorted Lists']
    },
    careerTree: ['DSA Foundations', 'Competitive Programming', 'Technical Interview Prep', 'Software Engineer']
  },

  webdev: {
    title: 'Full-Stack Web Development',
    tagline: 'From semantic markup to production web applications with REST APIs.',
    overview: 'Web development covers semantic markup, modern CSS layouts, client-side interactivity, and server-side APIs.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Semantic Frontend',
        topics: [
          { id: 'web_1', title: 'Semantic HTML5', desc: 'Accessible markup, forms, document structure' },
          { id: 'web_2', title: 'CSS3 & Responsive Design', desc: 'Flexbox, Grid, media queries' },
          { id: 'web_3', title: 'Vanilla JavaScript', desc: 'DOM manipulation, event listeners, Fetch API' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Frontend Architecture',
        topics: [
          { id: 'web_4', title: 'Component-Based Structure', desc: 'State management and reusable components' },
          { id: 'web_5', title: 'Routing & API Data Fetching', desc: 'Async/await, handling loading/error states' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Backend & Database',
        topics: [
          { id: 'web_6', title: 'Server Engine (Node.js / Express)', desc: 'Middleware, REST endpoints, routing' },
          { id: 'web_7', title: 'Relational Database (PostgreSQL)', desc: 'Tables, foreign keys, SQL queries' },
          { id: 'web_8', title: 'Authentication & Security', desc: 'Password hashing, token authentication' }
        ]
      },
      {
        level: 'Projects',
        title: 'Level 4: Production Deployment',
        topics: [
          { id: 'web_9', title: 'Git & Version Control', desc: 'Commits, branching, pull requests' },
          { id: 'web_10', title: 'Cloud Hosting', desc: 'Deploying frontend and backend services' }
        ]
      }
    ],
    practice: {
      easy: ['Responsive Portfolio Page', 'Todo App with LocalStorage', 'Weather Display App'],
      medium: ['Note Taking App with Tags', 'Student Registration Portal', 'Product Filter Catalog'],
      hard: ['Real-time Chat App', 'Role-based Dashboard', 'Collaborative Editor']
    },
    careerTree: ['Frontend Basics', 'Backend & Database', 'Full Stack Developer', 'Software Engineer']
  },

  c: {
    title: 'C Programming Roadmap',
    tagline: 'Master low-level programming, memory addressing, and foundational computation.',
    overview: 'C provides direct control over hardware and memory, making it vital for operating systems and embedded development.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Syntax & Control Structures',
        topics: [
          { id: 'c_1', title: 'Data Types & Format Specifiers', desc: 'int, float, char, printf, scanf' },
          { id: 'c_2', title: 'Control Statements', desc: 'if-else, switch case, while, for loops' },
          { id: 'c_3', title: '1D & 2D Arrays', desc: 'Array declarations, matrix operations, indexing' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Pointers & Memory',
        topics: [
          { id: 'c_4', title: 'Pointers & Address Arithmetic', desc: 'Address-of operator, dereferencing, pointer arithmetic' },
          { id: 'c_5', title: 'Dynamic Memory Allocation', desc: 'malloc, calloc, realloc, free, memory leak detection' },
          { id: 'c_6', title: 'Structures & Unions', desc: 'struct definitions, typedef, self-referential structures' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: File I/O & Preprocessor',
        topics: [
          { id: 'c_7', title: 'File Handling Operations', desc: 'fopen, fread, fwrite, fclose, binary modes' },
          { id: 'c_8', title: 'Preprocessor Macros & Headers', desc: '#define, conditional compilation, header inclusion' }
        ]
      }
    ],
    practice: {
      easy: ['Factorial Recursion', 'Matrix Multiplication', 'String Reversal without library'],
      medium: ['Custom Dynamic String Library', 'Student Record File Manager', 'Singly Linked List in C'],
      hard: ['Memory Allocator Implementation', 'Mini Shell Parser', 'Binary File Compressor']
    },
    careerTree: ['C Foundations', 'System Programming', 'Embedded Systems', 'Core Systems Engineer']
  },

  cpp: {
    title: 'C++ Programming Roadmap',
    tagline: 'Modern object-oriented programming, STL, and high-performance computation.',
    overview: 'C++ combines low-level memory efficiency with powerful abstractions, standard libraries, and high performance.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Language Fundamentals',
        topics: [
          { id: 'cpp_1', title: 'Input/Output & Namespaces', desc: 'cin, cout, std namespace, references' },
          { id: 'cpp_2', title: 'Function Overloading & Inline', desc: 'Default arguments, function signatures' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Object-Oriented Principles',
        topics: [
          { id: 'cpp_3', title: 'Classes & Constructors', desc: 'Constructors, destructors, copy constructor' },
          { id: 'cpp_4', title: 'Inheritance & Polymorphism', desc: 'Virtual functions, abstract classes, vtables' },
          { id: 'cpp_5', title: 'Operator Overloading', desc: 'Overloading arithmetic and stream operators' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Standard Template Library (STL)',
        topics: [
          { id: 'cpp_6', title: 'Containers', desc: 'vector, list, deque, map, unordered_map, set' },
          { id: 'cpp_7', title: 'Iterators & Algorithms', desc: 'sort, binary_search, lambda functions' },
          { id: 'cpp_8', title: 'Smart Pointers', desc: 'unique_ptr, shared_ptr, weak_ptr' }
        ]
      }
    ],
    practice: {
      easy: ['Bank Account Simulation', 'Complex Number Calculator', 'Matrix Class'],
      medium: ['Custom Vector Class', 'LRU Cache using STL', 'Expression Evaluator'],
      hard: ['High-Frequency Order Book', 'Thread Pool Engine', 'Ray Tracer']
    },
    careerTree: ['C++ Basics', 'STL & Algorithms', 'High Performance Systems', 'Software Engineer']
  },

  java: {
    title: 'Java Programming Roadmap',
    tagline: 'Enterprise-grade object-oriented engineering with JVM internals and Spring Boot.',
    overview: 'Java is an industry powerhouse known for strong typing, portability across platforms, and enterprise scalability.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Core Syntax & OOP',
        topics: [
          { id: 'jav_1', title: 'Syntax & Type System', desc: 'JVM, JRE, primitive types, loops, arrays' },
          { id: 'jav_2', title: 'Class Hierarchies', desc: 'Encapsulation, inheritance, polymorphism, interfaces' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Java Collections & Streams',
        topics: [
          { id: 'jav_3', title: 'Collections Framework', desc: 'List, Set, Map, Queue implementations' },
          { id: 'jav_4', title: 'Exceptions & Generics', desc: 'Checked vs unchecked exceptions, type parameters' },
          { id: 'jav_5', title: 'Java Streams & Lambdas', desc: 'Functional interfaces, map, filter, collect' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Concurrency & Backend',
        topics: [
          { id: 'jav_6', title: 'Multithreading & Executors', desc: 'Thread lifecycle, synchronization, locks' },
          { id: 'jav_7', title: 'JDBC & Spring Boot Basics', desc: 'REST endpoints, JPA repository, dependency injection' }
        ]
      }
    ],
    practice: {
      easy: ['Employee Payroll System', 'Library Book Tracker', 'Password Generator'],
      medium: ['Multi-threaded Downloader', 'JDBC CRUD Console App', 'REST API with Spring Boot'],
      hard: ['Distributed Job Queue', 'Microservices Architecture', 'Custom Connection Pool']
    },
    careerTree: ['Core Java', 'Spring Boot & Microservices', 'Enterprise Java Developer', 'Software Architect']
  },

  dbms: {
    title: 'Database Management Systems (DBMS)',
    tagline: 'Relational database modeling, normalization, indexing, and ACID transactions.',
    overview: 'DBMS principles govern how structured data is organized, queried with SQL, and reliably maintained in production.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Relational Model & SQL',
        topics: [
          { id: 'db_1', title: 'Relational Algebra & ER Diagrams', desc: 'Entities, relationships, cardinalities, primary keys' },
          { id: 'db_2', title: 'SQL DDL & DML', desc: 'CREATE, ALTER, INSERT, UPDATE, DELETE' },
          { id: 'db_3', title: 'Joins & Subqueries', desc: 'INNER, LEFT, RIGHT, FULL OUTER joins, nested queries' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Normalization & Transactions',
        topics: [
          { id: 'db_4', title: 'Normalization (1NF to BCNF)', desc: 'Functional dependencies, anomaly prevention' },
          { id: 'db_5', title: 'ACID Properties', desc: 'Atomicity, Consistency, Isolation, Durability' },
          { id: 'db_6', title: 'Concurrency Control', desc: 'Two-phase locking, deadlocks, serializability' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Optimization & Indexing',
        topics: [
          { id: 'db_7', title: 'B-Trees & Index Tuning', desc: 'Clustered vs non-clustered indexes, query execution plans' },
          { id: 'db_8', title: 'NoSQL Alternatives', desc: 'Document stores (MongoDB), key-value stores (Redis)' }
        ]
      }
    ],
    practice: {
      easy: ['University Schema Design', 'Complex SQL Aggregations', 'Join Queries on E-Commerce'],
      medium: ['Normalized Hospital Database', 'Query Optimizer Analysis', 'Transaction Isolation Playground'],
      hard: ['Database Sharding Simulation', 'Write-Ahead Log Engine', 'Custom B-Tree Indexer']
    },
    careerTree: ['SQL Foundations', 'Database Administration', 'Backend Engineering', 'Data Architect']
  },

  os: {
    title: 'Operating Systems (OS)',
    tagline: 'Kernel architecture, CPU scheduling, virtual memory, and process synchronization.',
    overview: 'Operating systems manage hardware resources, process concurrency, virtual memory spaces, and storage systems.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Processes & Threads',
        topics: [
          { id: 'os_1', title: 'Processes & System Calls', desc: 'fork, exec, PCB, process states, context switching' },
          { id: 'os_2', title: 'Threads & Concurrency', desc: 'User vs kernel threads, race conditions' },
          { id: 'os_3', title: 'CPU Scheduling Algorithms', desc: 'FCFS, SJF, Round Robin, Priority scheduling' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Synchronization & Deadlocks',
        topics: [
          { id: 'os_4', title: 'Critical Section & Mutex', desc: 'Semaphores, Peterson solution, condition variables' },
          { id: 'os_5', title: 'Deadlock Detection & Handling', desc: 'Banker algorithm, resource allocation graphs' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Memory & File Systems',
        topics: [
          { id: 'os_6', title: 'Paging & Virtual Memory', desc: 'TLB, page tables, page replacement algorithms (LRU, FIFO)' },
          { id: 'os_7', title: 'File System Architecture', desc: 'Inodes, directory structures, disk scheduling' }
        ]
      }
    ],
    practice: {
      easy: ['CPU Scheduler Visualizer', 'Fork Process Tree', 'Producer-Consumer Semaphore'],
      medium: ['Banker Algorithm Simulator', 'LRU Page Replacement', 'Dining Philosophers Problem'],
      hard: ['Custom Memory Allocator', 'Kernel Module for Linux', 'User-space Thread Scheduler']
    },
    careerTree: ['OS Concepts', 'Linux Systems Programming', 'Core Infrastructure', 'Systems Software Engineer']
  },

  cn: {
    title: 'Computer Networks (CN)',
    tagline: 'OSI 7-layer model, TCP/IP stack, routing protocols, and socket programming.',
    overview: 'Computer networks govern how data packets traverse the internet reliably and securely from client to server.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Network Models & Physical Layer',
        topics: [
          { id: 'cn_1', title: 'OSI & TCP/IP Reference Models', desc: 'Layer responsibilities, packet encapsulation' },
          { id: 'cn_2', title: 'Data Link Layer & Framing', desc: 'Error detection (CRC), MAC addresses, CSMA/CD' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: IP Addressing & Routing',
        topics: [
          { id: 'cn_3', title: 'IPv4 & IPv6 Subnetting', desc: 'CIDR notation, subnet masks, private IP ranges' },
          { id: 'cn_4', title: 'Routing Protocols', desc: 'Distance vector (RIP), Link state (OSPF), BGP' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Transport & Application Layers',
        topics: [
          { id: 'cn_5', title: 'TCP vs UDP Protocols', desc: '3-way handshake, sliding window, congestion control' },
          { id: 'cn_6', title: 'DNS, HTTP/HTTPS & TLS', desc: 'Domain lookup, HTTP verbs, TLS handshake, SSL' },
          { id: 'cn_7', title: 'Socket Programming', desc: 'Client-server communication using TCP/UDP sockets' }
        ]
      }
    ],
    practice: {
      easy: ['Subnet Calculator', 'Port Scanner Script', 'DNS Lookup Tool'],
      medium: ['Multi-client TCP Chat Room', 'HTTP File Server from Sockets', 'Packet Sniffer using Scapy'],
      hard: ['Custom Reliable UDP Protocol', 'Mini Software Router', 'Load Balancer Proxy']
    },
    careerTree: ['Networking Basics', 'Network Engineering', 'Cloud Networking', 'Infrastructure Engineer']
  },

  aiml: {
    title: 'Artificial Intelligence & Machine Learning (AI/ML)',
    tagline: 'Mathematics for ML, supervised models, deep neural networks, and model deployment.',
    overview: 'AI and Machine Learning enable computers to learn predictive patterns from data to automate decision-making.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Foundations & Math',
        topics: [
          { id: 'ai_1', title: 'Linear Algebra & Calculus', desc: 'Vectors, matrices, dot products, gradients' },
          { id: 'ai_2', title: 'Probability & Statistics', desc: 'Distributions, mean, variance, Bayes theorem' },
          { id: 'ai_3', title: 'Data Analysis with Pandas/NumPy', desc: 'Data cleaning, feature transformation, visualization' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Supervised & Unsupervised ML',
        topics: [
          { id: 'ai_4', title: 'Regression & Classification', desc: 'Linear/Logistic regression, Decision Trees, Random Forests' },
          { id: 'ai_5', title: 'Model Evaluation & Metrics', desc: 'Precision, recall, F1-score, cross-validation' },
          { id: 'ai_6', title: 'Clustering & Dimensionality Reduction', desc: 'K-Means, PCA, feature selection' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Deep Learning & Deployment',
        topics: [
          { id: 'ai_7', title: 'Neural Networks & PyTorch', desc: 'Feedforward networks, backpropagation, activation functions' },
          { id: 'ai_8', title: 'Computer Vision / NLP Basics', desc: 'CNNs, Transformers, tokenization' },
          { id: 'ai_9', title: 'Model Serving & APIs', desc: 'Serving predictions via FastAPI' }
        ]
      }
    ],
    practice: {
      easy: ['House Price Linear Regression', 'Iris Flower Classifier', 'Customer Segmentation with K-Means'],
      medium: ['Handwritten Digit Classifier (MNIST)', 'Sentiment Analysis on Reviews', 'Spam Email Detector'],
      hard: ['Object Detection with YOLO', 'Transformer Text Summarizer', 'End-to-End MLOps Pipeline']
    },
    careerTree: ['Python & Math', 'Classical Machine Learning', 'Deep Learning', 'AI / ML Engineer']
  },

  cyber: {
    title: 'Cyber Security Roadmap',
    tagline: 'Network security, vulnerability assessment, cryptography, and secure systems.',
    overview: 'Cyber security focuses on safeguarding computer systems, networks, and applications against unauthorized access and attacks.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Security Fundamentals',
        topics: [
          { id: 'cy_1', title: 'CIA Triad & Security Principles', desc: 'Confidentiality, Integrity, Availability, defense in depth' },
          { id: 'cy_2', title: 'Linux Fundamentals & Shell', desc: 'Permissions, processes, log analysis' },
          { id: 'cy_3', title: 'Basic Cryptography', desc: 'Symmetric (AES) vs Asymmetric (RSA), hashing (SHA-256)' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Web & Network Security',
        topics: [
          { id: 'cy_4', title: 'OWASP Top 10 Vulnerabilities', desc: 'SQL Injection, XSS, CSRF, broken authentication' },
          { id: 'cy_5', title: 'Network Security & Firewalls', desc: 'Port scanning, Wireshark, IDS/IPS, VPNs' },
          { id: 'cy_6', title: 'Vulnerability Assessment', desc: 'Nmap reconnaissance, vulnerability scanning tools' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Defensive & Offensive Ops',
        topics: [
          { id: 'cy_7', title: 'SOC & Incident Response', desc: 'SIEM tools, log correlation, threat hunting' },
          { id: 'cy_8', title: 'Penetration Testing Methodology', desc: 'Exploitation frameworks, reporting remediation' }
        ]
      }
    ],
    practice: {
      easy: ['Caesar & Vigenere Cipher Tools', 'SQLi Vulnerable Lab', 'Basic Nmap Network Audit'],
      medium: ['XSS Defense Filter Implementation', 'Password Hash Cracker', 'Wireshark Packet Analysis'],
      hard: ['Secure Authentication Service with MFA', 'Custom Intrusion Detection Rule', 'CTF Challenge Creation']
    },
    careerTree: ['Security Basics', 'Network & Web Security', 'Security Analyst', 'Cyber Security Engineer']
  },

  cloud: {
    title: 'Cloud Computing Roadmap',
    tagline: 'Infrastructure as code, containerization, microservices, and serverless architectures.',
    overview: 'Cloud computing powers modern software deployment, scalability, managed databases, and global delivery networks.',
    levels: [
      {
        level: 'Beginner',
        title: 'Level 1: Cloud Concepts & Virtualization',
        topics: [
          { id: 'cl_1', title: 'Cloud Models (IaaS, PaaS, SaaS)', desc: 'Shared responsibility model, public vs private clouds' },
          { id: 'cl_2', title: 'Virtual Machines & Storage', desc: 'Compute instances, block storage, object storage (S3)' },
          { id: 'cl_3', title: 'Virtual Private Clouds (VPC)', desc: 'Subnets, route tables, internet gateways, security groups' }
        ]
      },
      {
        level: 'Intermediate',
        title: 'Level 2: Containers & Automation',
        topics: [
          { id: 'cl_4', title: 'Docker Containerization', desc: 'Dockerfiles, container images, volume mounts' },
          { id: 'cl_5', title: 'CI/CD Pipelines', desc: 'Automated testing and deployment with GitHub Actions' },
          { id: 'cl_6', title: 'Serverless Functions', desc: 'Event-driven computing, API Gateways' }
        ]
      },
      {
        level: 'Advanced',
        title: 'Level 3: Orchestration & Infrastructure as Code',
        topics: [
          { id: 'cl_7', title: 'Kubernetes (K8s) Basics', desc: 'Pods, Deployments, Services, Ingress controllers' },
          { id: 'cl_8', title: 'Infrastructure as Code (Terraform)', desc: 'Declarative resource provisioning, state files' },
          { id: 'cl_9', title: 'Observability & Monitoring', desc: 'Metrics, distributed tracing, alerting' }
        ]
      }
    ],
    practice: {
      easy: ['Static Website on S3 with CDN', 'Dockerize a Web App', 'GitHub Actions Test Pipeline'],
      medium: ['Multi-tier App with VPC & Managed DB', 'Serverless Image Resizer', 'Terraform Cloud Provisioner'],
      hard: ['Kubernetes Cluster with Autoscaling', 'Zero-Downtime Deployment', 'Multi-Region Disaster Recovery']
    },
    careerTree: ['Linux & Networking', 'Docker & CI/CD', 'Cloud Engineering', 'DevOps / Site Reliability Engineer']
  }
};

/* ==========================================================================
   6. ROADMAP DETAIL PAGE
   ========================================================================== */

function initRoadmapPage() {
  const container =
    document.getElementById('roadmapDetailContainer');

  if (!container) return;

  const urlParams =
    new URLSearchParams(window.location.search);

  let currentSubject =
    urlParams.get('subject') || 'python';

  if (!ROADMAP_DATA[currentSubject]) {
    currentSubject = 'python';
  }

  document.querySelectorAll('[data-roadmap-subject]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-roadmap-subject') === currentSubject);
  });

  renderRoadmapSubject(currentSubject);
  initRoadmapProgress();

  document
    .querySelectorAll('[data-roadmap-subject]')
    .forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();

        const subject =
          btn.getAttribute('data-roadmap-subject');

        if (ROADMAP_DATA[subject]) {
          document
            .querySelectorAll('[data-roadmap-subject]')
            .forEach(b => b.classList.remove('active'));

          btn.classList.add('active');

          renderRoadmapSubject(subject);

          initRoadmapProgress();

          window.history.replaceState(
            null,
            '',
            `?subject=${encodeURIComponent(subject)}`
          );
        } else {
          CampusX.showToast(
            'This roadmap is being updated.',
            'info'
          );
        }
      });
    });
}

function renderRoadmapSubject(subjectKey) {
  const data = ROADMAP_DATA[subjectKey];

  const container =
    document.getElementById('roadmapDetailContainer');

  if (!container || !data) return;

  container.innerHTML = `
    <div class="roadmap-progress-header">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
        <div>
          <span class="badge badge-indigo" style="margin-bottom: 0.35rem;">
            Engineering Curriculum
          </span>

          <h2 style="font-size: 1.65rem; margin-bottom: 0.25rem;">
            ${escapeHtml(data.title)}
          </h2>

          <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width: 600px;">
            ${escapeHtml(data.tagline)}
          </p>
        </div>

        <button
          class="btn btn-secondary btn-sm"
          id="resetRoadmapBtn"
          type="button"
        >
          ↺ Reset Checklist
        </button>
      </div>

      <div class="progress-bar-wrapper">
        <div class="progress-bar-fill"></div>
      </div>

      <div class="progress-info-row">
        <span class="progress-stats">
          0 of 0 topics completed
        </span>

        <span class="progress-pct">
          0%
        </span>
      </div>
    </div>

    ${data.levels.map(level => `
      <div class="roadmap-level-section">
        <div class="level-header">
          <span class="level-tag">
            ${escapeHtml(level.level)}
          </span>

          <h3 class="level-title">
            ${escapeHtml(level.title)}
          </h3>
        </div>

        <div class="checklist-group">
          ${level.topics.map(topic => `
            <div class="checklist-item">
              <input
                type="checkbox"
                class="checklist-checkbox"
                id="${escapeHtml(topic.id)}"
                data-item-id="${escapeHtml(topic.id)}"
              />

              <label
                class="checklist-label"
                for="${escapeHtml(topic.id)}"
              >
                <div class="checklist-item-title">
                  ${escapeHtml(topic.title)}
                </div>

                <div class="checklist-item-desc">
                  ${escapeHtml(topic.desc)}
                </div>
              </label>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}

    <div class="card" style="margin-bottom: 1.5rem;">
      <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">
        Hands-on Practice Tracks
      </h3>

      <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
        Recommended implementation challenges to solidify your understanding.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-sm); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.88rem; color: #166534; margin-bottom: 0.5rem;">
            🟢 Easy Track
          </div>

          <ul style="padding-left: 1.1rem; font-size: 0.82rem; color: #14532d; margin: 0;">
            ${data.practice.easy.map(p => `
              <li style="margin-bottom: 0.25rem;">
                ${escapeHtml(p)}
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-sm); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.88rem; color: #1e40af; margin-bottom: 0.5rem;">
            🔵 Medium Track
          </div>

          <ul style="padding-left: 1.1rem; font-size: 0.82rem; color: #1e3a8a; margin: 0;">
            ${data.practice.medium.map(p => `
              <li style="margin-bottom: 0.25rem;">
                ${escapeHtml(p)}
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-sm); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.88rem; color: #991b1b; margin-bottom: 0.5rem;">
            🔴 Hard Track
          </div>

          <ul style="padding-left: 1.1rem; font-size: 0.82rem; color: #7f1d1d; margin: 0;">
            ${data.practice.hard.map(p => `
              <li style="margin-bottom: 0.25rem;">
                ${escapeHtml(p)}
              </li>
            `).join('')}
          </ul>
        </div>

      </div>
    </div>

    <div class="card">
      <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">
        Career Path Progression
      </h3>

      <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
        How this subject connects to technology engineering career paths.
      </p>

      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem; background: var(--color-card); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
        ${data.careerTree.map((step, idx) => `
          <div style="font-weight: 700; font-size: 0.88rem; color: var(--color-primary);">
            ${escapeHtml(step)}
          </div>

          ${
            idx < data.careerTree.length - 1
              ? '<span style="color: #94a3b8; font-weight: bold;">→</span>'
              : ''
          }
        `).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   7. MARKETPLACE
   ========================================================================== */

function initMarketplace() {
  const container =
    document.getElementById('marketItemsGrid');

  if (!container) return;

  let currentCategory = 'all';
  let currentCondition = 'all';
  let searchQuery = '';

  function getmaterial() {
    return safeJsonArray('campusx_material')
      .map(normalizeMaterial)
      .filter(Boolean);
  }

  function savematerial(list) {
    return saveJsonArray(
      'campusx_material',
      list
    );
  }

  function renderListings() {
    const material = getmaterial();

    if (material.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">📦</div>

          <h3 class="empty-state-title">
            No material Currently Listed
          </h3>

          <p class="empty-state-desc">
            No material are currently listed. Sell your unused engineering material to another student.
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="sellModal"
          >
            Sell Material
          </button>
        </div>
      `;

      return;
    }

    const filtered = material.filter(item => {
      const matchCat =
        currentCategory === 'all' ||
        item.category === currentCategory;

      const matchCond =
        currentCondition === 'all' ||
        item.condition.toLowerCase()
          .includes(currentCondition.toLowerCase());

      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery) ||
        item.desc.toLowerCase().includes(searchQuery);

      return matchCat && matchCond && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🔍</div>

          <h3 class="empty-state-title">
            No material Found
          </h3>

          <p class="empty-state-desc">
            No material found in this category. Be the first student to list an item.
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="sellModal"
          >
            Sell Material
          </button>
        </div>
      `;

      return;
    }

    container.innerHTML = filtered.map((item, index) => `
      <div class="market-card">
        <div class="market-image-placeholder">
          <span class="market-icon-big">
            ${item.icon}
          </span>

          <span class="badge ${item.conditionClass} market-condition-tag">
            ${escapeHtml(item.condition)}
          </span>

          <span class="badge badge-gray market-category-tag">
            ${escapeHtml(item.categoryName)}
          </span>
        </div>

        <div class="market-content">
          <h3 class="market-title">
            ${escapeHtml(item.title)}
          </h3>

          <div class="market-price">
            ${escapeHtml(item.price)}
          </div>

          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.75rem; flex: 1;">
            ${escapeHtml(item.desc)}
          </p>

          <div class="market-meta">
            <div class="market-meta-row">
              <span>👤 Seller:</span>
              <strong>${escapeHtml(item.seller)}</strong>
            </div>

            <div class="market-meta-row">
              <span>📍 Location:</span>
              <span>${escapeHtml(item.location)}</span>
            </div>
          </div>

          <button
            class="btn btn-primary btn-sm btn-full"
            type="button"
            data-market-id="${escapeHtml(item.id)}"
            data-market-contact="${index}"
          >
            Connect with Seller
          </button>
        </div>
      </div>
    `).join('');
  }

  document
    .querySelectorAll('[data-market-tab]')
    .forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();

        document
          .querySelectorAll('[data-market-tab]')
          .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        currentCategory =
          btn.getAttribute('data-market-tab') || 'all';

        renderListings();
      });
    });

  document
    .getElementById('marketConditionFilter')
    ?.addEventListener('change', e => {
      currentCondition =
        cleanSearchString(e.target.value, 50) || 'all';

      renderListings();
    });

  document
    .getElementById('marketSearchInput')
    ?.addEventListener('input', e => {
      searchQuery =
        cleanSearchString(e.target.value, 100);

      renderListings();
    });

  const urlParams =
    new URLSearchParams(window.location.search);

  const qCat =
    cleanString(urlParams.get('category'), 50);

  if (qCat) {
    const targetTab =
      document.querySelector(
        `[data-market-tab="${CSS.escape(qCat)}"]`
      );

    if (targetTab) {
      document
        .querySelectorAll('[data-market-tab]')
        .forEach(b => b.classList.remove('active'));

      targetTab.classList.add('active');
      currentCategory = qCat;
    }
  }

  renderListings();

  container.addEventListener('click', e => {
    const contactButton =
      e.target.closest('[data-market-contact]');

    if (!contactButton) return;

    const targetId = contactButton.getAttribute('data-market-id');
    const material = getmaterial();
    const item = targetId
      ? material.find(m => m.id === targetId)
      : material[safeInteger(contactButton.getAttribute('data-market-contact'), 0, 10000)];

    if (!item) return;

    contactSellerModal(item);
  });

  const sellForm =
    document.getElementById('sellMaterialForm');

  sellForm?.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm(sellForm)) return;

    const title =
      getFormValue(
        'sellTitle',
        'Study Material',
        150
      );

    const category =
      getFormValue(
        'sellCategory',
        'calculators',
        50
      );

    const condition =
      getFormValue(
        'sellCondition',
        'Good',
        50
      );

    const rawPrice =
      getFormValue(
        'sellPrice',
        '0',
        20
      );

    const price =
      safeNumber(
        rawPrice.replace(/[₹,\s]/g, ''),
        0,
        1000000
      );

    const seller =
      getFormValue(
        'sellName',
        'Student Seller',
        100
      );

    const location =
      getFormValue(
        'sellLocation',
        'College Campus',
        150
      );

    const desc =
      getFormValue(
        'sellDesc',
        '',
        1000
      );

    const email =
      getFormValue(
        'sellEmail',
        'seller@campusx.edu',
        120
      );

    const phone =
      getFormValue(
        'sellPhone',
        '+91 98901 23456',
        25
      );

    if (price === null) {
      markFieldError(
        document.getElementById('sellPrice'),
        'Enter a valid price.'
      );
      return;
    }

    const categoryData =
      getAllowedMarketplaceCategory(category);

    const conditionData =
      getAllowedCondition(condition);

    const material =
      getmaterial();

    material.unshift({
      id: createId('m'),
      title,
      category,
      categoryName: categoryData.name,
      condition: conditionData.condition,
      conditionClass: conditionData.className,
      price: `₹${price}`,
      seller,
      location,
      email: email || 'seller@campusx.edu',
      phone: phone || '+91 98901 23456',
      desc,
      icon: categoryData.icon,
      fileUrl: ''
    });

    if (!savematerial(material)) return;

    renderListings();

    CampusX.closeModal('sellModal');

    sellForm.reset();

    CampusX.showToast(
      'Listing published! Other students can now see your study material.',
      'success'
    );
  });
}

function normalizeMaterial(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const category =
    cleanString(item.category, 50);

  const categoryData =
    getAllowedMarketplaceCategory(category);

  const conditionData =
    getAllowedCondition(
      cleanString(item.condition, 50)
    );

  let numericPrice = null;

  if (
    typeof item.price === 'number' ||
    typeof item.price === 'string'
  ) {
    numericPrice = safeNumber(
      String(item.price)
        .replace(/[₹,\s]/g, '')
        .replace(/[^\d.]/g, ''),
      0,
      1000000
    );
  }

  return {
    id: cleanString(item.id, 100) || createId('m'),
    title: cleanString(item.title, 150) || 'Study Material',
    category: category || 'calculators',
    categoryName: categoryData.name,
    condition: conditionData.condition,
    conditionClass: conditionData.className,
    price:
      numericPrice !== null
        ? `₹${numericPrice}`
        : '₹0',
    seller: cleanString(item.seller, 100) || 'Student Seller',
    location: cleanString(item.location, 150) || 'College Campus',
    email: cleanString(item.email, 150) || (cleanString(item.seller, 100).toLowerCase().replace(/[^a-z0-9]/g, '.') + '@campusx.edu'),
    phone: cleanString(item.phone, 30) || '+91 98901 23456',
    desc: cleanString(item.desc, 1000),
    icon: getAllowedIcon(item.icon) || categoryData.icon
  };
}

function contactSellerModal(itemOrTitle, fallbackSeller) {
  const item = typeof itemOrTitle === 'object' && itemOrTitle !== null
    ? itemOrTitle
    : {
        title: cleanString(itemOrTitle, 150) || 'Study Material',
        seller: cleanString(fallbackSeller, 100) || 'Student Seller',
        location: 'College Campus',
        price: 'Listed Price',
        email: 'seller@campusx.edu',
        phone: '+91 98901 23456'
      };

  const modal = document.getElementById('contactSellerModal');

  if (modal) {
    const titleElement = document.getElementById('contactItemTitle');
    const sellerElement = document.getElementById('contactSellerName');
    const locationElement = document.getElementById('contactSellerLocation');
    const emailElement = document.getElementById('contactSellerEmail');
    const phoneElement = document.getElementById('contactSellerPhone');
    const copyBtn = document.getElementById('copySellerInfoBtn');
    const mailBtn = document.getElementById('mailSellerBtn');

    const locationText = document.getElementById('contactLocationText');
    const mailtoLink = document.getElementById('contactMailtoLink');
    const phoneText = document.getElementById('contactPhoneText');

    if (titleElement) titleElement.textContent = item.title;
    if (sellerElement) sellerElement.textContent = item.seller;
    if (locationText) locationText.textContent = item.location || 'College Campus';
    if (mailtoLink) {
      mailtoLink.textContent = item.email || 'seller@campusx.edu';
      mailtoLink.href = `mailto:${item.email || 'seller@campusx.edu'}`;
    }
    if (phoneText) phoneText.textContent = item.phone || '+91 98901 23456';

    if (copyBtn) {
      copyBtn.onclick = () => {
        const textToCopy = `Seller: ${item.seller}\nItem: ${item.title} (${item.price || ''})\nLocation: ${item.location || 'Campus'}\nEmail: ${item.email || ''}\nPhone: ${item.phone || ''}`;
        navigator.clipboard?.writeText(textToCopy).then(() => {
          CampusX.showToast('Seller contact info copied to clipboard!', 'success');
        }).catch(() => {
          CampusX.showToast(`Contact: ${item.email || item.seller}`, 'info');
        });
      };
    }

    if (mailBtn) {
      mailBtn.onclick = () => {
        const subject = encodeURIComponent(`CampusX Exchange: Inquiring about ${item.title}`);
        const body = encodeURIComponent(`Hi ${item.seller},\n\nI saw your listing on CampusX for "${item.title}" (${item.price || ''}).\nIs this item still available for campus handover at ${item.location || 'campus'}?\n\nThank you!`);
        window.location.href = `mailto:${item.email || 'seller@campusx.edu'}?subject=${subject}&body=${body}`;
      };
    }

    CampusX.openModal('contactSellerModal');
  } else {
    CampusX.showToast(
      `Inquiry prepared for "${item.title}". Contact seller at ${item.email || 'campus'}.`,
      'info'
    );
  }
}

window.contactSellerModal = contactSellerModal;

/* ==========================================================================
   8. TEAMS
   ========================================================================== */

function initTeamsPage() {
  const container =
    document.getElementById('teamsGrid');

  if (!container) return;

  let currentRole = 'all';
  let currentYear = 'all';
  let currentBranch = 'all';
  let searchQuery = '';

  function getProfiles() {
    return safeJsonArray('campusx_teams')
      .map(normalizeTeamProfile)
      .filter(Boolean);
  }

  function saveProfiles(list) {
    return saveJsonArray(
      'campusx_teams',
      list
    );
  }

  function renderProfiles() {
    const profiles = getProfiles();

    if (profiles.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🤝</div>

          <h3 class="empty-state-title">
            No Active Teammate Profiles Yet
          </h3>

          <p class="empty-state-desc">
            No student profiles are currently active. Register your profile to find teammates for upcoming hackathons and projects.
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="createProfileModal"
          >
            Create Your Profile
          </button>
        </div>
      `;

      return;
    }

    const filtered = profiles.filter(item => {
      const roleText =
        item.role.toLowerCase();

      const matchRole =
        currentRole === 'all' ||
        item.roleKey === currentRole ||
        roleText.includes(
          currentRole.toLowerCase()
        );

      const matchYear =
        currentYear === 'all' ||
        item.year === currentYear;

      const matchBranch =
        currentBranch === 'all' ||
        item.branch === currentBranch;

      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery) ||
        item.title.toLowerCase().includes(searchQuery) ||
        item.skills.some(
          skill =>
            skill.toLowerCase().includes(searchQuery)
        ) ||
        item.bio.toLowerCase().includes(searchQuery);

      return (
        matchRole &&
        matchYear &&
        matchBranch &&
        matchSearch
      );
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🔍</div>

          <h3 class="empty-state-title">
            No Profiles Found
          </h3>

          <p class="empty-state-desc">
            No profiles match the selected filters. Register your profile or clear the filters.
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="createProfileModal"
          >
            Create Your Profile
          </button>
        </div>
      `;

      return;
    }

    container.innerHTML = filtered.map((item, index) => `
      <div class="team-member-card">

        <div class="member-header">
          <div class="member-avatar">
            ${escapeHtml(item.initials || 'ST')}
          </div>

          <div class="member-info">
            <h4>
              ${escapeHtml(item.name || item.title)}
            </h4>

            <div class="member-branch-year">
              ${escapeHtml(item.year)}
              •
              ${escapeHtml(item.branch)}
            </div>
          </div>
        </div>

        <div class="member-role">
          ${escapeHtml(item.role)}
        </div>

        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.75rem; flex: 1;">
          ${escapeHtml(item.bio)}
        </p>

        <div class="skills-pill-group" style="margin-bottom: 0.85rem;">
          ${item.skills.map(skill => `
            <span class="skill-pill">
              ${escapeHtml(skill)}
            </span>
          `).join('')}
        </div>

        <div class="member-availability">
          <span class="availability-dot"></span>

          <span>
            ${escapeHtml(item.availability)}
          </span>
        </div>

        <div class="member-links">

          ${
            item.github
              ? `
                <a
                  class="btn btn-secondary btn-sm"
                  href="${escapeHtml(item.github)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              `
              : ''
          }

          <button
            class="btn btn-primary btn-sm btn-full"
            type="button"
            data-team-id="${escapeHtml(item.id)}"
            data-team-connect="${index}"
          >
            Connect with Teammate
          </button>

        </div>
      </div>
    `).join('');
  }

  document
    .getElementById('teamRoleFilter')
    ?.addEventListener('change', e => {
      currentRole =
        cleanString(e.target.value, 50) || 'all';

      renderProfiles();
    });

  document
    .getElementById('teamYearFilter')
    ?.addEventListener('change', e => {
      currentYear =
        cleanString(e.target.value, 50) || 'all';

      renderProfiles();
    });

  document
    .getElementById('teamBranchFilter')
    ?.addEventListener('change', e => {
      currentBranch =
        cleanString(e.target.value, 100) || 'all';

      renderProfiles();
    });

  document
    .getElementById('teamSearchInput')
    ?.addEventListener('input', e => {
      searchQuery =
        cleanSearchString(e.target.value, 100);

      renderProfiles();
    });

  const urlParams =
    new URLSearchParams(window.location.search);

  const qRole =
    cleanString(urlParams.get('role'), 50);

  if (qRole) {
    const roleSelect =
      document.getElementById('teamRoleFilter');

    if (roleSelect) {
      roleSelect.value = qRole;
      currentRole = qRole;
    }
  }

  renderProfiles();

  container.addEventListener('click', e => {
    const connectButton =
      e.target.closest('[data-team-connect]');

    if (!connectButton) return;

    const targetId = connectButton.getAttribute('data-team-id');
    const profiles = getProfiles();
    const item = targetId
      ? profiles.find(p => p.id === targetId)
      : profiles[safeInteger(connectButton.getAttribute('data-team-connect'), 0, 10000)];

    if (!item) return;

    openConnectTeammateModal(item);
  });

  const profileForm =
    document.getElementById('createProfileForm');

  profileForm?.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm(profileForm)) return;

    const name =
      getFormValue(
        'profName',
        'Student',
        100
      );

    const role =
      getFormValue(
        'profRole',
        'Developer',
        100
      );

    const branch =
      getFormValue(
        'profBranch',
        'Computer Science',
        100
      );

    const year =
      getFormValue(
        'profYear',
        '2nd Year',
        50
      );

    const skillsRaw =
      getFormValue(
        'profSkills',
        '',
        300
      );

    const github =
      safeHttpUrl(
        getFormValue(
          'profGithub',
          '',
          300
        )
      );

    const linkedin =
      safeHttpUrl(
        getFormValue(
          'profLinkedin',
          '',
          300
        )
      );

    const availability =
      getFormValue(
        'profAvailability',
        'Available for Hackathons',
        100
      );

    const about =
      getFormValue(
        'profAbout',
        '',
        500
      );

    const skills =
      skillsRaw
        .split(',')
        .map(skill => cleanString(skill, 50))
        .filter(Boolean)
        .slice(0, 15);

    const profiles =
      getProfiles();

    profiles.unshift({
      id: createId('t'),
      name,
      title: name,
      initials: getInitials(name),
      branch,
      year,
      role,
      roleKey: role
        .toLowerCase()
        .replace(/[^a-z]/g, ''),
      skills:
        skills.length > 0
          ? skills
          : ['Engineering', 'Coding'],
      email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@campusx.edu`,
      phone: phone || '+91 98765 43210',
      github,
      linkedin,
      availability,
      bio:
        about ||
        'Engineering student keen to build practical solutions with a motivated team.'
    });

    if (!saveProfiles(profiles)) return;

    renderProfiles();

    CampusX.closeModal(
      'createProfileModal'
    );

    profileForm.reset();

    CampusX.showToast(
      'Profile created! You are now visible to students looking for teammates.',
      'success'
    );
  });
}

function openConnectTeammateModal(item) {
  const modal = document.getElementById('connectTeammateModal');
  if (!modal) {
    CampusX.showToast(`Connecting with ${item.name}...`, 'info');
    return;
  }

  const avatarEl = document.getElementById('teamModalAvatar');
  const nameEl = document.getElementById('teamModalName');
  const roleEl = document.getElementById('teamModalRole');
  const infoEl = document.getElementById('teamModalInfo');
  const mailtoLink = document.getElementById('teamModalMailto');
  const githubText = document.getElementById('teamModalGithubText');
  const linkedinText = document.getElementById('teamModalLinkedinText');
  const messageArea = document.getElementById('teamPeerMessage');
  const copyBtn = document.getElementById('copyContactBtn');
  const sendEmailBtn = document.getElementById('sendEmailPeerBtn');

  const displayName = item.name || item.title || 'Student';
  if (avatarEl) avatarEl.textContent = item.initials || 'ST';
  if (nameEl) nameEl.textContent = displayName;
  if (roleEl) roleEl.textContent = item.role || 'Developer';
  if (infoEl) infoEl.textContent = `${item.year || '2nd Year'} • ${item.branch || 'Engineering'}`;

  const email = item.email || `${displayName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@campusx.edu`;
  if (mailtoLink) {
    mailtoLink.textContent = email;
    mailtoLink.href = `mailto:${email}`;
  }

  if (githubText) {
    if (item.github) {
      githubText.innerHTML = `<a href="${escapeHtml(item.github)}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); font-weight: 500;">${escapeHtml(item.github)}</a>`;
    } else {
      githubText.textContent = 'Available upon request';
    }
  }

  if (linkedinText) {
    if (item.linkedin) {
      linkedinText.innerHTML = `<a href="${escapeHtml(item.linkedin)}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); font-weight: 500;">${escapeHtml(item.linkedin)}</a>`;
    } else {
      linkedinText.textContent = 'Available upon request';
    }
  }

  if (messageArea) {
    messageArea.value = `Hi ${displayName.split(' ')[0]},\n\nI saw your profile on CampusX for the "${item.role}" role. We are forming a team for an upcoming engineering project/hackathon and would love to collaborate!`;
  }

  if (copyBtn) {
    copyBtn.onclick = () => {
      const textToCopy = `Teammate: ${displayName} (${item.role})\nBranch/Year: ${item.branch} (${item.year})\nEmail: ${email}\nGitHub: ${item.github || 'N/A'}\nLinkedIn: ${item.linkedin || 'N/A'}`;
      navigator.clipboard?.writeText(textToCopy).then(() => {
        CampusX.showToast('Teammate contact details copied to clipboard!', 'success');
      }).catch(() => {
        CampusX.showToast(`Contact: ${email}`, 'info');
      });
    };
  }

  if (sendEmailBtn) {
    sendEmailBtn.onclick = () => {
      const subject = encodeURIComponent(`CampusX Collaboration: Invitation for ${item.role}`);
      const body = encodeURIComponent(messageArea?.value || `Hi ${displayName},\n\nI would like to collaborate with you on CampusX!`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };
  }

  CampusX.openModal('connectTeammateModal');
}

function normalizeTeamProfile(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const name =
    cleanString(
      item.name || item.title,
      100
    ) || 'Student';

  const role =
    cleanString(
      item.role,
      100
    ) || 'Developer';

  const skills =
    cleanArray(
      item.skills,
      15,
      50
    );

  return {
    id:
      cleanString(item.id, 100) ||
      createId('t'),

    name,

    title:
      cleanString(item.title, 100) ||
      name,

    initials:
      cleanString(
        item.initials,
        4
      ) || getInitials(name),

    branch:
      cleanString(
        item.branch,
        100
      ) || 'Computer Science',

    year:
      cleanString(
        item.year,
        50
      ) || '2nd Year',

    role,

    roleKey:
      cleanString(
        item.roleKey,
        50
      ) ||
      role
        .toLowerCase()
        .replace(/[^a-z]/g, ''),

    skills:
      skills.length
        ? skills
        : ['Engineering', 'Coding'],

    github:
      safeHttpUrl(item.github),

    linkedin:
      safeHttpUrl(item.linkedin),

    email:
      cleanString(item.email, 150) ||
      `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@campusx.edu`,

    phone:
      cleanString(item.phone, 30) ||
      '+91 98234 11223',

    availability:
      cleanString(
        item.availability,
        100
      ) || 'Available for Hackathons',

    bio:
      cleanString(
        item.bio,
        500
      ) ||
      'Engineering student keen to build practical solutions with a motivated team.'
  };
}

/* ==========================================================================
   9. PROJECTS
   ========================================================================== */

function initProjectsPage() {
  const container =
    document.getElementById(
      'projectsDirectoryGrid'
    );

  if (!container) return;

  let currentCategory = 'all';
  let currentLevel = 'all';
  let searchQuery = '';

  function getProjects() {
    return safeJsonArray('campusx_projects')
      .map(normalizeProject)
      .filter(Boolean);
  }

  function saveProjects(list) {
    return saveJsonArray(
      'campusx_projects',
      list
    );
  }

  function renderProjects() {
    const projects = getProjects();

    if (projects.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">💻</div>

          <h3 class="empty-state-title">
            Project Showcase Open for Submissions
          </h3>

          <p class="empty-state-desc">
            Project showcase is currently open for submissions. Share your college project report or repository to guide junior students.
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="submitProjectModal"
          >
            Submit Project
          </button>
        </div>
      `;

      return;
    }

    const filtered = projects.filter(item => {
      const matchCat =
        currentCategory === 'all' ||
        item.domain.toLowerCase().includes(currentCategory.toLowerCase()) ||
        item.level.toLowerCase().includes(currentCategory.toLowerCase());

      const matchLevel =
        currentLevel === 'all' ||
        item.level.toLowerCase() === currentLevel.toLowerCase();

      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery) ||
        item.domain.toLowerCase().includes(searchQuery) ||
        item.tech.toLowerCase().includes(searchQuery) ||
        item.desc.toLowerCase().includes(searchQuery);

      return matchCat && matchLevel && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🔍</div>

          <h3 class="empty-state-title">
            No Projects Found
          </h3>

          <p class="empty-state-desc">
            No projects match the selected filters. Be the first student to submit a project.
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="submitProjectModal"
          >
            Submit Project
          </button>
        </div>
      `;

      return;
    }

    container.innerHTML =
      filtered.map((item, index) => `
        <div class="card project-card-item">

          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.65rem;">

            <span class="badge badge-indigo">
              ${escapeHtml(item.level)}
            </span>

            <span class="badge badge-gray">
              ${escapeHtml(item.domain)}
            </span>

          </div>

          <h3 class="card-title">
            ${escapeHtml(item.title)}
          </h3>

          <div style="font-size: 0.82rem; font-weight: 600; color: var(--color-primary); margin-bottom: 0.35rem;">
            ${escapeHtml(item.tech)}
          </div>

          <p class="card-desc">
            ${escapeHtml(item.desc)}
          </p>

          <div class="card-footer">

            <span style="font-size: 0.78rem; color: var(--color-text-muted);">
              Team Size:
              ${escapeHtml(item.teamSize)}
            </span>

            <button
              class="btn btn-primary btn-sm"
              type="button"
              data-project-id="${escapeHtml(item.id)}"
              data-project-view="${index}"
            >
              View Project
            </button>

          </div>
        </div>
      `).join('');
  }

  document
    .querySelectorAll('[data-project-filter]')
    .forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();

        document
          .querySelectorAll('[data-project-filter]')
          .forEach(b =>
            b.classList.remove('active')
          );

        btn.classList.add('active');

        currentCategory =
          btn.getAttribute(
            'data-project-filter'
          ) || 'all';

        renderProjects();
      });
    });

  document
    .getElementById('projectSearchInput')
    ?.addEventListener('input', e => {
      searchQuery =
        cleanSearchString(e.target.value, 100);

      renderProjects();
    });

  document
    .getElementById('projectLevelFilter')
    ?.addEventListener('change', e => {
      currentLevel =
        cleanString(e.target.value, 50) || 'all';

      renderProjects();
    });

  renderProjects();

  container.addEventListener('click', e => {
    const viewButton =
      e.target.closest('[data-project-view]');

    if (!viewButton) return;

    const targetId = viewButton.getAttribute('data-project-id');
    const projects = getProjects();
    const project = targetId
      ? projects.find(p => p.id === targetId)
      : projects[safeInteger(viewButton.getAttribute('data-project-view'), 0, 10000)];

    if (!project) return;

    openProjectDetail(project);
  });

  const submitForm =
    document.getElementById(
      'submitProjectForm'
    );

  submitForm?.addEventListener(
    'submit',
    async e => {
      e.preventDefault();

      if (!validateForm(submitForm)) {
        return;
      }

      const title =
        getFormValue(
          'projTitle',
          'Student Project',
          150
        );

      const domain =
        getFormValue(
          'projDomain',
          'Web Development',
          100
        );

      const tech =
        getFormValue(
          'projTech',
          'HTML, CSS, JS',
          250
        );

      const level =
        getFormValue(
          'projLevel',
          'Intermediate',
          50
        );

      const teamSizeValue =
        document.getElementById(
          'projTeamSize'
        )?.value || '2';

      const teamSize =
        safeInteger(
          teamSizeValue,
          1,
          6
        );

      const desc =
        getFormValue(
          'projDesc',
          '',
          1000
        );

      const github = safeHttpUrl(
        getFormValue('projGithub', 'https://github.com')
      ) || 'https://github.com';

      const reportUrl = safeHttpUrl(
        getFormValue('projReport', '')
      );

      if (teamSize === null) {
        markFieldError(
          document.getElementById(
            'projTeamSize'
          ),
          'Team size must be between 1 and 6.'
        );

        return;
      }

      const projects =
        getProjects();

      projects.unshift({
        id: createId('p'),
        title,
        domain,
        tech,
        level,
        teamSize: String(teamSize),
        desc,
        github,
        reportUrl
      });

      if (!saveProjects(projects)) {
        return;
      }

      renderProjects();

      CampusX.closeModal(
        'submitProjectModal'
      );

      submitForm.reset();

      CampusX.showToast(
        'Project submitted! Your project is now featured in the showcase.',
        'success'
      );
    }
  );
}

function normalizeProject(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const teamSize =
    safeInteger(
      item.teamSize,
      1,
      6
    );

  return {
    id:
      cleanString(item.id, 100) ||
      createId('p'),

    title:
      cleanString(
        item.title,
        150
      ) || 'Student Project',

    domain:
      cleanString(
        item.domain,
        100
      ) || 'Web Development',

    tech:
      cleanString(
        item.tech,
        250
      ) || 'HTML, CSS, JS',

    level:
      cleanString(
        item.level,
        50
      ) || 'Intermediate',

    teamSize:
      String(
        teamSize === null
          ? 2
          : teamSize
      ),

    desc:
      cleanString(
        item.desc,
        1000
      ),

    github:
      safeHttpUrl(item.github) || 'https://github.com',

    reportUrl:
      safeHttpUrl(item.reportUrl) || ''
  };
}

function openProjectDetail(projectOrTitle, tech, desc) {
  const project =
    typeof projectOrTitle === 'object' && projectOrTitle !== null
      ? projectOrTitle
      : {
          title: cleanString(projectOrTitle, 150) || 'Student Project',
          tech: cleanString(tech, 250) || 'Engineering Tech',
          desc: cleanString(desc, 1000) || 'Comprehensive engineering capstone project.',
          github: 'https://github.com',
          reportUrl: ''
        };

  const modal =
    document.getElementById('projectModal');

  if (modal) {
    const titleElement =
      document.getElementById('projModalTitle');

    const techElement =
      document.getElementById('projModalTech');

    const descElement =
      document.getElementById('projModalDesc');

    const githubBtn =
      modal.querySelector('[data-project-action="github"]');

    const reportBtn =
      modal.querySelector('[data-project-action="report"]');

    if (titleElement) {
      titleElement.textContent = project.title;
    }

    if (techElement) {
      techElement.textContent = project.tech;
    }

    if (descElement) {
      descElement.textContent = project.desc;
    }

    if (githubBtn) {
      githubBtn.onclick = () => {
        const ghUrl = project.github || 'https://github.com';
        window.open(ghUrl, '_blank', 'noopener,noreferrer');
      };
    }

    if (reportBtn) {
      reportBtn.onclick = () => {
        if (project.reportUrl) {
          window.open(project.reportUrl, '_blank', 'noopener,noreferrer');
        } else {
          CampusX.showToast(
            `Project Synopsis and Documentation for "${project.title}" will sync via project repository.`,
            'info'
          );
        }
      };
    }

    CampusX.openModal('projectModal');
  } else {
    CampusX.showToast(
      `Viewing details for "${project.title}".`,
      'info'
    );
  }
}

window.openProjectDetail =
  openProjectDetail;

/* ==========================================================================
   10. STUDY NOTES
   ========================================================================== */

function initNotesPage() {
  const container = document.getElementById('notesListGrid');
  if (!container) return;

  let currentSem = 'all';
  let currentSubject = 'all';
  let searchQuery = '';
  let activeNotes = [];

  // Status banner for honest status display
  let statusBanner = document.getElementById('notesApiStatusBanner');
  if (!statusBanner) {
    statusBanner = document.createElement('div');
    statusBanner.id = 'notesApiStatusBanner';
    statusBanner.style.cssText = 'margin-bottom: 1.25rem; padding: 0.65rem 1rem; border-radius: 8px; font-size: 0.82rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; background: #eef2ff; color: #3730a3; border: 1px solid #c7d2fe;';
    container.parentNode.insertBefore(statusBanner, container);
  }

  function updateStatusBanner(status, message) {
    if (!statusBanner) return;
    if (status === 'loading') {
      statusBanner.style.background = '#f8fafc';
      statusBanner.style.color = '#64748b';
      statusBanner.style.borderColor = '#e2e8f0';
      statusBanner.innerHTML = '<span>⏳ <strong>Connecting to CampusX Backend API...</strong> (' + escapeHtml(CampusXAPI.getBaseUrl()) + ')</span>';
    } else if (status === 'connected') {
      statusBanner.style.background = '#ecfdf5';
      statusBanner.style.color = '#065f46';
      statusBanner.style.borderColor = '#a7f3d0';
      statusBanner.innerHTML = '<span>🟢 <strong>Backend Connected:</strong> ' + escapeHtml(message) + '</span><span style="font-size: 0.75rem; color: #047857;">Live API • http://localhost:3000</span>';
    } else if (status === 'fallback') {
      statusBanner.style.background = '#fffbeb';
      statusBanner.style.color = '#92400e';
      statusBanner.style.borderColor = '#fde68a';
      statusBanner.innerHTML = '<span>⚠️ <strong>Backend Offline / Standalone:</strong> Showing cached study notes (' + escapeHtml(message) + '). To start backend, run <code>npm.cmd start</code> in <code>backend/</code>.</span>';
    }
  }

  function getLocalNotes() {
    return safeJsonArray('campusx_notes')
      .map(normalizeNote)
      .filter(Boolean);
  }

  function saveLocalNotes(list) {
    return saveJsonArray('campusx_notes', list);
  }

  // Load from local storage immediately so UI is instant
  activeNotes = getLocalNotes();
  if (activeNotes.length === 0) {
    activeNotes = [...DEFAULT_NOTES];
    saveLocalNotes(activeNotes);
  }
  renderNotes();
  updateStatusBanner('loading');

  // Asynchronously sync with GET /api/notes
  CampusXAPI.getNotes()
    .then(response => {
      if (response && response.success && Array.isArray(response.data)) {
        const apiList = response.data.map(normalizeNote).filter(Boolean);

        // Server notes take priority; preserve local notes with unique titles/IDs
        const merged = [...apiList];
        const apiIds = new Set(apiList.map(n => String(n.id).toLowerCase()));
        const apiTitles = new Set(apiList.map(n => n.title.toLowerCase().trim()));

        activeNotes.forEach(localNote => {
          const idMatches = apiIds.has(String(localNote.id).toLowerCase());
          const titleMatches = apiTitles.has(localNote.title.toLowerCase().trim());
          if (!idMatches && !titleMatches) {
            merged.push(localNote);
          }
        });

        activeNotes = merged;
        saveLocalNotes(activeNotes);
        updateStatusBanner('connected', (response.count || apiList.length) + ' notes synced from GET /api/notes');
        renderNotes();
      } else {
        updateStatusBanner('fallback', response.error || 'Server did not return data');
      }
    })
    .catch(err => {
      updateStatusBanner('fallback', err.message || 'Connection failed');
    });

  function renderNotes() {
    const notes = activeNotes;

    if (notes.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">📚</div>

          <h3 class="empty-state-title">
            Notes Repository Under Curation
          </h3>

          <p class="empty-state-desc">
            Notes repository is currently being updated for the current semester. Senior students can upload verified unit-wise notes.
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="uploadNotesModal"
          >
            Upload Notes
          </button>
        </div>
      `;

      return;
    }

    const filtered = notes.filter(item => {
      const matchSem =
        currentSem === 'all' ||
        item.sem.toLowerCase().includes(currentSem.toLowerCase());

      const matchSubject =
        currentSubject === 'all' ||
        item.subject.toLowerCase() === currentSubject.toLowerCase();

      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery) ||
        item.subject.toLowerCase().includes(searchQuery) ||
        item.unit.toLowerCase().includes(searchQuery) ||
        (item.desc && item.desc.toLowerCase().includes(searchQuery));

      return matchSem && matchSubject && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🔍</div>

          <h3 class="empty-state-title">
            No Study Notes Found
          </h3>

          <p class="empty-state-desc">
            No notes match the selected criteria. Be the first student to upload notes for this subject.
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="uploadNotesModal"
          >
            Upload Notes
          </button>
        </div>
      `;

      return;
    }

    container.innerHTML =
      filtered.map((item, index) => `
        <div
          class="card note-card-item"
          data-year="${escapeHtml(item.year)}"
          data-sem="${escapeHtml(item.sem)}"
          data-subject="${escapeHtml(item.subject.toLowerCase())}"
        >
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.65rem; gap: 0.5rem; flex-wrap: wrap;">
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <span class="badge badge-indigo">
                ${escapeHtml(item.subject)}
              </span>
              <span class="badge badge-gray">
                ${escapeHtml(item.unit)}
              </span>
            </div>
            ${item.fileUrl ? `<span class="badge badge-green" style="font-size: 0.68rem; text-transform: uppercase;">📄 ${escapeHtml(item.fileUrl.split('.').pop())}</span>` : ''}
          </div>

          <h3 class="card-title">
            ${escapeHtml(item.title)}
          </h3>

          <p class="card-desc">
            ${escapeHtml(
              item.desc ||
              'Unit-wise comprehensive study notes covering standard college syllabus.'
            )}
          </p>

          <div class="card-footer">
            <span style="font-size: 0.78rem; color: var(--color-text-muted);">
              Uploaded by ${escapeHtml(item.contributor)}
            </span>

            <button
              class="btn btn-secondary btn-sm"
              type="button"
              data-note-id="${escapeHtml(item.id)}"
              data-note-download="${index}"
            >
              ${item.fileUrl ? '📥 Download / View' : '📖 View Notes'}
            </button>
          </div>
        </div>
      `).join('');
  }

  document.querySelectorAll('[data-notes-sem]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('[data-notes-sem]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSem = btn.getAttribute('data-notes-sem') || 'all';
      renderNotes();
    });
  });

  document.getElementById('notesSearchInput')?.addEventListener('input', e => {
    searchQuery = cleanSearchString(e.target.value, 100);
    renderNotes();
  });

  document.getElementById('notesSubjectFilter')?.addEventListener('change', e => {
    currentSubject = cleanString(e.target.value, 100) || 'all';
    renderNotes();
  });

  container.addEventListener('click', e => {
    const button = e.target.closest('[data-note-download]');
    if (!button) return;

    const targetId = button.getAttribute('data-note-id');
    const notes = activeNotes;
    const item = targetId
      ? notes.find(n => String(n.id) === String(targetId))
      : notes[safeInteger(button.getAttribute('data-note-download'), 0, 10000)];

    if (!item) return;

    if (item.fileUrl) {
      window.open(encodeURI(item.fileUrl), '_blank');
      CampusX.showToast('Opening "' + item.title + '"...', 'success');
    } else {
      CampusX.showToast('Notes for "' + item.title + '" contributed by ' + item.contributor + '.', 'info');
    }
  });

  const uploadForm = document.getElementById('uploadNotesForm');

  uploadForm?.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm(uploadForm)) {
      return;
    }

    const title = getFormValue('noteTitle', 'Study Notes', 150);
    const subject = getFormValue('noteSubject', 'Engineering Subject', 100);
    const year = getFormValue('noteYear', '2nd Year', 50);
    const sem = getFormValue('noteSem', 'Sem 3', 50);
    const unit = getFormValue('noteUnit', 'Unit 1', 50);
    const contributor = getFormValue('noteContributor', 'Senior Student', 100);
    const desc = getFormValue('noteDesc', '', 1000);
    const fileUrl = getFormValue('noteFileUrl', '', 300);

    const submitBtn = uploadForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Uploading to API...';
    }

    const notePayload = {
      title,
      subject,
      year,
      sem,
      unit,
      contributor,
      desc,
      fileUrl
    };

    let savedNote = null;
    let savedOnServer = false;

    try {
      const apiRes = await CampusXAPI.createNote(notePayload);
      if (apiRes && apiRes.success && apiRes.data) {
        savedNote = normalizeNote(apiRes.data);
        savedOnServer = true;
      }
    } catch (err) {
      console.warn('Backend API note creation error:', err);
    }

    if (!savedNote) {
      savedNote = normalizeNote({
        id: createId('n'),
        ...notePayload
      });
    }

    activeNotes.unshift(savedNote);
    saveLocalNotes(activeNotes);
    renderNotes();

    CampusX.closeModal('uploadNotesModal');
    uploadForm.reset();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }

    if (savedOnServer) {
      CampusX.showToast('Note uploaded to CampusX API & published successfully!', 'success');
      updateStatusBanner('connected', 'New note posted to CampusX API (Port 3000)');
    } else {
      CampusX.showToast('Note saved locally in browser storage (Backend API offline).', 'info');
    }
  });
}

function normalizeNote(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  return {
    id:
      cleanString(item.id, 100) ||
      createId('n'),

    title:
      cleanString(
        item.title,
        150
      ) || 'Study Notes',

    subject:
      cleanString(
        item.subject,
        100
      ) || 'Engineering Subject',

    year:
      cleanString(
        item.year,
        50
      ) || '2nd Year',

    sem:
      cleanString(
        item.sem,
        50
      ) || 'Sem 3',

    unit:
      cleanString(
        item.unit,
        50
      ) || 'Unit 1',

    contributor:
      cleanString(
        item.contributor,
        100
      ) || 'Senior Student',

    desc:
      cleanString(
        item.desc,
        1000
      ),

    fileUrl:
      cleanString(
        item.fileUrl,
        300
      )
  };
}

/* ==========================================================================
   11. PREVIOUS YEAR PAPERS
   ========================================================================== */

function initPYQsPage() {
  const container =
    document.getElementById(
      'pyqsListGrid'
    );

  if (!container) return;

  let currentType = 'all';
  let currentSem = 'all';
  let searchQuery = '';

  function getPYQs() {
    return safeJsonArray('campusx_pyqs')
      .map(normalizePYQ)
      .filter(Boolean);
  }

  function savePYQs(list) {
    return saveJsonArray(
      'campusx_pyqs',
      list
    );
  }

  function renderPYQs() {
    const pyqs = getPYQs();

    if (pyqs.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">📄</div>

          <h3 class="empty-state-title">
            Examination Papers Collection Underway
          </h3>

          <p class="empty-state-desc">
            Previous year university examination papers are currently being collected. Upload an exam paper to assist batchmates.
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="uploadPyqModal"
          >
            Upload Question Paper
          </button>
        </div>
      `;

      return;
    }

    const filtered = pyqs.filter(item => {
      const matchType =
        currentType === 'all' ||
        item.examType.toLowerCase().includes(currentType.toLowerCase());

      const matchSem =
        currentSem === 'all' ||
        (item.sem && item.sem.toLowerCase().includes(currentSem.toLowerCase())) ||
        (item.title && item.title.toLowerCase().includes(currentSem.toLowerCase())) ||
        (item.desc && item.desc.toLowerCase().includes(currentSem.toLowerCase()));

      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery) ||
        item.subject.toLowerCase().includes(searchQuery) ||
        item.examYear.toLowerCase().includes(searchQuery) ||
        item.examType.toLowerCase().includes(searchQuery) ||
        (item.desc && item.desc.toLowerCase().includes(searchQuery));

      return matchType && matchSem && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🔍</div>

          <h3 class="empty-state-title">
            No Question Papers Found
          </h3>

          <p class="empty-state-desc">
            No examination papers match the selected criteria. Upload a paper to contribute!
          </p>

          <button
            class="btn btn-primary"
            type="button"
            data-open-modal="uploadPyqModal"
          >
            Upload Question Paper
          </button>
        </div>
      `;

      return;
    }

    container.innerHTML =
      filtered.map((item, index) => `
        <div
          class="card pyq-card-item"
          data-year="${escapeHtml(item.examYear)}"
          data-exam="${escapeHtml(item.examType)}"
          data-subject="${escapeHtml(item.subject.toLowerCase())}"
        >
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.65rem; gap: 0.5rem; flex-wrap: wrap;">
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <span class="badge badge-indigo">
                ${escapeHtml(item.examType)}
              </span>
              <span class="badge badge-gray">
                ${escapeHtml(item.examYear)}
              </span>
            </div>
            ${item.fileUrl ? `<span class="badge badge-green" style="font-size: 0.68rem; text-transform: uppercase;">📄 ${escapeHtml(item.fileUrl.split('.').pop())}</span>` : ''}
          </div>

          <h3 class="card-title">
            ${escapeHtml(item.title)}
          </h3>

          <p class="card-desc">
            ${escapeHtml(
              item.desc ||
              'University examination question paper with question patterns.'
            )}
          </p>

          <div class="card-footer">
            <span style="font-size: 0.78rem; color: var(--color-text-muted);">
              ${escapeHtml(
                item.solutionStatus ||
                'Question Paper'
              )}
            </span>

            <button
              class="btn btn-secondary btn-sm"
              type="button"
              data-pyq-id="${escapeHtml(item.id)}"
              data-pyq-download="${index}"
            >
              ${item.fileUrl ? '📥 Download / View' : '📄 View Paper'}
            </button>
          </div>
        </div>
      `).join('');
  }

  document.querySelectorAll('[data-pyq-type]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('[data-pyq-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.getAttribute('data-pyq-type') || 'all';
      renderPYQs();
    });
  });

  document.getElementById('pyqSearchInput')?.addEventListener('input', e => {
    searchQuery = cleanSearchString(e.target.value, 100);
    renderPYQs();
  });

  document.getElementById('pyqSemFilter')?.addEventListener('change', e => {
    currentSem = cleanString(e.target.value, 50) || 'all';
    renderPYQs();
  });

  renderPYQs();

  container.addEventListener('click', e => {
    const button =
      e.target.closest(
        '[data-pyq-download]'
      );

    if (!button) return;

    const targetId = button.getAttribute('data-pyq-id');
    const pyqs = getPYQs();
    const item = targetId
      ? pyqs.find(q => q.id === targetId)
      : pyqs[safeInteger(button.getAttribute('data-pyq-download'), 0, 10000)];

    if (!item) return;

    if (item.fileUrl) {
      window.open(encodeURI(item.fileUrl), '_blank');
      CampusX.showToast(
        `Opening "${item.title}"...`,
        'success'
      );
    } else {
      CampusX.showToast(
        `Question paper "${item.title}" (${item.examYear}).`,
        'info'
      );
    }
  });

  const uploadForm =
    document.getElementById(
      'uploadPyqForm'
    );

  uploadForm?.addEventListener(
    'submit',
    e => {
      e.preventDefault();

      if (!validateForm(uploadForm)) {
        return;
      }

      const title =
        getFormValue(
          'pyqTitle',
          'Question Paper',
          150
        );

      const subject =
        getFormValue(
          'pyqSubject',
          'Subject',
          100
        );

      const examYear =
        getFormValue(
          'pyqExamYear',
          '2025',
          20
        );

      const examType =
        getFormValue(
          'pyqExamType',
          'End-Sem',
          50
        );

      const solutionStatus =
        getFormValue(
          'pyqSolutionStatus',
          'Question Paper',
          100
        );

      const desc =
        getFormValue(
          'pyqDesc',
          '',
          1000
        );

      const fileUrl =
        getFormValue(
          'pyqFileUrl',
          '',
          300
        );

      const pyqs =
        getPYQs();

      pyqs.unshift({
        id: createId('q'),
        title,
        subject,
        examYear,
        examType,
        solutionStatus,
        desc,
        fileUrl
      });

      if (!savePYQs(pyqs)) {
        return;
      }

      renderPYQs();

      CampusX.closeModal(
        'uploadPyqModal'
      );

      uploadForm.reset();

      CampusX.showToast(
        'Question paper submitted! Thank you for helping your peers.',
        'success'
      );
    }
  );
}

function normalizePYQ(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  return {
    id:
      cleanString(item.id, 100) ||
      createId('q'),

    title:
      cleanString(
        item.title,
        150
      ) || 'Question Paper',

    subject:
      cleanString(
        item.subject,
        100
      ) || 'Subject',

    examYear:
      cleanString(
        item.examYear,
        20
      ) || '2025',

    examType:
      cleanString(
        item.examType,
        50
      ) || 'End-Sem',

    solutionStatus:
      cleanString(
        item.solutionStatus,
        100
      ) || 'Question Paper',

    desc:
      cleanString(
        item.desc,
        1000
      ),

    fileUrl:
      cleanString(
        item.fileUrl,
        300
      )
  };
}

/* ==========================================================================
   12. HOMEPAGE PREVIEWS
   ========================================================================== */

function initHomepagePreviews() {
  const homeProjects =
    document.getElementById(
      'homeProjectsGrid'
    );

  const homeTeams =
    document.getElementById(
      'homeTeamsGrid'
    );

  const homeMarket =
    document.getElementById(
      'homeMarketGrid'
    );

  /* ------------------------------------------------------------------------
     Projects
     ------------------------------------------------------------------------ */

  if (homeProjects) {
    const projects =
      safeJsonArray(
        'campusx_projects'
      )
        .map(normalizeProject)
        .filter(Boolean);

    if (projects.length === 0) {
      homeProjects.innerHTML = `
        <div class="empty-state-box">

          <div class="empty-state-icon">
            💻
          </div>

          <h3 class="empty-state-title">
            Project Showcase Open for Submissions
          </h3>

          <p class="empty-state-desc">
            Project showcase is currently open for submissions. Share your college project report or repository to guide junior students.
          </p>

          <div class="empty-state-actions">
            <a
              href="projects.html"
              class="btn btn-primary"
            >
              Submit Project
            </a>

            <a
              href="projects.html"
              class="btn btn-secondary"
            >
              Browse Projects Directory
            </a>
          </div>

        </div>
      `;
    } else {
      homeProjects.innerHTML =
        projects.slice(0, 3).map(item => {
          const techList =
            cleanString(
              item.tech,
              250
            )
              .split(',')
              .map(t => cleanString(t, 50))
              .filter(Boolean)
              .slice(0, 15);

          return `
            <div class="card">

              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.65rem;">

                <span class="badge badge-green">
                  ${escapeHtml(item.level)}
                </span>

                <span class="badge badge-gray">
                  ${escapeHtml(item.domain)}
                </span>

              </div>

              <h3 class="card-title">
                ${escapeHtml(item.title)}
              </h3>

              <p class="card-desc">
                ${escapeHtml(item.desc)}
              </p>

              <div class="skills-pill-group">
                ${techList.map(t => `
                  <span class="skill-pill">
                    ${escapeHtml(t)}
                  </span>
                `).join('')}
              </div>

              <div class="card-footer">

                <span style="font-size: 0.78rem; color: var(--color-text-muted);">
                  Team Size:
                  ${escapeHtml(item.teamSize)}
                </span>

                <a
                  href="projects.html"
                  class="btn btn-secondary btn-sm"
                >
                  View Details
                </a>

              </div>

            </div>
          `;
        }).join('');
    }
  }

  /* ------------------------------------------------------------------------
     Teams
     ------------------------------------------------------------------------ */

  if (homeTeams) {
    const teams =
      safeJsonArray(
        'campusx_teams'
      )
        .map(normalizeTeamProfile)
        .filter(Boolean);

    if (teams.length === 0) {
      homeTeams.innerHTML = `
        <div class="empty-state-box">

          <div class="empty-state-icon">
            🤝
          </div>

          <h3 class="empty-state-title">
            No Active Teammate Profiles Yet
          </h3>

          <p class="empty-state-desc">
            No student profiles are currently active. Register your profile to find teammates for upcoming hackathons and projects.
          </p>

          <div class="empty-state-actions">

            <a
              href="teams.html"
              class="btn btn-primary"
            >
              Create Your Profile
            </a>

            <a
              href="teams.html"
              class="btn btn-secondary"
            >
              Browse Teammate Directory
            </a>

          </div>

        </div>
      `;
    } else {
      homeTeams.innerHTML =
        teams.slice(0, 3).map(item => `
          <div class="team-member-card">

            <div class="member-header">

              <div class="member-avatar">
                ${escapeHtml(
                  item.initials || 'ST'
                )}
              </div>

              <div class="member-info">

                <h4>
                  ${escapeHtml(
                    item.name ||
                    item.title
                  )}
                </h4>

                <div class="member-branch-year">
                  ${escapeHtml(item.year)}
                  •
                  ${escapeHtml(item.branch)}
                </div>

              </div>

            </div>

            <div class="member-role">
              ${escapeHtml(item.role)}
            </div>

            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">
              ${escapeHtml(item.bio)}
            </p>

            <div class="skills-pill-group">
              ${item.skills.map(skill => `
                <span class="skill-pill">
                  ${escapeHtml(skill)}
                </span>
              `).join('')}
            </div>

            <div class="member-availability">
              <span class="availability-dot"></span>

              <span>
                ${escapeHtml(item.availability)}
              </span>
            </div>

            <div class="member-links">

              <a
                href="teams.html"
                class="btn btn-primary btn-sm btn-full"
              >
                Connect with Teammate
              </a>

            </div>

          </div>
        `).join('');
    }
  }

  /* ------------------------------------------------------------------------
     Marketplace
     ------------------------------------------------------------------------ */

  if (homeMarket) {
    const material =
      safeJsonArray(
        'campusx_material'
      )
        .map(normalizeMaterial)
        .filter(Boolean);

    if (material.length === 0) {
      homeMarket.innerHTML = `
        <div class="empty-state-box">

          <div class="empty-state-icon">
            📦
          </div>

          <h3 class="empty-state-title">
            No material Currently Listed
          </h3>

          <p class="empty-state-desc">
            No material are currently listed. Sell your unused engineering material to another student.
          </p>

          <div class="empty-state-actions">

            <a
              href="material.html"
              class="btn btn-primary"
            >
              Sell Material
            </a>

            <a
              href="material.html"
              class="btn btn-secondary"
            >
              Browse Marketplace
            </a>

          </div>

        </div>
      `;
    } else {
      homeMarket.innerHTML =
        material.slice(0, 3).map(item => `
          <div class="market-card">

            <div class="market-image-placeholder">

              <span class="market-icon-big">
                ${item.icon}
              </span>

              <span class="badge ${item.conditionClass} market-condition-tag">
                ${escapeHtml(item.condition)}
              </span>

              <span class="badge badge-gray market-category-tag">
                ${escapeHtml(item.categoryName)}
              </span>

            </div>

            <div class="market-content">

              <h3 class="market-title">
                ${escapeHtml(item.title)}
              </h3>

              <div class="market-price">
                ${escapeHtml(item.price)}
              </div>

              <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">
                ${escapeHtml(item.desc)}
              </p>

              <div class="market-meta">

                <div class="market-meta-row">
                  <span>👤 Seller:</span>
                  <strong>
                    ${escapeHtml(item.seller)}
                  </strong>
                </div>

                <div class="market-meta-row">
                  <span>📍 Location:</span>
                  <span>
                    ${escapeHtml(item.location)}
                  </span>
                </div>

              </div>

              <a
                href="material.html"
                class="btn btn-primary btn-sm btn-full"
              >
                View Material in Marketplace
              </a>

            </div>

          </div>
        `).join('');
    }
  }
}

/* ==========================================================================
   13. GENERIC MODALS
   ========================================================================== */

function initGenericModals() {
  /*
    Event delegation is used here intentionally.

    This means buttons dynamically created later with
    data-open-modal / data-close-modal also work.
  */

  document.addEventListener('click', e => {
    const openButton =
      e.target.closest(
        '[data-open-modal]'
      );

    if (openButton) {
      e.preventDefault();

      const modalId =
        openButton.getAttribute(
          'data-open-modal'
        );

      if (isSafeId(modalId)) {
        CampusX.openModal(modalId);
      }

      return;
    }

    const closeButton =
      e.target.closest(
        '[data-close-modal]'
      );

    if (closeButton) {
      e.preventDefault();

      const modal =
        closeButton.closest(
          '.modal-overlay'
        );

      if (modal) {
        modal.classList.remove('active');
      }

      if (
        !document.querySelector(
          '.modal-overlay.active'
        )
      ) {
        document.body.style.overflow = '';
      }

      return;
    }

    const overlay =
      e.target.closest(
        '.modal-overlay'
      );

    if (
      overlay &&
      e.target === overlay
    ) {
      overlay.classList.remove(
        'active'
      );

      if (
        !document.querySelector(
          '.modal-overlay.active'
        )
      ) {
        document.body.style.overflow = '';
      }
    }
  });
}

/* ==========================================================================
   14. DYNAMIC ACTIONS FROM HARDENED HTML
   ========================================================================== */

function initDynamicActions() {
  document.addEventListener('click', e => {

    /* ----------------------------------------------------------------------
       Community Guidelines
       ---------------------------------------------------------------------- */

    const guidelines =
      e.target.closest(
        '[data-community-guidelines]'
      );

    if (guidelines) {
      e.preventDefault();

      CampusX.showToast(
        'Please use CampusX responsibly. Share genuine academic resources and respect other students.',
        'info'
      );

      return;
    }

    /* ----------------------------------------------------------------------
       Roadmap disabled items
       ---------------------------------------------------------------------- */

    const roadmapDisabled =
      e.target.closest(
        '[data-roadmap-disabled="true"]'
      );

    if (roadmapDisabled) {
      e.preventDefault();

      CampusX.showToast(
        'This roadmap section is coming soon.',
        'info'
      );

      return;
    }

    /* ----------------------------------------------------------------------
       Marketplace inquiry button from material.html
       ---------------------------------------------------------------------- */

    const inquiryButton =
      e.target.closest(
        '[data-send-inquiry="true"]'
      );

    if (inquiryButton) {
      e.preventDefault();

      const titleElement =
        document.getElementById(
          'contactItemTitle'
        );

      const sellerElement =
        document.getElementById(
          'contactSellerName'
        );

      const title =
        cleanString(
          titleElement?.textContent,
          150
        );

      const seller =
        cleanString(
          sellerElement?.textContent,
          100
        );

      CampusX.showToast(
        `Inquiry sent${seller ? ` to ${seller}` : ''}${title ? ` for "${title}"` : ''}.`,
        'success'
      );

      CampusX.closeModal(
        'contactSellerModal'
      );

      return;
    }

  });
}
/* ==========================================================================
   15. CAREER ROADMAP PAGE
   ========================================================================== */

function initCareerPage() {
  const tabs = document.querySelectorAll('.filter-tabs a[href^="#"]');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  const cards = document.querySelectorAll('.card[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 160;
    cards.forEach(card => {
      const top = card.offsetTop;
      const height = card.offsetHeight;
      const id = card.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        tabs.forEach(tab => {
          tab.classList.toggle('active', tab.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { passive: true });
}
