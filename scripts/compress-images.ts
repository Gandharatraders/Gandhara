import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'images');
const QUALITY = 80; // Compression quality (0-100)

async function compressImage(inputPath: string, outputPath: string) {
  try {
    const tempPath = inputPath + '.tmp';
    await sharp(inputPath)
      .jpeg({ quality: QUALITY })
      .toFile(tempPath);
    
    // Replace original with compressed version
    await fs.rename(tempPath, outputPath);
    return true;
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error);
    return false;
  }
}

async function compressAllImages() {
  console.log('Starting image compression...');
  console.log(`Source directory: ${UPLOADS_DIR}`);

  const files = await fs.readdir(UPLOADS_DIR);
  const imageFiles = files.filter(f => 
    f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
  );

  console.log(`Found ${imageFiles.length} images to compress`);

  let originalSize = 0;
  let compressedSize = 0;
  let successCount = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(UPLOADS_DIR, file);
    const outputPath = path.join(UPLOADS_DIR, file);

    const stats = await fs.stat(inputPath);
    originalSize += stats.size;

    console.log(`Compressing: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const success = await compressImage(inputPath, outputPath);
    
    if (success) {
      const newStats = await fs.stat(outputPath);
      compressedSize += newStats.size;
      const savings = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);
      console.log(`  ✓ Compressed to ${(newStats.size / 1024 / 1024).toFixed(2)} MB (${savings}% reduction)`);
      successCount++;
    }
  }

  console.log('\n=== Compression Summary ===');
  console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Compressed size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total saved: ${((originalSize - compressedSize) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Success rate: ${successCount}/${imageFiles.length} images`);
}

compressAllImages().catch(console.error);
