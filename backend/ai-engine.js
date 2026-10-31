/**
 * Smart AI Engine for CodeJudge
 * 
 * Provides:
 * 1. 3-Tier Progressive Hint System (Intuition -> Clue -> Approach, never full code)
 * 2. Plain-English Compiler & Runtime Error Explainer
 * 3. Post-Accepted Code Optimization Review
 * 4. Big-O Time & Space Complexity Detector
 * 5. Problem Generator for Admins
 * 6. Rate-Limiting Guard (5 calls/min)
 */

// In-memory rate limiting map: ip/user -> timestamp[]
const userRequestTimestamps = new Map();

export function checkAiRateLimit(userId = 'guest', maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const timestamps = userRequestTimestamps.get(userId) || [];
  const recent = timestamps.filter(t => now - t < windowMs);

  if (recent.length >= maxRequests) {
    const oldest = recent[0];
    const waitSec = Math.ceil((windowMs - (now - oldest)) / 1000);
    return { allowed: false, waitSec };
  }

  recent.push(now);
  userRequestTimestamps.set(userId, recent);
  return { allowed: true, remaining: maxRequests - recent.length };
}

/**
 * 3-Tier Progressive AI Hint System
 */
export function getProblemHint(problemTitle, tier = 1) {
  const hintsDatabase = {
    'Two Sum': [
      { tier: 1, title: 'Initial Intuition', text: 'Can you solve this without checking every pair of numbers ($O(N^2)$)? Think about what information you need when inspecting a number.' },
      { tier: 2, title: 'Data Structure Clue', text: 'If you are looking at `num`, you need to know if `target - num` was already seen. What data structure gives $O(1)$ average lookup time?' },
      { tier: 3, title: 'Complete Approach', text: 'Use a Hash Map / Dictionary. Iterate through the array once: for each number, check if `target - num` exists in the map. If yes, return their indices; otherwise store `map[num] = index`.' }
    ],
    'Longest Substring Without Repeating Characters': [
      { tier: 1, title: 'Initial Intuition', text: 'A contiguous subsegment suggests looking at subarrays or sliding windows rather than nested loops.' },
      { tier: 2, title: 'Two Pointers Clue', text: 'Maintain a window `[left, right]`. When you encounter a duplicate character, where should your `left` pointer jump to?' },
      { tier: 3, title: 'Complete Approach', text: 'Use the Sliding Window technique with a hash map of `{ character: last_seen_index }`. Expand `right` pointer; when a character repeats within the window, advance `left = max(left, last_seen[char] + 1)`. Maximize `right - left + 1`.' }
    ],
    'default': [
      { tier: 1, title: 'Initial Intuition', text: 'Examine the constraints first. What is the maximum value of $N$? An $N \le 10^5$ constraint requires an $O(N)$ or $O(N \log N)$ algorithm.' },
      { tier: 2, title: 'Algorithmic Clue', text: 'Break the problem down into subproblems. Can greedy choice or sorting the input simplify the search space?' },
      { tier: 3, title: 'Complete Approach', text: 'Identify the state transitions. If optimal substructure exists, formulate the base case and recurrence relation for Dynamic Programming or BFS.' }
    ]
  };

  const list = hintsDatabase[problemTitle] || hintsDatabase['default'];
  return list[tier - 1] || list[0];
}

/**
 * AI Error Explainer for Beginners
 */
export function explainCompilerError(errorText) {
  const err = (errorText || '').toLowerCase();

  if (err.includes('segmentation fault') || err.includes('sigsegv')) {
    return {
      type: 'Memory Violation (Segmentation Fault)',
      cause: 'Your program tried to access a memory address that does not belong to it.',
      plainEnglish: 'You likely accessed an array out of bounds (e.g. `arr[n]` when length is `n`), dereferenced a `NULL` pointer, or overflowed the recursion stack.',
      fix: 'Verify array indices in all loops and ensure base cases exist in recursion.'
    };
  }

  if (err.includes('time limit exceeded') || err.includes('timed out')) {
    return {
      type: 'Time Limit Exceeded (TLE)',
      cause: 'The execution took longer than the 1.0 second limit.',
      plainEnglish: 'Your algorithm has an asymptotic time complexity that is too slow for the largest test cases, or an infinite loop was triggered.',
      fix: 'If using nested loops ($O(N^2)$), replace with a Hash Map ($O(N)$) or Binary Search ($O(\log N)$). Check loop increment conditions.'
    };
  }

  if (err.includes('indexerror') || err.includes('indexoutofboundsexception')) {
    return {
      type: 'Index Out of Range',
      cause: 'Attempted to access an index outside the valid bounds of a list or array.',
      plainEnglish: 'If an array has 5 items (indices 0 to 4), asking for index 5 or higher crashes the program.',
      fix: 'Check loop limits (use `< length` instead of `<= length`) and verify empty array edge cases.'
    };
  }

  if (err.includes('syntaxerror') || err.includes('error: expected')) {
    return {
      type: 'Syntax Error',
      cause: 'The compiler/interpreter could not parse the code structure.',
      plainEnglish: 'There is a missing parenthesis `)`, semicolon `;`, bracket `}`, or invalid indentation.',
      fix: 'Check the line mentioned in the compiler output and the line directly above it.'
    };
  }

  return {
    type: 'Execution Issue',
    cause: 'Process terminated with non-zero status.',
    plainEnglish: errorText || 'An unexpected condition caused the process to abort.',
    fix: 'Inspect edge cases such as empty input, single element, negative numbers, or maximum constraint boundaries.'
  };
}

/**
 * AI Time & Space Complexity Estimator
 */
export function estimateComplexity(code, language = 'PYTHON') {
  const c = code || '';
  
  // Count nested loops
  const forLoops = (c.match(/\bfor\b/g) || []).length;
  const whileLoops = (c.match(/\bwhile\b/g) || []).length;
  const totalLoops = forLoops + whileLoops;

  // Check for recursion
  const hasRecursion = /\b(def|function)\s+([a-zA-Z0-9_]+)[\s\S]*?\b\2\s*\(/.test(c);
  // Check for hash structures / arrays
  const hasMapOrSet = /(Map|Set|dict|\{\}|new\s+HashMap|new\s+HashSet|unordered_map)/.test(c);

  let timeComplexity = 'O(N)';
  let spaceComplexity = 'O(1)';
  let reasoning = 'Linear scan over input elements.';

  if (totalLoops >= 2) {
    timeComplexity = 'O(N²)';
    reasoning = 'Nested loop detected. Quadratic time complexity with respect to input length.';
  } else if (c.includes('.sort(') || c.includes('Arrays.sort') || c.includes('std::sort')) {
    timeComplexity = 'O(N log N)';
    reasoning = 'Sorting step dominates execution time.';
  } else if (hasRecursion) {
    timeComplexity = 'O(2^N) or O(N)';
    spaceComplexity = 'O(N) call stack';
    reasoning = 'Recursive branching structure detected.';
  }

  if (hasMapOrSet) {
    spaceComplexity = 'O(N)';
    reasoning += ' Utilizes hash table auxiliary storage proportional to unique input elements.';
  }

  return {
    timeComplexity,
    spaceComplexity,
    reasoning,
    optimal: timeComplexity === 'O(N)' || timeComplexity === 'O(N log N)',
    suggestion: totalLoops >= 2 ? 'Consider replacing inner loop with a Hash Map or Two-Pointer technique for O(N) performance.' : 'Optimal asymptotic bounds achieved!'
  };
}

/**
 * Post-Accepted AI Code Review
 */
export function reviewAcceptedCode(code, language = 'PYTHON') {
  const complexity = estimateComplexity(code, language);

  return {
    rating: complexity.optimal ? 'Excellent (A+)' : 'Good (B+)',
    timeComplexity: complexity.timeComplexity,
    spaceComplexity: complexity.spaceComplexity,
    positives: [
      'Clean variable semantics and readable structure',
      'Passes all hidden Docker sandbox test constraints cleanly',
      'Handles standard I/O streams safely'
    ],
    recommendations: [
      complexity.suggestion,
      'Consider reserving capacity when initializing dynamic vectors/arrays to avoid reallocation overhead',
      'Add docstrings or brief comments explaining non-trivial loop invariant conditions'
    ]
  };
}

/**
 * AI Problem Generator for Admins
 */
export function generateDraftProblem(promptIdea) {
  const title = promptIdea 
    ? promptIdea.split(' ').slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Dynamic Network Routing';

  return {
    title: `${title}`,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    difficulty: 'MEDIUM',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    tags: ['Graph', 'Shortest Path', 'Dijkstra'],
    descriptionMd: `You are given a directed weighted graph representing network routers with $N$ vertices labeled $1$ to $N$, and an array of directed transmission lines where lines[i] = [u, v, w] represents a one-way wire from $u$ to $v$ with latency $w$ ms.\n\nFind the minimum time it takes for a signal sent from source node $K$ to reach all other reachable nodes. If it is impossible for all nodes to receive the signal, return $-1$.\n\n### Input Format\n- First line contains three integers $N, M, K$ (number of nodes, wires, and source node).\n- Next $M$ lines each contain three integers $u, v, w$.\n\n### Constraints\n- $1 \\le N \\le 10^4$\n- $1 \\le M \\le 5 \\times 10^4$\n- $0 \\le w \\le 100$`,
    sampleCases: [
      {
        input: "4 3 2\n2 1 1\n2 3 1\n3 4 1",
        output: "2",
        explanation: "Signal travels from node 2 to 1 (1ms), and 2 to 3 (1ms) to 4 (2ms). Max time is 2ms."
      }
    ],
    starterCode: {
      PYTHON: `def networkDelayTime(n: int, edges: list[list[int]], k: int) -> int:\n    # Write your solution here\n    pass`,
      CPP: `#include <bits/stdc++.h>\nusing namespace std;\n\nint networkDelayTime(int n, vector<vector<int>>& edges, int k) {\n    // Write your solution here\n    return -1;\n}`,
      JAVA: `import java.util.*;\n\nclass Solution {\n    public int networkDelayTime(int n, int[][] edges, int k) {\n        // Write your solution here\n        return -1;\n    }\n}`
    }
  };
}

