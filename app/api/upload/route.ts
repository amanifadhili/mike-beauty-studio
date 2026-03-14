import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
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

    // Build the upload directory path (inside public/ so Next.js can serve it)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Create a unique filename to prevent overwrites
    const ext = path.extname(file.name);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const fullPath = path.join(uploadDir, uniqueName);

    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(fullPath, buffer);

    // Return the public URL for the saved file
    const publicUrl = `/uploads/${uniqueName}`;
    const mediaType = file.type.startsWith('video') ? 'video' : 'image';

    return NextResponse.json({ url: publicUrl, type: mediaType }, { status: 200 });

  } catch (error) {
    console.error('[upload] Error handling file upload:', error);
    return NextResponse.json({ error: 'Failed to upload file. Please try again.' }, { status: 500 });
  }
}
