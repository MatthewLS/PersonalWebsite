"use client";

import Link from 'next/link';
import { ultra } from '@/app/ui/fonts'
import { motion } from "framer-motion";
import FullscreenNav from "./components/FullscreenNav";
import { getImages } from '@/app/lib/getImage'
import Image from 'next/image';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Home() {

  const images = ['/ggbridge.jpg', '/bubbles.jpg', '/buoys.jpg'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <div className="flex items-top justify-center w-full h-screen pd-20">
        {images.map((img, index) => (
          <Image
            key={img}
            src={img}
            alt="Background"
            fill
            style={{
              objectFit: 'fill',
              objectPosition: 'center',
              zIndex: 0,
              opacity: currentIndex === index ? 1 : 0,
              transition: 'all 4s ease-in-out',
            }}
            quality={100}
            priority={index === 0}
          />
        ))}
        <Link href='/gallery' style={{ zIndex: 1 }}>
          <h1 className={`text-[3rem] ${ultra.className} text-center gradientText mt-40 leading-none`}>
            Respectful Mother
          </h1>
        </Link>
      </div>
    </div>
  );
}
