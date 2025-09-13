/**
 * Image Slider Utility Functions
 *
 * This module contains pure utility functions for image slider calculations.
 * These functions are stateless and can be easily tested and reused.
 */

/**
 * Get the scaling factor to fit an image within canvas bounds while preserving aspect ratio
 *
 * @param img - The HTML image element
 * @param canvas - The canvas element
 * @returns The scaling factor (0-1) to fit the image within canvas bounds
 */
export function getImageScaleToFitCanvas(img: HTMLImageElement, canvas: HTMLCanvasElement): number {
  const widthScale = canvas.width / img.naturalWidth;
  const heightScale = canvas.height / img.naturalHeight;
  // Use smaller scale to ensure image fits completely within canvas
  return Math.min(widthScale, heightScale);
}

/**
 * Get the scaled dimensions of an image when fitted to canvas
 *
 * @param img - The HTML image element
 * @param canvas - The canvas element
 * @returns Object containing scaled width and height
 */
export function getImageScaledDimensions(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
): { width: number; height: number } {
  const scale = getImageScaleToFitCanvas(img, canvas);
  return {
    width: img.naturalWidth * scale,
    height: img.naturalHeight * scale,
  };
}

/**
 * Get the canvas draw coordinates and dimensions for an image in the slider strip
 *
 * @param img - The HTML image element
 * @param canvas - The canvas element
 * @param imageStripX - The horizontal position of this image in the strip
 * @param scrollOffset - The current scroll offset
 * @returns Object containing draw position and scaled dimensions
 */
export function getImageDrawCoordinates(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  imageStripX: number,
  scrollOffset: number,
): { drawX: number; drawY: number; width: number; height: number } {
  const scaledDimensions = getImageScaledDimensions(img, canvas);
  // Calculate the start position of this image's cell on the canvas
  const cellStartOnCanvasX = imageStripX - scrollOffset;

  return {
    // Center the image horizontally within its cell
    drawX: cellStartOnCanvasX + (canvas.width - scaledDimensions.width) / 2,
    // Center the image vertically within the canvas
    drawY: (canvas.height - scaledDimensions.height) / 2,
    ...scaledDimensions,
  };
}

/**
 * Get the total width needed for the entire image strip
 *
 * @param loadedImages - Array of loaded image elements
 * @param canvasWidth - The width of the canvas
 * @returns Total width of the image strip
 */
export function getImageStripTotalWidth(
  loadedImages: HTMLImageElement[],
  canvasWidth: number,
): number {
  if (loadedImages.length === 0) return 0;
  // Each image occupies a full canvas-width cell
  return loadedImages.length * canvasWidth;
}

/**
 * Get the scroll boundaries to prevent over-scrolling
 *
 * @param totalWidth - Total width of the image strip
 * @param canvasWidth - Width of the canvas
 * @returns Object containing max scroll offset and constrained scroll offset
 */
export function getScrollBoundaries(
  totalWidth: number,
  canvasWidth: number,
  currentScrollOffset: number,
): { maxScrollOffset: number; constrainedScrollOffset: number } {
  const maxScrollOffset = Math.max(0, totalWidth - canvasWidth);
  const constrainedScrollOffset = Math.max(0, Math.min(maxScrollOffset, currentScrollOffset));

  return {
    maxScrollOffset,
    constrainedScrollOffset,
  };
}
