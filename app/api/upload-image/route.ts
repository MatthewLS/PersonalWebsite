import { NextRequest, NextResponse } from 'next/server';
import * as exifr from 'exifr';
import { put } from '@vercel/blob'; // if you're using Vercel Blob SDK

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const title = formData.get('title') as string;

  if (!file || !title) {
    return NextResponse.json({ error: 'Missing file or title' }, { status: 400 });
  }

  // Read the file into a buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract EXIF metadata
  const exifData = await exifr.parse(buffer, { gps: true });

  console.log('EXIF data:', exifData);

  // Safe defaults
  let latitude: number | null = null;
  let longitude: number | null = null;

  if (exifData?.latitude && exifData?.longitude) {
    latitude = exifData.latitude;
    longitude = exifData.longitude;
  }

  // Upload to Vercel Blob Storage
  const blob = await put(file.name, buffer, {
    access: 'public', // or 'private' depending on your use
  });

  // Save to your database
  const dbEntry = {
    title,
    imageUrl: blob.url,
    latitude,
    longitude,
    uploadDate: new Date().toISOString(),
    // you could also save camera model, etc, if you want:
    cameraModel: exifData?.Model || null,
    shutterSpeed: exifData?.ExposureTime ? `${exifData.ExposureTime}s` : null,
  };

  // TODO: Insert `dbEntry` into your DB here (e.g., Prisma, Drizzle, etc.)

  return NextResponse.json({ success: true, photo: dbEntry });
}
