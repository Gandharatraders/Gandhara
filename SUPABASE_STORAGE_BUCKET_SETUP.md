# Supabase Storage Bucket Setup Instructions

## Critical Step Required

The watch laboratory form requires a Supabase Storage bucket named `product-uploads` to store uploaded files (images, videos, payment receipts).

## How to Create the Storage Bucket

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/pjqfmwjkkthxvfqbzxqc
2. Click on **Storage** in the left sidebar
3. Click **"New bucket"**
4. Enter the bucket name: `product-uploads`
5. Make it **Public** (check the "Public bucket" option)
6. Click **"Create bucket"**

## Bucket Permissions

After creating the bucket, you need to set up the bucket policies:

1. Click on the `product-uploads` bucket
2. Click on **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Choose a policy name (e.g., "Public Read")
6. Set the policy to allow **SELECT** operations for **public** access
7. Click **"Save"**

8. Create another policy for uploads:
   - Click **"New Policy"** again
   - Select **"For full customization"**
   - Choose a policy name (e.g., "Allow Uploads")
   - Set the policy to allow **INSERT** operations for **public** access
   - Click **"Save"**

## Environment Variables

Ensure your `.env.local` file has the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

You can find these in your Supabase project dashboard under **Settings > API**.

## Verify the Bucket Was Created

1. Go to **Storage** in Supabase
2. You should see the `product-uploads` bucket in the list
3. Click on it to verify you can see files inside after testing
