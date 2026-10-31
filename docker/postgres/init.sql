-- PostgreSQL Schema for Code Judge

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    rating INT DEFAULT 1500,
    solved_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description_md TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    time_limit_ms INT NOT NULL DEFAULT 1000,
    memory_limit_mb INT NOT NULL DEFAULT 256,
    sample_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT true,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tags & Problem Tags
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS problem_tags (
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (problem_id, tag_id)
);

-- 4. Test Cases Table
CREATE TABLE IF NOT EXISTS test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    input_data TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT true,
    test_order INT NOT NULL DEFAULT 1
);

-- 5. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    contest_id UUID NULL,
    language VARCHAR(20) NOT NULL CHECK (language IN ('PYTHON', 'C', 'CPP', 'JAVA')),
    source_code TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED')),
    verdict VARCHAR(30) NULL CHECK (verdict IN ('AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'SE')),
    runtime_ms INT NULL,
    memory_kb INT NULL,
    error_message TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Submission Test Cases (Per-test-case granular breakdown)
CREATE TABLE IF NOT EXISTS submission_test_cases (
    id BIGSERIAL PRIMARY KEY,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    verdict VARCHAR(30) NOT NULL,
    runtime_ms INT,
    memory_kb INT
);

-- 7. Contests & Contest Problems
CREATE TABLE IF NOT EXISTS contests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description_md TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_rated BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contest_problems (
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    points INT DEFAULT 100,
    PRIMARY KEY (contest_id, problem_id)
);

CREATE TABLE IF NOT EXISTS contest_participants (
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INT DEFAULT 0,
    penalty_minutes INT DEFAULT 0,
    rank INT,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (contest_id, user_id)
);

-- Seed initial basic tags
INSERT INTO tags (name, slug) VALUES 
('Array', 'array'),
('String', 'string'),
('Hash Table', 'hash-table'),
('Dynamic Programming', 'dynamic-programming'),
('Math', 'math'),
('Binary Search', 'binary-search'),
('Graph', 'graph'),
('Tree', 'tree')
ON CONFLICT (slug) DO NOTHING;

