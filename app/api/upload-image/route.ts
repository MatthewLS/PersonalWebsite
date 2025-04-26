import { NextRequest, NextResponse } from 'next/server';
import * as exifr from 'exifr';
import { put } from '@vercel/blob'; // if you're using Vercel Blob SDK
import { supabase } from '@/app/lib/supabaseClient';

const folder = process.env.VERCEL_ENV === 'development' ? '' : 'prod-uploads';

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

  const blob = await put(`${folder}/${file.name}`, buffer, {
    access: 'public',
  });

  const dbEntry = {
    alt_text: alt_text,
    url: blob.url,
    latitude: exifData?.latitude ?? null,
    longitude: exifData?.longitude ?? null,
    date: exifData?.DateTimeOriginal ?? null,
    camera_model: exifData?.Model ?? null,
    lens_model: exifData?.LensModel ?? null,
    iso: exifData?.ISO ?? null,
    shutter_speed: exifData?.ExposureTime ?? null,
  };

  // TODO: Insert `dbEntry` into your DB here (e.g., Prisma, Drizzle, etc.)
  const { data, error } = await supabase
      .from('images')   // << Your table name
      .insert(dbEntry)

  if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save photo to database' }, { status: 500 });
    }

  return NextResponse.json({ success: true, photo: dbEntry });
}
