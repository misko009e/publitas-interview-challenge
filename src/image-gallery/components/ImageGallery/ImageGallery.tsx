import './ImageGallery.scss';

import { useEffect, useState } from 'react';

import { Spinner } from '../../../shared';
import type { ImageData } from '../../models';
import { imageService } from '../../services';
import { ImageSlider } from '../ImageSlider/ImageSlider';

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
      <header className="gallery-title">
        <h1>Publitas Image Gallery</h1>
      </header>
      <main className="gallery-content">
        {loading && <Spinner />}
        {!loading && (
          <div>
            <ImageSlider images={images} />
          </div>
        )}
      </main>
    </div>
  );
}
