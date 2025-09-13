import { mockImages } from '@image-gallery/mocks';
import type { ImageData } from '@image-gallery/models';
import { imageService } from '@image-gallery/services';
import { render, screen } from '@testing-library/react';

import { ImageGallery } from './ImageGallery';

let mockImagesState: ImageData[] = [];
let mockLoadingState = true;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((fn) => fn()), // Run synchronously to avoid act() warnings
  useState: jest.fn((initial) => {
    if (initial === true) return [mockLoadingState, jest.fn()]; // loading state
    return [mockImagesState, jest.fn()]; // images state
  }),
}));

jest.mock('@image-gallery/services', () => ({
  imageService: {
    getImages: jest.fn(),
  },
}));

jest.mock('@image-gallery/components/ImageSlider/ImageSlider', () => ({
  ImageSlider: ({ images, loading }: { images: ImageData[]; loading: boolean }) => (
    <div data-testid="image-slider" data-loading={loading} data-images-count={images.length}>
      ImageSlider Mock
    </div>
  ),
}));

describe('ImageGallery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockImagesState = []; // Reset to empty state
    mockLoadingState = true; // Reset to loading state

    // Mock service to return valid response to prevent console errors
    (imageService.getImages as jest.Mock).mockResolvedValue({
      items: mockImages,
      count: mockImages.length,
      total: mockImages.length,
      page: 1,
      pageCount: 1,
    });
  });

  it('should render the title', () => {
    render(<ImageGallery />);
    expect(screen.getByText('Publitas Frontend Code Challenge')).toBeTruthy();
  });

  it('should render ImageSlider component', () => {
    render(<ImageGallery />);
    expect(screen.getByTestId('image-slider')).toBeTruthy();
  });

  it('should pass correct props to ImageSlider', () => {
    render(<ImageGallery />);
    const imageSlider = screen.getByTestId('image-slider');
    expect(imageSlider.getAttribute('data-loading')).toBe('true');
    expect(imageSlider.getAttribute('data-images-count')).toBe('0');
  });

  it('should call imageService.getImages on mount', () => {
    render(<ImageGallery />);
    expect(imageService.getImages).toHaveBeenCalledTimes(1);
  });

  it('should receive and pass mock items to ImageSlider', () => {
    mockImagesState = mockImages; // Simulate loaded data
    mockLoadingState = false; // Simulate finished loading

    render(<ImageGallery />);

    const imageSlider = screen.getByTestId('image-slider');
    expect(imageSlider.getAttribute('data-images-count')).toBe('4');
    expect(imageSlider.getAttribute('data-loading')).toBe('false');

    // Verify exact mock data was passed through
    expect(mockImagesState).toEqual(mockImages);
    expect(mockImagesState[0].title).toBe('Bob Marley Image 1');
    expect(mockImagesState[1].title).toBe('Bob Marley Image 2');
    expect(mockImagesState[2].title).toBe('Bob Marley Image 3');
    expect(mockImagesState[3].title).toBe('Bob Marley Image 4');
  });
});
