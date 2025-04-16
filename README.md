# MAFUI Demo 1

A modern e-commerce web application built with Next.js featuring a responsive UI with shadcn/ui components and API integration.

## Overview

This project demonstrates a product showcase application with features like:
- Product cards with favorite functionality
- Product carousels for browsing collections
- Responsive sidebar navigation
- Theme support (light/dark mode)
- API integration for product data
- Search functionality

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) - React framework with App Router
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Accessible and customizable components
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **State Management**: React Hooks and Context API
- **API Integration**: Next.js API Routes with external service integration

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mafui-demo1
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router files and page components
  - `/api`: API route handlers for backend functionality
  - `/search`: Search page and related components
  - `/product`: Product detail pages
  - `/components`: Components built for this demo
  - `/ui`: shadcn/ui components and customizations
  - Custom components like ProductCard, ProductCarousel
  - `/hooks`: Custom React hooks for state management and data fetching
  - `/lib`: Utility functions and shared logic
  - `/types`: TypeScript type definitions

## Features

- **Responsive Design**: Adapts to mobile and desktop viewports with custom breakpoints
- **Theme Support**: Light and dark mode with system preference detection
- **Interactive UI**: Product favoriting with toast notifications
- **Accessible Components**: Built with accessibility in mind following WCAG guidelines
- **Product Search**: Keyword-based search with filtering options
- **API Integration**: Fetches product data from external APIs
- **Type Safety**: Full TypeScript implementation for better developer experience

## Development

### Adding New Components

To add new shadcn/ui components:

```bash
npx shadcn-ui add [component-name]
```

### Commit Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for creating semantic commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that don't affect code functionality (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or correcting tests
- `chore`: Changes to build process or auxiliary tools

Examples:
```
feat: add product search functionality
fix(auth): resolve login redirect issue
docs: update installation instructions
```

### Environment Variables

The application requires the following environment variables:

```
API_RETAIL_API_KEY=API_key
API_BASE_URL=https://your-api-endpoint.com/api/
USER_ID=userID
```

Create a `.env.local` file in the root directory with these variables.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Deployment

This application can be deployed to Vercel with minimal configuration:

```bash
npm install -g vercel
vercel
```

## API Documentation

The application interacts with external APIs through Next.js API routes:

- `/api/product` - Fetches product details and availability
- `/api/search` - Handles product search with filtering options

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes using semantic commits
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
