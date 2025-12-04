# Frontend Integration Guide

## Overview

The frontend application is a React/TypeScript application built with Vite that connects to the Liferay Portal backend via REST APIs.

## Architecture

```
┌─────────────────────────────────────┐
│   Frontend (React/Vite)             │
│   http://localhost:3000             │
├─────────────────────────────────────┤
│ Headless API Client (Axios)         │
│ Proxy: /o/* → http://localhost:8080 │
├─────────────────────────────────────┤
│   Liferay Portal Backend            │
│   http://localhost:8080             │
│   (REST API Endpoints)              │
├─────────────────────────────────────┤
│ React Components                    │
│ - ContentCard.tsx                   │
│ - UI Components (alert, card, etc)  │
│ - Hooks (useLiferayContent)         │
└─────────────────────────────────────┘
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for Liferay backend)

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Start Liferay Backend

From the project root:

```powershell
.\docker-up.ps1
```

Wait for Liferay to fully start (typically 5-10 minutes). You can check the status with:

```bash
cd backend/configs/docker
docker-compose logs -f liferay
```

### 4. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Integration

### Authentication

The current setup uses Basic Authentication with default credentials:
- Username: `test@liferay.com`
- Password: `test`

These credentials are configured in `src/services/api.ts`. For production, implement OAuth2 authentication.

### Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_LIFERAY_SITE_ID=20124
```

### Available API Endpoints

The frontend uses these Liferay Headless API endpoints:

- **Get Structured Content**: `/o/headless-delivery/v1.0/sites/{siteId}/structured-contents`
- **Get Content by ID**: `/o/headless-delivery/v1.0/structured-contents/{contentId}`

### Custom Hooks

The `useLiferayContent.ts` hook provides convenient methods to fetch Liferay content:

```typescript
import { useLiferayContent } from '@/hooks/useLiferayContent';

function MyComponent() {
  const { data, loading, error } = useLiferayContent();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.items?.map(item => (
        <ContentCard key={item.id} content={item} />
      ))}
    </div>
  );
}
```

## Build and Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Build output is in the `dist/` directory.

### Running Built App

```bash
npm run preview
```

## Code Quality

### Linting

```bash
npm run lint
```

### Type Checking

TypeScript is configured with strict mode. Type definitions are available in `src/types/liferay.ts`.

## Component Structure

```
src/
├── components/
│   ├── ContentCard.tsx      # Display Liferay content
│   └── ui/                  # Reusable UI components
├── hooks/
│   └── useLiferayContent.ts # Fetch Liferay content
├── services/
│   └── api.ts               # API client configuration
├── types/
│   └── liferay.ts           # TypeScript interfaces
├── assets/                  # Static assets
├── App.tsx                  # Main component
└── main.tsx                 # Entry point
```

## Styling

The project uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Type-safe component variants
- **CSS Modules**: Component-scoped styles

Configuration files:
- `tailwind.config.js`: Tailwind configuration
- `postcss.config.js`: PostCSS configuration
- `src/index.css`: Global styles

## Troubleshooting

### API Connection Issues

1. Ensure Liferay is running:
   ```bash
   docker-compose ps
   ```

2. Check CORS configuration in Liferay (`backend/configs/docker/portal-ext.properties`)

3. Verify proxy is working in browser DevTools Network tab

### Build Errors

```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run build
```

### Port Conflicts

If port 3000 is already in use, the Vite server will use the next available port. Check the console output.

## Production Checklist

- [ ] Update `VITE_API_BASE_URL` to production Liferay URL
- [ ] Implement OAuth2 authentication
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up CDN for static assets
- [ ] Configure environment-specific build
- [ ] Add error monitoring (Sentry, etc.)
- [ ] Implement analytics
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Security audit (dependencies, CSP headers)

## Additional Resources

- [Liferay Headless API Documentation](https://learn.liferay.com/w/dxp/headless-delivery-apis)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
