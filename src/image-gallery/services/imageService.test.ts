import { imageService } from './imageService';

describe('imageService', () => {
  it('should return images with correct structure', async () => {
    const result = await imageService.getImages();

    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('pageCount');
    expect(Array.isArray(result.items)).toBe(true);
  });
});
