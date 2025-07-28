'use client';

import Image from 'next/image';
import { useEffect } from 'react';

type Props = {
  imageUrl: string;
  altText?: string;
  onClose: () => void;
};

export default function ImageModal({ imageUrl, altText, onClose }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-3xl"
        >
          &times;
        </button>
        <Image
          src={imageUrl}
          alt={altText || 'Image'}
          width={1200}
          height={800}
          className="rounded-lg w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
