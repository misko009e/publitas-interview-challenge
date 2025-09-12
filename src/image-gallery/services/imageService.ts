import { mockImages } from '../mocks';
import type { ImageData } from '../models';

class ImageService {
  private baseUrl = '/api';

  async getImages(): Promise<ImageData[]> {
    try {
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
