import './App.scss';

import { ImageGallery } from './image-gallery';

function App() {
  // Here we would implement routing (React Router, etc.)
  // For now, we directly render the ImageGallery component
  return (
    <div className="page-container">
      <ImageGallery />
    </div>
  );
}

export default App;
