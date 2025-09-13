import { mockImages } from '@image-gallery/mocks';
import { render, screen } from '@testing-library/react';

import { ImageSlider } from './ImageSlider';

describe('ImageSlider', () => {
  it('should render without crashing', () => {
    render(<ImageSlider images={[]} loading={false} />);
  });

  it('should display "No images available" when images array is empty', () => {
    render(<ImageSlider images={[]} loading={false} />);
    expect(screen.getByText('No images available')).toBeTruthy();
    expect(document.querySelector('.image-canvas')).toBeFalsy();
  });

  it('should show loading spinner when loading is true', () => {
    render(<ImageSlider images={[]} loading={true} />);
    expect(document.querySelector('.spinner')).toBeTruthy();
    expect(document.querySelector('.image-canvas')).toBeFalsy();
  });

  it('should render canvas when images are provided', () => {
    render(<ImageSlider images={mockImages} loading={false} />);
    expect(document.querySelector('.image-canvas')).toBeTruthy();
  });
});
