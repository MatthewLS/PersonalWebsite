import { supabase } from '@/app/lib/supabaseClient';
import {ArticleImage, ArticleImagesResponse } from '@/app/api/article-images/types';

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

    // Transform the data to match the desired response format
    const transformedData: ArticleImage[] = (articles || []).map(article => ({
      articleId: article.article_id,  // Renaming `article_id` to `articleId`
      imageId: article.image_id,      // Renaming `image_id` to `imageId`
    }));

    console.log("TRANSFORMED DATA:", transformedData);

    return new Response(JSON.stringify({ article_images: transformedData }), {
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
