import { mockImages } from '@image-gallery/mocks';

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

  it('should return correct number of images', async () => {
    const result = await imageService.getImages();

    expect(result.items.length).toBe(4);
    expect(result.count).toBe(4);
    expect(result.total).toBe(4);
  });

  it('should return correct pagination values', async () => {
    const result = await imageService.getImages();

    expect(result.page).toBe(1);
    expect(result.pageCount).toBe(1);
  });

  it('should return mock images with correct properties', async () => {
    const result = await imageService.getImages();

    expect(result.items).toEqual(mockImages);
    expect(result.items[0]).toHaveProperty('id');
    expect(result.items[0]).toHaveProperty('url');
    expect(result.items[0]).toHaveProperty('title');
    expect(result.items[0]).toHaveProperty('width');
    expect(result.items[0]).toHaveProperty('height');
  });

  it('should return images with correct titles', async () => {
    const result = await imageService.getImages();

    expect(result.items[0].title).toBe('Bob Marley Image 1');
    expect(result.items[1].title).toBe('Bob Marley Image 2');
    expect(result.items[2].title).toBe('Bob Marley Image 3');
    expect(result.items[3].title).toBe('Bob Marley Image 4');
  });
});
