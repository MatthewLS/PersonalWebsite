'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Blog = () => {
  const [images, setImages] = useState([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [proximities, setProximities] = useState({});

  useEffect(() => {
  let animationFrameId;

  const handleMouseMove = (e) => {
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


  useEffect(() => {
    async function fetchImages() {
      const res = await fetch('/api/list-blobs');
      const data = await res.json();

      if (data.urls) {
        setImages(data.urls);
      } else {
        console.error('Failed to fetch blob list:', data.error);
      }
    }
    fetchImages();
  }, []);

  const calculateProximityEffect = (x, y, element) => {
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
      {images.map((url, index) => {
        const proximity = proximities[index] || 0;
        console.log("proximity for index " + index + ": " + proximity);
        return (
          <Link
            key={index}
            href={`/post${index + 1}`} // Adjust your post URL structure if needed
            className="relative group transform transition-all duration-500"
          >
            <div
              id={`image-${index}`}
              className="floating-image"
            >
              <Image
                src={url}
                width={500}
                height={500}
                alt={`Post ${index + 1}`}
                className="transition-all duration-500 w-64 h-64 object-cover rounded-xl shadow-lg"
                style={{
                transform: `translateY(-${calculateProximityEffect(
                  cursorPos.x,
                  cursorPos.y,
                  document.getElementById(`image-${index}`)
                ) * 10}px) scale(${1 + calculateProximityEffect(
                  cursorPos.x,
                  cursorPos.y,
                  document.getElementById(`image-${index}`)
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
          0%, 100% {
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
