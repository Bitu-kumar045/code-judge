// AlgoArena Gamification & RPG Engine Store

const STORAGE_KEY = 'algoarena_player_state_v1';

export const WORLDS = [
  {
    id: 'basics',
    title: 'World 1: Basics & Math',
    subtitle: 'The Gateway to Computation',
    icon: 'Sparkles',
    color: 'from-blue-600 to-indigo-600',
    accent: '#3B82F6',
    requiredStars: 0,
    stages: [
      { id: 'b-1', num: 1, title: 'Scout: Fibonacci Numbers', level: 'EASY', slug: 'fibonacci-number', xp: 100, isBoss: false },
      { id: 'b-2', num: 2, title: 'Knight: Palindrome Number', level: 'EASY', slug: 'palindrome-number', xp: 120, isBoss: false },
      { id: 'b-3', num: 3, title: 'BOSS: Reverse Integer Overflow', level: 'MEDIUM', slug: 'reverse-integer', xp: 250, isBoss: true },
    ]
  },
  {
    id: 'arrays',
    title: 'World 2: Arrays & Memory',
    subtitle: 'Contiguous Buffers & Pointer Arithmetic',
    icon: 'Layers',
    color: 'from-indigo-600 to-purple-600',
    accent: '#7C3AED',
    requiredStars: 2,
    stages: [
      { id: 'a-1', num: 1, title: 'Scout: Two Sum Search', level: 'EASY', slug: 'two-sum', xp: 120, isBoss: false },
      { id: 'a-2', num: 2, title: 'Knight: Container With Most Water', level: 'MEDIUM', slug: 'container-with-most-water', xp: 220, isBoss: false },
      { id: 'a-3', num: 3, title: 'BOSS: Trapping Rain Water', level: 'HARD', slug: 'trapping-rain-water', xp: 450, isBoss: true },
    ]
  },
  {
    id: 'strings',
    title: 'World 3: Strings & Hashing',
    subtitle: 'ASCII Glyphs & Hash Maps',
    icon: 'Hash',
    color: 'from-purple-600 to-pink-600',
    accent: '#EC4899',
    requiredStars: 4,
    stages: [
      { id: 's-1', num: 1, title: 'Scout: Valid Anagram', level: 'EASY', slug: 'valid-anagram', xp: 120, isBoss: false },
      { id: 's-2', num: 2, title: 'Knight: Group Anagrams', level: 'MEDIUM', slug: 'group-anagrams', xp: 220, isBoss: false },
      { id: 's-3', num: 3, title: 'BOSS: Substring Concatenation', level: 'HARD', slug: 'substring-with-concatenation-of-all-words', xp: 500, isBoss: true },
    ]
  },
  {
    id: 'sliding-window',
    title: 'World 4: Sliding Window',
    subtitle: 'Dynamic Subarrays & Frequency Counters',
    icon: 'Maximize2',
    color: 'from-emerald-600 to-teal-600',
    accent: '#34D399',
    requiredStars: 6,
    stages: [
      { id: 'sw-1', num: 1, title: 'Scout: Best Time to Buy and Sell Stock', level: 'EASY', slug: 'best-time-to-buy-and-sell-stock', xp: 130, isBoss: false },
      { id: 'sw-2', num: 2, title: 'Knight: Longest Substring Without Repeating', level: 'MEDIUM', slug: 'longest-substring-without-repeating-characters', xp: 240, isBoss: false },
      { id: 'sw-3', num: 3, title: 'BOSS: Minimum Window Substring', level: 'HARD', slug: 'minimum-window-substring', xp: 480, isBoss: true },
    ]
  },
  {
    id: 'two-pointers',
    title: 'World 5: Two Pointers',
    subtitle: 'Converging and Diverging Indices',
    icon: 'ChevronsLeftRight',
    color: 'from-teal-600 to-cyan-600',
    accent: '#06B6D4',
    requiredStars: 8,
    stages: [
      { id: 'tp-1', num: 1, title: 'Scout: Valid Palindrome', level: 'EASY', slug: 'valid-palindrome', xp: 120, isBoss: false },
      { id: 'tp-2', num: 2, title: 'Knight: 3Sum Triplet Hunt', level: 'MEDIUM', slug: '3sum', xp: 240, isBoss: false },
      { id: 'tp-3', num: 3, title: 'BOSS: 4Sum Quadruplets', level: 'HARD', slug: '4sum', xp: 460, isBoss: true },
    ]
  },
  {
    id: 'linked-lists',
    title: 'World 6: Linked Lists',
    subtitle: 'Pointer Node Traversals & Reversals',
    icon: 'GitCommit',
    color: 'from-cyan-600 to-blue-600',
    accent: '#0284C7',
    requiredStars: 10,
    stages: [
      { id: 'll-1', num: 1, title: 'Scout: Reverse Linked List', level: 'EASY', slug: 'reverse-linked-list', xp: 140, isBoss: false },
      { id: 'll-2', num: 2, title: 'Knight: Remove Nth Node From End', level: 'MEDIUM', slug: 'remove-nth-node-from-end-of-list', xp: 230, isBoss: false },
      { id: 'll-3', num: 3, title: 'BOSS: Merge k Sorted Lists', level: 'HARD', slug: 'merge-k-sorted-lists', xp: 490, isBoss: true },
    ]
  },
  {
    id: 'stacks-queues',
    title: 'World 7: Stacks & Monotonic Queues',
    subtitle: 'LIFO Buffers & Bracket Validation',
    icon: 'Archive',
    color: 'from-amber-600 to-orange-600',
    accent: '#F59E0B',
    requiredStars: 12,
    stages: [
      { id: 'st-1', num: 1, title: 'Scout: Valid Parentheses', level: 'EASY', slug: 'valid-parentheses', xp: 130, isBoss: false },
      { id: 'st-2', num: 2, title: 'Knight: Daily Temperatures', level: 'MEDIUM', slug: 'daily-temperatures', xp: 240, isBoss: false },
      { id: 'st-3', num: 3, title: 'BOSS: Largest Rectangle in Histogram', level: 'HARD', slug: 'largest-rectangle-in-histogram', xp: 520, isBoss: true },
    ]
  },
  {
    id: 'binary-search',
    title: 'World 8: Binary Search',
    subtitle: 'Logarithmic Space Partitioning',
    icon: 'Target',
    color: 'from-orange-600 to-rose-600',
    accent: '#F43F5E',
    requiredStars: 14,
    stages: [
      { id: 'bs-1', num: 1, title: 'Scout: Standard Binary Search', level: 'EASY', slug: 'binary-search', xp: 130, isBoss: false },
      { id: 'bs-2', num: 2, title: 'Knight: Search in Rotated Sorted Array', level: 'MEDIUM', slug: 'search-in-rotated-sorted-array', xp: 250, isBoss: false },
      { id: 'bs-3', num: 3, title: 'BOSS: Median of Two Sorted Arrays', level: 'HARD', slug: 'median-of-two-sorted-arrays', xp: 550, isBoss: true },
    ]
  },
  {
    id: 'trees-bst',
    title: 'World 9: Trees & BST',
    subtitle: 'Hierarchical Nodes & Inorder DFS',
    icon: 'FolderTree',
    color: 'from-emerald-600 to-green-600',
    accent: '#10B981',
    requiredStars: 16,
    stages: [
      { id: 'tr-1', num: 1, title: 'Scout: Maximum Depth of Binary Tree', level: 'EASY', slug: 'maximum-depth-of-binary-tree', xp: 140, isBoss: false },
      { id: 'tr-2', num: 2, title: 'Knight: Validate Binary Search Tree', level: 'MEDIUM', slug: 'validate-binary-search-tree', xp: 260, isBoss: false },
      { id: 'tr-3', num: 3, title: 'BOSS: Binary Tree Maximum Path Sum', level: 'HARD', slug: 'binary-tree-maximum-path-sum', xp: 540, isBoss: true },
    ]
  },
  {
    id: 'dp-1',
    title: 'World 10: Dynamic Programming',
    subtitle: 'Overlapping Subproblems & Memoization',
    icon: 'Cpu',
    color: 'from-violet-600 to-indigo-700',
    accent: '#8B5CF6',
    requiredStars: 18,
    stages: [
      { id: 'dp-1', num: 1, title: 'Scout: Climbing Stairs', level: 'EASY', slug: 'climbing-stairs', xp: 140, isBoss: false },
      { id: 'dp-2', num: 2, title: 'Knight: Coin Change Minimizer', level: 'MEDIUM', slug: 'coin-change', xp: 270, isBoss: false },
      { id: 'dp-3', num: 3, title: 'BOSS: Edit Distance (Levenshtein)', level: 'HARD', slug: 'edit-distance', xp: 580, isBoss: true },
    ]
  },
  {
    id: 'graphs',
    title: 'World 11: Graphs & BFS/DFS',
    subtitle: 'Adjacency Matrices & Shortest Paths',
    icon: 'Network',
    color: 'from-blue-600 to-cyan-500',
    accent: '#3B82F6',
    requiredStars: 20,
    stages: [
      { id: 'gr-1', num: 1, title: 'Scout: Flood Fill Grid', level: 'EASY', slug: 'flood-fill', xp: 140, isBoss: false },
      { id: 'gr-2', num: 2, title: 'Knight: Number of Islands', level: 'MEDIUM', slug: 'number-of-islands', xp: 270, isBoss: false },
      { id: 'gr-3', num: 3, title: 'BOSS: Word Ladder BFS', level: 'HARD', slug: 'word-ladder', xp: 580, isBoss: true },
    ]
  },
  {
    id: 'backtracking',
    title: 'World 12: Backtracking & State Space',
    subtitle: 'Pruned Recursion Trees & Combinations',
    icon: 'Compass',
    color: 'from-fuchsia-600 to-purple-700',
    accent: '#D946EF',
    requiredStars: 22,
    stages: [
      { id: 'bk-1', num: 1, title: 'Scout: Subsets Generation', level: 'MEDIUM', slug: 'subsets', xp: 240, isBoss: false },
      { id: 'bk-2', num: 2, title: 'Knight: Combination Sum', level: 'MEDIUM', slug: 'combination-sum', xp: 260, isBoss: false },
      { id: 'bk-3', num: 3, title: 'BOSS: N-Queens Placement', level: 'HARD', slug: 'n-queens', xp: 600, isBoss: true },
    ]
  }
];

const DEFAULT_PLAYER = {
  username: 'AlexCode',
  level: 5,
  title: 'Algorithm Knight',
  xp: 1450,
  nextLevelXp: 2000,
  streakDays: 7,
  streakFrozen: false,
  gems: 480,
  eloRating: 1680,
  duelsWon: 14,
  duelsLost: 3,
  completedStages: {
    'b-1': 3,
    'b-2': 3,
    'b-3': 2,
    'a-1': 3,
    'a-2': 2,
  },
  badges: [
    { id: 'first_blood', name: 'First Blood', desc: 'Solved first problem on AlgoArena', icon: '⚔️', date: '2026-10-15' },
    { id: 'streak_7', name: '7-Day Blaze', desc: 'Maintained 7 consecutive active days', icon: '🔥', date: '2026-10-22' },
    { id: 'duel_master', name: 'Duel Champion', desc: 'Won 10 live 1v1 battles', icon: '🏆', date: '2026-10-28' },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Passed all tests under 15ms', icon: '⚡', date: '2026-10-30' }
  ],
  revisionQueue: [
    { slug: 'two-sum', title: 'Two Sum', dueDays: 1, interval: '1 Day Review' },
    { slug: 'trapping-rain-water', title: 'Trapping Rain Water', dueDays: 3, interval: '3 Day Review' },
    { slug: 'coin-change', title: 'Coin Change', dueDays: 7, interval: '7 Day Review' },
  ]
};

export function getPlayerState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      savePlayerState(DEFAULT_PLAYER);
      return DEFAULT_PLAYER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PLAYER;
  }
}

export function savePlayerState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save player state', e);
  }
}

export function getPlayerTitle(level) {
  if (level <= 2) return 'Apprentice Coder';
  if (level <= 5) return 'Algorithm Knight';
  if (level <= 10) return 'Code Sorcerer';
  if (level <= 18) return 'Binary Gladiator';
  if (level <= 25) return 'Grandmaster';
  return 'Arena Legend';
}

export function awardXp(amount, stageId = null, stars = 3) {
  const current = getPlayerState();
  let newXp = current.xp + amount;
  let newLevel = current.level;
  let nextXp = newLevel * newLevel * 80;

  while (newXp >= nextXp) {
    newLevel++;
    nextXp = newLevel * newLevel * 80;
  }

  const updatedStages = { ...current.completedStages };
  if (stageId) {
    updatedStages[stageId] = Math.max(updatedStages[stageId] || 0, stars);
  }

  const updated = {
    ...current,
    xp: newXp,
    level: newLevel,
    title: getPlayerTitle(newLevel),
    nextLevelXp: nextXp,
    gems: current.gems + Math.floor(amount / 5),
    completedStages: updatedStages
  };

  savePlayerState(updated);
  return updated;
}

export function getTotalStars(completedStages) {
  return Object.values(completedStages || {}).reduce((acc, s) => acc + (s || 0), 0);
}

export function updateElo(win, change = 25) {
  const current = getPlayerState();
  const newElo = win ? current.eloRating + change : Math.max(800, current.eloRating - change);
  const updated = {
    ...current,
    eloRating: newElo,
    duelsWon: win ? current.duelsWon + 1 : current.duelsWon,
    duelsLost: win ? current.duelsLost : current.duelsLost + 1,
    xp: current.xp + (win ? 150 : 40)
  };
  savePlayerState(updated);
  return updated;
}
