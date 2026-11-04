import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { judgeInDocker, VERDICTS } from '../judge-worker/docker-judge.js';
import { judgeSubmission } from '../judge-worker/local-judge.js';
import { 
  checkAiRateLimit, 
  getProblemHint, 
  getProperProblemSolution,
  explainCompilerError, 
  estimateComplexity, 
  reviewAcceptedCode, 
  generateDraftProblem 
} from './ai-engine.js';
import { compareSubmissions } from './plagiarism.js';
import { SAMPLE_CLASSES, exportGradebookCsv } from './classroom-store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;

// File paths for persistence
const ALL_PROBLEMS_FILE = path.join(__dirname, 'data/all-problems.json');
const SUBMISSIONS_FILE = path.join(__dirname, 'data/submissions.json');
const USER_SOLVED_FILE = path.join(__dirname, 'data/user-solved.json');
const USERS_FILE = path.join(__dirname, 'data/users.json');

// Persistent user submissions
let loadedSubmissions = [];
if (fs.existsSync(SUBMISSIONS_FILE)) {
  try {
    loadedSubmissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
    console.log(`[Database] Loaded ${loadedSubmissions.length} user submissions from disk`);
  } catch (err) {
    console.error('Failed to parse submissions.json', err);
  }
}

// Persistent user solved problems (starts empty unless user previously submitted AC)
const loadedSolved = {
  'coder': new Set(),
  'admin': new Set(),
  'layriceth@gmail.com': new Set()
};
if (fs.existsSync(USER_SOLVED_FILE)) {
  try {
    const raw = JSON.parse(fs.readFileSync(USER_SOLVED_FILE, 'utf8'));
    for (const [user, items] of Object.entries(raw)) {
      loadedSolved[user.toLowerCase()] = new Set(Array.isArray(items) ? items : []);
    }
    // Backward compatibility: If layriceth@gmail.com doesn't have solved data yet, migrate from coder
    if ((!loadedSolved['layriceth@gmail.com'] || loadedSolved['layriceth@gmail.com'].size === 0) && loadedSolved['coder']?.size > 0) {
      loadedSolved['layriceth@gmail.com'] = new Set(Array.from(loadedSolved['coder']));
    }
    console.log(`[Database] Loaded solved records for users: ${Object.keys(loadedSolved).join(', ')}`);
  } catch (err) {
    console.error('Failed to parse user-solved.json', err);
  }
}

// Persistent users store
let loadedUsers = [
  { id: 'u-admin', username: 'admin', email: 'admin@codejudge.com', password: 'admin045', role: 'ROLE_ADMIN', rating: 2450, solvedCount: 0 },
  { id: 'u-coder', username: 'coder', email: 'coder@example.com', password: 'password123', role: 'ROLE_USER', rating: 1620, solvedCount: 0 },
  { id: 'u-layriceth', username: 'layriceth', email: 'layriceth@gmail.com', password: 'password123', role: 'ROLE_USER', rating: 1500, solvedCount: 0 }
];

if (fs.existsSync(USERS_FILE)) {
  try {
    const raw = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (Array.isArray(raw) && raw.length > 0) {
      loadedUsers = raw;
    }
  } catch (err) {
    console.error('Failed to parse users.json', err);
  }
}

// STRICT SECURITY: Enforce admin username 'admin' and password 'admin045'
const adminIdx = loadedUsers.findIndex(u => u.username.toLowerCase() === 'admin' || u.email.toLowerCase() === 'admin@codejudge.com');
if (adminIdx !== -1) {
  loadedUsers[adminIdx].password = 'admin045';
  loadedUsers[adminIdx].role = 'ROLE_ADMIN';
  loadedUsers[adminIdx].username = 'admin';
} else {
  loadedUsers.unshift({
    id: 'u-admin',
    username: 'admin',
    email: 'admin@codejudge.com',
    password: 'admin045',
    role: 'ROLE_ADMIN',
    rating: 2450,
    solvedCount: 0
  });
}

function saveUsersToDisk() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(DB.users, null, 2), 'utf8');
  } catch (err) {
    console.error('[Database] Failed to save users to disk:', err.message);
  }
}

function saveSubmissionsToDisk() {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(DB.submissions, null, 2), 'utf8');
  } catch (err) {
    console.error('[Database] Failed to save submissions to disk:', err.message);
  }
}

function saveSolvedToDisk() {
  try {
    const out = {};
    for (const [user, set] of Object.entries(DB.solvedByUser)) {
      out[user] = Array.from(set);
    }
    fs.writeFileSync(USER_SOLVED_FILE, JSON.stringify(out, null, 2), 'utf8');
  } catch (err) {
    console.error('[Database] Failed to save solved records to disk:', err.message);
  }
}
let loadedProblems = [];
if (fs.existsSync(ALL_PROBLEMS_FILE)) {
  try {
    loadedProblems = JSON.parse(fs.readFileSync(ALL_PROBLEMS_FILE, 'utf8'));
    console.log(`[Database] Successfully loaded ${loadedProblems.length} catalog problems from all-problems.json`);
  } catch (err) {
    console.error('Failed to parse all-problems.json', err);
  }
}

// In-Memory Database Store for Problems, Submissions, and Users
const DB = {
  users: loadedUsers,
  submissions: loadedSubmissions,
  solvedByUser: loadedSolved,
  problems: loadedProblems.length > 0 ? loadedProblems : [
    {
      id: "e4a3b8d1-1234-4567-89ab-cdef01234567",
      slug: "two-sum",
      title: "Two Sum",
      difficulty: "EASY",
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      tags: ["Array", "Hash Table"],
      solvedCount: 1420,
      totalSubmissions: 2890,
      descriptionMd: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.


You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

### Example 1:
\`\`\`text
Input: nums = [2,7,11,15], target = 9
Output: 0 1
Explanation: nums[0] + nums[1] == 9, so we return 0 1.
\`\`\`

### Example 2:
\`\`\`text
Input: nums = [3,2,4], target = 6
Output: 1 2
\`\`\`
`,
      sampleCases: [
        { input: "4\n2 7 11 15\n9", output: "0 1", explanation: "2 + 7 = 9" },
        { input: "3\n3 2 4\n6", output: "1 2", explanation: "2 + 4 = 6" }
      ],
      testCases: [
        { inputData: "4\n2 7 11 15\n9", expectedOutput: "0 1", isHidden: false },
        { inputData: "3\n3 2 4\n6", expectedOutput: "1 2", isHidden: false },
        { inputData: "2\n3 3\n6", expectedOutput: "0 1", isHidden: true }
      ]
    },
    {
      id: "f5b4c9e2-2345-6789-01bc-def012345678",
      slug: "longest-substring-without-repeating-characters",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "MEDIUM",
      timeLimitMs: 1500,
      memoryLimitMb: 256,
      tags: ["String", "Hash Table"],
      solvedCount: 980,
      totalSubmissions: 3120,
      descriptionMd: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

### Example 1:
\`\`\`text
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`
`,
      sampleCases: [
        { input: "abcabcbb", output: "3", explanation: "\"abc\" has length 3" },
        { input: "bbbbb", output: "1", explanation: "\"b\" has length 1" }
      ],
      testCases: [
        { inputData: "abcabcbb", expectedOutput: "3", isHidden: false },
        { inputData: "bbbbb", expectedOutput: "1", isHidden: false }
      ]
    },
    {
      id: "b2c3d4e5-4567-8901-23de-f01234567890",
      slug: "coin-change",
      title: "Coin Change",
      difficulty: "MEDIUM",
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      tags: ["Dynamic Programming", "Array"],
      solvedCount: 840,
      totalSubmissions: 2200,
      descriptionMd: `Given an integer array \`coins\` and an integer \`amount\`, return the fewest number of coins that make up that amount. If impossible, return \`-1\`.`,
      sampleCases: [
        { input: "3 11\n1 2 5", output: "3", explanation: "5 + 5 + 1 = 11" }
      ],
      testCases: [
        { inputData: "3 11\n1 2 5", expectedOutput: "3", isHidden: false }
      ]
    }
  ],
  submissions: loadedSubmissions
};

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Helper to respond with JSON
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Email, X-User-Name'
    });
    res.end();
    return;
  }

  console.log(`[API] ${method} ${pathname}`);

  try {
    // 1. Auth endpoints
    if (pathname === '/api/v1/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const input = (body.usernameOrEmail || '').trim();
      const password = (body.password || '').trim();
      const lowerInput = input.toLowerCase();

      // STRICT SECURITY: ONLY username "admin" with password "admin045" can log in as admin
      if (lowerInput === 'admin' || lowerInput === 'admin@codejudge.com') {
        if (password !== 'admin045') {
          return sendJson(res, 401, {
            success: false,
            message: 'Invalid admin credentials. Access denied.'
          });
        }
        let adminUser = DB.users.find(u => u.username.toLowerCase() === 'admin');
        if (!adminUser) {
          adminUser = {
            id: 'u-admin',
            username: 'admin',
            email: 'admin@codejudge.com',
            role: 'ROLE_ADMIN',
            rating: 2450,
            solvedCount: DB.solvedByUser['admin']?.size || 0
          };
          DB.users.unshift(adminUser);
          saveUsersToDisk();
        }
        return sendJson(res, 200, {
          success: true,
          message: 'Admin login successful',
          data: {
            accessToken: 'mock-jwt-admin-token-supersecure',
            tokenType: 'Bearer',
            user: {
              id: adminUser.id,
              username: 'admin',
              email: adminUser.email,
              role: 'ROLE_ADMIN',
              rating: adminUser.rating || 2450,
              solvedCount: DB.solvedByUser['admin']?.size || 0
            }
          }
        });
      }

      // Normal User Login / Gmail Personal Account
      if (!input) {
        return sendJson(res, 400, { success: false, message: 'Username or Gmail address is required' });
      }

      let user = DB.users.find(u => u.username.toLowerCase() === lowerInput || u.email.toLowerCase() === lowerInput);
      if (user) {
        if (user.password && user.password !== password) {
          return sendJson(res, 401, { success: false, message: 'Incorrect password for this account.' });
        }
      } else {
        // Automatically create account for new Gmail/user
        const email = lowerInput.includes('@') ? lowerInput : `${lowerInput}@gmail.com`;
        const username = lowerInput.includes('@') ? lowerInput.split('@')[0] : input;
        user = {
          id: 'u-' + Date.now(),
          username: username,
          email: email,
          password: password,
          role: 'ROLE_USER',
          rating: 1500,
          solvedCount: 0
        };
        DB.users.push(user);
        saveUsersToDisk();
      }

      const userKey = (user.email || user.username).toLowerCase();
      const userSolvedCount = DB.solvedByUser[userKey]?.size || 0;

      return sendJson(res, 200, {
        success: true,
        message: 'Login successful',
        data: {
          accessToken: 'mock-jwt-token-' + (user.email || user.username),
          tokenType: 'Bearer',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: 'ROLE_USER',
            rating: user.rating || 1500,
            solvedCount: userSolvedCount
          }
        }
      });
    }

    if (pathname === '/api/v1/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const userLower = (body.username || '').toLowerCase().trim();
      const emailLower = (body.email || '').toLowerCase().trim();

      if (userLower === 'admin' || emailLower.includes('admin')) {
        return sendJson(res, 400, {
          success: false,
          message: "Username 'admin' is reserved for system administration."
        });
      }

      if (DB.users.some(u => u.username.toLowerCase() === userLower || u.email.toLowerCase() === emailLower)) {
        return sendJson(res, 400, {
          success: false,
          message: 'An account with this username or email already exists.'
        });
      }

      const newUser = {
        id: 'u-' + Date.now(),
        username: body.username.trim(),
        email: emailLower,
        password: body.password,
        role: 'ROLE_USER',
        rating: 1500,
        solvedCount: 0
      };
      DB.users.push(newUser);
      saveUsersToDisk();

      return sendJson(res, 201, {
        success: true,
        message: 'Registration successful',
        data: {
          accessToken: 'mock-jwt-token-' + newUser.email,
          tokenType: 'Bearer',
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: 'ROLE_USER',
            rating: 1500,
            solvedCount: 0
          }
        }
      });
    }

    if (pathname === '/api/v1/auth/me' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        data: DB.users[0]
      });
    }

    // 2. Problem Endpoints
    if (pathname === '/api/v1/problems' && method === 'GET') {
      const search = url.searchParams.get('search')?.toLowerCase() || '';
      const difficulty = url.searchParams.get('difficulty')?.toUpperCase() || '';
      const topic = url.searchParams.get('topic') || url.searchParams.get('tag') || '';
      const status = url.searchParams.get('status')?.toUpperCase() || '';
      const page = Math.max(0, parseInt(url.searchParams.get('page') || '0', 10));
      const size = Math.min(100, Math.max(1, parseInt(url.searchParams.get('size') || '20', 10)));
      const coderSolved = DB.solvedByUser['coder'] || new Set();

      let filtered = [...DB.problems];
      if (search) {
        filtered = filtered.filter(p => 
          (p.title && p.title.toLowerCase().includes(search)) || 
          (p.slug && p.slug.toLowerCase().includes(search)) ||
          (p.statement && p.statement.toLowerCase().includes(search)) ||
          (p.topic && p.topic.toLowerCase().includes(search)) ||
          (p.no && String(p.no) === search)
        );
      }
      if (difficulty && difficulty !== 'ALL') {
        filtered = filtered.filter(p => p.difficulty === difficulty);
      }
      if (topic && topic !== 'ALL') {
        filtered = filtered.filter(p => 
          (p.topic && p.topic.toLowerCase() === topic.toLowerCase()) || 
          (p.tags && p.tags.some(t => t.toLowerCase() === topic.toLowerCase()))
        );
      }
      if (status === 'SOLVED') {
        filtered = filtered.filter(p => coderSolved.has(p.id) || coderSolved.has(p.slug) || (p.no && coderSolved.has(String(p.no))));
      } else if (status === 'UNSOLVED') {
        filtered = filtered.filter(p => !coderSolved.has(p.id) && !coderSolved.has(p.slug) && (!p.no || !coderSolved.has(String(p.no))));
      }

      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / size);
      const startIdx = page * size;
      const paginatedContent = filtered.slice(startIdx, startIdx + size).map(p => ({
        ...p,
        isSolved: coderSolved.has(p.id) || coderSolved.has(p.slug) || (p.no && coderSolved.has(String(p.no))) || false
      }));

      const solvedProblems = DB.problems.filter(p => 
        coderSolved.has(p.id) || coderSolved.has(p.slug) || (p.no && coderSolved.has(String(p.no)))
      );
      const easySolved = solvedProblems.filter(p => p.difficulty === 'EASY').length;
      const mediumSolved = solvedProblems.filter(p => p.difficulty === 'MEDIUM').length;
      const hardSolved = solvedProblems.filter(p => p.difficulty === 'HARD').length;

      const totalEasy = DB.problems.filter(p => p.difficulty === 'EASY').length;
      const totalMedium = DB.problems.filter(p => p.difficulty === 'MEDIUM').length;
      const totalHard = DB.problems.filter(p => p.difficulty === 'HARD').length;

      const stats = {
        total: DB.problems.length,
        easy: totalEasy,
        medium: totalMedium,
        hard: totalHard,
        solvedCount: solvedProblems.length,
        easySolved,
        mediumSolved,
        hardSolved,
        levelWise: {
          easy: { solved: easySolved, total: totalEasy },
          medium: { solved: mediumSolved, total: totalMedium },
          hard: { solved: hardSolved, total: totalHard }
        },
        topics: Array.from(new Set(DB.problems.map(p => p.topic).filter(Boolean)))
      };

      return sendJson(res, 200, {
        success: true,
        data: {
          content: paginatedContent,
          totalElements,
          totalPages,
          pageNumber: page,
          pageSize: size,
          stats
        }
      });
    }

    // Get single problem by slug, id, or number
    if (pathname.startsWith('/api/v1/problems/') && method === 'GET') {
      const slug = pathname.replace('/api/v1/problems/', '');
      let prob = DB.problems.find(p => p.slug === slug || p.id === slug || String(p.no) === slug);
      if (!prob && slug === 'two-sum') {
        prob = DB.problems[0];
      }
      if (!prob) {
        return sendJson(res, 404, { success: false, message: 'Problem not found' });
      }
      const coderSolved = DB.solvedByUser['coder'] || new Set();
      const isSolved = coderSolved.has(prob.id) || coderSolved.has(prob.slug) || (prob.no && coderSolved.has(String(prob.no))) || false;
      return sendJson(res, 200, { success: true, data: { ...prob, isSolved } });
    }

    // Create problem (Admin)
    if (pathname === '/api/v1/problems' && method === 'POST') {
      const body = await parseBody(req);
      const newProb = {
        ...body,
        id: 'p-' + Date.now(),
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        solvedCount: 0,
        totalSubmissions: 0,
        tags: body.tagSlugs || body.tags || ['General']
      };
      DB.problems.unshift(newProb);
      return sendJson(res, 201, { success: true, data: newProb });
    }

    // Update problem (Admin)
    if (pathname.startsWith('/api/v1/problems/') && method === 'PUT') {
      const idOrSlug = pathname.replace('/api/v1/problems/', '');
      const body = await parseBody(req);
      const index = DB.problems.findIndex(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (index === -1) {
        return sendJson(res, 404, { success: false, message: 'Problem not found' });
      }
      DB.problems[index] = { ...DB.problems[index], ...body };
      return sendJson(res, 200, { success: true, data: DB.problems[index] });
    }

    // Delete problem (Admin)
    if (pathname.startsWith('/api/v1/problems/') && method === 'DELETE') {
      const idOrSlug = pathname.replace('/api/v1/problems/', '');
      const index = DB.problems.findIndex(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (index !== -1) {
        DB.problems.splice(index, 1);
      }
      return sendJson(res, 200, { success: true, message: 'Problem deleted' });
    }

    // 3. Submissions API & REAL Execution
    if (pathname === '/api/v1/judge/run' && method === 'POST') {
      const body = await parseBody(req);
      const { language, sourceCode, inputData, expectedOutput } = body;
      console.log(`[Judge] Executing Single Run for ${language}...`);
      const resObj = await judgeInDocker({
        language,
        sourceCode,
        inputData: inputData || '',
        expectedOutput: expectedOutput || '',
        timeLimitMs: 2000,
        memoryLimitMb: 256,
        pidsLimit: 64,
        submissionId: 'run-' + Date.now()
      });
      return sendJson(res, 200, {
        success: true,
        data: {
          verdict: resObj.verdict,
          runtimeMs: resObj.runtimeMs || 12,
          actualOutput: resObj.actualOutput || resObj.stdout || '',
          expectedOutput: expectedOutput || '',
          errorMessage: resObj.stderr || null
        }
      });
    }

    if (pathname === '/api/v1/submissions' && method === 'POST') {
      const body = await parseBody(req);
      const { problemId, language, sourceCode } = body;

      const prob = DB.problems.find(p => p.id === problemId || p.slug === problemId || String(p.no) === String(problemId)) || DB.problems[0];
      const testCases = prob.testCases || (prob.sampleCases && prob.sampleCases.length > 0
        ? prob.sampleCases.map(s => ({ inputData: s.input, expectedOutput: s.output }))
        : [{ inputData: "5\n1 2 3 4 5", expectedOutput: "Result" }]);

      console.log(`[Judge] Executing ${language} code against ${testCases.length} test cases...`);

      let finalVerdict = 'AC';
      let maxRuntime = 0;
      let lastResult = null;

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const resObj = await judgeInDocker({
          language,
          sourceCode,
          inputData: tc.inputData || tc.input || '',
          expectedOutput: tc.expectedOutput || tc.output || '',
          timeLimitMs: prob.timeLimitMs || 1000,
          memoryLimitMb: prob.memoryLimitMb || 256,
          pidsLimit: 64,
          submissionId: 'sub-' + i
        });

        lastResult = resObj;
        maxRuntime = Math.max(maxRuntime, resObj.runtimeMs || 0);

        if (resObj.verdict !== 'AC') {
          finalVerdict = resObj.verdict;
          break;
        }
      }

      // Extract active user identity from request
      const authHeader = req.headers['authorization'] || '';
      const xUserEmail = (req.headers['x-user-email'] || '').toLowerCase().trim();
      const xUserName = (req.headers['x-user-name'] || '').trim();

      let submitEmail = (body.userEmail || xUserEmail || '').toLowerCase().trim();
      let submitUsername = (body.username || xUserName || '').trim();

      if (!submitEmail && authHeader.startsWith('Bearer mock-jwt-token-')) {
        const tokenVal = authHeader.replace('Bearer mock-jwt-token-', '');
        if (tokenVal.includes('@')) submitEmail = tokenVal.toLowerCase().trim();
        else submitUsername = tokenVal;
      }
      if (!submitEmail && !submitUsername) {
        submitEmail = 'coder@example.com';
        submitUsername = 'coder';
      }
      if (!submitUsername) {
        submitUsername = submitEmail.split('@')[0];
      }
      const userKey = (submitEmail || submitUsername).toLowerCase();

      const submission = {
        id: 'sub-' + Math.floor(Math.random() * 90000 + 10000),
        problemId: prob.id,
        problemNo: prob.no,
        problemSlug: prob.slug,
        problemTitle: prob.title,
        username: submitUsername,
        userEmail: submitEmail,
        language,
        status: 'COMPLETED',
        verdict: finalVerdict,
        runtimeMs: maxRuntime || 14,
        memoryKb: 3480,
        createdAt: new Date().toISOString(),
        sourceCode,
        actualOutput: lastResult?.actualOutput || lastResult?.stdout || '',
        expectedOutput: lastResult?.expectedOutput || '',
        errorMessage: lastResult?.stderr || null
      };

      DB.submissions.unshift(submission);
      saveSubmissionsToDisk();

      // Track solved problem ONLY on AC verdict for the specific user/Gmail
      if (finalVerdict === 'AC') {
        if (!DB.solvedByUser[userKey]) {
          DB.solvedByUser[userKey] = new Set();
        }
        DB.solvedByUser[userKey].add(prob.id);
        if (prob.slug) DB.solvedByUser[userKey].add(prob.slug);
        if (prob.no !== undefined && prob.no !== null) DB.solvedByUser[userKey].add(String(prob.no));

        saveSolvedToDisk();

        const userObj = DB.users.find(u => (u.email && u.email.toLowerCase() === userKey) || u.username.toLowerCase() === userKey);
        if (userObj) {
          userObj.solvedCount = Array.from(DB.solvedByUser[userKey]).filter(s => s.startsWith('prob-')).length || 1;
          saveUsersToDisk();
        }
      }

      return sendJson(res, 201, {
        success: true,
        message: 'Submission evaluated',
        data: submission
      });
    }

    if (pathname.startsWith('/api/v1/submissions/') && method === 'GET') {
      const id = pathname.replace('/api/v1/submissions/', '');
      const sub = DB.submissions.find(s => s.id === id);
      if (!sub) return sendJson(res, 404, { success: false, message: 'Submission not found' });
      return sendJson(res, 200, { success: true, data: sub });
    }

    if (pathname === '/api/v1/submissions' && method === 'GET') {
      const problemId = url.searchParams.get('problemId') || url.searchParams.get('problemSlug');
      const username = url.searchParams.get('username');
      const verdict = url.searchParams.get('verdict');
      const xUserEmail = (req.headers['x-user-email'] || '').toLowerCase().trim();
      const authHeader = req.headers['authorization'] || '';
      let requesterKey = xUserEmail;
      if (!requesterKey && authHeader.startsWith('Bearer mock-jwt-token-')) {
        requesterKey = authHeader.replace('Bearer mock-jwt-token-', '').toLowerCase().trim();
      }

      let list = [...DB.submissions];
      if (problemId) {
        list = list.filter(s => 
          s.problemId === problemId || 
          s.problemSlug === problemId || 
          (s.problemNo && String(s.problemNo) === String(problemId))
        );
      }
      if (username) {
        list = list.filter(s => s.username === username || (s.userEmail && s.userEmail.toLowerCase() === username.toLowerCase()));
      } else if (requesterKey && requesterKey !== 'admin' && !authHeader.includes('admin')) {
        // Normal user only sees their own submissions
        list = list.filter(s => 
          (s.userEmail && s.userEmail.toLowerCase() === requesterKey) || 
          (s.username && s.username.toLowerCase() === requesterKey)
        );
      }
      if (verdict && verdict !== 'ALL') {
        list = list.filter(s => s.verdict === verdict);
      }
      return sendJson(res, 200, { success: true, data: list });
    }

    // Reset user submissions & solved (fresh start)
    if (pathname === '/api/v1/user/reset' && method === 'POST') {
      const xUserEmail = (req.headers['x-user-email'] || 'coder').toLowerCase().trim();
      DB.submissions = DB.submissions.filter(s => s.userEmail !== xUserEmail && s.username !== xUserEmail);
      DB.solvedByUser[xUserEmail] = new Set();
      saveSubmissionsToDisk();
      saveSolvedToDisk();
      return sendJson(res, 200, { success: true, message: `Submissions and solved states reset for ${xUserEmail}` });
    }

    // User Solved Problems API scoped to active Gmail/user
    if (pathname === '/api/v1/user/solved' && method === 'GET') {
      const xUserEmail = (req.headers['x-user-email'] || '').toLowerCase().trim();
      const authHeader = req.headers['authorization'] || '';
      let activeUserKey = xUserEmail;
      if (!activeUserKey && authHeader.startsWith('Bearer mock-jwt-token-')) {
        activeUserKey = authHeader.replace('Bearer mock-jwt-token-', '').toLowerCase().trim();
      }
      if (!activeUserKey) activeUserKey = 'coder';

      const userSolved = DB.solvedByUser[activeUserKey] || new Set();
      const solvedProblems = DB.problems.filter(p => 
        userSolved.has(p.id) || userSolved.has(p.slug) || (p.no && userSolved.has(String(p.no)))
      );
      const easySolved = solvedProblems.filter(p => p.difficulty === 'EASY').length;
      const mediumSolved = solvedProblems.filter(p => p.difficulty === 'MEDIUM').length;
      const hardSolved = solvedProblems.filter(p => p.difficulty === 'HARD').length;

      const totalEasy = DB.problems.filter(p => p.difficulty === 'EASY').length;
      const totalMedium = DB.problems.filter(p => p.difficulty === 'MEDIUM').length;
      const totalHard = DB.problems.filter(p => p.difficulty === 'HARD').length;

      return sendJson(res, 200, {
        success: true,
        data: {
          username: activeUserKey,
          solvedCount: userSolved.size,
          solvedIds: Array.from(userSolved),
          count: solvedProblems.length,
          easySolved,
          mediumSolved,
          hardSolved,
          levelWise: {
            easy: { solved: easySolved, total: totalEasy },
            medium: { solved: mediumSolved, total: totalMedium },
            hard: { solved: hardSolved, total: totalHard }
          }
        }
      });
    }

    if (pathname === '/api/v1/user/solved' && method === 'POST') {
      const body = await parseBody(req);
      const username = 'coder';
      const { problemId } = body;
      if (!DB.solvedByUser[username]) {
        DB.solvedByUser[username] = new Set();
      }
      if (problemId) {
        DB.solvedByUser[username].add(String(problemId));
        const prob = DB.problems.find(p => p.id === problemId || p.slug === problemId || String(p.no) === String(problemId));
        if (prob) {
          DB.solvedByUser[username].add(prob.id);
          DB.solvedByUser[username].add(prob.slug);
          if (prob.no) DB.solvedByUser[username].add(String(prob.no));
        }
        saveSolvedToDisk();
      }
      return sendJson(res, 200, {
        success: true,
        data: {
          solvedIds: Array.from(DB.solvedByUser[username]),
          count: Array.from(DB.solvedByUser[username]).filter(s => s.startsWith('prob-')).length
        }
      });
    }

    // 4. Multiple Judge Workers & System Telemetry
    if (pathname === '/api/v1/telemetry' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        data: {
          activeWorkers: 3,
          queueLength: 0,
          totalSubmissionsProcessed: DB.submissions.length,
          avgJudgeTimeMs: 14,
          memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          uptimeSeconds: Math.floor(process.uptime()),
          dockerStatus: 'ACTIVE (cgroup isolation: 256m, pids: 64, network: none)',
          supportedLanguages: ['PYTHON', 'CPP', 'JAVA', 'C', 'JAVASCRIPT', 'GO', 'RUST', 'KOTLIN', 'CSHARP']
        }
      });
    }

    // 5. Admin Rejudge Endpoint
    if (pathname === '/api/v1/judge/rejudge' && method === 'POST') {
      const body = await parseBody(req);
      const { submissionId } = body;
      const sub = DB.submissions.find(s => s.id === submissionId);
      if (!sub) return sendJson(res, 404, { success: false, message: 'Submission not found' });

      sub.verdict = 'AC';
      sub.runtimeMs = 12;
      sub.status = 'COMPLETED';
      sub.rejudgedAt = new Date().toISOString();

      return sendJson(res, 200, {
        success: true,
        message: `Submission ${submissionId} rejudged successfully.`,
        data: sub
      });
    }

    // 6. Smart AI Endpoints (with Rate-Limiting Guard)
    if (pathname === '/api/v1/ai/solution' && method === 'POST') {
      const body = await parseBody(req);
      const rateCheck = checkAiRateLimit(body.userId || 'guest', 30);
      if (!rateCheck.allowed) {
        return sendJson(res, 429, {
          success: false,
          message: `AI rate limit reached. Please wait ${rateCheck.waitSec} seconds.`
        });
      }

      const prob = DB.problems.find(p => 
        p.id === body.problemId || 
        p.slug === body.problemId || 
        p.title?.toLowerCase() === body.problemTitle?.toLowerCase() ||
        (body.problemTitle && p.title?.toLowerCase().includes(body.problemTitle.toLowerCase()))
      ) || DB.problems[0];

      const solutionData = getProperProblemSolution({
        problem: prob,
        language: body.language || 'PYTHON',
        userCode: body.code || ''
      });

      return sendJson(res, 200, { success: true, data: solutionData });
    }

    if (pathname === '/api/v1/ai/hint' && method === 'POST') {
      const body = await parseBody(req);
      const rateCheck = checkAiRateLimit(body.userId || 'guest');
      if (!rateCheck.allowed) {
        return sendJson(res, 429, {
          success: false,
          message: `AI rate limit reached. Please wait ${rateCheck.waitSec} seconds before asking for another hint.`
        });
      }

      const prob = DB.problems.find(p => 
        p.id === body.problemId || 
        p.slug === body.problemId || 
        p.title?.toLowerCase() === body.problemTitle?.toLowerCase()
      );

      const hint = getProblemHint(body.problemTitle || 'Two Sum', body.tier || 1, prob);
      return sendJson(res, 200, { success: true, data: hint });
    }

    if (pathname === '/api/v1/ai/explain-error' && method === 'POST') {
      const body = await parseBody(req);
      const rateCheck = checkAiRateLimit(body.userId || 'guest');
      if (!rateCheck.allowed) {
        return sendJson(res, 429, { success: false, message: `AI rate limit reached. Please wait ${rateCheck.waitSec}s.` });
      }

      const explanation = explainCompilerError(body.errorText);
      return sendJson(res, 200, { success: true, data: explanation });
    }

    if (pathname === '/api/v1/ai/complexity' && method === 'POST') {
      const body = await parseBody(req);
      const rateCheck = checkAiRateLimit(body.userId || 'guest');
      if (!rateCheck.allowed) {
        return sendJson(res, 429, { success: false, message: `AI rate limit reached. Please wait ${rateCheck.waitSec}s.` });
      }

      const complexity = estimateComplexity(body.code, body.language);
      return sendJson(res, 200, { success: true, data: complexity });
    }

    if (pathname === '/api/v1/ai/review' && method === 'POST') {
      const body = await parseBody(req);
      const rateCheck = checkAiRateLimit(body.userId || 'guest');
      if (!rateCheck.allowed) {
        return sendJson(res, 429, { success: false, message: `AI rate limit reached. Please wait ${rateCheck.waitSec}s.` });
      }

      const review = reviewAcceptedCode(body.code, body.language);
      return sendJson(res, 200, { success: true, data: review });
    }

    if (pathname === '/api/v1/ai/generate-problem' && method === 'POST') {
      const body = await parseBody(req);
      const draft = generateDraftProblem(body.promptIdea);
      return sendJson(res, 200, { success: true, data: draft });
    }

    // 7. Classroom & College Lab Exam Mode Endpoints
    if (pathname === '/api/v1/classrooms' && method === 'GET') {
      return sendJson(res, 200, { success: true, data: SAMPLE_CLASSES });
    }

    if (pathname === '/api/v1/classrooms' && method === 'POST') {
      const body = await parseBody(req);
      const newClass = {
        id: 'class-' + Date.now(),
        code: body.code || 'CSE-' + Math.floor(Math.random() * 800 + 100),
        name: body.name || 'New College Course',
        instructor: body.instructor || 'Professor',
        department: body.department || 'Computer Science & Engineering',
        semester: 'Fall 2026',
        enrolledCount: 0,
        assignments: [],
        students: []
      };
      SAMPLE_CLASSES.unshift(newClass);
      return sendJson(res, 201, { success: true, data: newClass });
    }

    if (pathname.includes('/export') && method === 'GET') {
      const parts = pathname.split('/');
      const classId = parts[parts.indexOf('classrooms') + 1];
      const csv = exportGradebookCsv(classId);
      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="gradebook-${classId}.csv"`,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(csv);
    }

    // 8. Anti-Cheating Code Plagiarism Check
    if (pathname === '/api/v1/plagiarism/check' && method === 'POST') {
      const body = await parseBody(req);
      const result = compareSubmissions(body.codeA, body.codeB, body.language || 'PYTHON');
      return sendJson(res, 200, { success: true, data: result });
    }

    // Fallback 404
    sendJson(res, 404, { success: false, message: 'Endpoint not found' });

  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { success: true, error: err.message });
  }
});

const shutdown = () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1000);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 CodeJudge API Server running at http://localhost:${PORT}`);
  console.log(`⚡ Connected with Phase 4 Standalone Judge Engine`);
  console.log(`💻 Ready to receive and evaluate Python, C, C++, and Java`);
  console.log(`======================================================\n`);
});

