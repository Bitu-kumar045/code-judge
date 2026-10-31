const fs = require('fs');
const path = require('path');

const sstXml = fs.readFileSync('C:/Users/layri/.gemini/antigravity/brain/e9d1b6e0-6dfc-4f6d-be66-39d4d6781fa1/scratch/xlsx_unpacked/xl/sharedStrings.xml', 'utf8');

// 1. Parse shared strings
const strings = [];
const siRegex = /<si>([\s\S]*?)<\/si>/g;
let match;
while ((match = siRegex.exec(sstXml)) !== null) {
  const siContent = match[1];
  const tMatches = [...siContent.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)];
  let str = tMatches.map(m => m[1]).join('');
  str = str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  strings.push(str);
}

// 2. Parse sheet2.xml
const sheet2Xml = fs.readFileSync('C:/Users/layri/.gemini/antigravity/brain/e9d1b6e0-6dfc-4f6d-be66-39d4d6781fa1/scratch/xlsx_unpacked/xl/worksheets/sheet2.xml', 'utf8');

const rawQuestions = [];
const rowRegex = /<row r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
let rMatch;

while ((rMatch = rowRegex.exec(sheet2Xml)) !== null) {
  const rowNum = parseInt(rMatch[1]);
  if (rowNum === 1) continue; // Skip header

  const rowContent = rMatch[2];
  const cellRegex = /<c\b([^>]*)>(?:<v>([^<]*)<\/v>)?(?:<is><t>([\s\S]*?)<\/t><\/is>)?<\/c>/g;
  let cMatch;
  const cols = {};
  while ((cMatch = cellRegex.exec(rowContent)) !== null) {
    const attrs = cMatch[1];
    const val = cMatch[2];
    const inline = cMatch[3];
    const colMatch = attrs.match(/r="([A-Z]+)\d+"/);
    if (!colMatch) continue;
    const col = colMatch[1];
    const isString = /t="s"/.test(attrs);

    if (inline !== undefined) {
      cols[col] = inline;
    } else if (isString && val !== undefined) {
      cols[col] = strings[parseInt(val)];
    } else {
      cols[col] = val;
    }
  }

  const no = parseInt(cols['A']);
  const difficulty = cols['B'] ? cols['B'].trim() : 'Moderate';
  const topic = cols['C'] ? cols['C'].trim() : 'General';
  const question = cols['D'] ? cols['D'].trim() : '';
  const status = cols['E'] ? cols['E'].trim() : 'Not started';

  if (!isNaN(no) && question) {
    rawQuestions.push({ no, difficulty, topic, question, status });
  }
}

// Sort by question number
rawQuestions.sort((a, b) => a.no - b.no);

console.log(`Parsed ${rawQuestions.length} raw questions.`);

// 3. Write backend/data/questions.csv
const csvLines = ['No,Difficulty,Topic,Question,Status'];
rawQuestions.forEach(q => {
  // Escape question if contains comma or quotes
  const escapedQ = q.question.includes(',') || q.question.includes('"')
    ? `"${q.question.replace(/"/g, '""')}"`
    : q.question;
  csvLines.push(`${q.no},${q.difficulty},${q.topic},${escapedQ},${q.status}`);
});

fs.writeFileSync(
  path.join(__dirname, '../data/questions.csv'),
  csvLines.join('\n'),
  'utf8'
);
console.log(`Saved backend/data/questions.csv (${csvLines.length - 1} questions).`);

// Helper to derive titles from question sentences
function makeTitle(no, question, topic) {
  let text = question.trim();
  // Strip trailing period
  if (text.endsWith('.')) text = text.slice(0, -1).trim();

  // If question is short (< 50 chars), use it directly with title casing
  // Remove common starting imperatives
  const prefixRegex = /^(Read|Print|Find the|Find a|Find|Calculate the|Calculate|Check whether|Check if|Check|Given|Count the|Count|Determine the|Determine|Implement a|Implement an|Implement|Compute the|Compute|Return the|Return|Solve the|Solve|Construct a|Construct|Generate all|Generate)\s+/i;
  
  let cleaned = text.replace(prefixRegex, '');
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  // If too long (> 65 chars), cut at punctuation or sensible length
  if (cleaned.length > 60) {
    const commaIdx = cleaned.indexOf(',');
    if (commaIdx > 15 && commaIdx < 55) {
      cleaned = cleaned.substring(0, commaIdx);
    } else {
      const words = cleaned.split(' ');
      cleaned = words.slice(0, 7).join(' ');
    }
  }

  // Ensure title has substance
  if (cleaned.length < 4) {
    cleaned = `${topic} Problem ${no}`;
  }

  return cleaned;
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

// 4. Build rich problems array
const problems = rawQuestions.map(q => {
  const normDiff = q.difficulty === 'Easy' ? 'EASY' : q.difficulty === 'Moderate' ? 'MEDIUM' : 'HARD';
  const title = makeTitle(q.no, q.question, q.topic);
  const slug = `p${q.no}-${slugify(title)}`;

  // Realistic metrics
  const baseRate = normDiff === 'EASY' ? 76.5 : normDiff === 'MEDIUM' ? 52.8 : 31.4;
  const variance = ((q.no * 17) % 25) - 12; // -12 to +12
  const acceptanceRate = Math.min(96, Math.max(12, +(baseRate + variance * 0.7).toFixed(1)));
  const submissionsCount = Math.max(850, 48000 - (q.no * 42) + ((q.no * 31) % 500));
  const acceptedCount = Math.round(submissionsCount * (acceptanceRate / 100));

  const tags = [q.topic];
  if (q.topic.includes('&')) {
    q.topic.split('&').forEach(t => {
      const clean = t.trim();
      if (clean && !tags.includes(clean)) tags.push(clean);
    });
  }
  tags.push(normDiff.toLowerCase());

  const descriptionMd = `### Problem Statement
${q.question}

### Input Format
- Standard input contains the test cases.
- First line contains the primary parameters / size, followed by elements where applicable.

### Output Format
- Print the computed result to standard output followed by a newline.

### Constraints
- $1 \\le N \\le 10^5$
- Time Limit: 1.0 second
- Memory Limit: 256 MB

### Example
**Input:**
\`\`\`
5
1 2 3 4 5
\`\`\`

**Output:**
\`\`\`
Result
\`\`\`
`;

  return {
    id: `prob-${q.no}`,
    no: q.no,
    title,
    slug,
    difficulty: normDiff,
    level: q.difficulty,
    topic: q.topic,
    tags,
    statement: q.question,
    descriptionMd,
    timeLimitMs: normDiff === 'HARD' ? 2000 : 1000,
    memoryLimitMb: 256,
    acceptanceRate,
    submissionsCount,
    acceptedCount,
    status: q.status,
    sampleCases: [
      {
        input: '5\n1 2 3 4 5',
        output: 'Result'
      }
    ]
  };
});

fs.writeFileSync(
  path.join(__dirname, '../data/all-problems.json'),
  JSON.stringify(problems, null, 2),
  'utf8'
);

console.log(`Saved backend/data/all-problems.json (${problems.length} problems).`);
console.log('Sample Problem 1:', problems[0]);
console.log('Sample Problem 500:', problems[499]);
console.log('Sample Problem 1000:', problems[999]);

