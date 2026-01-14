-- ================================
-- EXTENSIONS
-- ================================

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================
-- UUID v8 GENERATOR (Postgres-side)
-- Draft-compatible, time-ordered, random-based
-- ================================

CREATE OR REPLACE FUNCTION uuid_v8()
RETURNS UUID
LANGUAGE SQL
AS $$
SELECT (
    overlay(
        overlay(
            gen_random_uuid()::text
            PLACING to_char(EXTRACT(EPOCH FROM clock_timestamp())::bigint, 'FM0000000000000000')
            FROM 1 FOR 16
        )
        PLACING '8'
        FROM 15 FOR 1
    )
)::uuid;
$$;

-- ================================
-- USERS (CORE)
-- ================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_v8(),

    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Added for authentication
    phone TEXT,
    location TEXT,

    proficiency_level TEXT CHECK (proficiency_level IN ('beginner','intermediate','advanced')),
    preferred_work_mode TEXT CHECK (preferred_work_mode IN ('remote','onsite','hybrid')),
    availability_timeline TEXT,

    career_goal_short TEXT,
    career_goal_long TEXT,

    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ================================
-- EDUCATION
-- ================================

CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_v8(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    degree TEXT,
    major TEXT,
    institution TEXT,
    graduation_year INT
);

-- ================================
-- EXPERIENCE (JOBS / PROJECTS)
-- ================================

CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT uuid_v8(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    title TEXT,
    organization TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE
);

-- ================================
-- SKILLS (VECTOR READY)
-- ================================

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_v8(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    skill_name TEXT NOT NULL,
    skill_type TEXT CHECK (skill_type IN ('technical','soft')),
    proficiency INT CHECK (proficiency BETWEEN 1 AND 5),

    embedding vector(768)
);

-- ================================
-- CERTIFICATIONS & LINKS
-- ================================

CREATE TABLE certifications_links (
    id UUID PRIMARY KEY DEFAULT uuid_v8(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    label TEXT,
    url TEXT
);

-- ================================
-- PREFERENCES
-- ================================

CREATE TABLE preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    interests TEXT[],
    preferred_roles TEXT[],
    industry_preferences TEXT[]
);

-- ================================
-- OPTIONAL (LATER STAGE)
-- ================================

CREATE TABLE optional_profile (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    gender TEXT,
    expected_salary INT,
    work_style_preference TEXT
);

-- ================================
-- RESUME METADATA
-- ================================

CREATE TABLE resume_metadata (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    resume_uploaded BOOLEAN DEFAULT false,
    parsed_successfully BOOLEAN DEFAULT false,
    resume_source TEXT,
    last_parsed_at TIMESTAMP
);

-- ================================
-- INDEXES (IMPORTANT)
-- ================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_skills_embedding ON skills USING ivfflat (embedding vector_cosine_ops);