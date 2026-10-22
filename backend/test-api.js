/**
 * CampusX Comprehensive Full-Stack Verification Suite
 * Tests all Express routes, database diagnostics, input validations,
 * authentication contracts, and reports exact storage mode.
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          // Response is text
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json !== null ? json : data
        });
      });
    });

    req.on('error', reject);

    if (options.rawBody) {
      req.write(options.rawBody);
    } else if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('🧪 CampusX Full-Stack Integration Verification Suite');
  console.log(`Target: ${BASE_URL}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${details ? '- ' + details : ''}`);
      failed++;
    }
  }

  try {
    // 1. Test GET /
    const rootRes = await makeRequest('/');
    assert(
      rootRes.statusCode === 200 && rootRes.body === 'CampusX Backend is Running!',
      'GET / returns "CampusX Backend is Running!"'
    );

    // 2. Test GET /api/status & Database Diagnostic Mode
    const statusRes = await makeRequest('/api/status');
    const dbInfo = statusRes.body.database || {};
    assert(
      statusRes.statusCode === 200 &&
      statusRes.body.success === true &&
      statusRes.body.message === 'CampusX API is working!' &&
      statusRes.body.project === 'CampusX',
      'GET /api/status returns expected JSON contract'
    );

    console.log(`\n📊 [DATABASE DIAGNOSTIC]`);
    console.log(`   - Storage Mode : ${dbInfo.mode}`);
    console.log(`   - Provider     : ${dbInfo.provider}`);
    console.log(`   - Persistent   : ${dbInfo.persistent ? 'YES (PostgreSQL / Supabase)' : 'NO (Ephemeral Dev Fallback)'}`);
    console.log(`   - Target Host  : ${dbInfo.targetHost || 'None (Local In-Memory)'}`);
    console.log(`   - Status Note  : ${dbInfo.message}\n`);

    // 3. Test GET /api/health
    const healthRes = await makeRequest('/api/health');
    assert(
      (healthRes.statusCode === 200 || healthRes.statusCode === 503) &&
      healthRes.body.serverAvailable === true &&
      Boolean(healthRes.body.uptimeSeconds !== undefined),
      'GET /api/health returns server uptime and memory telemetry'
    );

    // 4. Test GET /api/notes
    const notesRes = await makeRequest('/api/notes');
    assert(
      notesRes.statusCode === 200 &&
      notesRes.body.success === true &&
      Array.isArray(notesRes.body.data) &&
      notesRes.body.count >= 3,
      'GET /api/notes returns array of notes with count >= 3'
    );

    // Verify the 3 original sample notes exist
    const titles = notesRes.body.data.map(n => n.title);
    assert(
      titles.includes('Introduction to Trees') &&
      titles.includes('Introduction to DBMS') &&
      titles.includes('Network Fundamentals'),
      'GET /api/notes preserves the 3 original required sample notes'
    );

    // 5. Test POST /api/notes with valid data
    const postNoteRes = await makeRequest('/api/notes', {
      method: 'POST',
      body: {
        title: 'Artificial Intelligence - Heuristic Search Algorithms',
        subject: 'Artificial Intelligence',
        unit: 'Unit 1',
        sem: 'Sem 3',
        year: '2nd Year',
        contributor: 'CampusX Student Test',
        desc: 'A*, AO*, Branch and Bound search algorithm implementations and space complexities.'
      }
    });
    assert(
      postNoteRes.statusCode === 201 &&
      postNoteRes.body.success === true &&
      postNoteRes.body.data.title === 'Artificial Intelligence - Heuristic Search Algorithms',
      'POST /api/notes creates note with 201 Created'
    );

    // 6. Test POST /api/notes validation error (missing title)
    const postInvalidNoteRes = await makeRequest('/api/notes', {
      method: 'POST',
      body: { subject: 'Mathematics' }
    });
    assert(
      postInvalidNoteRes.statusCode === 400 &&
      postInvalidNoteRes.body.success === false &&
      postInvalidNoteRes.body.error === 'Validation Error',
      'POST /api/notes rejects missing title with 400 Bad Request'
    );

    // 7. Test GET /api/projects
    const projRes = await makeRequest('/api/projects');
    assert(
      projRes.statusCode === 200 &&
      projRes.body.success === true &&
      Array.isArray(projRes.body.data),
      'GET /api/projects returns project listings'
    );

    // 8. Test POST /api/projects
    const postProjRes = await makeRequest('/api/projects', {
      method: 'POST',
      body: {
        title: 'Smart Agritech Yield Monitor',
        category: 'IoT & Web',
        techStack: ['Node.js', 'Express', 'Python', 'PostgreSQL'],
        description: 'Automated soil moisture and weather advisory system.'
      }
    });
    assert(
      postProjRes.statusCode === 201 &&
      postProjRes.body.success === true &&
      postProjRes.body.data.title === 'Smart Agritech Yield Monitor',
      'POST /api/projects creates project listing with 201 Created'
    );

    // 9. Test GET /api/teams
    const teamsRes = await makeRequest('/api/teams');
    assert(
      teamsRes.statusCode === 200 &&
      teamsRes.body.success === true &&
      Array.isArray(teamsRes.body.data),
      'GET /api/teams returns peer team recruitments'
    );

    // 10. Test POST /api/teams
    const postTeamRes = await makeRequest('/api/teams', {
      method: 'POST',
      body: {
        title: 'SIH 2026 Smart Mobility Team',
        category: 'Hackathon',
        lookingFor: 'Flutter / React Native Developer',
        description: 'Building urban route optimization solution for municipal transit.',
        contactEmail: 'transit-lead@campusx.edu'
      }
    });
    assert(
      postTeamRes.statusCode === 201 &&
      postTeamRes.body.success === true &&
      postTeamRes.body.data.title === 'SIH 2026 Smart Mobility Team',
      'POST /api/teams creates team listing with 201 Created'
    );

    // 11. Test GET /api/materials & POST /api/materials
    const matRes = await makeRequest('/api/materials');
    assert(
      matRes.statusCode === 200 &&
      matRes.body.success === true &&
      Array.isArray(matRes.body.data),
      'GET /api/materials returns marketplace materials list'
    );

    const postMatRes = await makeRequest('/api/materials', {
      method: 'POST',
      body: {
        title: 'Casio fx-991EX Scientific Calculator',
        category: 'calculators',
        condition: 'Like New',
        price: 750,
        contactPhone: '+91 98220 11223',
        description: 'Original scientific calculator with solar panel and textbook display.'
      }
    });
    assert(
      postMatRes.statusCode === 201 &&
      postMatRes.body.success === true &&
      postMatRes.body.data.title === 'Casio fx-991EX Scientific Calculator',
      'POST /api/materials creates marketplace listing with 201 Created'
    );

    // 12. Test POST /api/auth/register
    const testEmail = `student_${Date.now()}@campusx.edu`;
    const regRes = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Verification Student',
        email: testEmail,
        password: 'securePassword2026!',
        role: 'Student Member',
        branch: 'Information Technology',
        year: 'SE',
        college: 'NDMVP KBTCOE'
      }
    });
    assert(
      regRes.statusCode === 201 &&
      regRes.body.success === true &&
      Boolean(regRes.body.token) &&
      Boolean(regRes.body.user),
      'POST /api/auth/register registers user, hashes password, returns JWT'
    );

    const token = regRes.body.token;

    // 13. Test POST /api/auth/register duplicate email conflict
    const dupRegRes = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Duplicate Student',
        email: testEmail,
        password: 'anotherPassword123!'
      }
    });
    assert(
      dupRegRes.statusCode === 409 &&
      dupRegRes.body.success === false &&
      dupRegRes.body.error === 'Conflict',
      'POST /api/auth/register prevents duplicate email registration (409 Conflict)'
    );

    // 14. Test POST /api/auth/login
    const loginRes = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'securePassword2026!'
      }
    });
    assert(
      loginRes.statusCode === 200 &&
      loginRes.body.success === true &&
      loginRes.body.user.email === testEmail &&
      Boolean(loginRes.body.token),
      'POST /api/auth/login verifies PBKDF2 hash & returns JWT session'
    );

    // 15. Test POST /api/auth/login generic error on invalid credentials
    const badLoginRes = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'wrongPasswordHere!'
      }
    });
    assert(
      badLoginRes.statusCode === 401 &&
      badLoginRes.body.success === false &&
      badLoginRes.body.message === 'Invalid email or password.',
      'POST /api/auth/login returns generic error without revealing account details'
    );

    // 16. Test GET /api/auth/me with Bearer token
    const meRes = await makeRequest('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    assert(
      meRes.statusCode === 200 &&
      meRes.body.success === true &&
      meRes.body.user.email === testEmail,
      'GET /api/auth/me authorizes request with valid Bearer token'
    );

    // 17. Test GET /api/auth/me without token (401 Unauthorized)
    const meUnauthorizedRes = await makeRequest('/api/auth/me');
    assert(
      meUnauthorizedRes.statusCode === 401 &&
      meUnauthorizedRes.body.success === false,
      'GET /api/auth/me rejects missing token with 401 Unauthorized'
    );

    // 18. Test 404 for unknown route
    const notFoundRes = await makeRequest('/api/non-existent-endpoint');
    assert(
      notFoundRes.statusCode === 404 &&
      notFoundRes.body.success === false &&
      notFoundRes.body.message === 'API route not found',
      'Unknown route returns 404 with JSON message'
    );

    // 19. Test Invalid JSON Body Handling
    const invalidJsonRes = await makeRequest('/api/notes', {
      method: 'POST',
      rawBody: '{"title": "Broken JSON, missing closing brace',
      headers: { 'Content-Type': 'application/json' }
    });
    assert(
      invalidJsonRes.statusCode === 400 || invalidJsonRes.statusCode === 500,
      'Malformed JSON request body is intercepted without crashing the server'
    );

    console.log('\n================================================================');
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    console.log(`Storage Mode Tested: ${dbInfo.persistent ? 'REAL POSTGRESQL / SUPABASE' : 'IN-MEMORY DEVELOPMENT FALLBACK'}`);
    console.log('================================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal Test Suite Error:', error);
    process.exit(1);
  }
}

runTests();
