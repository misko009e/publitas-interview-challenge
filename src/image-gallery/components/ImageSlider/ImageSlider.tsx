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

  // Calculate total width of all images maintaining aspect ratios
  const calculateTotalWidth = useCallback(() => {
    if (loadedImages.length === 0) return 0;

    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const imageHeight = canvas.height;
    return loadedImages.reduce((totalWidth, img) => {
      const aspectRatio = img.width / img.height;
      const imageWidth = imageHeight * aspectRatio;
      return totalWidth + imageWidth;
    }, 0);
  }, [loadedImages]);

  // Render images on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loadedImages.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to fit container
    const container = canvas.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate total width needed for all images
    const imageHeight = canvas.height;
    const totalWidth = calculateTotalWidth();

    // Constrain scroll offset to valid range
    const maxScrollOffset = Math.max(0, totalWidth - canvas.width);
    const constrainedScrollOffset = Math.max(0, Math.min(maxScrollOffset, scrollOffset));

    // Update scroll offset if it was constrained
    if (constrainedScrollOffset !== scrollOffset) {
      setScrollOffset(constrainedScrollOffset);
      return; // Re-render will happen with correct offset
    }

    let currentX = -constrainedScrollOffset;

    // Draw each image side by side maintaining aspect ratios
    loadedImages.forEach((img) => {
      const aspectRatio = img.width / img.height;
      const imageWidth = imageHeight * aspectRatio;

      // Only draw if image is visible in current viewport
      if (currentX + imageWidth > 0 && currentX < canvas.width) {
        ctx.drawImage(img, currentX, 0, imageWidth, imageHeight);
      }

      currentX += imageWidth;
    });
  }, [loadedImages, scrollOffset, calculateTotalWidth]);

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      scrollLeft: scrollOffset,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const newScrollOffset = dragStart.scrollLeft - deltaX;
    setScrollOffset(newScrollOffset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

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
