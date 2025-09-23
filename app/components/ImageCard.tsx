'use client';
import React, { useState } from 'react';
import Image from 'next/image';

import { Database } from '@/app/types/supabase';
type ImageRow = Database['public']['Tables']['images']['Row'];

type DisplayConfig = {
  width: number;
  height: number;
  loadingPriority: 'lazy' | 'eager';
};

type ImageCardProps = {
  image: ImageRow;
  displayConfig: DisplayConfig;
};

const ImageCard: React.FC<ImageCardProps> = ({ image, displayConfig }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className=""
      style={{
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.15)' : 'none',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={image.url}
        alt={image.alt_text || ''}
        width={displayConfig.width}
        height={displayConfig.height}
        className="w-auto h-auto max-w-full max-h-[80vh] block"
        sizes="(max-width: 768px) 90vw, 800px"
        loading={displayConfig.loadingPriority}
      />
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '12px',
            fontSize: 14,
          }}
        >
          {image.alt_text && <div><strong>{image.alt_text}</strong></div>}
          {image.camera_model && <div><strong>Camera Model:</strong> {image.camera_model}</div>}
          {image.lens_model && <div><strong>Lens Model:</strong> {image.lens_model}</div>}
          {image.latitude !== undefined && <div><strong>Latitude:</strong> {image.latitude}</div>}
          {image.longitude !== undefined && <div><strong>Longitude:</strong> {image.longitude}</div>}
          {image.iso !== undefined && <div><strong>ISO:</strong> {image.iso}</div>}
          {image.shutter_speed && <div><strong>Shutter Speed:</strong> {image.shutter_speed}</div>}
          {image.aperture && <div><strong>Aperture:</strong> {image.aperture}</div>}
          {image.image_date && <div><strong>Image Date:</strong> {new Date(image.image_date).toISOString().slice(0, 10)}</div>}
        </div>
      )}
    </div>
  );
};

export default ImageCard;
