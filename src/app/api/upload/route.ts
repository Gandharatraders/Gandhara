import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side uploads (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BUCKET_NAME = 'product-uploads';

export async function POST(request: Request) {
  try {
    console.log('Upload request received');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'laboratory';

    console.log('File details:', { name: file?.name, size: file?.size, type: file?.type, uploadType: type });

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('File buffer created, size:', buffer.length);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = `${type}/${filename}`;

    console.log('Uploading to Supabase:', { bucket: BUCKET_NAME, path: filepath });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ 
        error: 'Failed to upload file to storage',
        details: error.message,
        fullError: error
      }, { status: 500 });
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filepath);

    return NextResponse.json({
      success: true,
      filename: file.name,
      path: publicUrl,
      url: publicUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
