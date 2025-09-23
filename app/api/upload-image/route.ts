import { createHandler } from './handler';
import { NextRequest, NextResponse } from 'next/server';
import vercelUploader from './vercelUploader';
import uploadDbImageEntry from './uploadDbImageEntry';
import uploadDbImageTags from './uploadDbImageTags';

export async function POST(req: NextRequest) {
  const handler = createHandler({
    blobUploader: vercelUploader,
    dbImageEntryUploader: uploadDbImageEntry,
    dbImageTagsUploader: uploadDbImageTags
  });

  return handler(req);
}