import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer';


type ExifData = {
  latitude?: number;
  longitude?: number;
  DateTimeOriginal?: string;
  Model?: string;
  LensModel?: string;
  ISO?: number;
  ExposureTime?: number
};

type Dependencies = {
  exifParser: (buffer: Buffer) => Promise<ExifData>;
  uploader: (filename: string, buffer: Buffer) => Promise<string>;
  db: {
    insert: (entry: Record<string, any>) => Promise<{data: any; error: any}>;
  };
};

export function createHandler({ exifParser, uploader, db }: Dependencies) {
  return async function handler(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const alt_text = formData.get('alt_text') as string;

    if (!file || !alt_text) {
      return NextResponse.json({ error: 'Missing file or alt_text' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const exifData = await exifParser(buffer);
    const url = await uploader(file.name, buffer);

    const dbEntry = {
      alt_text,
      url,
      latitude: exifData?.latitude ?? null,
      longitude: exifData?.longitude ?? null,
      date: exifData?.DateTimeOriginal ?? null,
      camera_model: exifData?.Model ?? null,
      lens_model: exifData?.LensModel ?? null,
      iso: exifData?.ISO ?? null,
      shutter_speed: exifData?.ExposureTime ?? null,
    };

    const { data, error } = await db.insert(dbEntry);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save photo to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, photo: dbEntry });
  };
}
