'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabaseClient';
import { ArticleImage, ArticleImagesResponse } from '@/app/api/article-images/types';
import { GetImagesResponse } from '@/app/api/get-images/types';

interface CursorPosition {
  x: number;
  y: number;
}

interface ImageMap {
  [imageId: string]: {
    articleId: string;
    imageUrl: string;
    altText: string;
    slug: string;
  };
}

const Blog: React.FC = () => {
  const [imageMap, setImageMap] = useState<ImageMap>({}); // Initialize as an object, not an array
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 }); // Mouse cursor position
  const [animationDelays, setAnimationDelays] = useState<number[]>([]); // Animation delays for images

  useEffect(() => {
    const fetchArticlesData = async (): Promise<void> => {
      try {
        // Fetch imageID of all images in position 1
        const response = await fetch('/api/article-images');
        if (!response.ok) throw new Error('Failed to fetch articles');

        const imageMapTemp: ImageMap = {}; // Temporary map to hold the data
        const articleImagesResponse: ArticleImagesResponse = await response.json();
        
        // Populate imageMapTemp with initial articleImage data
        articleImagesResponse.articleImages.forEach((articleImage) => {
          if (articleImage.imageId) {
            imageMapTemp[articleImage.imageId] = {
              articleId: articleImage.articleId,
              imageUrl: '',
              altText: '',
              slug: '',
            };
          }
        });

        const query = new URLSearchParams({
          ids: articleImagesResponse.articleImages
            .map((image: ArticleImage) => image.imageId)
            .join(','),
        }).toString();

        console.log('Query:', query);

        // Fetch images using the constructed query
        const imagesResponse = await fetch(`/api/get-images?${query}`);
        if (!imagesResponse.ok) throw new Error('Failed to fetch images');

        // Parse the imagesResponse JSON
        const imagesData: { images: GetImagesResponse[] } = await imagesResponse.json();

        imagesData.images.forEach((image) => {
          console.log("image: ", image);
        })
        

        // Update imageMapTemp with the fetched image data
        imagesData.images.forEach((image) => {
          if (imageMapTemp[image.id]) {
            imageMapTemp[image.id] = {
              ...imageMapTemp[image.id],
              imageUrl: image.url,
              altText: image.altText,
            };
          }
        });

        // Update state with the final imageMap
        setImageMap(imageMapTemp); // Update the imageMap state
      } catch (err) {
        console.error('Error fetching articles:', err);
      }
    };

    fetchArticlesData();
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent): void => {
      animationFrameId = requestAnimationFrame(() => {
        setCursorPos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const calculateProximityEffect = (x: number, y: number, element: HTMLElement | null): number => {
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const elementCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const distance = Math.hypot(x - elementCenter.x, y - elementCenter.y);
    const maxDistance = 600; // Customize the sensitivity
    const proximity = Math.max(0, 1 - distance / maxDistance);
    return proximity;
  };

  return (
    <div className="min-h-screen flex flex-wrap justify-center items-center p-10 gap-12">
      {Object.values(imageMap).map((imageData, index) => {
        const elementId = `image-${index}`;
        return (
          <Link
            key={index}
            href={`/post${index + 1}`} // Adjust your post URL structure if needed
            className="relative group transform transition-all duration-500"
          >
            <div
              id={elementId}
              className="floating-image"
              style={{ animationDelay: `${animationDelays[index]}s` }} // Apply the random delay
            >
              <Image
                src={imageData.imageUrl} // Use the slug or another appropriate field for the image URL
                width={500}
                height={500}
                alt={imageData.altText || `Post ${index + 1}`}
                className="transition-all duration-500 w-64 h-64 object-cover rounded-xl shadow-lg"
                style={{
                  transform: `translateY(-${calculateProximityEffect(
                    cursorPos.x,
                    cursorPos.y,
                    document.getElementById(elementId)
                  ) * 10}px) scale(${1 + calculateProximityEffect(
                    cursorPos.x,
                    cursorPos.y,
                    document.getElementById(elementId)
                  ) * 0.25})`,
                }}
              />
            </div>
          </Link>
        );
      })}
      <style jsx>{`
        .floating-image {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
};

export default Blog;
