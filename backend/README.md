# Code Judge - Backend Service (Spring Boot 3)

The REST API and coordination backend for the Code Judge system. Built with Spring Boot 3, Spring Data JPA, Spring Security (JWT), PostgreSQL, and Redis.

## Features Implemented (Phase 3)

1. **Authentication & Authorization (JWT)**
   - Registration & Login with BCrypt password hashing.
   - Stateless JWT tokens (Bearer tokens).
   - Role-Based Access Control (`ROLE_USER`, `ROLE_ADMIN`).
   - Pre-seeded admin user (`admin` / `admin123`) and coder user (`coder` / `password123`).

2. **Problem Management (CRUD)**
   - List problems with pagination, difficulty filtering, and keyword search.
   - View problem by ID or slug with constraints, markdown description, sample cases, and tags.
   - Admin-protected create, update, and delete endpoints.
   - Auto-slug generation and JSON sample-case mapping.
   - Pre-seeded "Two Sum" problem with test cases.

3. **Submissions API**
   - Submit solutions in Python, C, C++, or Java.
   - Asynchronous queuing: saves submission as `PENDING` in PostgreSQL and pushes payload to Redis queue (`judge:queue`) for the `judge-worker`.
   - Fetch submission status, runtime, memory, and verdicts.
   - Filter submissions by user or problem.

---

## API Endpoints Reference

### 1. Auth (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new user |
| `POST` | `/api/v1/auth/login` | Public | Login and obtain JWT token |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve authenticated user profile |

**Example Register Request:**
```json
POST /api/v1/auth/register
{
  "username": "alex",
  "email": "alex@example.com",
  "password": "mypassword123"
}
```

**Example Login Request:**
```json
POST /api/v1/auth/login
{
  "usernameOrEmail": "alex",
  "password": "mypassword123"
}
```

---

### 2. Problems (`/api/v1/problems`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/problems` | Public | Paginated list with `?difficulty=EASY&search=sum&page=0&size=20` |
| `GET` | `/api/v1/problems/{slug}` | Public | Get problem details by slug |
| `GET` | `/api/v1/problems/id/{id}` | Public | Get problem details by UUID |
| `POST` | `/api/v1/problems` | Admin | Create new problem |
| `PUT` | `/api/v1/problems/{id}` | Admin | Update problem details |
| `DELETE` | `/api/v1/problems/{id}` | Admin | Delete problem |

**Example Problem Creation (Admin only):**
```json
POST /api/v1/problems
Authorization: Bearer <ADMIN_JWT_TOKEN>
{
  "title": "Reverse String",
  "descriptionMd": "Write a function that reverses a string.",
  "difficulty": "EASY",
  "timeLimitMs": 1000,
  "memoryLimitMb": 256,
  "tagSlugs": ["string"],
  "sampleCases": [
    {
      "input": "hello",
      "output": "olleh",
      "explanation": "Reverse of hello is olleh"
    }
  ],
  "testCases": [
    {
      "inputData": "hello",
      "expectedOutput": "olleh",
      "isHidden": false,
      "testOrder": 1
    },
    {
      "inputData": "world",
      "expectedOutput": "dlrow",
      "isHidden": true,
      "testOrder": 2
    }
  ]
}
```

---

### 3. Submissions (`/api/v1/submissions`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/submissions` | Authenticated | Submit code for evaluation |
| `GET` | `/api/v1/submissions/{id}` | Public | Check verdict & execution status |
| `GET` | `/api/v1/submissions/user/{userId}`| Public | List user submission history |
| `GET` | `/api/v1/submissions/problem/{problemId}`| Public | List problem submission history |

**Example Code Submission:**
```json
POST /api/v1/submissions
Authorization: Bearer <USER_JWT_TOKEN>
{
  "problemId": "UUID_OF_TWO_SUM",
  "language": "PYTHON",
  "sourceCode": "import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    target = int(lines[n+1])\n    seen = {}\n    for i, x in enumerate(nums):\n        comp = target - x\n        if comp in seen:\n            print(f\"{seen[comp]} {i}\")\n            return\n        seen[x] = i\n\nsolve()\n"
}
```

---

## Running the Backend

### Option 1: Docker Compose (All services together)
From the root directory:
```bash
docker compose up --build
```

### Option 2: Local Development
Ensure PostgreSQL and Redis are running locally or via Docker:
```bash
docker compose up db redis -d
```
Then run the Spring Boot app:
```bash
cd backend
mvn spring-boot:run
```
The server will start on `http://localhost:8080`.
