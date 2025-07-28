'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type ImageData = {
  url: string;
  alt_text?: string;
  camera_model?: string;
  lens_model?: string;
  latitude?: number;
  longitude?: number;
  iso?: number;
  shutter_speed?: string;
  aperture?: string;
  upload_date: string; // ISO date string
  image_date?: string; // ISO date string
};

type DisplayConfig = {
  width: number;
  height: number;
  loadingPriority: 'lazy' | 'eager';
}

type ImageCardProps = {
  image: ImageData;
  displayConfig: DisplayConfig
};

const formatSize = (size?: number) => {
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const ImageCard: React.FC<ImageCardProps> = ({ image, displayConfig }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: 300,
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
        style={{ width: '100%', height: 'auto', display: 'block' }}
        sizes="300px"
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
          {image.alt_text && <div><strong> {image.alt_text}</strong></div>}
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