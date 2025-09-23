import { supabase } from '@/app/lib/supabaseClient';
import Image from 'next/image';

async function getImageUrl(id: string): Promise<string> {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching image:', error);
    return '';
  }

  return data.url
}


export default async function ImagePage({ params }: { params: Promise<{ id: string }> }) {
  const imageId = (await params).id;
  const imageUrl = await getImageUrl(imageId);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Image
        src={imageUrl}
        alt={`Photo ${imageId}`}
        fill
        style={{ objectFit: 'contain' }}
        sizes="90vw"
      />
    </div>
  );
}
