-- HSG Guard Trace - PostgreSQL Database Setup Schema
-- Run this in your Supabase SQL Editor or directly in PostgreSQL

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'worker',
  shift TEXT,
  badge_id TEXT UNIQUE,
  batch_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert Default Demo Accounts
INSERT INTO users (id, name, email, password, role, shift, badge_id, batch_id)
VALUES 
  ('W-102', 'Arun Kumar', 'arun.kumar@plant.com', '123', 'worker', 'Morning Shift', 'B-00125', 'BATCH-07'),
  ('HSE-901', 'Senior HSE Officer', 'hse.officer@plant.com', '123', 'monitor', 'All Shifts', 'B-00000', 'BATCH-00')
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row Level Security (RLS) policies for Supabase public access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read and write access on users" ON users;
CREATE POLICY "Allow public read and write access on users" 
ON users FOR ALL 
USING (true) 
WITH CHECK (true);
