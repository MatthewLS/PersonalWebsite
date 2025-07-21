import { supabase } from '@/app/lib/supabaseClient';
import { GetImagesResponse } from '@/app/api/get-images/types';
import ImageCard from '@/app/components/ImageCard';

// Move styles to a global CSS file or use <style jsx global>
const floatingStyles = `
@keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
        100% { transform: translateY(0px); }
}
.floating-card {
        animation: float 3s ease-in-out infinite;
        transition: transform 0.3s;
}
.floating-card:hover {
        transform: scale(1.05) translateY(-16px);
        z-index: 10;
}
`;

export const dynamic = 'force-dynamic'; // Optional: ensures SSR

const getImages = async (): Promise<GetImagesResponse[]> => {
        const { data, error } = await supabase
                .from('images')
                .select('*')
                .order('created_at', { ascending: false });

        if (error) {
                // Optionally handle/log error
                return [];
        }
        return data as GetImagesResponse[];
};

const GalleryPage = async () => {
        const images = await getImages();

        return (
                <div className="container mx-auto p-4">
                        <style>{floatingStyles}</style>
                        <h1 className="text-2xl font-bold mb-4">Gallery</h1>
                        <div className="grid grid-cols-3 gap-8">
                                {images.map((image, idx) => (
                                        <div
                                                key={image.id}
                                                className="relative group floating-card p-10"
                                                style={{ animationDelay: `${idx * 0.3}s` }}
                                        >
                                                <ImageCard 
                                                        image={{
                                                                url: image.url,
                                                                alt_text: image.altText,
                                                                camera_model: image.camera_model,
                                                                lens_model: image.lens_model,
                                                                iso: image.iso,
                                                                shutter_speed: image.shutter_speed,
                                                                aperture: image.aperture,
                                                                created_at: image.created_at,
                                                                image_date: image.image_date
                                                        }}
                                                />
                                        </div>
                                ))}
                        </div>
                </div>
        );
}

export default GalleryPage;