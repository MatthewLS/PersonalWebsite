import { supabase } from '@/app/lib/supabaseClient';
import { Database } from '@/app/types/supabase';
type ArticleImagesRow = Database['public']['Tables']['article_images']['Insert'];

// obtain supabase image URLs, coupled with their associated articleID
export async function GET(request: Request): Promise<Response> {
  try {
    // Fetch articles along with their primary image and excerpt
    const { data: articles, error } = await supabase
      .from('article_images')
      .select('*')
      .eq('position', 1)
      .limit(50);

    if (error) {
      console.error('Supabase error:', error.message, error.details);
      throw new Error(error.message);
    }

    const transformedData: ArticleImagesRow[] = (articles || []).map(article => ({
      article_id: article.article_id,
      image_id: article.image_id,
    }));

    console.log("TRANSFORMED DATA:", transformedData);

    return new Response(JSON.stringify({ articleImages: transformedData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching articles:', err.message);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.error('Unknown error:', err);
      return new Response(JSON.stringify({ error: 'An unknown error occurred' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
