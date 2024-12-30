// app/api/list-blobs/
import { list } from '@vercel/blob';

export async function GET() {
  console.log("Server-side log: API route hit!");
  try {
    const { blobs } = await list();
    const urls = blobs.map(blob => blob.url); // Extract public URLs from blobs
    console.log("urls: " + urls)
    return new Response(JSON.stringify({ urls }), { status: 200 });
  } catch (error) {
    console.error('Error listing blobs:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch blob list' }), { status: 500 });
  }
}
