import { render } from '@testing-library/react';

import { ImageSlider } from './ImageSlider';

describe('ImageSlider', () => {
  it('should render without crashing', () => {
    render(<ImageSlider images={[]} loading={false} />);
  });
});
