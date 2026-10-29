import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BUCKET_NAME = 'product-images';

async function uploadFile(filePath: string, fileName: string) {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${fileName}:`, error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

async function uploadAllImages() {
  console.log('Starting image upload to Supabase Storage...');

  // Check if bucket exists, if not create it
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((b: any) => b.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`Creating bucket: ${BUCKET_NAME}`);
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true
    });
    if (error) {
      console.error('Error creating bucket:', error);
      return;
    }
  }

  // Get all products
  const { data: products } = await supabase.from('products').select('id, images');

  if (!products || products.length === 0) {
    console.log('No products found');
    return;
  }

  console.log(`Found ${products.length} products`);

  for (const product of products) {
    console.log(`Processing product: ${product.id}`);

    if (!product.images) continue;

    const updatedImages: any = {};

    // Upload main image
    if (product.images.main) {
      const localPath = path.join(process.cwd(), 'public', product.images.main);
      if (await fs.access(localPath).then(() => true).catch(() => false)) {
        const fileName = path.basename(product.images.main);
        const publicUrl = await uploadFile(localPath, `${product.id}/${fileName}`);
        if (publicUrl) {
          updatedImages.main = publicUrl;
          console.log(`  ✓ Uploaded main: ${fileName}`);
        }
      }
    }

    // Upload gallery images
    for (let i = 1; i <= 5; i++) {
      const galleryKey = `gallery${i}` as keyof typeof product.images;
      const galleryPath = product.images[galleryKey];
      
      if (galleryPath) {
        const localPath = path.join(process.cwd(), 'public', galleryPath);
        if (await fs.access(localPath).then(() => true).catch(() => false)) {
          const fileName = path.basename(galleryPath);
          const publicUrl = await uploadFile(localPath, `${product.id}/${fileName}`);
          if (publicUrl) {
            updatedImages[galleryKey] = publicUrl;
            console.log(`  ✓ Uploaded gallery${i}: ${fileName}`);
          }
        }
      }
    }

    // Update product with new Supabase Storage URLs
    if (Object.keys(updatedImages).length > 0) {
      const { error } = await supabase
        .from('products')
        .update({ images: updatedImages })
        .eq('id', product.id);

      if (error) {
        console.error(`Error updating product ${product.id}:`, error);
      } else {
        console.log(`  ✓ Updated product ${product.id} with new URLs`);
      }
    }
  }

  console.log('\n✓ Image upload completed!');
}

uploadAllImages().catch(console.error);
