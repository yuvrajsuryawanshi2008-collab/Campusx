-- =============================================================================
-- CampusX Row Level Security (RLS) Policies for Supabase
-- Run this script in the Supabase SQL Editor to secure all tables.
-- =============================================================================

-- 1. USERS TABLE SECURITY
-- Enable RLS to prevent public scraping of student emails and password hashes via PostgREST
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Deny public read access to users" ON users;
DROP POLICY IF EXISTS "Service role full access to users" ON users;

-- Policy: Only service role (backend connection) can access users
CREATE POLICY "Service role full access to users" 
ON users FOR ALL 
USING (auth.role() = 'service_role' OR current_user = 'postgres');


-- 2. ACADEMIC NOTES TABLE SECURITY
ALTER TABLE IF EXISTS notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public notes are viewable by everyone" ON notes;
DROP POLICY IF EXISTS "Allow note uploads" ON notes;

-- Read: Anyone can read approved study notes
CREATE POLICY "Public notes are viewable by everyone" 
ON notes FOR SELECT 
USING (true);

-- Insert: Backend / Authenticated users can insert
CREATE POLICY "Allow note uploads" 
ON notes FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR current_user = 'postgres' OR auth.role() = 'authenticated');


-- 3. PROJECTS SHOWCASE TABLE SECURITY
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Allow project submissions" ON projects;

-- Read: Anyone can read project showcase
CREATE POLICY "Public projects are viewable by everyone" 
ON projects FOR SELECT 
USING (true);

-- Insert: Backend / Authenticated users can insert
CREATE POLICY "Allow project submissions" 
ON projects FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR current_user = 'postgres' OR auth.role() = 'authenticated');


-- 4. PEER TEAMS TABLE SECURITY
ALTER TABLE IF EXISTS teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public teams are viewable by everyone" ON teams;
DROP POLICY IF EXISTS "Allow team submissions" ON teams;

-- Read: Anyone can browse peer team openings
CREATE POLICY "Public teams are viewable by everyone" 
ON teams FOR SELECT 
USING (true);

-- Insert: Backend / Authenticated users can insert
CREATE POLICY "Allow team submissions" 
ON teams FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR current_user = 'postgres' OR auth.role() = 'authenticated');


-- 5. STUDY MATERIALS / MARKETPLACE TABLE SECURITY
ALTER TABLE IF EXISTS materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public materials are viewable by everyone" ON materials;
DROP POLICY IF EXISTS "Allow material submissions" ON materials;

-- Read: Anyone can browse materials
CREATE POLICY "Public materials are viewable by everyone" 
ON materials FOR SELECT 
USING (true);

-- Insert: Backend / Authenticated users can insert
CREATE POLICY "Allow material submissions" 
ON materials FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR current_user = 'postgres' OR auth.role() = 'authenticated');
