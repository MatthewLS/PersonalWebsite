import { supabase } from '@/app/lib/supabaseClient';
import { GetImagesResponse} from '@/app/api/get-images/types';

// takes image table id's and obtains vercel image urls
export async function GET(request) {
  try {
    // Parse the request URL and extract search params
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids'); // e.g., "1,2,3"

    if (!idsParam) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing "ids" parameter.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate IDs
    const ids = idsParam.split(',')

    // Query Supabase for images
    const { data: images, error } = await supabase
      .from('images')
      .select('url, alt_text, id')
      .in('id', ids);

    console.log('images response: ', images)

    if (error) {
      console.error('Supabase error:', error.message, error.details);
      throw new Error('Database query failed.');
    }

    // Transform the data
    const transformedData: GetImagesResponse[] = images.map(image => ({
      id: image.id,
      url: image.url,
      altText: image.alt_text,
    }));

    console.log("Fetched images:", transformedData);

    // Return the response
    return new Response(
      JSON.stringify({ success: true, images: transformedData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in GET /api/get-images:', error.message);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
