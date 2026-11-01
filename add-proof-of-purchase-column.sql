-- Add proof_of_purchase column to laboratory_cases table
-- Run this in Supabase SQL Editor

ALTER TABLE laboratory_cases
ADD COLUMN IF NOT EXISTS proof_of_purchase JSONB DEFAULT '{}'::jsonb;
