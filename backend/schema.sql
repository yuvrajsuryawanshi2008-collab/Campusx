-- =============================================================================
-- CampusX Database Schema (PostgreSQL / Supabase Compatible)
-- Project: CampusX — Learn • Share • Grow
-- =============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'Student Member',
    branch VARCHAR(100),
    year VARCHAR(50),
    college VARCHAR(200) DEFAULT 'Engineering College',
    avatar_initials VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ACADEMIC NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    unit VARCHAR(100) DEFAULT 'Unit 1',
    sem VARCHAR(50) DEFAULT 'Sem 3',
    year VARCHAR(50) DEFAULT '2nd Year',
    contributor VARCHAR(150) DEFAULT 'Senior Student',
    description TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching and filtering notes
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes (subject);
CREATE INDEX IF NOT EXISTS idx_notes_sem ON notes (sem);

-- 3. PROJECTS SHOWCASE TABLE
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Web Development',
    tech_stack TEXT[] DEFAULT '{}',
    description TEXT,
    github_url TEXT,
    live_url TEXT,
    team_lead VARCHAR(150),
    team_size INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TEAM OPENINGS TABLE
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Hackathon',
    looking_for VARCHAR(150) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255) NOT NULL,
    member_count VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STUDY MATERIAL / MARKETPLACE TABLE
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'textbooks',
    condition VARCHAR(50) DEFAULT 'Good',
    price NUMERIC(10, 2) DEFAULT 0.00,
    contact_phone VARCHAR(50),
    description TEXT,
    seller_name VARCHAR(150),
    status VARCHAR(50) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- SEED INITIAL DATA (Ensuring exact contract parity with CampusX API)
-- =============================================================================

INSERT INTO notes (id, subject, title, unit, sem, year, contributor, description)
VALUES 
  (1, 'Data Structures', 'Introduction to Trees', 'Unit 3', 'Sem 3', '2nd Year', 'Dept. of IT / Faculty Notes', 'Binary trees, BST traversal methods, AVL tree rotations, and depth-first search principles.'),
  (2, 'Database Management Systems', 'Introduction to DBMS', 'Unit 1', 'Sem 4', '2nd Year', 'Dept. of IT / Faculty Notes', 'Relational database architecture, ACID properties, ER diagrams, and relational algebra.'),
  (3, 'Computer Networks', 'Network Fundamentals', 'Unit 1', 'Sem 5', '3rd Year', 'Senior Tech Circle', 'OSI 7-layer model, TCP/IP stack, subnetting, packet switching, and core protocols.')
ON CONFLICT (id) DO NOTHING;
-- Reset sequence to continue after seeded IDs

SELECT setval('notes_id_seq', (SELECT MAX(id) FROM notes));
