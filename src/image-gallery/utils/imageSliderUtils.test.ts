import {
  getImageDrawCoordinates,
  getImageScaledDimensions,
  getImageScaleToFitCanvas,
  getImageStripTotalWidth,
  getScrollBoundaries,
} from './imageSliderUtils';

describe('imageSliderUtils', () => {
  const mockImage = {
    naturalWidth: 1000,
    naturalHeight: 500,
  } as HTMLImageElement;

  const mockCanvas = {
    width: 400,
    height: 300,
  } as HTMLCanvasElement;

  describe('getImageScaleToFitCanvas', () => {
    it('should calculate correct scale for image to fit canvas', () => {
      const scale = getImageScaleToFitCanvas(mockImage, mockCanvas);
      // Image (1000x500) scales to fit canvas width (400), so scale = 400/1000 = 0.4
      expect(scale).toBe(0.4);
    });

    it('should scale to fit height when image is taller', () => {
      const tallImage = {
        naturalWidth: 200,
        naturalHeight: 800,
      } as HTMLImageElement;

      const scale = getImageScaleToFitCanvas(tallImage, mockCanvas);
      // Image (200x800) scales to fit canvas height (300), so scale = 300/800 = 0.375
      expect(scale).toBe(0.375);
    });

    it('should return 1 when image fits perfectly', () => {
      const perfectImage = {
        naturalWidth: 400,
        naturalHeight: 300,
      } as HTMLImageElement;

      const scale = getImageScaleToFitCanvas(perfectImage, mockCanvas);
      // Image dimensions match canvas exactly, so no scaling needed
      expect(scale).toBe(1);
    });
  });

  describe('getImageScaledDimensions', () => {
    it('should return correct scaled dimensions', () => {
      const dimensions = getImageScaledDimensions(mockImage, mockCanvas);
      // With scale 0.4: width = 1000 * 0.4 = 400, height = 500 * 0.4 = 200
      expect(dimensions.width).toBe(400);
      expect(dimensions.height).toBe(200);
    });
  });

  describe('getImageDrawCoordinates', () => {
    it('should return correct draw coordinates', () => {
      const coords = getImageDrawCoordinates(mockImage, mockCanvas, 0, 0);
      // Image centered: drawX = 0 (centered horizontally), drawY = (300-200)/2 = 50
      expect(coords.drawX).toBe(0);
      expect(coords.drawY).toBe(50);
      expect(coords.width).toBe(400);
      expect(coords.height).toBe(200);
    });

    it('should account for scroll offset', () => {
      const coords = getImageDrawCoordinates(mockImage, mockCanvas, 400, 100);
      // With scroll offset 100: drawX = 400 - 100 + (400-400)/2 = 300
      expect(coords.drawX).toBe(300);
      expect(coords.drawY).toBe(50);
    });
  });

  describe('getImageStripTotalWidth', () => {
    it('should return 0 for empty images array', () => {
      const width = getImageStripTotalWidth([], 400);
      expect(width).toBe(0);
    });

    it('should calculate total width for multiple images', () => {
      const images = [mockImage, mockImage, mockImage];
      const width = getImageStripTotalWidth(images, 400);
      // Each image takes full canvas width: 3 images * 400px = 1200px
      expect(width).toBe(1200);
    });
  });

  describe('getScrollBoundaries', () => {
    it('should return correct boundaries when content fits', () => {
      const boundaries = getScrollBoundaries(200, 400, 0);
      // Content (200px) fits in canvas (400px), so no scrolling needed
      expect(boundaries.maxScrollOffset).toBe(0);
      expect(boundaries.constrainedScrollOffset).toBe(0);
    });

    it('should return correct boundaries when content overflows', () => {
      const boundaries = getScrollBoundaries(1000, 400, 0);
      // Content (1000px) overflows canvas (400px), max scroll = 1000 - 400 = 600
      expect(boundaries.maxScrollOffset).toBe(600);
      expect(boundaries.constrainedScrollOffset).toBe(0);
    });

    it('should constrain scroll offset to valid range', () => {
      const boundaries = getScrollBoundaries(1000, 400, 800);
      // Requested scroll (800) exceeds max (600), so constrained to 600
      expect(boundaries.maxScrollOffset).toBe(600);
      expect(boundaries.constrainedScrollOffset).toBe(600);
    });

    it('should prevent negative scroll offset', () => {
      const boundaries = getScrollBoundaries(1000, 400, -100);
      // Negative scroll (-100) is constrained to minimum (0)
      expect(boundaries.maxScrollOffset).toBe(600);
      expect(boundaries.constrainedScrollOffset).toBe(0);
    });
  });
});
