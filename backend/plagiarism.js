/**
 * Plagiarism & Code Similarity Engine (MOSS Principle)
 * 
 * Analyzes submissions using:
 * 1. Tokenization: Strips comments, string literals, and normalizes variable identifiers to common tokens
 * 2. K-gram generation: Generates rolling hash n-grams
 * 3. Winnowing algorithm: Produces robust structural fingerprints
 * 4. Jaccard & Intersection similarity calculation
 */

// Tokenize code into language-agnostic structural tokens
export function tokenizeCode(code, language = 'PYTHON') {
  if (!code) return [];

  // 1. Remove comments
  let clean = code
    .replace(/\/\*[\s\S]*?\*\//g, '')  // Multi-line C/Java/JS comments
    .replace(/\/\/.*/g, '')            // Single line C/Java/JS comments
    .replace(/#.*/g, '')              // Python comments
    .replace(/""".*?"""/gs, '')       // Python docstrings
    .replace(/'''.*?'''/gs, '');

  // 2. Normalize string literals and numbers to generic tokens
  clean = clean
    .replace(/"([^"\\]|\\.)*"/g, ' STR ')
    .replace(/'([^'\\]|\\.)*'/g, ' STR ')
    .replace(/\b\d+(\.\d+)?\b/g, ' NUM ');

  // 3. Normalize keywords vs variable names
  const keywords = new Set([
    'def', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'as',
    'class', 'in', 'is', 'not', 'and', 'or', 'try', 'except', 'with', 'lambda',
    'int', 'float', 'char', 'void', 'public', 'private', 'static', 'vector', 'include',
    'const', 'let', 'var', 'function', 'function*', 'async', 'await'
  ]);

  const rawTokens = clean.match(/[a-zA-Z_][a-zA-Z0-9_]*|[+\-*/%=<>!&|^~]+|[(){}\[\],;:]/g) || [];

  return rawTokens.map(token => {
    if (keywords.has(token)) return token.toUpperCase();
    if (/^[+\-*/%=<>!&|^~]+$/.test(token)) return `OP_${token}`;
    if (/^[(){}\[\],;:]$/.test(token)) return `SYM_${token}`;
    return 'VAR'; // Collapse all variable identifiers into 'VAR' to detect simple renames
  });
}

// Generate k-gram rolling hash fingerprints
export function generateFingerprints(tokens, k = 5, windowSize = 4) {
  if (tokens.length < k) return new Set(tokens);

  const hashes = [];
  for (let i = 0; i <= tokens.length - k; i++) {
    const kgram = tokens.slice(i, i + k).join('_');
    // Simple 32-bit hash
    let hash = 0;
    for (let c = 0; c < kgram.length; c++) {
      hash = ((hash << 5) - hash) + kgram.charCodeAt(c);
      hash |= 0;
    }
    hashes.push(hash);
  }

  // Winnowing algorithm: select minimum hash in each sliding window
  const fingerprints = new Set();
  for (let i = 0; i <= hashes.length - windowSize; i++) {
    const window = hashes.slice(i, i + windowSize);
    const minHash = Math.min(...window);
    fingerprints.add(minHash);
  }

  return fingerprints;
}

// Compare two code submissions and calculate similarity percentage
export function compareSubmissions(codeA, codeB, language = 'PYTHON') {
  const tokensA = tokenizeCode(codeA, language);
  const tokensB = tokenizeCode(codeB, language);

  const fpA = generateFingerprints(tokensA);
  const fpB = generateFingerprints(tokensB);

  if (fpA.size === 0 || fpB.size === 0) return { similarity: 0, sharedFingerprints: 0 };

  let intersection = 0;
  for (const h of fpA) {
    if (fpB.has(h)) intersection++;
  }

  const union = new Set([...fpA, ...fpB]).size;
  const jaccard = union > 0 ? (intersection / union) : 0;
  const similarityPercent = Math.min(100, Math.round(jaccard * 100 * 1.5)); // Normalized percentage

  return {
    similarity: similarityPercent,
    isSuspicious: similarityPercent >= 70,
    sharedTokens: intersection,
    totalTokensA: tokensA.length,
    totalTokensB: tokensB.length,
  };
}
