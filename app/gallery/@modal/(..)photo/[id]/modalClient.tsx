'use client';

import { useEffect, useState, useRef } from 'react';
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
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000 }}>
      <div style={{ position: 'relative', width: '90vw', height: '90vh', margin: 'auto', top: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          src={imageUrl}
          alt={`Photo ${imageUrl}`}
          fill
          style={{ objectFit: 'contain' }}
          sizes="90vw"
        />
        <button
          onClick={onDismiss}
          className="close-button"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 40,
            height: 40,
            cursor: 'pointer',
            fontSize: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>,
    modalRoot
  );
}
