import { supabase } from '@/app/lib/supabaseClient';
import { GetImagesResponse } from '@/app/api/get-images/types';

async function getImageUrl(imageId: string): Promise<string> {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('id', imageId)
    .single();

  if (error) {
    console.error('Error fetching image:', error);
    return '';
  }

  return (data as GetImagesResponse).url
}


export default async function ImagePage({ params }: { params: Promise<{ imageId: string }> }) {
  const imageId = (await params).imageId;
  const imageUrl = await getImageUrl(imageId);

  return (
    <div>
      <img src={imageUrl} alt="" />
    </div>
  );
}
