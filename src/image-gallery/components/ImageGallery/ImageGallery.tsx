import './ImageGallery.scss';

import { ImageSlider } from '@image-gallery/components/ImageSlider/ImageSlider';
import type { ImageData } from '@image-gallery/models';
import { imageService } from '@image-gallery/services';
import { useEffect, useState } from 'react';

// ImageGallery component that fetches and displays a collection of images.
// The entire image gallery functionality might be its own reusable library,
// but here we use it like so for simplicity
export function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // In a real application, we could implement nice UX with classier loading spinners,
        // skeleton screens, or progress indicators instead of simple text
        setLoading(true);
        const fetchedImages = await imageService.getImages();
        setImages(fetchedImages.items);
      } catch (err) {
        // In a real application, error handling would typically be centralized
        // through error boundaries, global error services, or service-level handling
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>Publitas Frontend Code Challenge</h1>
      </header>
      <main className="gallery-content">
        <div className="image-slider-container">
          <ImageSlider images={images} loading={loading} />
        </div>
      </main>
      <footer className="gallery-footer">
        <div className="image-slider-hint">
          <p>Drag to change image</p>
        </div>
      </footer>
    </div>
  );
}
