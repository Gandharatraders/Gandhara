# Supabase Storage Setup for Media Files

Since the video file (24MB) and some images are too large for GitHub, we'll use Supabase Storage to host them.

## Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard/project/pjqfmwjkkthxvfqbzxqc
2. Click on **Storage** in the left sidebar
3. Click **"New bucket"**
4. Name it: `media`
5. Make it **Public** (so images/videos can be accessed without authentication)
6. Click **"Create bucket"**

## Step 2: Upload Files to Supabase Storage

Upload these files to the `media` bucket:

1. **Logo:**
   - File: `public/logo.png`
   - Upload to: `media/logo.png`

2. **Video:**
   - File: `public/rolex-watches-video.mp4`
   - Upload to: `media/rolex-watches-video.mp4`

3. **Hero Poster:**
   - File: `public/hero-poster.jpg`
   - Upload to: `media/hero-poster.jpg`

## Step 3: Get Public URLs

After uploading, Supabase will give you public URLs like:
- Logo: `https://pjqfmwjkkthxvfqbzxqc.supabase.co/storage/v1/object/public/media/logo.png`
- Video: `https://pjqfmwjkkthxvfqbzxqc.supabase.co/storage/v1/object/public/media/rolex-watches-video.mp4`
- Poster: `https://pjqfmwjkkthxvfqbzxqc.supabase.co/storage/v1/object/public/media/hero-poster.jpg`

## Step 4: Update Environment Variables

Add these to your `.env.local` and Vercel environment variables:

```
NEXT_PUBLIC_SUPABASE_MEDIA_URL=https://pjqfmwjkkthxvfqbzxqc.supabase.co/storage/v1/object/public/media
```

## Step 5: Update Code

I will update the code to use these Supabase Storage URLs instead of local files.

---

**After completing steps 1-3, share the public URLs with me and I'll update the code to use them.**
