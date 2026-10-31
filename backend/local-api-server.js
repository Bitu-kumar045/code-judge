import http from 'http';
import { judgeInDocker, VERDICTS } from '../judge-worker/docker-judge.js';

const PORT = 8080;

// In-Memory Database Store for Problems, Submissions, and Users
const DB = {
  users: [
    { id: 'u-admin', username: 'admin', email: 'admin@codejudge.com', role: 'ROLE_ADMIN', rating: 2150, solvedCount: 182 },
    { id: 'u-coder', username: 'coder', email: 'coder@example.com', role: 'ROLE_USER', rating: 1620, solvedCount: 47 }
  ],
  problems: [
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
  submissions: [
    {
      id: "sub-9001",
      problemSlug: "two-sum",
      problemTitle: "Two Sum",
      username: "tourist",
      language: "CPP",
      status: "COMPLETED",
      verdict: "AC",
      runtimeMs: 12,
      memoryKb: 3420,
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      sourceCode: "#include <iostream>\nusing namespace std;\nint main() { cout << \"0 1\\n\"; return 0; }"
    }
  ]
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  console.log(`[API] ${method} ${pathname}`);

  try {
    // 1. Auth endpoints
    if (pathname === '/api/v1/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const user = DB.users.find(u => u.username === body.usernameOrEmail || u.email === body.usernameOrEmail) || {
        id: 'u-' + Date.now(),
        username: body.usernameOrEmail || 'coder',
        email: `${body.usernameOrEmail || 'coder'}@example.com`,
        role: body.usernameOrEmail === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER',
        rating: 1500,
        solvedCount: 0
      };

      return sendJson(res, 200, {
        success: true,
        message: 'Login successful',
        data: {
          accessToken: 'mock-jwt-token-' + user.username,
          tokenType: 'Bearer',
          user
        }
      });
    }

    if (pathname === '/api/v1/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const newUser = {
        id: 'u-' + Date.now(),
        username: body.username,
        email: body.email,
        role: body.username.toLowerCase() === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER',
        rating: 1500,
        solvedCount: 0
      };
      DB.users.push(newUser);

      return sendJson(res, 201, {
        success: true,
        message: 'Registration successful',
        data: {
          accessToken: 'mock-jwt-token-' + newUser.username,
          tokenType: 'Bearer',
          user: newUser
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
      const page = parseInt(url.searchParams.get('page') || '0', 10);
      const size = parseInt(url.searchParams.get('size') || '20', 10);

      let filtered = [...DB.problems];
      if (search) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(search) || p.slug.includes(search));
      }
      if (difficulty && difficulty !== 'ALL') {
        filtered = filtered.filter(p => p.difficulty === difficulty);
      }

      return sendJson(res, 200, {
        success: true,
        data: {
          content: filtered,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          pageNumber: page,
          pageSize: size
        }
      });
    }

    // Get single problem by slug
    if (pathname.startsWith('/api/v1/problems/') && method === 'GET') {
      const slug = pathname.replace('/api/v1/problems/', '');
      const prob = DB.problems.find(p => p.slug === slug || p.id === slug);
      if (!prob) {
        return sendJson(res, 404, { success: false, message: 'Problem not found' });
      }
      return sendJson(res, 200, { success: true, data: prob });
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
    if (pathname === '/api/v1/submissions' && method === 'POST') {
      const body = await parseBody(req);
      const { problemId, language, sourceCode } = body;

      const prob = DB.problems.find(p => p.id === problemId || p.slug === problemId) || DB.problems[0];
      const testCases = prob.testCases || prob.sampleCases.map(s => ({ inputData: s.input, expectedOutput: s.output }));

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

      const submission = {
        id: 'sub-' + Math.floor(Math.random() * 90000 + 10000),
        problemId: prob.id,
        problemSlug: prob.slug,
        problemTitle: prob.title,
        username: 'coder',
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
      return sendJson(res, 200, { success: true, data: DB.submissions });
    }

    // Fallback 404
    sendJson(res, 404, { success: false, message: 'Endpoint not found' });

  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { success: true, error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 CodeJudge API Server running at http://localhost:${PORT}`);
  console.log(`⚡ Connected with Phase 4 Standalone Judge Engine`);
  console.log(`💻 Ready to receive and evaluate Python, C, C++, and Java`);
  console.log(`======================================================\n`);
});

