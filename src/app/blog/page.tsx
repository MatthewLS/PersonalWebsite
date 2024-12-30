'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Blog = () => {
	const [images, setImages] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-wrap justify-center items-center p-10">
      {images.map((url, index) => (
        <Link
          key={index}
          href={`/post${index + 1}`} // Adjust your post URL structure if needed
          className="relative group transform hover:scale-110 hover:translate-y-[-10px] transition-all duration-300"
        >
          <Image
            src={url}
            width={500}
            height={500}
            alt={`Post ${index + 1}`}
            className="transition-all duration-500 group-hover w-64 h-64 object-cover rounded-xl shadow-lg group-hover:shadow-2xl"
          />
        </Link>
      ))}
    </div>
  );
};

export default Blog;
