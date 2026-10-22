/**
 * CampusX Database Layer (PostgreSQL / Supabase + Development Fallback)
 * 
 * Provides an active PostgreSQL connection pool when DATABASE_URL is supplied in .env.
 * - If DATABASE_URL is provided and connected: All operations execute real persistent SQL.
 * - If DATABASE_URL is provided but unreachable: Rejects operations with a clear connection error.
 * - If DATABASE_URL is omitted: Operates in explicit ephemeral development mode with clear logging.
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment from backend/.env first, then root .env
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');

let pool = null;
let isConnected = false;
let dbError = null;
let targetHost = null;
let storageMode = 'in-memory-development'; // 'postgresql' | 'connection_failed' | 'in-memory-development'

// In-memory seed data for development fallback
const inMemoryNotes = [
  {
    id: 1,
    subject: "Data Structures",
    title: "Introduction to Trees",
    unit: "Unit 3",
    sem: "Sem 3",
    year: "2nd Year",
    contributor: "Dept. of IT / Faculty Notes",
    desc: "Binary trees, BST traversal methods, AVL tree rotations, and depth-first search principles.",
    fileUrl: "Sem3 Study Material/DSA/Practical/Pract1 Linear and Binary Search .pdf"
  },
  {
    id: 2,
    subject: "Database Management Systems",
    title: "Introduction to DBMS",
    unit: "Unit 1",
    sem: "Sem 4",
    year: "2nd Year",
    contributor: "Dept. of IT / Faculty Notes",
    desc: "Relational database architecture, ACID properties, ER diagrams, and relational algebra.",
    fileUrl: ""
  },
  {
    id: 3,
    subject: "Computer Networks",
    title: "Network Fundamentals",
    unit: "Unit 1",
    sem: "Sem 5",
    year: "3rd Year",
    contributor: "Senior Tech Circle",
    desc: "OSI 7-layer model, TCP/IP stack, subnetting, packet switching, and core protocols.",
    fileUrl: ""
  }
];

const inMemoryProjects = [
  {
    id: 1,
    title: "CampusX CEP Portal",
    category: "Full Stack Web",
    techStack: ["Node.js", "Express", "HTML5", "CSS3", "JavaScript"],
    description: "Production-grade student portal for engineering materials, notes repository, peer team finding, and interactive learning roadmaps.",
    githubUrl: "https://github.com/campusx-org/campusx-platform",
    liveUrl: "http://localhost:3000",
    teamLead: "Yuvraj (SE IT)",
    teamSize: 4
  }
];

const inMemoryTeams = [
  {
    id: 1,
    title: "Smart India Hackathon 2026 - AI in Agritech",
    category: "Hackathon",
    lookingFor: "Backend Developer (Node / Python) & ML Engineer",
    description: "Building an automated crop disease classification and yield advisory engine for rural agricultural hubs.",
    contactEmail: "sih-team@campusx.edu",
    memberCount: "3/5 Members",
    status: "Open"
  }
];

const inMemoryMaterials = [
  {
    id: 1,
    title: "Organic Farming CEP Seminar Dossier & Research Slides",
    category: "pdf",
    condition: "Like New",
    price: 90.00,
    sellerName: "Yuvraj & Team (SE IT)",
    contactPhone: "+91 98112 44556",
    description: "Comprehensive community engagement report and presentation slides on sustainable agriculture.",
    status: "Available"
  }
];

const inMemoryUsers = [];

let nextNoteId = 4;
let nextProjectId = 2;
let nextTeamId = 2;
let nextMaterialId = 2;

// Parse safe database info without exposing password
function getSafeDbInfo(rawUrl) {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    return {
      host: parsed.hostname,
      port: parsed.port || '5432',
      database: parsed.pathname.replace(/^\//, ''),
      user: parsed.username
    };
  } catch (err) {
    return { host: 'custom-connection-string', port: '5432', database: 'postgres', user: 'unknown' };
  }
}

// Initialize PostgreSQL pool if DATABASE_URL is configured
if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim()) {
  const safeInfo = getSafeDbInfo(process.env.DATABASE_URL);
  targetHost = safeInfo ? `${safeInfo.host}:${safeInfo.port}/${safeInfo.database}` : 'configured-host';

  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 7000,
      ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL.includes('supabase')
        ? { rejectUnauthorized: false }
        : false
    });

    console.log(`🔌 [CampusX DB] DATABASE_URL detected. Connecting to PostgreSQL (${safeInfo ? safeInfo.host : 'remote'})...`);

    pool.query('SELECT NOW()')
      .then(() => {
        isConnected = true;
        storageMode = 'postgresql';
        console.log(`✅ [CampusX DB] Connected successfully to PostgreSQL database at ${safeInfo.host}.`);
        console.log(`🔒 [CampusX DB] Persistent SQL storage is active.`);
      })
      .catch(err => {
        isConnected = false;
        storageMode = 'connection_failed';
        dbError = err.message;
        console.error(`❌ [CampusX DB] Failed to connect to PostgreSQL at ${safeInfo ? safeInfo.host : 'host'}:`, err.message);
        console.error(`⚠️ [CampusX DB] Persistent database is unreachable.`);
        if (safeInfo && safeInfo.host.includes('.supabase.co')) {
          console.warn(`💡 [CampusX DB Tip] If connecting to Supabase on Windows, ensure your network supports IPv6 or use the Supabase Session Pooler URL (pooler.supabase.com) on port 5432/6543.`);
        }
      });
  } catch (err) {
    isConnected = false;
    storageMode = 'connection_failed';
    dbError = err.message;
    console.error('❌ [CampusX DB] Pool initialization error:', err.message);
  }
} else {
  storageMode = 'in-memory-development';
  console.log('ℹ️ [CampusX DB] DATABASE_URL not configured in backend/.env.');
  console.log('⚠️ [CampusX DB] Operating in EPHEMERAL IN-MEMORY DEVELOPMENT mode.');
  console.log('ℹ️ [CampusX DB] Changes will NOT persist across server restarts until DATABASE_URL is configured.');
}

// Guard to prevent silent in-memory fallback when a real database is configured but down
function checkStorageIntegrity() {
  if (storageMode === 'connection_failed') {
    const error = new Error(`Database connection failed (${dbError || 'PostgreSQL unreachable'}). Operations are blocked to preserve data integrity.`);
    error.status = 503;
    throw error;
  }
}

/**
 * NOTES OPERATIONS
 */
async function getAllNotes() {
  checkStorageIntegrity();

  if (storageMode === 'postgresql' && pool && isConnected) {
    const res = await pool.query(
      'SELECT id, title, subject, unit, sem, year, contributor, description AS desc, file_url AS "fileUrl", created_at FROM notes ORDER BY id ASC'
    );
    return res.rows;
  }

  return [...inMemoryNotes];
}

async function addNote({ title, subject, unit, sem, year, contributor, desc, fileUrl }) {
  checkStorageIntegrity();

  if (storageMode === 'postgresql' && pool && isConnected) {
    const query = `
      INSERT INTO notes (title, subject, unit, sem, year, contributor, description, file_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, subject, unit, sem, year, contributor, description AS desc, file_url AS "fileUrl", created_at
    `;
    const values = [
      title,
      subject,
      unit || 'Unit 1',
      sem || 'Sem 3',
      year || '2nd Year',
      contributor || 'Senior Student',
      desc || '',
      fileUrl || ''
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  const newNote = {
    id: nextNoteId++,
    title,
    subject,
    unit: unit || 'Unit 1',
    sem: sem || 'Sem 3',
    year: year || '2nd Year',
    contributor: contributor || 'Senior Student',
    desc: desc || '',
    fileUrl: fileUrl || ''
  };
  inMemoryNotes.push(newNote);
  return newNote;
}

/**
 * PROJECTS OPERATIONS
 */
async function getAllProjects() {
  checkStorageIntegrity();

  if (storageMode === 'postgresql' && pool && isConnected) {
    const res = await pool.query(
      'SELECT id, title, category, tech_stack AS "techStack", description, github_url AS "githubUrl", live_url AS "liveUrl", team_lead AS "teamLead", team_size AS "teamSize", created_at FROM projects ORDER BY id DESC'
    );
    return res.rows;
  }

  return [...inMemoryProjects];
}

async function addProject(project) {
  checkStorageIntegrity();

  if (storageMode === 'postgresql' && pool && isConnected) {
    const query = `
      INSERT INTO projects (title, category, tech_stack, description, github_url, live_url, team_lead, team_size)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, category, tech_stack AS "techStack", description, github_url AS "githubUrl", live_url AS "liveUrl", team_lead AS "teamLead", team_size AS "teamSize", created_at
    `;
    const values = [
      project.title,
      project.category || 'Web Development',
      project.techStack || [],
      project.description || '',
      project.githubUrl || '',
      project.liveUrl || '',
      project.teamLead || 'Student',
      project.teamSize || 1
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  const newProject = {
    id: nextProjectId++,
    ...project,
    createdAt: new Date().toISOString()
  };
  inMemoryProjects.unshift(newProject);
  return newProject;
}

/**
 * TEAMS OPERATIONS
 */
async function getAllTeams() {
  checkStorageIntegrity();

  if (storageMode === 'postgresql' && pool && isConnected) {
    const res = await pool.query(
      'SELECT id, title, category, looking_for AS "lookingFor", description, contact_email AS "contactEmail", member_count AS "memberCount", status, created_at FROM teams ORDER BY id DESC'
    );
    return res.rows;
  }

  return [...inMemoryTeams];
}

async function addTeam(team) {
  checkStorageIntegrity();

  if (storageMode === 'postgresql' && pool && isConnected) {
    const query = `
      INSERT INTO teams (title, category, looking_for, description, contact_email, member_count, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, category, looking_for AS "lookingFor", description, contact_email AS "contactEmail", member_count AS "memberCount", status, created_at
    `;
    const values = [
      team.title,
      team.category || 'Hackathon',
      team.lookingFor,
      team.description || '',
      team.contactEmail,
      team.memberCount || '1 Member',
      team.status || 'Open'
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  const newTeam = {
    id: nextTeamId++,
    ...team,
    status: team.status || 'Open',
    createdAt: new Date().toISOString()
  };
  inMemoryTeams.unshift(newTeam);
  return newTeam;
}

/**
 * MATERIALS OPERATIONS
 */
async function getAllMaterials() {
  checkStorageIntegrity();

  if (storageMode === 'postgresql' && pool && isConnected) {
    const res = await pool.query(
      'SELECT id, title, category, condition, price, contact_phone AS "contactPhone", description, seller_name AS "sellerName", status, created_at FROM materials ORDER BY id DESC'
    );
    return res.rows;
  }

  return [...inMemoryMaterials];
}

async function addMaterial(material) {
  checkStorageIntegrity();

  if (storageMode === 'postgresql' && pool && isConnected) {
    const query = `
      INSERT INTO materials (title, category, condition, price, contact_phone, description, seller_name, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, category, condition, price, contact_phone AS "contactPhone", description, seller_name AS "sellerName", status, created_at
    `;
    const values = [
      material.title,
      material.category || 'textbooks',
      material.condition || 'Good',
      material.price || 0.00,
      material.contactPhone || '',
      material.description || '',
      material.sellerName || 'Student Seller',
      material.status || 'Available'
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  const newMaterial = {
    id: nextMaterialId++,
    ...material,
    createdAt: new Date().toISOString()
  };
  inMemoryMaterials.unshift(newMaterial);
  return newMaterial;
}

/**
 * USERS & AUTH OPERATIONS
 */
async function findUserByEmail(email) {
  checkStorageIntegrity();

  const normalized = String(email).trim().toLowerCase();
  if (storageMode === 'postgresql' && pool && isConnected) {
    const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalized]);
    return res.rows[0] || null;
  }

  return inMemoryUsers.find(u => u.email.toLowerCase() === normalized) || null;
}

async function registerUser({ name, email, passwordHash, role, branch, year, college }) {
  checkStorageIntegrity();

  const normalized = String(email).trim().toLowerCase();
  const avatarInitials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'ST';

  if (storageMode === 'postgresql' && pool && isConnected) {
    const query = `
      INSERT INTO users (name, email, password_hash, role, branch, year, college, avatar_initials)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, email, role, branch, year, college, avatar_initials AS "avatarInitials", created_at
    `;
    const values = [
      name,
      normalized,
      passwordHash,
      role || 'Student Member',
      branch || 'Engineering',
      year || 'SE',
      college || 'Engineering College',
      avatarInitials
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  const newUser = {
    id: `u_${Date.now()}`,
    name,
    email: normalized,
    passwordHash,
    role: role || 'Student Member',
    branch: branch || 'Engineering',
    year: year || 'SE',
    college: college || 'Engineering College',
    avatarInitials,
    createdAt: new Date().toISOString()
  };
  inMemoryUsers.push(newUser);
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    branch: newUser.branch,
    year: newUser.year,
    college: newUser.college,
    avatarInitials: newUser.avatarInitials,
    createdAt: newUser.createdAt
  };
}

/**
 * DATABASE DIAGNOSTICS & STATUS
 */
function getDatabaseStatus() {
  return {
    status: isConnected ? 'connected' : (Boolean(process.env.DATABASE_URL) ? 'connection_failed' : 'not_configured'),
    mode: storageMode,
    persistent: isConnected,
    provider: isConnected ? 'PostgreSQL (Supabase)' : (Boolean(process.env.DATABASE_URL) ? 'PostgreSQL (Unreachable)' : 'built-in-memory'),
    targetHost: targetHost || null,
    configured: Boolean(process.env.DATABASE_URL),
    error: dbError || null,
    message: isConnected
      ? 'Connected to persistent PostgreSQL database.'
      : (Boolean(process.env.DATABASE_URL)
          ? `Failed to connect to configured database at ${targetHost}. Check credentials and network connectivity.`
          : 'Operating in ephemeral in-memory development fallback mode. Configure DATABASE_URL in backend/.env for persistence.')
  };
}

module.exports = {
  getAllNotes,
  addNote,
  getAllProjects,
  addProject,
  getAllTeams,
  addTeam,
  getAllMaterials,
  addMaterial,
  findUserByEmail,
  registerUser,
  getDatabaseStatus
};
