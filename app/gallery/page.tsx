import { supabase } from '@/app/lib/supabaseClient';
import { GetImagesResponse } from '@/app/api/get-images/types';
import ImageCard from '@/app/components/ImageCard';
import Link from 'next/link';

type Props = {
  searchParams?: Promise<{ page?: string }>;
};

const getImages = async (page: number = 1, limit: number = 10): Promise<GetImagesResponse[]> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('upload_date', { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    return [];
  }
  return data as GetImagesResponse[];
};

const GalleryPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = parseInt(params?.page || '1');
  const limit = 15;
  const images = await getImages();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 justify-items-center">
      {images.map((image, idx) => (
        <div key={image.id} className="p-4 flex justify-center">
          <ImageCard
            image={{
              url: image.url,
              alt_text: image.altText,
              camera_model: image.camera_model,
              lens_model: image.lens_model,
              iso: image.iso,
              shutter_speed: image.shutter_speed,
              aperture: image.aperture,
              upload_date: image.upload_date,
              image_date: image.image_date
            }}
            displayConfig={{
              width: 500,
              height: 500,
              loadingPriority: idx < 6 ? 'eager' : 'lazy'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryPage;
