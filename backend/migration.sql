-- Migration to add test generation fields to problems table
-- Run this directly in Supabase SQL Editor

-- Add new columns to problems table
ALTER TABLE "problems"
ADD COLUMN IF NOT EXISTS "inputSpec" JSONB,
ADD COLUMN IF NOT EXISTS "correctSolution" TEXT,
ADD COLUMN IF NOT EXISTS "solutionLanguage" TEXT;

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'problems'
AND column_name IN ('inputSpec', 'correctSolution', 'solutionLanguage');
