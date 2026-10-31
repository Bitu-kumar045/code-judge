# ⚡ CodeJudge: Full-Stack Online Judge & Competitive Programming Platform

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Sandboxing-2496ED.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Queue-DC382D.svg)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

An enterprise-grade, distributed Online Judge system designed for compiling, executing, and evaluating user-submitted algorithms in strictly isolated execution environments with sub-millisecond job queuing and real-time live contest leaderboards.

---

## 🏛️ System Architecture

```text
[ Browser / React UI (Port 3000) ]
        │
        ├── REST API calls (/api/v1/...) & WebSocket (/ws)
        ▼
[ Spring Boot 3 REST Backend (Port 8080) ]
        │
        ├── PostgreSQL 15 (Users, Problems, Submissions, Contests)
        └── Redis Message Broker (Push to 'judge:queue')
                │
                │ BRPOP (Task Claiming)
                ▼
        [ Judge Worker Service ]
                │
                │ Spawns isolated container per test case
                ▼
        [ Docker Sandbox Engine ]
          ├── --network none (Zero internet/socket access)
          ├── --memory 256m & --memory-swap 256m (cgroups limit)
          ├── --cpus 1.0 (CPU core ceiling)
          ├── --pids-limit 64 (Blocks fork bombs)
          ├── --read-only root filesystem
          ├── --tmpfs /tmp:rw,noexec,nosuid,size=64m
          └── Hard timeout watchdog (GNU timeout + host kill)
```

---

## 🚀 Key Features

1. **Authentication & Role-Based Access Control (RBAC)**:
   - Stateless JWT tokens with BCrypt password hashing.
   - Protected routes (`ROLE_ADMIN` vs `ROLE_USER`).
   - 1-click instant demo sign-in for testing.

2. **Problem Management Studio (CRUD)**:
   - Filter by difficulty (`EASY`, `MEDIUM`, `HARD`), search keyword, and tags (`Array`, `DP`, etc.).
   - Admin Problem Studio with Markdown statement editor and dynamic test cases manager.
   - Sensitive hidden test case masking to prevent cheating.

3. **In-Browser IDE & Execution Console**:
   - Monaco code editor with syntax highlighting for **Python 3**, **C**, **C++**, and **Java**.
   - **Custom Input Tab** to test arbitrary `STDIN` in real time.
   - Side-by-side diff comparison between **Your Output** and **Expected Output**.
   - 5-second anti-spam submission cooldown.

4. **Contest Arena & ICPC Scoreboard**:
   - Live synchronized countdown clock (HH:MM:SS).
   - Problem matrix with attempt penalty tracking:
     $$\text{Penalty} = \text{Elapsed Minutes} + (20 \times \text{Rejected Submissions before AC})$$
   - Real-time ranking with tie-breaking on score and penalty.

5. **Security-Hardened Docker Sandboxing**:
   - Air-gapped network, memory ceilings, CPU throttling, fork bomb protection, and automatic container deletion (`--rm`) after each run.

---

## ⚡ Quick Start

### Option 1: Docker Compose (All Services Together)
```bash
docker compose up --build
```
- **Frontend Web App**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:8080`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

### Option 2: Local Development
```bash
# 1. Run the Frontend dev server
cd frontend
npm install
npm run dev
# Accessible at http://localhost:3000

# 2. Run the Backend API & Standalone Judge
node backend/local-api-server.js
# Accessible at http://localhost:8080

# 3. Run Judge Worker Automated Tests
node judge-worker/tests/judge-test.js
```

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new user account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate credentials and receive JWT |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve current user profile |
| `GET` | `/api/v1/problems` | Public | Paginated list with `?difficulty=EASY&search=sum` |
| `GET` | `/api/v1/problems/{slug}` | Public | Problem statement, constraints, sample cases |
| `POST` | `/api/v1/problems` | Admin | Create new problem definition and test cases |
| `PUT` | `/api/v1/problems/{id}` | Admin | Update problem details |
| `DELETE`| `/api/v1/problems/{id}` | Admin | Remove problem from archive |
| `POST` | `/api/v1/submissions` | Authenticated | Submit code for sandboxed execution |
| `GET` | `/api/v1/submissions/{id}` | Public | Poll execution status and verdict |
| `GET` | `/api/v1/submissions` | Public | Recent submissions feed |
| `GET` | `/api/v1/contests` | Public | List active, upcoming, and past contests |
| `GET` | `/api/v1/contests/{id}` | Public | Contest arena details and live scoreboard |
| `GET` | `/api/v1/leaderboard` | Public | Global coder hall of fame |

---

## 🎬 2-Minute Product Demo Video Script

**Title**: *CodeJudge: High-Performance Online Judge Engine*  
**Duration**: 120 Seconds  
**Resolution**: 1080p @ 60fps  

| Timestamp | Visual Screen | Voiceover / Narration |
|---|---|---|
| **0:00 - 0:15** | Browser opens to `http://localhost:3000`. Clean dark-theme navbar, CodeJudge Engine badge, platform stats card. | *"Welcome to CodeJudge, an online judge and competitive programming platform built with Spring Boot, React, Redis, and isolated Docker sandboxes."* |
| **0:15 - 0:30** | Click **Sign In**. Click the **Admin (Full Access)** quick button. Navbar updates showing `admin` badge and **Create Problem** button. | *"We sign in instantly using stateless JWT authentication. Notice the role-based access control unlocking administrative problem authoring features."* |
| **0:30 - 0:55** | Click **Two Sum** in the problem list. Show the dual-pane IDE. Choose **Python 3**. Switch to **Custom Input** tab, enter `4\n2 7 11 15\n9`, and click **Run Code**. | *"Inside the problem solving workspace, coders get a full Monaco code editor. We can test custom input immediately in the console runner before submitting."* |
| **0:55 - 1:15** | Click **Submit**. Show the 5-second anti-spam cooldown button. The console animates `Enqueuing to Redis` $\to$ `Container Sandbox Spun Up` $\to$ `Accepted (AC)` with 14ms runtime. | *"When we click Submit, the code is enqueued to Redis, picked up by background workers, and evaluated inside an isolated container with zero internet and hard memory caps. We get an instant AC verdict!"* |
| **1:15 - 1:35** | Click **Contests** in navbar, then **Enter Live Arena** on Weekly Contest 401. Show the live countdown clock and the real-time ICPC scoreboard matrix with score and penalty calculations. | *"In the Contest Arena, a live synchronized timer tracks the round while the dynamic scoreboard recalculates points and ICPC penalty minutes in real time."* |
| **1:35 - 1:50** | Click **Admin Problem Studio**. Show the title, auto-slug generator, constraints sliders, markdown editor, and dynamic test case builder. | *"Platform admins can author new challenges, specify time limits, and attach hidden test cases that are shielded from public view."* |
| **1:50 - 2:00** | Transition to Terminal showing `docker compose up` and all unit tests passing (`8/8 tests passed`). Show logo and GitHub link. | *"Production ready, fully tested, and secure. That's CodeJudge. Check out the repository and start building today!"* |

---

## 🔒 Security Hardening Summary

- **Network Air-Gap**: Containers run with `--network none` (no outbound sockets or HTTP calls).
- **Fork-Bomb Block**: `--pids-limit 64` prevents process multiplication attacks.
- **Memory Ceiling**: `--memory 256m --memory-swap 256m` enforces cgroup limits without disk thrashing.
- **Ephemeral Storage**: Containers run with `--read-only` root; temporary files live on an in-memory `tmpfs` and are deleted immediately on exit (`--rm`).
- **Least Privilege**: Binaries run as unprivileged `UID 1000` with all Linux kernel capabilities dropped (`--cap-drop ALL`).
