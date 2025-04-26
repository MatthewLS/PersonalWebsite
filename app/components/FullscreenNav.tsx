"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FullscreenNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Button to Open/Close Menu */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-20 px-4 py-2 bg-white text-black rounded-lg"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Fullscreen Overlay */}
      <motion.div
        initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
        animate={{
          opacity: isOpen ? 1 : 0,
          clipPath: isOpen
            ? "circle(100% at 50% 50%)"
            : "circle(0% at 50% 50%)",
        }}
        transition={{ duration: 0.8 }}
        className={`fixed inset-0 bg-black text-white z-10 flex flex-col items-center justify-center ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <nav className="space-y-6 text-center">
          <a href="#gallery" className="text-3xl font-bold hover:underline">
            Gallery
          </a>
          <a href="#blog" className="text-3xl font-bold hover:underline">
            Blog
          </a>
          <a href="#stream" className="text-3xl font-bold hover:underline">
            Live Stream
          </a>
        </nav>
      </motion.div>
    </div>
  );
}
