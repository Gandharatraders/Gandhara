# Hero Slideshow Setup Instructions

## Step Required

Add the `hero_slideshow` column to the `products` table in Supabase.

## How to Add the Column

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/pjqfmwjkkthxvfqbzxqc
2. Click on **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the SQL from `add-hero-slideshow-column.sql`:
```sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS hero_slideshow BOOLEAN DEFAULT false;
```
5. Click **"Run"** or press `Ctrl+Enter`

## What This Enables

After running this SQL:
- Admin can mark products to appear in the hero section slideshow
- A new checkbox "Show in Hero Slideshow" will appear in product forms
- Products marked with this checkbox will appear in the hero slideshow on the homepage
- Separate from "Featured" products which appear in the featured collection section

## How to Use

1. Edit a product in the admin panel
2. Check the "Show in Hero Slideshow" checkbox
3. Save the product
4. The product will now appear in the hero slideshow on the homepage

## Verify the Column Was Added

1. Go to **Table Editor** in Supabase
2. Click on the `products` table
3. You should see the `hero_slideshow` column in the column list
