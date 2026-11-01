# Proof of Purchase Column Fix Instructions

## Critical Step Required

The Supabase database is missing the `proof_of_purchase` column in the `laboratory_cases` table. This is causing the case submission to fail and the case reference number to not generate.

## How to Add This Column

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/pjqfmwjkkthxvfqbzxqc
2. Click on **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the SQL from `add-proof-of-purchase-column.sql`:
```sql
ALTER TABLE laboratory_cases
ADD COLUMN IF NOT EXISTS proof_of_purchase JSONB DEFAULT '{}'::jsonb;
```
5. Click **"Run"** or press `Ctrl+Enter`

## What This Fixes

After running this SQL:
- Laboratory case submissions will work correctly
- Proof of purchase files will be saved to the database
- Case reference numbers will be generated and displayed on the submission success screen
- Users can track their cases using the reference number

## Verify the Column Was Added

1. Go to **Table Editor** in Supabase
2. Click on the `laboratory_cases` table
3. You should see the `proof_of_purchase` column in the column list
