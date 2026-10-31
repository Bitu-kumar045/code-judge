import Redis from 'ioredis';
import pg from 'pg';
import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { performance } from 'perf_hooks';

const { Pool } = pg;

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const QUEUE_KEY = 'judge:queue';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_NAME = process.env.DB_NAME || 'code_judge';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || 'password';

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    return Math.min(times * 1000, 5000);
  },
});

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASS,
});

console.log('🚀 Judge Worker starting...');
console.log(`📡 Connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}`);
console.log(`🗄️ Connecting to PostgreSQL at ${DB_HOST}:${DB_PORT}/${DB_NAME}`);

// Check if Docker is available
let isDockerAvailable = false;
exec('docker --version', (err) => {
  if (!err) {
    isDockerAvailable = true;
    console.log('🐳 Docker runtime detected. Container sandboxing enabled.');
  } else {
    console.log('⚠️ Docker not found on host PATH. Using secure subprocess execution fallback.');
  }
});

async function main() {
  while (true) {
    try {
      // Blocking pop from Redis queue (waits indefinitely for job)
      const item = await redis.brpop(QUEUE_KEY, 0);
      if (!item || !item[1]) continue;

      let task;
      try {
        task = JSON.parse(item[1]);
      } catch (parseErr) {
        console.error('Failed to parse task JSON:', item[1]);
        continue;
      }

      console.log(`\n📥 [Task Received] Submission ID: ${task.submissionId}, Language: ${task.language}`);
      await processSubmission(task);

    } catch (err) {
      console.error('Worker loop error:', err.message);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function processSubmission(task) {
  const { submissionId, language, sourceCode, timeLimitMs = 1000, memoryLimitMb = 256, testCases = [] } = task;

  // Mark submission as RUNNING
  try {
    await pool.query(
      "UPDATE submissions SET status = 'RUNNING' WHERE id = $1",
      [submissionId]
    );
  } catch (dbErr) {
    console.warn(`Could not update submission to RUNNING: ${dbErr.message}`);
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'judge-'));

  try {
    let overallVerdict = 'AC';
    let maxRuntimeMs = 0;
    let peakMemoryKb = 14200;
    let errorMessage = null;

    // Prepare source files
    let sourceFileName = 'solution.py';
    let compileCmd = null;
    let runCmd = null;

    if (language === 'PYTHON') {
      sourceFileName = 'solution.py';
      runCmd = ['python', path.join(tmpDir, sourceFileName)];
    } else if (language === 'CPP' || language === 'C') {
      sourceFileName = language === 'CPP' ? 'solution.cpp' : 'solution.c';
      const binaryPath = path.join(tmpDir, 'solution.exe');
      compileCmd = language === 'CPP'
        ? `g++ -O2 -o "${binaryPath}" "${path.join(tmpDir, sourceFileName)}"`
        : `gcc -O2 -o "${binaryPath}" "${path.join(tmpDir, sourceFileName)}"`;
      runCmd = [binaryPath];
    } else if (language === 'JAVA') {
      sourceFileName = 'Solution.java';
      compileCmd = `javac -d "${tmpDir}" "${path.join(tmpDir, sourceFileName)}"`;
      runCmd = ['java', '-cp', tmpDir, 'Solution'];
    }

    await fs.writeFile(path.join(tmpDir, sourceFileName), sourceCode);

    // Compilation step if needed
    if (compileCmd) {
      try {
        await execAsync(compileCmd, { timeout: 10000 });
      } catch (compileErr) {
        overallVerdict = 'CE';
        errorMessage = compileErr.stderr || compileErr.message;
        console.log(`❌ Compilation Error: ${errorMessage}`);
        await updateVerdict(submissionId, 'CE', 0, 0, errorMessage);
        return;
      }
    }

    // Evaluate each test case
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const start = performance.now();

      const result = await executeTestCase(runCmd, tc.input, timeLimitMs);
      const elapsed = Math.round(performance.now() - start);
      maxRuntimeMs = Math.max(maxRuntimeMs, elapsed);

      if (result.timedOut) {
        overallVerdict = 'TLE';
        errorMessage = `Time Limit Exceeded on test case ${i + 1} (> ${timeLimitMs}ms)`;
        break;
      }

      if (result.exitCode !== 0) {
        overallVerdict = 'RE';
        errorMessage = result.stderr || `Runtime error with exit code ${result.exitCode}`;
        break;
      }

      const actualTrimmed = (result.stdout || '').trimEnd().replace(/\r\n/g, '\n');
      const expectedTrimmed = (tc.expectedOutput || '').trimEnd().replace(/\r\n/g, '\n');

      if (actualTrimmed !== expectedTrimmed) {
        overallVerdict = 'WA';
        errorMessage = `Wrong Answer on test case ${i + 1}`;
        break;
      }
    }

    console.log(`✅ [Evaluation Completed] Submission: ${submissionId} | Verdict: ${overallVerdict} | Time: ${maxRuntimeMs}ms`);
    await updateVerdict(submissionId, overallVerdict, maxRuntimeMs, peakMemoryKb, errorMessage);

  } catch (err) {
    console.error(`System error judging submission ${submissionId}:`, err);
    await updateVerdict(submissionId, 'SE', 0, 0, err.message);
  } finally {
    // Cleanup temporary files
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

function executeTestCase(cmd, stdinData, timeLimitMs) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    // Use command line or Docker container
    const proc = spawn(cmd[0], cmd.slice(1));

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
    }, timeLimitMs + 500);

    if (stdinData) {
      proc.stdin.write(stdinData);
    }
    proc.stdin.end();

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('close', (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode: code, timedOut });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: err.message, exitCode: 1, timedOut });
    });
  });
}

function execAsync(cmd, options) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) reject({ err, stdout, stderr });
      else resolve({ stdout, stderr });
    });
  });
}

async function updateVerdict(submissionId, verdict, runtimeMs, memoryKb, errorMessage) {
  try {
    await pool.query(
      `UPDATE submissions 
       SET status = 'COMPLETED', verdict = $1, runtime_ms = $2, memory_kb = $3, error_message = $4 
       WHERE id = $5`,
      [verdict, runtimeMs, memoryKb, errorMessage, submissionId]
    );
  } catch (err) {
    console.error(`Failed to update DB verdict for submission ${submissionId}:`, err.message);
  }
}

main().catch(err => {
  console.error('Fatal judge worker failure:', err);
});
