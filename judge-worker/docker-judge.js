#!/usr/bin/env node
/**
 * Phase 5: Docker Container Sandboxing Engine
 * 
 * Enforces strict security isolations:
 *   - --network none (no internet / no socket access)
 *   - --memory 256m and --memory-swap 256m (hard memory limits)
 *   - --cpus 1 (CPU core ceiling)
 *   - --pids-limit 64 (blocks fork bombs)
 *   - --read-only (immutable root filesystem)
 *   - --tmpfs /tmp:rw,noexec,nosuid,size=64m (isolated RAM-backed scratchpad)
 *   - --cap-drop ALL (strip Linux root capabilities)
 *   - --security-opt no-new-privileges:true
 *   - Hard timeout wrapper (GNU timeout + host watchdog kill)
 *   - Automatic container removal (--rm + explicit cleanup)
 */

import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { performance } from 'perf_hooks';
import { judgeSubmission as fallbackJudge, normalizeOutput, VERDICTS } from './local-judge.js';

export { VERDICTS };

const DOCKER_IMAGES = {
  PYTHON: 'codejudge-runner-python',
  C: 'codejudge-runner-c',
  CPP: 'codejudge-runner-cpp',
  JAVA: 'codejudge-runner-java',
};

// Check if Docker daemon is active
let dockerActive = null;
export async function isDockerDaemonAvailable() {
  if (dockerActive !== null) return dockerActive;
  try {
    await execPromise('docker info');
    dockerActive = true;
  } catch {
    dockerActive = false;
  }
  return dockerActive;
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
 * Judges submission inside a hardened Docker container
 */
export async function judgeInDocker({
  language,
  sourceCode,
  inputData = '',
  expectedOutput = '',
  timeLimitMs = 1000,
  memoryLimitMb = 256,
  pidsLimit = 64,
  submissionId = 'sub-' + Math.floor(Math.random() * 100000),
}) {
  const normLang = language.toUpperCase();
  const hasDocker = await isDockerDaemonAvailable();

  // If Docker daemon isn't running on the machine, use the verified standalone engine
  if (!hasDocker) {
    console.log(`[Docker Sandbox] Docker daemon not found. Using local subprocess sandbox for ${normLang}.`);
    return await fallbackJudge({
      language,
      sourceCode,
      inputData,
      expectedOutput,
      timeLimitMs,
    });
  }

  const containerName = `judge-${submissionId}-${Date.now()}`;
  const hostTmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'judge-sandbox-'));

  try {
    let sourceFileName = 'solution.py';
    let runArgs = [];

    switch (normLang) {
      case 'PYTHON':
        sourceFileName = 'solution.py';
        runArgs = ['python', '/sandbox/solution.py'];
        break;
      case 'C':
        sourceFileName = 'solution.c';
        runArgs = ['sh', '-c', 'gcc -O2 /sandbox/solution.c -o /tmp/solution && /tmp/solution'];
        break;
      case 'CPP':
        sourceFileName = 'solution.cpp';
        runArgs = ['sh', '-c', 'g++ -O2 /sandbox/solution.cpp -o /tmp/solution && /tmp/solution'];
        break;
      case 'JAVA':
        sourceFileName = 'Solution.java';
        runArgs = ['sh', '-c', 'javac -d /tmp /sandbox/Solution.java && java -cp /tmp Solution'];
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    // Write source file to host directory mounted into container
    await fs.writeFile(path.join(hostTmpDir, sourceFileName), sourceCode, 'utf8');

    const timeoutSeconds = Math.max(1, Math.ceil(timeLimitMs / 1000));
    const imageName = DOCKER_IMAGES[normLang] || DOCKER_IMAGES.PYTHON;

    // Strict Docker isolation arguments
    const dockerArgs = [
      'run',
      '--rm',                                              // Delete container after run
      '--name', containerName,                             // Unique container identifier
      '--network', 'none',                                 // NO internet / network access
      '--memory', `${memoryLimitMb}m`,                     // RAM limit
      '--memory-swap', `${memoryLimitMb}m`,                // Prevent swap escaping
      '--cpus', '1.0',                                     // CPU ceiling
      '--pids-limit', String(pidsLimit),                   // Prevent fork bombs
      '--read-only',                                       // Read-only root filesystem
      '--tmpfs', '/tmp:rw,noexec,nosuid,size=64m',         // Isolated RAM scratchpad
      '--cap-drop', 'ALL',                                 // Drop all root Linux capabilities
      '--security-opt', 'no-new-privileges:true',          // Disallow privilege escalation
      '-v', `${hostTmpDir}:/sandbox:ro`,                   // Mount user code read-only
      '-i',                                                // Interactive STDIN stream
      imageName,
      `${timeoutSeconds}s`,                                // Timeout duration passed to entrypoint
      ...runArgs
    ];

    console.log(`[Docker Sandbox] Spawning: docker run --rm --network none --memory ${memoryLimitMb}m --cpus 1.0 ...`);

    const result = await runDockerProcess(dockerArgs, inputData, timeLimitMs + 1000, containerName);

    // Timeout (Exit code 124 or 137 from GNU timeout / SIGKILL)
    if (result.timedOut || result.exitCode === 124 || result.exitCode === 137) {
      return {
        verdict: VERDICTS.TIME_LIMIT_EXCEEDED,
        runtimeMs: result.runtimeMs,
        stdout: result.stdout,
        stderr: 'Time Limit Exceeded: Container killed by timeout watchdog.',
        details: `Exceeded hard limit of ${timeLimitMs} ms.`,
        sandbox: 'Docker (isolated)'
      };
    }

    // Non-zero exit code
    if (result.exitCode !== 0) {
      const isCE = result.stderr.toLowerCase().includes('error:') || 
                   result.stderr.toLowerCase().includes('syntaxerror') ||
                   result.stderr.toLowerCase().includes('cannot find symbol');

      return {
        verdict: isCE ? VERDICTS.COMPILATION_ERROR : VERDICTS.RUNTIME_ERROR,
        runtimeMs: result.runtimeMs,
        stdout: result.stdout,
        stderr: result.stderr,
        details: isCE ? 'Compilation Error in container.' : `Runtime Error (exit code ${result.exitCode})`,
        sandbox: 'Docker (isolated)'
      };
    }

    // Normalizing and verifying output
    const actualNorm = normalizeOutput(result.stdout);
    const expectedNorm = normalizeOutput(expectedOutput);
    const isMatch = actualNorm === expectedNorm;

    return {
      verdict: isMatch ? VERDICTS.ACCEPTED : VERDICTS.WRONG_ANSWER,
      runtimeMs: result.runtimeMs,
      actualOutput: actualNorm,
      expectedOutput: expectedNorm,
      stdout: result.stdout,
      stderr: result.stderr,
      details: isMatch ? 'Accepted (AC) inside Docker sandbox' : 'Wrong Answer (WA)',
      sandbox: 'Docker (isolated)'
    };

  } finally {
    // Force cleanup container and host temporary directory
    try {
      await execPromise(`docker rm -f ${containerName}`).catch(() => {});
      await fs.rm(hostTmpDir, { recursive: true, force: true });
    } catch {}
  }
}

/**
 * Spawns the Docker process with piped STDIN and host watchdog timer
 */
function runDockerProcess(args, stdinData, watchdogTimeoutMs, containerName) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const start = performance.now();

    const proc = spawn('docker', args, {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Host watchdog timer
    const timer = setTimeout(() => {
      timedOut = true;
      exec(`docker kill ${containerName}`, () => {
        exec(`docker rm -f ${containerName}`, () => {});
      });
      try { proc.kill('SIGKILL'); } catch {}
    }, watchdogTimeoutMs);

    if (stdinData) {
      proc.stdin.write(stdinData);
    }
    proc.stdin.end();

    proc.stdout.on('data', chunk => { stdout += chunk.toString(); });
    proc.stderr.on('data', chunk => { stderr += chunk.toString(); });

    proc.on('close', code => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr,
        exitCode: code,
        timedOut,
        runtimeMs: Math.round(performance.now() - start)
      });
    });

    proc.on('error', err => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr: err.message,
        exitCode: 1,
        timedOut: false,
        runtimeMs: Math.round(performance.now() - start)
      });
    });
  });
}

