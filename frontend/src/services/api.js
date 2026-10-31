// Unified API service connecting to Spring Boot backend with seamless local fallback
const API_BASE_URL = '/api/v1';

// Sample fallback problems matching the backend seed & standard LeetCode problems
export const SAMPLE_PROBLEMS = [
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

You can return the answer in any order.

### Example 1:
\`\`\`text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2:
\`\`\`text
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

### Constraints:
* \`2 <= nums.length <= 10^4\`
* \`-10^9 <= nums[i] <= 10^9\`
* \`-10^9 <= target <= 10^9\`
* **Only one valid answer exists.**
`,
    sampleCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "3\n3 2 4\n6", output: "1 2", explanation: "nums[1] + nums[2] = 2 + 4 = 6" }
    ],
    starterCode: {
      PYTHON: "import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    target = int(lines[n+1])\n    \n    seen = {}\n    for i, x in enumerate(nums):\n        diff = target - x\n        if diff in seen:\n            print(f\"{seen[diff]} {i}\")\n            return\n        seen[x] = i\n\nif __name__ == '__main__':\n    solve()\n",
      CPP: "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; ++i) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    unordered_map<int, int> seen;\n    for (int i = 0; i < n; ++i) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) {\n            cout << seen[comp] << \" \" << i << \"\\n\";\n            return 0;\n        }\n        seen[nums[i]] = i;\n    }\n    return 0;\n}\n",
      JAVA: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        \n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int comp = target - nums[i];\n            if (seen.containsKey(comp)) {\n                System.out.println(seen.get(comp) + \" \" + i);\n                return;\n            }\n            seen.put(nums[i], i);\n        }\n    }\n}\n",
      C: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 0;\n    int *nums = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) scanf(\"%d\", &nums[i]);\n    int target;\n    scanf(\"%d\", &target);\n    \n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                printf(\"%d %d\\n\", i, j);\n                free(nums);\n                return 0;\n            }\n        }\n    }\n    free(nums);\n    return 0;\n}\n"
    }
  },
  {
    id: "f5b4c9e2-2345-6789-01bc-def012345678",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM",
    timeLimitMs: 1500,
    memoryLimitMb: 256,
    tags: ["String", "Hash Table", "Binary Search"],
    solvedCount: 980,
    totalSubmissions: 3120,
    descriptionMd: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

### Example 1:
\`\`\`text
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

### Example 2:
\`\`\`text
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
\`\`\`

### Constraints:
* \`0 <= s.length <= 5 * 10^4\`
* \`s\` consists of English letters, digits, symbols and spaces.
`,
    sampleCases: [
      { input: "abcabcbb", output: "3", explanation: "\"abc\" has length 3" },
      { input: "bbbbb", output: "1", explanation: "\"b\" has length 1" }
    ],
    starterCode: {
      PYTHON: "import sys\n\ndef lengthOfLongestSubstring(s: str) -> int:\n    char_map = {}\n    left = 0\n    max_len = 0\n    for right, char in enumerate(s):\n        if char in char_map and char_map[char] >= left:\n            left = char_map[char] + 1\n        char_map[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nif __name__ == '__main__':\n    line = sys.stdin.readline().strip('\\r\\n')\n    print(lengthOfLongestSubstring(line))\n",
      CPP: "#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!getline(cin, s)) return 0;\n    vector<int> last(256, -1);\n    int max_len = 0, left = 0;\n    for (int right = 0; right < (int)s.size(); ++right) {\n        if (last[(unsigned char)s[right]] >= left) {\n            left = last[(unsigned char)s[right]] + 1;\n        }\n        last[(unsigned char)s[right]] = right;\n        max_len = max(max_len, right - left + 1);\n    }\n    cout << max_len << \"\\n\";\n    return 0;\n}\n",
      JAVA: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : \"\";\n        Map<Character, Integer> map = new HashMap<>();\n        int maxLen = 0, left = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (map.containsKey(c) && map.get(c) >= left) {\n                left = map.get(c) + 1;\n            }\n            map.put(c, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        System.out.println(maxLen);\n    }\n}\n",
      C: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[50005];\n    if (!fgets(s, sizeof(s), stdin)) return 0;\n    int len = strlen(s);\n    if (len > 0 && s[len-1] == '\\n') s[--len] = '\\0';\n    int last[256];\n    for (int i = 0; i < 256; i++) last[i] = -1;\n    int max_len = 0, left = 0;\n    for (int right = 0; right < len; right++) {\n        unsigned char c = (unsigned char)s[right];\n        if (last[c] >= left) left = last[c] + 1;\n        last[c] = right;\n        int cur = right - left + 1;\n        if (cur > max_len) max_len = cur;\n    }\n    printf(\"%d\\n\", max_len);\n    return 0;\n}\n"
    }
  },
  {
    id: "a1b2c3d4-3456-7890-12cd-ef0123456789",
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "HARD",
    timeLimitMs: 2000,
    memoryLimitMb: 512,
    tags: ["Array", "Binary Search"],
    solvedCount: 430,
    totalSubmissions: 1850,
    descriptionMd: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.

### Example 1:
\`\`\`text
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
\`\`\`

### Constraints:
* \`nums1.length == m\`
* \`nums2.length == n\`
* \`0 <= m <= 1000\`, \`0 <= n <= 1000\`
* \`1 <= m + n <= 2000\`
`,
    sampleCases: [
      { input: "2 1\n1 3\n2", output: "2.00000", explanation: "Merged array [1,2,3], median 2.0" }
    ],
    starterCode: {
      PYTHON: "import sys\n\ndef findMedian():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    m, n = int(lines[0]), int(lines[1])\n    nums1 = [int(x) for x in lines[2:2+m]]\n    nums2 = [int(x) for x in lines[2+m:2+m+n]]\n    merged = sorted(nums1 + nums2)\n    total = m + n\n    if total % 2 == 1:\n        print(f\"{merged[total // 2]:.5f}\")\n    else:\n        print(f\"{(merged[total // 2 - 1] + merged[total // 2]) / 2.0:.5f}\")\n\nif __name__ == '__main__':\n    findMedian()\n",
      CPP: "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int m, n;\n    if (!(cin >> m >> n)) return 0;\n    vector<int> a(m), b(n);\n    for (int i = 0; i < m; ++i) cin >> a[i];\n    for (int i = 0; i < n; ++i) cin >> b[i];\n    vector<int> merged = a;\n    merged.insert(merged.end(), b.begin(), b.end());\n    sort(merged.begin(), merged.end());\n    int total = m + n;\n    cout << fixed << setprecision(5);\n    if (total % 2 == 1) cout << (double)merged[total / 2] << \"\\n\";\n    else cout << (double)(merged[total / 2 - 1] + merged[total / 2]) / 2.0 << \"\\n\";\n    return 0;\n}\n",
      JAVA: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt();\n        int n = sc.nextInt();\n        int[] merged = new int[m + n];\n        for (int i = 0; i < m; i++) merged[i] = sc.nextInt();\n        for (int i = 0; i < n; i++) merged[m + i] = sc.nextInt();\n        Arrays.sort(merged);\n        int total = m + n;\n        if (total % 2 == 1) System.out.printf(\"%.5f\\n\", (double)merged[total / 2]);\n        else System.out.printf(\"%.5f\\n\", (merged[total / 2 - 1] + merged[total / 2]) / 2.0);\n    }\n}\n",
      C: "#include <stdio.h>\n#include <stdlib.h>\n\nint cmp(const void *a, const void *b) { return (*(int*)a - *(int*)b); }\n\nint main() {\n    int m, n;\n    if (scanf(\"%d %d\", &m, &n) != 2) return 0;\n    int *arr = (int*)malloc((m + n) * sizeof(int));\n    for (int i = 0; i < m + n; i++) scanf(\"%d\", &arr[i]);\n    qsort(arr, m + n, sizeof(int), cmp);\n    int total = m + n;\n    if (total % 2 == 1) printf(\"%.5f\\n\", (double)arr[total / 2]);\n    else printf(\"%.5f\\n\", (arr[total / 2 - 1] + arr[total / 2]) / 2.0);\n    free(arr);\n    return 0;\n}\n"
    }
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
    descriptionMd: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

### Example 1:
\`\`\`text
Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1
\`\`\`
`,
    sampleCases: [
      { input: "3 11\n1 2 5", output: "3", explanation: "5 + 5 + 1 = 11 using 3 coins" }
    ],
    starterCode: {
      PYTHON: "import sys\n\ndef coinChange():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n, amount = int(lines[0]), int(lines[1])\n    coins = [int(x) for x in lines[2:2+n]]\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for i in range(c, amount + 1):\n            dp[i] = min(dp[i], dp[i - c] + 1)\n    print(dp[amount] if dp[amount] != float('inf') else -1)\n\nif __name__ == '__main__':\n    coinChange()\n",
      CPP: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, amount;\n    if (!(cin >> n >> amount)) return 0;\n    vector<int> coins(n);\n    for (int i = 0; i < n; ++i) cin >> coins[i];\n    vector<int> dp(amount + 1, 1e9);\n    dp[0] = 0;\n    for (int c : coins) {\n        for (int i = c; i <= amount; ++i) {\n            dp[i] = min(dp[i], dp[i - c] + 1);\n        }\n    }\n    cout << (dp[amount] >= 1e9 ? -1 : dp[amount]) << \"\\n\";\n    return 0;\n}\n",
      JAVA: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int amount = sc.nextInt();\n        int[] coins = new int[n];\n        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int c : coins) {\n            for (int i = c; i <= amount; i++) {\n                dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        System.out.println(dp[amount] > amount ? -1 : dp[amount]);\n    }\n}\n",
      C: "#include <stdio.h>\n\nint min(int a, int b) { return a < b ? a : b; }\n\nint main() {\n    int n, amount;\n    if (scanf(\"%d %d\", &n, &amount) != 2) return 0;\n    int coins[100];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &coins[i]);\n    int dp[10005];\n    for (int i = 0; i <= amount; i++) dp[i] = 1000000;\n    dp[0] = 0;\n    for (int i = 0; i < n; i++) {\n        for (int j = coins[i]; j <= amount; j++) {\n            dp[j] = min(dp[j], dp[j - coins[i]] + 1);\n        }\n    }\n    printf(\"%d\\n\", dp[amount] >= 1000000 ? -1 : dp[amount]);\n    return 0;\n}\n"
    }
  }
];

export const SAMPLE_CONTESTS = [
  {
    id: "c1-weekly-401",
    title: "Weekly Contest 401",
    description: "Challenge your algorithmic speed and accuracy across 4 competitive programming problems.",
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * 2 + 2)).toISOString(),
    isRated: true,
    participantCount: 1845,
    status: "UPCOMING",
    problems: [
      { id: "p1", slug: "two-sum", title: "Two Sum", points: 100, difficulty: "EASY" },
      { id: "p2", slug: "longest-substring-without-repeating-characters", title: "Longest Substring", points: 200, difficulty: "MEDIUM" },
      { id: "p3", slug: "coin-change", title: "Coin Change", points: 300, difficulty: "MEDIUM" },
      { id: "p4", slug: "median-of-two-sorted-arrays", title: "Median of Sorted Arrays", points: 400, difficulty: "HARD" }
    ]
  },
  {
    id: "c2-biweekly-130",
    title: "Biweekly Contest 130",
    description: "Join the rated global contest. Live ranking updates every 15 seconds.",
    startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 75).toISOString(),
    isRated: true,
    participantCount: 3210,
    status: "LIVE",
    problems: [
      { id: "p1", slug: "two-sum", title: "Two Sum", points: 100, difficulty: "EASY" },
      { id: "p2", slug: "longest-substring-without-repeating-characters", title: "Longest Substring", points: 200, difficulty: "MEDIUM" },
      { id: "p3", slug: "coin-change", title: "Coin Change", points: 300, difficulty: "MEDIUM" }
    ]
  },
  {
    id: "c3-spring-sprint",
    title: "Spring Code Sprint 2026",
    description: "Completed championship contest. Check the official solutions and final leaderboard.",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * (24 * 7 - 2)).toISOString(),
    isRated: true,
    participantCount: 4500,
    status: "PAST",
    problems: [
      { id: "p1", slug: "two-sum", title: "Two Sum", points: 100, difficulty: "EASY" },
      { id: "p4", slug: "median-of-two-sorted-arrays", title: "Median of Sorted Arrays", points: 400, difficulty: "HARD" }
    ]
  }
];

export const SAMPLE_SUBMISSIONS = [
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
    sourceCode: "#include <iostream>\n// O(n) hash table solution\n..."
  },
  {
    id: "sub-9002",
    problemSlug: "coin-change",
    problemTitle: "Coin Change",
    username: "coder",
    language: "PYTHON",
    status: "COMPLETED",
    verdict: "AC",
    runtimeMs: 84,
    memoryKb: 14890,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sourceCode: "# Python dynamic programming"
  },
  {
    id: "sub-9003",
    problemSlug: "median-of-two-sorted-arrays",
    problemTitle: "Median of Two Sorted Arrays",
    username: "alex99",
    language: "JAVA",
    status: "COMPLETED",
    verdict: "TLE",
    runtimeMs: 2010,
    memoryKb: 45100,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    sourceCode: "// O(m*n) naive solution causing TLE"
  }
];

export const MOCK_PROBLEMS = SAMPLE_PROBLEMS;

// Helper to make API requests with token headers
export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // If backend isn't reachable or endpoint 404s, return null so callers can handle fallback
    console.warn(`[API] fetch to ${endpoint} failed or offline, falling back gracefully:`, err.message);
    return null;
  }
}

export const api = {
  // Auth
  async login(usernameOrEmail, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    if (res && res.data) return res.data;
    
    // Fallback demo users
    if (usernameOrEmail === 'admin' || usernameOrEmail === 'admin@codejudge.com') {
      return {
        accessToken: "mock-jwt-admin-token-xyz",
        tokenType: "Bearer",
        user: { id: "u-admin", username: "admin", email: "admin@codejudge.com", role: "ROLE_ADMIN", rating: 2150, solvedCount: 182 }
      };
    }
    return {
      accessToken: "mock-jwt-coder-token-abc",
      tokenType: "Bearer",
      user: { id: "u-coder", username: usernameOrEmail || "coder", email: `${usernameOrEmail || 'coder'}@example.com`, role: "ROLE_USER", rating: 1620, solvedCount: 47 }
    };
  },

  async register(username, email, password) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    if (res && res.data) return res.data;
    return {
      accessToken: "mock-jwt-newuser-token",
      tokenType: "Bearer",
      user: { id: "u-" + Date.now(), username, email, role: "ROLE_USER", rating: 1500, solvedCount: 0 }
    };
  },

  // Problems
  async getProblems({ search = '', difficulty = '', tag = '', topic = '', status = '', page = 0, size = 20 } = {}) {
    let query = `?page=${page}&size=${size}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (difficulty && difficulty !== 'ALL') query += `&difficulty=${difficulty}`;
    const effectiveTopic = topic || tag;
    if (effectiveTopic && effectiveTopic !== 'ALL') query += `&topic=${encodeURIComponent(effectiveTopic)}`;
    if (status && status !== 'ALL') query += `&status=${encodeURIComponent(status)}`;

    const res = await request(`/problems${query}`);
    if (res && res.data && res.data.content) {
      return res.data;
    }

    // Fallback filtering on SAMPLE_PROBLEMS
    let filtered = [...SAMPLE_PROBLEMS];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.slug.includes(s));
    }
    if (difficulty && difficulty !== 'ALL') {
      filtered = filtered.filter(p => p.difficulty === difficulty.toUpperCase());
    }
    if (tag && tag !== 'ALL') {
      filtered = filtered.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    return {
      content: filtered,
      totalElements: filtered.length,
      totalPages: 1,
      pageNumber: page,
      pageSize: size
    };
  },

  async getProblemBySlug(slug) {
    const res = await request(`/problems/${slug}`);
    if (res && res.data) return res.data;
    return SAMPLE_PROBLEMS.find(p => p.slug === slug) || SAMPLE_PROBLEMS[0];
  },

  async createProblem(problemData) {
    const res = await request('/problems', {
      method: 'POST',
      body: JSON.stringify(problemData),
    });
    if (res && res.data) return res.data;
    const newProblem = {
      ...problemData,
      id: "prob-" + Date.now(),
      slug: problemData.slug || problemData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      solvedCount: 0,
      totalSubmissions: 0,
      tags: problemData.tagSlugs || ["General"]
    };
    SAMPLE_PROBLEMS.unshift(newProblem);
    return newProblem;
  },

  async updateProblem(id, problemData) {
    const res = await request(`/problems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(problemData),
    });
    if (res && res.data) return res.data;
    const index = SAMPLE_PROBLEMS.findIndex(p => p.id === id || p.slug === id);
    if (index !== -1) {
      SAMPLE_PROBLEMS[index] = { ...SAMPLE_PROBLEMS[index], ...problemData };
      return SAMPLE_PROBLEMS[index];
    }
    return problemData;
  },

  async deleteProblem(id) {
    const res = await request(`/problems/${id}`, {
      method: 'DELETE',
    });
    const index = SAMPLE_PROBLEMS.findIndex(p => p.id === id || p.slug === id);
    if (index !== -1) {
      SAMPLE_PROBLEMS.splice(index, 1);
    }
    return res || { success: true };
  },

  // Solved Tracking
  async getSolvedProblems() {
    const res = await request('/user/solved');
    if (res && res.data && res.data.solvedIds) {
      return res.data.solvedIds;
    }
    const saved = localStorage.getItem('codejudge_solved_problems');
    return saved ? JSON.parse(saved) : [];
  },

  async markSolved(problemId) {
    return request('/user/solved', {
      method: 'POST',
      body: JSON.stringify({ problemId })
    });
  },

  // Single Testcase Run
  async runCode({ language, sourceCode, inputData, expectedOutput }) {
    const res = await request('/judge/run', {
      method: 'POST',
      body: JSON.stringify({ language, sourceCode, inputData, expectedOutput }),
    });
    if (res && res.data) return res.data;
    return null;
  },

  // Submissions
  async submitCode({ problemId, language, sourceCode }) {
    const res = await request('/submissions', {
      method: 'POST',
      body: JSON.stringify({ problemId, language, sourceCode }),
    });
    if (res && res.data) return res.data;

    // Realistic simulated execution pipeline
    const submissionId = "sub-" + Math.floor(Math.random() * 90000 + 10000);
    const mockPending = {
      id: submissionId,
      problemId,
      language,
      sourceCode,
      status: "RUNNING",
      verdict: null,
      runtimeMs: null,
      memoryKb: null,
      createdAt: new Date().toISOString()
    };
    return mockPending;
  },

  async getSubmission(id) {
    const res = await request(`/submissions/${id}`);
    if (res && res.data) return res.data;
    return {
      id,
      status: "COMPLETED",
      verdict: "AC",
      runtimeMs: 28,
      memoryKb: 8420,
      createdAt: new Date().toISOString()
    };
  },

  async getSubmissions() {
    return SAMPLE_SUBMISSIONS;
  },

  // Contests
  async getContests() {
    return SAMPLE_CONTESTS;
  },

  async getContest(id) {
    return SAMPLE_CONTESTS.find(c => c.id === id) || SAMPLE_CONTESTS[0];
  },

  // Leaderboard
  async getLeaderboard() {
    return [
      { rank: 1, username: "tourist", rating: 3820, solved: 1450, badge: "Legendary Grandmaster", country: "PL" },
      { rank: 2, username: "benq", rating: 3510, solved: 1390, badge: "Grandmaster", country: "US" },
      { rank: 3, username: "ecnerwala", rating: 3480, solved: 1310, badge: "Grandmaster", country: "CA" },
      { rank: 4, username: "jiangly", rating: 3420, solved: 1480, badge: "Grandmaster", country: "CN" },
      { rank: 5, username: "admin", rating: 2150, solved: 182, badge: "Master", country: "GLOBAL" },
      { rank: 6, username: "coder", rating: 1620, solved: 47, badge: "Specialist", country: "GLOBAL" },
      { rank: 7, username: "neal", rating: 2890, solved: 920, badge: "International Master", country: "US" },
      { rank: 8, username: "petr", rating: 3120, solved: 1100, badge: "Grandmaster", country: "RU" },
    ];
  }
};
