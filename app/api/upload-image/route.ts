import { createHandler } from './handler';
import { put } from '@vercel/blob';
import * as exifr from 'exifr';
import { supabase } from '@/app/lib/supabaseClient';

type ImageEntry = {
  alt_text: string;
  url: string;
  latitude: number | null;
  longitude: number | null;
  date: string | null;
  camera_model: string | null;
  lens_model: string | null;
  iso: number | null;
  shutter_speed: number | null;
};

const uploader = async (filename: string, buffer: Buffer) => {
  const blob = await put(`images/${filename}`, buffer, { access: 'public' });
  return blob.url;
};

const db = {
  insert: (entry: ImageEntry) => supabase.from('images').insert(entry),
};

export const POST = createHandler({
  exifParser: (buffer) => exifr.parse(buffer, { gps: true }),
  uploader,
  db,
});
