import { NextRequest, NextResponse } from 'next/server';
import * as exifr from 'exifr';
import { put } from '@vercel/blob'; // if you're using Vercel Blob SDK

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const alt_text = formData.get('alt_text') as string;

  if (!file || !alt_text) {
    return NextResponse.json({ error: 'Missing file or alt_text' }, { status: 400 });
  }

  // Read the file into a buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract EXIF metadata
  const exifData = await exifr.parse(buffer, { gps: true });

  console.log('EXIF data:', exifData);


  // Upload to Vercel Blob Storage
  const blob = await put(file.name, buffer, {
    access: 'public', // or 'private' depending on your use
  });

  // Save to your database
  const dbEntry = {
    alt_text,
    imageUrl: blob.url,
    latitude: exifData?.latitude ?? null,
    longitude: exifData?.longitude ?? null,
    uploadDate: new Date().toISOString(),
    camera_model: exifData?.Model ?? null,
    iso: exifData?.ISO ?? null,
    shutterSpeed: exifData?.ExposureTime ?? null,
  };

  // TODO: Insert `dbEntry` into your DB here (e.g., Prisma, Drizzle, etc.)

  return NextResponse.json({ success: true, photo: dbEntry });
}
