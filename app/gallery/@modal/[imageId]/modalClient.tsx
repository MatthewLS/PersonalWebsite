"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ModalClient({ imageUrl }: { imageUrl: string }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-[90%] max-h-[90%] overflow-hidden">
        <Image src={imageUrl} alt="" className="max-h-full max-w-full" />
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
