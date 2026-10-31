const fs = require('fs');

const sstXml = fs.readFileSync('C:/Users/layri/.gemini/antigravity/brain/e9d1b6e0-6dfc-4f6d-be66-39d4d6781fa1/scratch/xlsx_unpacked/xl/sharedStrings.xml', 'utf8');

// Parse shared strings
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

const sheet2Xml = fs.readFileSync('C:/Users/layri/.gemini/antigravity/brain/e9d1b6e0-6dfc-4f6d-be66-39d4d6781fa1/scratch/xlsx_unpacked/xl/worksheets/sheet2.xml', 'utf8');

const problems = [];
const rowRegex = /<row r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
let rMatch;

while ((rMatch = rowRegex.exec(sheet2Xml)) !== null) {
  const rowNum = parseInt(rMatch[1]);
  if (rowNum === 1) continue; // Skip header

  const rowContent = rMatch[2];
  // Parse cells
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
  const difficulty = cols['B'] ? cols['B'].trim() : '';
  const topic = cols['C'] ? cols['C'].trim() : '';
  const question = cols['D'] ? cols['D'].trim() : '';
  const status = cols['E'] ? cols['E'].trim() : 'Not started';

  problems.push({ no, difficulty, topic, question, status });
}

console.log('Total problems extracted:', problems.length);
console.log('First problem:', problems[0]);
console.log('Last problem:', problems[problems.length - 1]);

const diffCounts = {};
const topicCounts = {};
problems.forEach(p => {
  diffCounts[p.difficulty] = (diffCounts[p.difficulty] || 0) + 1;
  topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
});

console.log('\nDifficulty Breakdown:', diffCounts);
console.log('\nTopic Breakdown:', topicCounts);



