CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'employee',
  company_id UUID REFERENCES companies(id),
  religion VARCHAR(50),
  country_code CHAR(2),
  free_days INT DEFAULT 24,
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  code VARCHAR(100) UNIQUE NOT NULL,
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMP
);

INSERT INTO companies (id, name, created_at)
VALUES (gen_random_uuid(), 'Filip Rigilog Company', NOW());