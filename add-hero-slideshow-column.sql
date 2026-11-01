-- Add hero_slideshow column to products table
-- Run this in Supabase SQL Editor

ALTER TABLE products
ADD COLUMN IF NOT EXISTS hero_slideshow BOOLEAN DEFAULT false;
