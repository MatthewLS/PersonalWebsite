import {supabase} from '@/app/lib/supabaseClient';

export interface ArticleImage {
  imageId: string;
  // Add other properties as needed
}

export interface ArticleImagesResponse {
  article_images: ArticleImage[];
}

// obtain supabase image url's, coupled with their associated articleID
export async function GET(request) {
  try {
    // Fetch articles along with their primary image and excerpt
    const { data: articles, error } = await supabase
      .from('article_images')
      .select('*')
      .eq('position', 1)
      .limit(50)

    if (error) {
      console.error('Supabase error:', error.message, error.details);
      throw error;
    }

    const transformedData = articles.map(article => ({
      articleId: article.article_id,  // Renaming `article_id` to `articleId`
      imageId: article.image_id,      // Renaming `image_id` to `imageId`
    }));
    console.log("TRANSFORMED DATA:", transformedData);

    return new Response(JSON.stringify({ article_images: transformedData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching articles:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
