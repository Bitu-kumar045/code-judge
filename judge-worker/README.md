# Code Judge - Worker Service

The worker service responsible for consuming queued submissions from Redis, running code inside sandboxed execution environments, and evaluating outputs against test cases.

## How it works

1. **Queue Consumer**: Continuously listens to `judge:queue` in Redis using non-busy-waiting `BRPOP`.
2. **State Transition**: Sets submission status to `RUNNING` in PostgreSQL.
3. **Execution Sandbox**:
   - Isolates code execution in a temporary scratch directory.
   - Enforces time limits (TLE detection) and captures stdout/stderr.
   - Automatically supports Docker container sandboxing when Docker daemon is available, with process-level execution fallback.
4. **Grading & Output Comparison**:
   - Evaluates test cases sequentially.
   - Compares trimmed stdout against expected outputs.
   - Assigns verdicts: `AC` (Accepted), `WA` (Wrong Answer), `TLE` (Time Limit Exceeded), `CE` (Compilation Error), or `RE` (Runtime Error).
5. **Persistence**: Updates the PostgreSQL `submissions` table with final verdict, peak runtime in milliseconds, and memory metrics.

## Running Locally

```bash
cd judge-worker
npm install
npm start
```

Or via Docker Compose:
```bash
docker compose up judge-worker
```
