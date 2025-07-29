"use client";

import Link from 'next/link';
import { ultra } from '@/app/ui/fonts'
import { motion } from "framer-motion";
import FullscreenNav from "./components/FullscreenNav";

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black text-white">
      <FullscreenNav />
      <main className="flex items-center justify-center w-full h-screen {}}">
        <Link href='/gallery'>
          <h1 className={`text-9xl ${ultra.className} text-center gradientText`}>
            Respectful Mother
          </h1>
        </Link>
      </main>
    </div>
  );
};
