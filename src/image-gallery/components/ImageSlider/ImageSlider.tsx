import './ImageSlider.scss';

import type { ImageData } from '@image-gallery/models';
import { Spinner } from '@shared/components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ImageSliderProps {
  images: ImageData[];
  loading: boolean;
}

/**
 * ImageSlider - A canvas-based horizontal image slider with drag functionality
 *
 * This component renders a collection of images in a horizontal strip that can be
 * dragged left and right to navigate between images. Each image is scaled to fit
 * within the canvas while maintaining its aspect ratio, and is centered within
 * its allocated cell space.
 *
 * Features:
 * - Canvas-based rendering for smooth performance
 * - Horizontal drag scrolling with boundary constraints
 * - Aspect ratio preservation for all image types
 * - Loading state with spinner
 * - Responsive sizing that adapts to container
 *
 * @param images - Array of image data objects containing URLs and metadata
 * @param loading - Boolean indicating if images are currently being loaded
 */
export function ImageSlider({ images, loading }: ImageSliderProps) {
  // Canvas reference for drawing images
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for loaded image elements
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);

  // Drag interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);

  // Load images when images prop changes
  useEffect(() => {
    if (images.length === 0) {
      setLoadedImages([]);
      return;
    }

    // Prevent state updates if component unmounts during loading
    let isCancelled = false;

    const loadImages = async () => {
      // Create promises for each image to load
      const imagePromises = images.map((imageData) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = imageData.url;
        });
      });

      try {
        // Wait for all images to load
        const loadedImgs = await Promise.all(imagePromises);
        if (!isCancelled) {
          setLoadedImages(loadedImgs);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error loading images:', error);
        }
      }
    };

    loadImages();

    // Cleanup function to prevent memory leaks
    return () => {
      isCancelled = true;
    };
  }, [images]);

  // Calculate the total width needed for the entire image strip
  const calculateTotalWidth = useCallback(() => {
    if (loadedImages.length === 0) return 0;

    const canvas = canvasRef.current;
    if (!canvas) return 0;

    // Each image occupies a full canvas-width cell
    return loadedImages.length * canvas.width;
  }, [loadedImages]);

  // Calculate scaling factor to fit image within canvas while preserving aspect ratio
  const calculateImageScale = useCallback((img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const widthScale = canvas.width / img.naturalWidth;
    const heightScale = canvas.height / img.naturalHeight;
    // Use smaller scale to ensure image fits completely within canvas
    return Math.min(widthScale, heightScale);
  }, []);

  // Calculate the final scaled dimensions of an image
  const calculateScaledDimensions = useCallback(
    (img: HTMLImageElement, canvas: HTMLCanvasElement) => {
      const scale = calculateImageScale(img, canvas);
      return {
        width: img.naturalWidth * scale,
        height: img.naturalHeight * scale,
      };
    },
    [calculateImageScale],
  );

  // Calculate where to position an image on the canvas
  const calculateImagePosition = useCallback(
    (
      img: HTMLImageElement,
      canvas: HTMLCanvasElement,
      imageStripX: number,
      scrollOffset: number,
    ) => {
      const scaledDimensions = calculateScaledDimensions(img, canvas);
      // Calculate the start position of this image's cell on the canvas
      const cellStartOnCanvasX = imageStripX - scrollOffset;

      return {
        // Center the image horizontally within its cell
        drawX: cellStartOnCanvasX + (canvas.width - scaledDimensions.width) / 2,
        // Center the image vertically within the canvas
        drawY: (canvas.height - scaledDimensions.height) / 2,
        ...scaledDimensions,
      };
    },
    [calculateScaledDimensions],
  );

  // Main rendering function that draws all images on the canvas
  const renderImages = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || loadedImages.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    // Set canvas size to match its container
    const containerRect = container.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    // Clear the canvas for fresh drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scroll boundaries to prevent over-scrolling
    const totalWidth = calculateTotalWidth();
    const maxScrollOffset = Math.max(0, totalWidth - canvas.width);
    const constrainedScrollOffset = Math.max(0, Math.min(maxScrollOffset, scrollOffset));

    // Update scroll offset if it was constrained (prevents infinite re-renders)
    if (constrainedScrollOffset !== scrollOffset) {
      setScrollOffset(constrainedScrollOffset);
      return;
    }

    // Fill background with light gray color
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each image centered in its allocated cell
    let imageStripX = 0;

    loadedImages.forEach((img) => {
      const position = calculateImagePosition(img, canvas, imageStripX, constrainedScrollOffset);

      // Draw the image at the calculated position and size
      ctx.drawImage(
        img,
        0, // Source x
        0, // Source y
        img.naturalWidth, // Source width
        img.naturalHeight, // Source height
        position.drawX, // Destination x
        position.drawY, // Destination y
        position.width, // Destination width
        position.height, // Destination height
      );

      // Move to the next image's cell position
      imageStripX += canvas.width;
    });
  }, [loadedImages, scrollOffset, calculateTotalWidth, calculateImagePosition]);

  // Trigger re-render when dependencies change
  useEffect(() => {
    renderImages();
  }, [renderImages]);

  // Start drag interaction when mouse is pressed down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        scrollLeft: scrollOffset,
      });
    },
    [scrollOffset],
  );

  // Update scroll position while dragging
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      const deltaX = e.clientX - dragStart.x;
      const newScrollOffset = dragStart.scrollLeft - deltaX;
      setScrollOffset(newScrollOffset);
    },
    [isDragging, dragStart],
  );

  // Stop dragging when mouse is released
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Stop dragging when mouse leaves the canvas
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Memoize cursor style to prevent unnecessary re-renders
  const canvasStyle = useMemo(
    () => ({
      cursor: isDragging ? 'grabbing' : 'grab',
    }),
    [isDragging],
  );

  return (
    <div className={`image-slider ${loading ? 'loading' : ''}`}>
      {loading ? (
        // Show loading spinner while images are being loaded
        <Spinner />
      ) : (
        <div className="content">
          {/* Canvas element for drawing images with drag interaction */}
          <canvas
            ref={canvasRef}
            className="image-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={canvasStyle}
          />
        </div>
      )}
    </div>
  );
}
