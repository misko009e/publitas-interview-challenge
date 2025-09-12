import { mockImages } from '../mocks';
import type { ApiResponse, ImageData } from '../models';

class ImageService {
  async getImages(): Promise<ApiResponse<ImageData>> {
    try {
      // In a real application, this is where we would make an actual backend call
      // using fetch(), axios, or another HTTP client library
      // Example: const response = await fetch('/api/images');
      // const images = await response.json();
      const mockResponse = await new Promise<ApiResponse<ImageData>>((resolve) =>
        setTimeout(
          () =>
            resolve({
              items: mockImages,
              count: mockImages.length,
              total: mockImages.length,
              page: 1,
              pageCount: 1,
            }),
          1000,
        ),
      );

      return mockResponse;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw new Error('Failed to fetch images');
    }
  }
}

export const imageService = new ImageService();
export default imageService;
