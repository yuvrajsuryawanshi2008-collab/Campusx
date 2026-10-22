/**
 * CampusX Backend API Server
 * 
 * Purpose: REST API supporting CampusX (Learn • Share • Grow)
 * College Academic Resource-Sharing Platform for Students.
 */

const path = require('path');
const dotenv = require('dotenv');

// Consistent environment variable resolution
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const db = require('./db');
const { hashPassword, verifyPassword, createToken, requireAuth } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate production environment requirements
if (NODE_ENV === 'production') {
  const missing = [];
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.trim()) {
    missing.push('DATABASE_URL (PostgreSQL / Supabase connection required)');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'campusx_development_secret_key_change_in_production') {
    missing.push('JWT_SECRET (Random strong secret required in production)');
  }
  if (missing.length > 0) {
    console.error('❌ [CampusX Production Guard] Halting startup due to unconfigured production settings:');
    missing.forEach(m => console.error(`   - ${m}`));
    process.exit(1);
  }
}

// =============================================================================
// MIDDLEWARE CONFIGURATION
// =============================================================================

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CORS configuration to allow local frontend tools (Live Server on 5500, Vite, static files)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['*'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (NODE_ENV === 'production') {
      return callback(new Error('CORS policy: Disallowed origin'));
    }
    return callback(null, true); // Dev-friendly fallback
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies safely with size limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Static serving for verified study materials and syllabi
app.use('/materials', express.static(path.join(__dirname, '../Sem3 Study Material')));

// Static serving for root assets and HTML pages (without overriding GET /)
app.use(express.static(path.join(__dirname, '..'), { index: false }));

// =============================================================================
// ROUTES: STATUS & HEALTH
// =============================================================================

// 1. Main route (Exact required string contract)
app.get('/', (req, res) => {
  res.send('CampusX Backend is Running!');
});

// 2. API status route (Exact required JSON contract)
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'CampusX API is working!',
    project: 'CampusX',
    environment: NODE_ENV,
    database: db.getDatabaseStatus()
  });
});

// 3. API health route: distinguishes server availability from DB connectivity
app.get('/api/health', (req, res) => {
  const mem = process.memoryUsage();
  const dbStatus = db.getDatabaseStatus();

  res.status(dbStatus.status === 'connection_failed' ? 503 : 200).json({
    status: dbStatus.status === 'connection_failed' ? 'degraded' : 'healthy',
    serverAvailable: true,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    memory: {
      rssMB: Math.round(mem.rss / 1024 / 1024),
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024)
    }
  });
});

// =============================================================================
// ROUTES: ACADEMIC NOTES
// =============================================================================

// GET /api/notes
app.get('/api/notes', async (req, res, next) => {
  try {
    const notes = await db.getAllNotes();
    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/notes
app.post('/api/notes', async (req, res, next) => {
  try {
    const { title, subject, unit, sem, year, contributor, desc, fileUrl } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Note title is required.'
      });
    }

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Subject is required.'
      });
    }

    const createdNote = await db.addNote({
      title: title.trim().slice(0, 200),
      subject: subject.trim().slice(0, 100),
      unit: unit ? String(unit).trim().slice(0, 50) : 'Unit 1',
      sem: sem ? String(sem).trim().slice(0, 50) : 'Sem 3',
      year: year ? String(year).trim().slice(0, 50) : '2nd Year',
      contributor: contributor ? String(contributor).trim().slice(0, 100) : 'Senior Student',
      desc: desc ? String(desc).trim().slice(0, 1000) : '',
      fileUrl: fileUrl ? String(fileUrl).trim().slice(0, 500) : ''
    });

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully!',
      data: createdNote
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// ROUTES: PROJECTS
// =============================================================================

// GET /api/projects
app.get('/api/projects', async (req, res, next) => {
  try {
    const projects = await db.getAllProjects();
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects
app.post('/api/projects', async (req, res, next) => {
  try {
    const { title, category, techStack, description, githubUrl, liveUrl, teamLead, teamSize } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Project title is required.'
      });
    }

    const newProject = await db.addProject({
      title: title.trim().slice(0, 200),
      category: category ? String(category).trim().slice(0, 100) : 'Web Development',
      techStack: Array.isArray(techStack) ? techStack.slice(0, 10).map(t => String(t).slice(0, 50)) : [],
      description: description ? String(description).trim().slice(0, 1500) : '',
      githubUrl: githubUrl ? String(githubUrl).trim().slice(0, 300) : '',
      liveUrl: liveUrl ? String(liveUrl).trim().slice(0, 300) : '',
      teamLead: teamLead ? String(teamLead).trim().slice(0, 100) : 'Student',
      teamSize: Number(teamSize) || 1
    });

    res.status(201).json({
      success: true,
      message: 'Project posted successfully!',
      data: newProject
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// ROUTES: PEER TEAMS
// =============================================================================

// GET /api/teams
app.get('/api/teams', async (req, res, next) => {
  try {
    const teams = await db.getAllTeams();
    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/teams
app.post('/api/teams', async (req, res, next) => {
  try {
    const { title, category, lookingFor, description, contactEmail, memberCount, status } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Team title is required.'
      });
    }

    if (!contactEmail || typeof contactEmail !== 'string' || !contactEmail.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Valid contact email is required.'
      });
    }

    const newTeam = await db.addTeam({
      title: title.trim().slice(0, 200),
      category: category ? String(category).trim().slice(0, 100) : 'Hackathon',
      lookingFor: lookingFor ? String(lookingFor).trim().slice(0, 200) : 'Teammates',
      description: description ? String(description).trim().slice(0, 1500) : '',
      contactEmail: contactEmail.trim().toLowerCase().slice(0, 150),
      memberCount: memberCount ? String(memberCount).trim().slice(0, 50) : '1 Member',
      status: status ? String(status).trim().slice(0, 50) : 'Open'
    });

    res.status(201).json({
      success: true,
      message: 'Team opening posted successfully!',
      data: newTeam
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// ROUTES: STUDY MATERIALS & MARKETPLACE
// =============================================================================

// GET /api/materials
app.get('/api/materials', async (req, res, next) => {
  try {
    const materials = await db.getAllMaterials();
    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/materials
app.post('/api/materials', async (req, res, next) => {
  try {
    const { title, category, condition, price, contactPhone, description, sellerName } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Material title is required.'
      });
    }

    const newMaterial = await db.addMaterial({
      title: title.trim().slice(0, 200),
      category: category ? String(category).trim().slice(0, 100) : 'textbooks',
      condition: condition ? String(condition).trim().slice(0, 50) : 'Good',
      price: Number(price) || 0.00,
      contactPhone: contactPhone ? String(contactPhone).trim().slice(0, 50) : '',
      description: description ? String(description).trim().slice(0, 1500) : '',
      sellerName: sellerName ? String(sellerName).trim().slice(0, 100) : 'Student Seller'
    });

    res.status(201).json({
      success: true,
      message: 'Study material listing posted successfully!',
      data: newMaterial
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// ROUTES: AUTHENTICATION
// =============================================================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password, role, branch, year, college } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Name is required.'
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Valid email address is required.'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Password must be at least 6 characters long.'
      });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'An account with this email address already exists.'
      });
    }

    const passwordHash = hashPassword(password);
    const user = await db.registerUser({
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 150),
      passwordHash,
      role: role ? String(role).slice(0, 50) : 'Student Member',
      branch: branch ? String(branch).slice(0, 50) : 'Engineering',
      year: year ? String(year).slice(0, 50) : 'SE',
      college: college ? String(college).slice(0, 150) : 'Engineering College'
    });

    const token = createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Email and password are required.'
      });
    }

    // Generic error message to prevent account enumeration
    const genericAuthError = {
      success: false,
      error: 'Invalid Credentials',
      message: 'Invalid email or password.'
    };

    const user = await db.findUserByEmail(email);
    if (!user || (!user.password_hash && !user.passwordHash)) {
      return res.status(401).json(genericAuthError);
    }

    const hash = user.password_hash || user.passwordHash;
    const isValid = verifyPassword(password, hash);
    if (!isValid) {
      return res.status(401).json(genericAuthError);
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        year: user.year,
        college: user.college,
        avatarInitials: user.avatar_initials || user.avatarInitials
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me (Protected route)
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// =============================================================================
// ROUTE HANDLERS: 404 & ERRORS
// =============================================================================

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Global error handling middleware (Never exposes stack traces in production)
app.use((err, req, res, next) => {
  const statusCode = err.status || (err instanceof SyntaxError && err.type === 'entity.parse.failed' ? 400 : 500);
  if (NODE_ENV !== 'test') {
    console.error(`[CampusX API Error ${statusCode}]:`, err.message);
  }

  res.status(statusCode).json({
    success: false,
    error: statusCode === 400 ? 'Bad Request' : (statusCode === 500 ? 'Internal Server Error' : err.name || 'Error'),
    message: NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred on the server.'
      : err.message
  });
});

// =============================================================================
// START SERVER & GRACEFUL SHUTDOWN
// =============================================================================
const server = app.listen(PORT, () => {
  console.log(`🚀 CampusX backend running at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down CampusX server gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = { app, server };
