import { supabase } from '@/app/lib/supabaseClient';
import { GetImagesResponse } from '@/app/api/get-images/types';
import ImageCard from '@/app/components/ImageCard';
import Link from 'next/link';

type Props = {
  searchParams?: Promise<{ page?: string }>;
};

const getImages = async (page: number = 1, limit: number = 12): Promise<GetImagesResponse[]> => {
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

// ✅ This is the correct Server Component signature
const GalleryPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = parseInt(params?.page || '1');
  const limit = 15;
  const images = await getImages();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gallery</h1>

      <div className="grid grid-cols-3 gap-8">
        {images.map((image, idx) => (
          <div
            key={image.id}
            className="relative group floating-card p-10"
            style={{ animationDelay: `${idx * 0.3}s` }}
          >
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
                maxWidth: 300,
                maxHeight: 200,
                loadingPriority: idx < 6 ? 'eager' : 'lazy'
              }}
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-10 flex justify-center gap-4">
        {page > 1 && (
          <Link
            href={`?page=${page - 1}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </Link>
        )}
        {images.length === limit && (
          <Link
            href={`?page=${page + 1}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
