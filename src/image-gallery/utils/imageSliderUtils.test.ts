import { getImageScaleToFitCanvas } from './imageSliderUtils';

describe('imageSliderUtils', () => {
  it('should calculate correct scale for image to fit canvas', () => {
    const mockImage = {
      naturalWidth: 1000,
      naturalHeight: 500,
    } as HTMLImageElement;

    const mockCanvas = {
      width: 400,
      height: 300,
    } as HTMLCanvasElement;

    const scale = getImageScaleToFitCanvas(mockImage, mockCanvas);

    // Image is wider than tall, so it should scale to fit width
    expect(scale).toBe(0.4); // 400/1000
  });
});
