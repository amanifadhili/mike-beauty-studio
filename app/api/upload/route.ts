import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/auth';


export async function POST(req: NextRequest) {
  // Ensure the user is authenticated before allowing uploads
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WebP, GIF, MP4, and WebM are allowed.' }, { status: 400 });
    }

    // Validate file size (max 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum file size is 25MB.' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Automated SEO Image Renaming
    // Instead of forcing the user to rename IMG_1234.jpg, we intercept all uploads 
    // and physically rename them to targeted local search queries on the CDN server.
    const seoKeywords = [
      'luxury-lash-extensions-kigali', 
      'classic-volume-lashes-rwanda', 
      'mike-beauty-studio-lashes', 
      'professional-eyelash-extensions-kigali', 
      'best-lash-salon-kigali',
      'hybrid-lash-specialist-kigali'
    ];
    const randomKeyword = seoKeywords[Math.floor(Math.random() * seoKeywords.length)];
    const uniqueSuffix = Date.now().toString(36).substring(3, 8); // e.g. "l7xyz"
    const optimizedPublicId = `${randomKeyword}-${uniqueSuffix}`;

    // Upload directly to Cloudinary using a stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'mike-beauty-studio',
          resource_type: 'auto',
          public_id: optimizedPublicId, // Forces the highly ranking URL path
        },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    }) as any;

    const mediaType = file.type.startsWith('video') ? 'video' : 'image';

    return NextResponse.json({ url: result.secure_url, type: mediaType }, { status: 200 });

  } catch (error) {
    console.error('[upload] Error handling file upload:', error);
    return NextResponse.json({ error: 'Failed to upload file. Please try again.' }, { status: 500 });
  }
}
