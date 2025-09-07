'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export default function Modal({ imageUrl }: { imageUrl: string }) {
  const router = useRouter();
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
    console.log("set modalRoot!")
  }, []);

  function onDismiss() {
    router.back();
  }

  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-backdrop">
      <Image
        src={imageUrl}
        alt={`Photo ${imageUrl}`}
        fill
        style={{ objectFit: 'contain' }}
        sizes="90vw"
      />
      <button onClick={onDismiss} className="close-button" />
    </div>,
    document.getElementById('modal-root')!
  );
}
