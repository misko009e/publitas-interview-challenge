import { mockImages } from '@image-gallery/mocks';
import { fireEvent, render, screen } from '@testing-library/react';

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

  it('should handle mouse down event', () => {
    render(<ImageSlider images={mockImages} loading={false} />);
    const canvas = document.querySelector('.image-canvas') as HTMLCanvasElement;

    fireEvent.mouseDown(canvas, { clientX: 100 });
    expect(canvas.style.cursor).toBe('grabbing');
  });

  it('should handle mouse move event when dragging', () => {
    render(<ImageSlider images={mockImages} loading={false} />);
    const canvas = document.querySelector('.image-canvas') as HTMLCanvasElement;

    // Start dragging
    fireEvent.mouseDown(canvas, { clientX: 100 });
    // Move mouse
    fireEvent.mouseMove(canvas, { clientX: 150 });

    expect(canvas.style.cursor).toBe('grabbing');
  });

  it('should handle mouse up event', () => {
    render(<ImageSlider images={mockImages} loading={false} />);
    const canvas = document.querySelector('.image-canvas') as HTMLCanvasElement;

    // Start dragging
    fireEvent.mouseDown(canvas, { clientX: 100 });
    // Release mouse
    fireEvent.mouseUp(canvas);

    expect(canvas.style.cursor).toBe('grab');
  });

  it('should handle mouse leave event', () => {
    render(<ImageSlider images={mockImages} loading={false} />);
    const canvas = document.querySelector('.image-canvas') as HTMLCanvasElement;

    // Start dragging
    fireEvent.mouseDown(canvas, { clientX: 100 });
    // Leave canvas
    fireEvent.mouseLeave(canvas);

    expect(canvas.style.cursor).toBe('grab');
  });

  it('should not handle mouse move when not dragging', () => {
    render(<ImageSlider images={mockImages} loading={false} />);
    const canvas = document.querySelector('.image-canvas') as HTMLCanvasElement;

    // Move mouse without starting drag
    fireEvent.mouseMove(canvas, { clientX: 150 });

    expect(canvas.style.cursor).toBe('grab');
  });
});
