import './ImageGallery.scss';

import { ImageSlider } from '../ImageSlider/ImageSlider';

export function ImageGallery() {
  return (
    <div className="gallery-page">
      <header className="gallery-title">
        <h1>Publitas Image Gallery</h1>
      </header>
      <main className="gallery-content">
        <ImageSlider />
      </main>
    </div>
  );
}
