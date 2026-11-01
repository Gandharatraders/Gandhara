-- Add missing columns to products table
-- Run this in Supabase SQL Editor

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS full_description TEXT,
ADD COLUMN IF NOT EXISTS shipping_info TEXT,
ADD COLUMN IF NOT EXISTS return_info TEXT,
ADD COLUMN IF NOT EXISTS care_info TEXT;
