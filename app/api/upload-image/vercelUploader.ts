import { PutBlobResult, put } from "@vercel/blob";
import { BlobUploadError } from "./handler";



/**
 * Uploads a file to Vercel Blob Storage and returns the public URL of the uploaded image.
 *
 * @param file - The file to be uploaded.
 * @returns A promise that resolves to the public URL of the uploaded image.
 * @throws {BlobUploadError} If the upload fails.
 *
 * @example
 * ```typescript
 * const imageUrl = await vercelUploader(file);
 * console.log(imageUrl); // https://<vercel-blob-url>
 * ```
 */
const vercelUploader = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  let blob: PutBlobResult;
  try {
    blob = await put(`Images/${file.name}`, buffer, {
      access: 'public',
    });
    console.log('Upload successful:', blob);
  } catch (error) {
    console.error('Error uploading blob to Vercel:', error);
    throw new BlobUploadError('Failed to upload image to blob storage');
  }
  return blob.url;
};

export default vercelUploader;
