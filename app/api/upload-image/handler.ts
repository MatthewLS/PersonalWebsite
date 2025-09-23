import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/app/types/supabase';
import { PostgrestError } from "@supabase/supabase-js";
import { upload } from '@vercel/blob/client';
type ImageRow = Database['public']['Tables']['images']['Row'];

export class BlobUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlobUploadError";
  }
}
export class TagUploadError extends Error {
  error: PostgrestError;
  constructor(message: string, error: PostgrestError) {
    super(message);
    this.name = "TagUploadError";
    this.error = error
  }
}
export class DbEntryUploadError extends Error {
  error: PostgrestError;
  constructor(message: string, error: PostgrestError) {
    super(message);
    this.name = "dbEntryUploadError";
    this.error = error;
  }
}

export type Dependencies = {
  blobUploader: (file: File) => Promise<string>,
  dbImageEntryUploader: (entry: ImageRow) => Promise<string>,
  dbImageTagsUploader: (imageId: string, tags: string[]) => Promise<void>,
};

export function createHandler({ blobUploader, dbImageEntryUploader, dbImageTagsUploader }: Dependencies) {
  return async function handler(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const keywordsJson = formData.get("keywords");

    let keywords: string[] = [];

    if (keywordsJson) {
      try {
        if (typeof keywordsJson === "string") {
          keywords = JSON.parse(keywordsJson); // now it's an array
        } else {
          throw new Error("Expected keywords to be a string");
        }
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid keywords JSON" }), { status: 400 });
      }
    }

    try {
      const url = await blobUploader(file);
      const imageRow = createImageRow(url, formData);
      const id = await dbImageEntryUploader(imageRow);
      await dbImageTagsUploader(id, keywords);
    } catch (error) {
      if (error instanceof BlobUploadError) {
        return NextResponse.json({ success: false, error: error.message }, { status: 501 });
      } else if (error instanceof DbEntryUploadError) {
        return NextResponse.json({ success: false, error: error.message }, { status: 502 });
      } else if (error instanceof TagUploadError) {
        return NextResponse.json({ success: false, error: error.message }, { status: 503 });
      } else {
        return NextResponse.json({ success: false, error: 'Unknown error occurred' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });


    function createImageRow(url: string, formData: FormData): ImageRow {
      const alt_text = formData.get('alt_text') as string;
      const latitude = formData.get('latitude') as string;
      const longitude = formData.get('longitude') as string;
      const cameraModel = formData.get('cameraModel') as string;
      const lensModel = formData.get('lensModel') as string;
      const shutterSpeed = formData.get('shutterSpeed') as string;
      const iso = formData.get('iso') as string;
      const apertureStr = formData.get('aperture') as string;
      const aperture = apertureStr ? parseFloat(apertureStr) : null;
      const image_date = formData.get('image_date') as string;
      const id = formData.get('id') as string;
      const upload_date = formData.get('upload_date') as string;

      return {
        id: id,
        upload_date: upload_date,
        url,
        alt_text: alt_text || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        camera_model: cameraModel || null,
        lens_model: lensModel || null,
        shutter_speed: shutterSpeed || null,
        iso: iso ? parseInt(iso) : null,
        aperture: aperture || null,
        image_date: image_date || null,
      };
    }
  };



}
