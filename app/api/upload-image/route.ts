import { NextRequest, NextResponse } from 'next/server';
import * as exifr from 'exifr';
import { put, PutBlobResult } from '@vercel/blob'; // if you're using Vercel Blob SDK
import { supabase } from '@/app/lib/supabaseClient';

const folder = process.env.VERCEL_ENV === 'development' ? '' : 'prod-uploads';

export async function POST(req: NextRequest) {
  console.log("POST /api/upload-image called");

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const alt_text = formData.get('alt_text') as string;
  const latitude = formData.get('latitude') as string;
  const longitude = formData.get('longitude') as string;
  const cameraModel = formData.get('cameraModel') as string;
  const lensModel = formData.get('lensModel') as string;
  const shutterSpeed = formData.get('shutterSpeed') as string;
  const iso = formData.get('iso') as string;
  const aperture = formData.get('aperture') as string;
  const date = formData.get('date') as string; // ISO format
  console.log("formData: ", formData);
  if (!file || !alt_text) {
    console.log("Missing file or alt_text");
    return NextResponse.json({ error: 'Missing file or alt_text' }, { status: 400 });
  }

  // Read the file into a buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  var blob: PutBlobResult | null = null;
  try {
  blob = await put(`${folder}/${file.name}`, buffer, {
    access: 'public',
  });
  console.log('Upload successful:', blob);
} catch (error) {
  console.error('Error uploading file:', error);
}

  console.log("blob upload result: ", blob);

  const dbEntry = {
    alt_text: alt_text,
    url: blob?.url ?? null,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    date: date ?? null,
    camera_model: cameraModel ?? null,
    lens_model: lensModel ?? null,
    iso: iso ?? null,
    shutter_speed: shutterSpeed ?? null,
    aperture: aperture ?? null,
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
