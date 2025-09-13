import { render } from '@testing-library/react';

import { ImageGallery } from './ImageGallery';

describe('ImageGallery', () => {
  it('should render without crashing', () => {
    render(<ImageGallery />);
  });
});
