
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { GetImagesResponse } from '@/app/api/get-images/types';
import ImageCard from '@/app/components/ImageCard';

const GalleryPage = () => {
    const [images, setImages] = useState<GetImagesResponse[]>([]);
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data, error } = await supabase
                    .from('images')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setImages(data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    })


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gallery</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="relative group">
                        <ImageCard 
                            image={{
                                url: image.url,
                                alt_text: image.altText || 'No description',
                                camera_model: image.camera_model,
                                lens_model: image.lens_model,
                                latitude: image.latitude,
                                longitude: image.longitude,
                                iso: image.iso,
                                shutter_speed: image.shutter_speed,
                                aperture: image.aperture,
                                created_at: image.created_at,
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <p>{image.altText || 'No description'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GalleryPage;