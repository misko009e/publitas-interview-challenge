import { mockImages } from '../mocks';
import type { ImageData } from '../models';

class ImageService {
  async getImages(): Promise<ImageData[]> {
    try {
      // In a real application, this is where we would make an actual backend call
      // using fetch(), axios, or another HTTP client library
      // Example: const response = await fetch('/api/images');
      // const images = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockImages;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw new Error('Failed to fetch images');
    }
  }
}

export const imageService = new ImageService();
export default imageService;
