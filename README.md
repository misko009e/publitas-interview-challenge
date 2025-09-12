# Publitas Frontend Interview Challenge

An image slider built with React and TypeScript that renders images in a single canvas element with drag functionality.

## What it does

- Renders images in a single canvas element
- Allows dragging to change between images
- Uses at least 3 images with different dimensions
- Works on latest Chrome, Firefox, and Safari

## Tech Stack

- React 19 with TypeScript
- Vite for building
- SCSS for styling
- ESLint + Prettier for code quality

## Getting Started

### Prerequisites

- Node.js v22 or higher
- npm

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` folder and can be served from any static file server.

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run format` - Format code

## Development Notes

- Pre-commit hooks automatically format and lint code
- All images are rendered in a single canvas element
- Drag functionality changes images without animations
- Built with modern React patterns and TypeScript
