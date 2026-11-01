# Database Column Fix Instructions

## Critical Step Required

The Supabase database is missing the following columns in the `products` table:
- `short_description`
- `full_description`
- `shipping_info`
- `return_info`
- `care_info`

## How to Add These Columns

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/pjqfmwjkkthxvfqbzxqc
2. Click on **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the SQL from `add-missing-columns.sql`:
```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS full_description TEXT,
ADD COLUMN IF NOT EXISTS shipping_info TEXT,
ADD COLUMN IF NOT EXISTS return_info TEXT,
ADD COLUMN IF NOT EXISTS care_info TEXT;
```
5. Click **"Run"** or press `Ctrl+Enter`

## What This Fixes

After running this SQL:
- Product creation will work with all fields
- Product updates will work with all fields
- Descriptions and shipping/return/care info will be saved to the database
- No more PGRST204 errors

## Verify the Columns Were Added

1. Go to **Table Editor** in Supabase
2. Click on the `products` table
3. You should see the new columns in the column list
