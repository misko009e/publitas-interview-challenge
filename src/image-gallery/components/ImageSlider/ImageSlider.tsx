import './ImageSlider.scss';

import { Spinner } from '../../../shared';
import type { ImageData } from '../../models';

interface ImageSliderProps {
  images: ImageData[];
  loading: boolean;
}

export function ImageSlider({ images, loading }: ImageSliderProps) {
  return (
    <div className={`image-slider ${loading ? 'loading' : ''}`}>
      {loading ? (
        <Spinner />
      ) : (
        <div className="content">
          <pre>{JSON.stringify(images, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
