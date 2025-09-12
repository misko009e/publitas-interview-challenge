import type { ImageData } from '../../models';

interface ImageSliderProps {
  images: ImageData[];
}

export function ImageSlider({ images }: ImageSliderProps) {
  return (
    <div>
      <p>Received images:</p>
      <pre>{JSON.stringify(images, null, 2)}</pre>
    </div>
  );
}
