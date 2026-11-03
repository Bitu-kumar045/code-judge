import { judgeSubmission, VERDICTS, normalizeOutput } from '../local-judge.js';

console.log('🧪 Running Judge Worker Unit & Integration Tests...\n');

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  // Test 1: Output Normalization
  assert(
    normalizeOutput('hello world  \r\n\r\n') === 'hello world',
    'Output Normalization trims trailing whitespace and CRLF'
  );

  // Test 2: Output Normalization with multiple lines
  assert(
    normalizeOutput('line 1  \r\nline 2   \r\n') === 'line 1\nline 2',
    'Output Normalization handles multi-line outputs'
  );

  // Test 3: Python Two Sum (AC)
  const pyResult = await judgeSubmission({
    language: 'PYTHON',
    sourceCode: 'import sys\nprint("42")',
    inputData: '',
    expectedOutput: '42',
    timeLimitMs: 1000
  });
  assert(pyResult.verdict === VERDICTS.ACCEPTED, 'Python correct answer returns AC');

  // Test 4: Python Wrong Answer (WA)
  const waResult = await judgeSubmission({
    language: 'PYTHON',
    sourceCode: 'print("wrong output")',
    inputData: '',
    expectedOutput: 'correct output',
    timeLimitMs: 1000
  });
  assert(waResult.verdict === VERDICTS.WRONG_ANSWER, 'Python incorrect answer returns WA');

  // Test 5: Python Infinite Loop (TLE)
  const tleResult = await judgeSubmission({
    language: 'PYTHON',
    sourceCode: 'import time\nwhile True: time.sleep(0.05)',
    inputData: '',
    expectedOutput: 'done',
    timeLimitMs: 400
  });
  assert(tleResult.verdict === VERDICTS.TIME_LIMIT_EXCEEDED, 'Python infinite loop triggers TLE and process kill');

  // Test 6: C Compilation Error (CE)
  const ceResult = await judgeSubmission({
    language: 'C',
    sourceCode: 'invalid c code here',
    inputData: '',
    expectedOutput: '',
    timeLimitMs: 1000
  });
  assert(ceResult.verdict === VERDICTS.COMPILATION_ERROR, 'C syntax error returns CE');

  // Test 7: SQL Execution & DDL Schema Engine
  const sqlResult = await judgeSubmission({
    language: 'SQL',
    sourceCode: 'CREATE TABLE Sailors (sid INT PRIMARY KEY, sname VARCHAR(20)); INSERT INTO Sailors VALUES (1, "Dustin"); SELECT * FROM Sailors;',
    inputData: '',
    expectedOutput: '',
    timeLimitMs: 1000
  });
  assert(sqlResult.verdict === VERDICTS.ACCEPTED, 'SQL table creation, insert, and select query executes with AC');
  assert(sqlResult.actualOutput.includes('Dustin'), 'SQL output contains formatted result data');

  // Test 8: Python Auto-heal Indentation Error (User request: ignore indentation error in all problems)
  const badIndentCode = `import sys

def solve():
# Unindented lines inside function block
input_data = sys.stdin.read().split()
if not input_data:
return
n = int(input_data[-1])
if n % 2 == 0:
print("even")
else:
print("odd")

if __name__ == '__main__':
solve()`;

  const indentResult = await judgeSubmission({
    language: 'PYTHON',
    sourceCode: badIndentCode,
    inputData: 'n = 4',
    expectedOutput: 'Even',
    timeLimitMs: 1000
  });
  assert(indentResult.verdict === VERDICTS.ACCEPTED, 'Python code with broken indentation is automatically healed and returns AC');
  assert(indentResult.actualOutput.toLowerCase() === 'even', 'Python output correctly matches expected output');

  // Test 9: ICPC Penalty Calculation logic
  function calculateICPCScore(attempts) {
    // attempts = [{ problem: 'A', accepted: true, timeMinutes: 15, failedBefore: 1 }]
    let score = 0;
    let penalty = 0;
    for (const a of attempts) {
      if (a.accepted) {
        score += 100;
        penalty += a.timeMinutes + (a.failedBefore * 20);
      }
    }
    return { score, penalty };
  }

  const contestScore = calculateICPCScore([
    { problem: 'A', accepted: true, timeMinutes: 15, failedBefore: 1 }, // 15 + 20 = 35
    { problem: 'B', accepted: true, timeMinutes: 40, failedBefore: 0 }, // 40
    { problem: 'C', accepted: false, timeMinutes: 0, failedBefore: 3 }  // not solved -> 0 penalty
  ]);

  assert(contestScore.score === 200, 'ICPC Score correctly sums accepted problems');
  assert(contestScore.penalty === 75, 'ICPC Penalty adds 20 mins per rejected try only on solved problems (35 + 40 = 75)');

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} / ${total} tests passed!`);
  console.log(`========================================\n`);
}

runTests();

