# Supabase Setup Instructions

## Step 1: Create Tables in Supabase

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/pjqfmwjkkthxvfqbzxqc
2. Click on **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy the contents of `supabase-schema.sql` from this repository
5. Paste it into the SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`

This will create all the necessary tables:
- `products`
- `orders`
- `reviews`
- `messages`
- `laboratory_cases`

## Step 2: Run Migration Script

After creating the tables, run the migration script to transfer your existing JSON data to Supabase:

```bash
npx tsx scripts/migrate-to-supabase.ts
```

This will migrate:
- Products from `data/products.json`
- Orders from `data/orders.json`
- Reviews from `data/reviews.json`
- Messages from `data/messages.json`
- Laboratory cases from `data/laboratory-cases.json`

## Step 3: Verify Migration

After migration, verify the data in Supabase:

1. Go to **Table Editor** in Supabase
2. Check each table to ensure data was migrated correctly
3. Verify row counts match your JSON files

## Step 4: Test Locally

Start the development server to test:

```bash
npm run dev
```

Test:
- Browse products
- Create an order
- Submit a review
- Send a contact message
- Submit a laboratory case

## Step 5: Deploy to Vercel

After testing locally:

1. Commit all changes
2. Push to GitHub
3. Vercel will automatically deploy
4. The site should now work with Supabase storage

## Troubleshooting

### Migration Fails
- Ensure `.env.local` has correct Supabase credentials
- Ensure tables were created in Step 1
- Check Supabase logs for errors

### Data Not Showing
- Verify RLS policies allow public read access
- Check API routes are using Supabase correctly
- Verify environment variables in Vercel

### Upload Errors
- Ensure Supabase Storage buckets are created for uploads
- Check storage permissions
