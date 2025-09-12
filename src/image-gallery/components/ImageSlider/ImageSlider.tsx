import './ImageSlider.scss';

import type { ImageData } from '@image-gallery/models';
import { Spinner } from '@shared/components';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ImageSliderProps {
  images: ImageData[];
  loading: boolean;
}

export function ImageSlider({ images, loading }: ImageSliderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);

  // Load images when images prop changes
  useEffect(() => {
    if (images.length === 0) return;

    const loadImages = async () => {
      const imagePromises = images.map((imageData) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = imageData.url;
        });
      });

      try {
        const loadedImgs = await Promise.all(imagePromises);
        setLoadedImages(loadedImgs);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, [images]);

  const calculateTotalWidth = useCallback(() => {
    if (loadedImages.length === 0) return 0;

    const canvas = canvasRef.current;
    if (!canvas) return 0;

    return loadedImages.length * canvas.width;
  }, [loadedImages]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loadedImages.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const totalWidth = calculateTotalWidth();
    const maxScrollOffset = Math.max(0, totalWidth - canvas.width);
    const constrainedScrollOffset = Math.max(0, Math.min(maxScrollOffset, scrollOffset));

    if (constrainedScrollOffset !== scrollOffset) {
      setScrollOffset(constrainedScrollOffset);
      return;
    }

    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let imageStripX = 0;

    loadedImages.forEach((img) => {
      const actualWidth = img.naturalWidth;
      const actualHeight = img.naturalHeight;

      const widthScale = canvas.width / actualWidth;
      const heightScale = canvas.height / actualHeight;
      const scale = Math.min(widthScale, heightScale);

      const finalScaledWidth = actualWidth * scale;
      const finalScaledHeight = actualHeight * scale;

      const cellStartOnCanvasX = imageStripX - constrainedScrollOffset;
      const drawX = cellStartOnCanvasX + (canvas.width - finalScaledWidth) / 2;
      const drawY = (canvas.height - finalScaledHeight) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        actualWidth,
        actualHeight,
        drawX,
        drawY,
        finalScaledWidth,
        finalScaledHeight,
      );

      imageStripX += canvas.width;
    });
  }, [loadedImages, scrollOffset, calculateTotalWidth]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        scrollLeft: scrollOffset,
      });
    },
    [scrollOffset],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const newScrollOffset = dragStart.scrollLeft - deltaX;
      setScrollOffset(newScrollOffset);
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className={`image-slider ${loading ? 'loading' : ''}`}>
      {loading ? (
        <Spinner />
      ) : (
        <div className="content">
          <canvas
            ref={canvasRef}
            className="image-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          />
        </div>
      )}
    </div>
  );
}
