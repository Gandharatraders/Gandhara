# Upload Product Images to Supabase Storage

Since product images are in `/public/uploads/` (excluded from Git), we need to upload them to Supabase Storage so they're accessible on Vercel.

## Step 1: Create Storage Bucket in Supabase

1. Go to: https://supabase.com/dashboard/project/pjqfmwjkkthxvfqbzxqc
2. Click **Storage** in the left sidebar
3. Click **"New bucket"**
4. Name it: `product-images`
5. Make it **Public** (so images can be accessed without authentication)
6. Click **"Create bucket"**

## Step 2: Run Upload Script

After creating the bucket, run:

```bash
npx tsx scripts/upload-images-to-supabase.ts
```

This script will:
- Upload all product images from `/public/uploads/` to Supabase Storage
- Update the database with the new Supabase Storage URLs
- Organize images by product ID

## Step 3: Verify

After the script completes:
1. Go to Supabase → Storage → product-images bucket
2. Verify images are uploaded
3. Go to Supabase → Table Editor → products table
4. Check that image URLs now point to Supabase Storage (e.g., `https://pjqfmwjkkthxvfqbzxqc.supabase.co/storage/v1/object/public/product-images/...`)

## Step 4: Deploy to Vercel

After images are uploaded and database is updated:
1. Push any code changes to GitHub
2. Redeploy in Vercel
3. Product images should now load from Supabase Storage

---

**Note:** This is a one-time setup. After this, when you upload new product images through the admin panel, you'll need to implement Supabase Storage upload in the upload API as well.
