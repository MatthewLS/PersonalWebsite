"use client";

import Link from 'next/link';
import { ultra } from '@/app/ui/fonts'
import { motion } from "framer-motion";
import FullscreenNav from "./components/FullscreenNav";

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black text-white ultra">
      <FullscreenNav />
      <main className="flex items-center justify-center w-full h-screen animate-gradient-text">
        <Link href='/gallery' className={`${ultra.className} text-10xl `}>Respectful Mother</Link>
      </main>
    </div>
  );
};
