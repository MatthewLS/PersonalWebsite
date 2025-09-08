// components/GalleryInfinite.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ImageCard from '@/app/components/ImageCard';
import { getImages } from '@/app/lib/getImage'
import { GetImagesResponse } from '@/app/api/get-images/types';

const LIMIT = 5;

export default function InfiniteGallery() {
  const [images, setImages] = useState<GetImagesResponse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Fetch images when page changes
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const newImages = await getImages(page, LIMIT);

      if (newImages.length < LIMIT) {
        setHasMore(false);
      }

      setImages(prev => [...prev, ...newImages]);
      setLoading(false);
    };

    fetchImages();
  }, [page]);

  // IntersectionObserver to trigger "load more"
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, hasMore]);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 justify-items-center">
      {images.map((image, idx) => (
        <div key={image.id} className="p-4 flex justify-center">
          <Link
            href={`/photo/${image.id}`}
            shallow
            className="no-underline"
            passHref
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
                width: 500,
                height: 500,
                loadingPriority: idx < 6 ? 'eager' : 'lazy'
              }}
            />
          </Link>
        </div>
      ))}
      {hasMore && (
        <div ref={loaderRef} className="h-10 flex items-center justify-center col-span-full">
          {loading && <p>Loading...</p>}
        </div>
      )}
    </section>
  );
}
