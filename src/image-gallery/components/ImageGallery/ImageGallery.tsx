import './ImageGallery.scss';

import { ImageSlider } from '@image-gallery/components/ImageSlider/ImageSlider';
import type { ImageData } from '@image-gallery/models';
import { imageService } from '@image-gallery/services';
import { useEffect, useState } from 'react';

/**
 * ImageGallery - Main container component for the image gallery application
 *
 * This component serves as the "smart" container that handles data fetching and
 * state management for the image gallery. It fetches image data from the service
 * layer and passes it down to the ImageSlider component for rendering.
 *
 * Features:
 * - Fetches image data from the image service
 * - Manages loading state during data fetching
 * - Provides complete page layout with header, content, and footer
 * - Handles error states (currently logged to console)
 * - Acts as the main entry point for the gallery functionality
 *
 * Architecture:
 * This follows the container/presentational pattern where ImageGallery handles
 * business logic and data fetching, while ImageSlider focuses purely on
 * presentation and user interaction.
 */
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
