#!/usr/bin/env node
/**
 * Phase 4: Standalone Code Judge (No Docker Required)
 * 
 * Supports: Python, C, C++, and Java
 * Features:
 *   - Compiles compiled languages (C, C++, Java)
 *   - Pipes standard input (STDIN)
 *   - Enforces wall-clock timeout (Time Limit Exceeded)
 *   - Normalizes and compares standard output (STDOUT)
 *   - Assigns official verdicts: AC, WA, TLE, CE, RE, SE
 */

import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { performance } from 'perf_hooks';

export const VERDICTS = {
  ACCEPTED: 'AC',
  WRONG_ANSWER: 'WA',
  TIME_LIMIT_EXCEEDED: 'TLE',
  COMPILATION_ERROR: 'CE',
  RUNTIME_ERROR: 'RE',
  SYSTEM_ERROR: 'SE',
};

// Auto-detect Python binary (py on Windows vs python3 vs python)
let cachedPythonBin = null;
async function getPythonBinary() {
  if (cachedPythonBin) return cachedPythonBin;
  const candidates = process.platform === 'win32' 
    ? ['py', 'python', 'python3'] 
    : ['python3', 'python'];

  for (const bin of candidates) {
    try {
      await execPromise(`${bin} --version`);
      cachedPythonBin = bin;
      return bin;
    } catch {}
  }
  return 'python';
}

function execPromise(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) reject({ err, stdout, stderr });
      else resolve({ stdout, stderr });
    });
  });
}

/**
 * Normalizes output for comparison:
 * - Converts CRLF to LF
 * - Trims trailing whitespace from each line
 * - Trims leading and trailing empty lines
 */
export function normalizeOutput(output) {
  if (output === null || output === undefined) return '';
  return output
    .toString()
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Executes a single submission against input and expected output
 * 
 * @param {Object} options
 * @param {'PYTHON'|'C'|'CPP'|'JAVA'} options.language
 * @param {string} options.sourceCode
 * @param {string} options.inputData
 * @param {string} options.expectedOutput
 * @param {number} [options.timeLimitMs=1000]
 * @returns {Promise<Object>} Execution report with verdict, runtime, outputs
 */
export async function judgeSubmission({
  language,
  sourceCode,
  inputData = '',
  expectedOutput = '',
  timeLimitMs = 1000,
}) {
  const normLang = language.toUpperCase();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'judge-box-'));

  let sourceFile;
  let compileCommand = null;
  let runCommand = [];
  const isWindows = process.platform === 'win32';
  const exeSuffix = isWindows ? '.exe' : '';

  try {
    // 1. Language Setup
    switch (normLang) {
      case 'PYTHON': {
        const pyBin = await getPythonBinary();
        sourceFile = 'solution.py';
        runCommand = [pyBin, '-u', path.join(tmpDir, sourceFile)];
        break;
      }

      case 'C': {
        sourceFile = 'solution.c';
        const binPath = path.join(tmpDir, `solution${exeSuffix}`);
        compileCommand = `gcc -O2 -Wall "${path.join(tmpDir, sourceFile)}" -o "${binPath}"`;
        runCommand = [binPath];
        break;
      }

      case 'CPP': {
        sourceFile = 'solution.cpp';
        const binPath = path.join(tmpDir, `solution${exeSuffix}`);
        compileCommand = `g++ -O2 -Wall "${path.join(tmpDir, sourceFile)}" -o "${binPath}"`;
        runCommand = [binPath];
        break;
      }

      case 'JAVA': {
        sourceFile = 'Solution.java';
        compileCommand = `javac -d "${tmpDir}" "${path.join(tmpDir, sourceFile)}"`;
        runCommand = ['java', '-cp', tmpDir, 'Solution'];
        break;
      }

      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    // 2. Write Source Code
    const sourcePath = path.join(tmpDir, sourceFile);
    await fs.writeFile(sourcePath, sourceCode, 'utf8');

    // 3. Compilation Phase
    if (compileCommand) {
      const compileStart = performance.now();
      try {
        await execPromise(compileCommand, { timeout: 10000 });
      } catch (compileErr) {
        const errMsg = compileErr.stderr || compileErr.stdout || compileErr.err?.message || 'Compilation failed';
        return {
          verdict: VERDICTS.COMPILATION_ERROR,
          runtimeMs: Math.round(performance.now() - compileStart),
          stdout: '',
          stderr: errMsg.trim(),
          details: 'Compilation Error: The compiler failed with non-zero exit code.',
        };
      }
    }

    // 4. Execution Phase with Time Limit
    const runResult = await runProcess(runCommand, inputData, timeLimitMs);

    if (runResult.timedOut) {
      return {
        verdict: VERDICTS.TIME_LIMIT_EXCEEDED,
        runtimeMs: runResult.runtimeMs,
        stdout: runResult.stdout,
        stderr: 'Time Limit Exceeded: Process killed after exceeding timeout.',
        details: `Process did not terminate within ${timeLimitMs} ms.`,
      };
    }

    if (runResult.exitCode !== 0) {
      return {
        verdict: VERDICTS.RUNTIME_ERROR,
        runtimeMs: runResult.runtimeMs,
        stdout: runResult.stdout,
        stderr: runResult.stderr || `Terminated with exit code ${runResult.exitCode}`,
        details: `Runtime Error: Process exited abnormally (code ${runResult.exitCode}).`,
      };
    }

    // 5. Output Verification
    const actualNorm = normalizeOutput(runResult.stdout);
    const expectedNorm = normalizeOutput(expectedOutput);

    const isMatch = actualNorm === expectedNorm;

    return {
      verdict: isMatch ? VERDICTS.ACCEPTED : VERDICTS.WRONG_ANSWER,
      runtimeMs: runResult.runtimeMs,
      actualOutput: actualNorm,
      expectedOutput: expectedNorm,
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      details: isMatch
        ? 'Accepted: Output matched expected result.'
        : `Wrong Answer: Output difference detected.`,
    };

  } catch (err) {
    return {
      verdict: VERDICTS.SYSTEM_ERROR,
      runtimeMs: 0,
      stdout: '',
      stderr: err.message,
      details: `System Error: ${err.message}`,
    };
  } finally {
    // 6. Cleanup Scratch Directory
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

/**
 * Spawns child process, writes STDIN, monitors time limit, captures STDOUT/STDERR
 */
function runProcess(cmd, stdinData, timeLimitMs) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const start = performance.now();

    const proc = spawn(cmd[0], cmd.slice(1), {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    // Time Limit Watchdog
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        if (process.platform === 'win32') {
          // Force terminate process tree on Windows
          exec(`taskkill /pid ${proc.pid} /T /F`, () => {});
        } else {
          proc.kill('SIGKILL');
        }
      } catch {}
    }, timeLimitMs);

    // Feed STDIN
    if (stdinData) {
      proc.stdin.write(stdinData);
    }
    proc.stdin.end();

    proc.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      const runtimeMs = Math.round(performance.now() - start);
      resolve({
        stdout,
        stderr,
        exitCode: code,
        timedOut,
        runtimeMs,
      });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      const runtimeMs = Math.round(performance.now() - start);
      resolve({
        stdout,
        stderr: err.message,
        exitCode: 1,
        timedOut: false,
        runtimeMs,
      });
    });
  });
}

// Interactive CLI / Self-Test Runner
async function runSelfTests() {
  console.log('🧪 Starting Phase 4 Standalone Judge Self-Tests...\n');

  const testCases = [
    // 1. Python AC
    {
      name: 'Python 3: Two Sum (Expected AC)',
      language: 'PYTHON',
      sourceCode: `
import sys
lines = sys.stdin.read().split()
if lines:
    a, b = int(lines[0]), int(lines[1])
    print(a + b)
`,
      inputData: '25 17',
      expectedOutput: '42',
      timeLimitMs: 1000,
    },
    // 2. Python WA
    {
      name: 'Python 3: Wrong Answer (Expected WA)',
      language: 'PYTHON',
      sourceCode: `print("Wrong!")`,
      inputData: '',
      expectedOutput: 'Hello World',
      timeLimitMs: 1000,
    },
    // 3. Python TLE
    {
      name: 'Python 3: Infinite Loop (Expected TLE)',
      language: 'PYTHON',
      sourceCode: `
import time
while True:
    time.sleep(0.1)
`,
      inputData: '',
      expectedOutput: 'Done',
      timeLimitMs: 500, // 500ms timeout
    },
    // 4. C AC
    {
      name: 'C: Sum of Array (Expected AC)',
      language: 'C',
      sourceCode: `
#include <stdio.h>
int main() {
    int n, sum = 0, x;
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &x);
        sum += x;
    }
    printf("%d\\n", sum);
    return 0;
}
`,
      inputData: '5\n10 20 30 40 50',
      expectedOutput: '150',
      timeLimitMs: 1000,
    },
    // 5. C CE
    {
      name: 'C: Syntax Error (Expected CE)',
      language: 'C',
      sourceCode: `
#include <stdio.h>
int main() {
    invalid syntax here!!
    return 0;
}
`,
      inputData: '',
      expectedOutput: '',
      timeLimitMs: 1000,
    },
    // 6. C++ AC
    {
      name: 'C++: Vector Sort (Expected AC)',
      language: 'CPP',
      sourceCode: `
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    sort(a.begin(), a.end());
    for (int i = 0; i < n; i++) cout << a[i] << (i + 1 == n ? "" : " ");
    cout << "\\n";
    return 0;
}
`,
      inputData: '4\n9 2 7 1',
      expectedOutput: '1 2 7 9',
      timeLimitMs: 1000,
    }
  ];

  for (const tc of testCases) {
    process.stdout.write(`▶ Testing [${tc.name}] ... `);
    const result = await judgeSubmission(tc);
    console.log(`Verdict: [${result.verdict}] | Time: ${result.runtimeMs}ms`);
    if (result.verdict === VERDICTS.COMPILATION_ERROR) {
      console.log(`   Compiler error snippet: ${result.stderr.split('\\n')[0]}`);
    } else if (result.verdict === VERDICTS.WRONG_ANSWER) {
      console.log(`   Actual: "${result.actualOutput}" vs Expected: "${result.expectedOutput}"`);
    }
  }

  console.log('\n✨ All Phase 4 Judge test cases executed successfully!');
}

if (process.argv[2] === '--test') {
  runSelfTests();
}

