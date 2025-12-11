# LivewireMesh Prerender Server

A Node.js server that prerenders React components for LivewireMesh, enabling instant content visibility before JavaScript hydration.

## Overview

When enabled, the prerender server:
1. Receives component name and props from Laravel/Livewire
2. Renders the React component to an HTML string using `renderToString`
3. Returns the HTML to be included in the initial server response
4. Client-side React then "hydrates" the existing HTML instead of rendering from scratch

**Benefits:**
- Users see content instantly (no flash of empty content)
- Better SEO (content is in the initial HTML)
- Improved Core Web Vitals (faster LCP)

## Installation

```bash
cd prerender-server
npm install
```

## Quick Start

### 1. Register Your Components

Create a file to register your React components with the prerender server:

```typescript
// prerender-server/src/register-components.ts
import { registerComponent } from "./server";

// Import your React components
import MyCounter from "../../resources/js/components/MyCounter";
import Dashboard from "../../resources/js/components/Dashboard";

// Register them with the exact same path used in your MeshComponent's component() method
registerComponent("resources/js/components/MyCounter.tsx", MyCounter);
registerComponent("resources/js/components/Dashboard.tsx", Dashboard);
```

### 2. Update the Server Entry Point

Modify `src/server.ts` to import your component registrations:

```typescript
// At the top of src/server.ts, add:
import "./register-components";
```

### 3. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

### 4. Configure Laravel

Add to your `.env` file:

```env
LIVEWIREMESH_PRERENDER_ENABLED=true
LIVEWIREMESH_PRERENDER_URL=http://localhost:3001
LIVEWIREMESH_PRERENDER_TIMEOUT=5
```

## Configuration Options

### Laravel Configuration (`config/livewiremesh.php`)

| Option | Default | Description |
|--------|---------|-------------|
| `prerender.enabled` | `false` | Enable/disable prerendering globally |
| `prerender.server_url` | `http://localhost:3001` | URL of the Node.js prerender server |
| `prerender.timeout` | `5` | Timeout for prerender requests (seconds) |
| `prerender.cache.enabled` | `false` | Cache prerendered HTML |
| `prerender.cache.ttl` | `3600` | Cache TTL in seconds |
| `prerender.fallback` | `'empty'` | Fallback behavior: `'empty'` or `'error'` |

### Environment Variables

```env
# Node.js Server
PRERENDER_PORT=3001

# Laravel
LIVEWIREMESH_PRERENDER_ENABLED=true
LIVEWIREMESH_PRERENDER_URL=http://localhost:3001
LIVEWIREMESH_PRERENDER_TIMEOUT=5
LIVEWIREMESH_PRERENDER_CACHE=false
LIVEWIREMESH_PRERENDER_CACHE_TTL=3600
LIVEWIREMESH_PRERENDER_FALLBACK=empty
```

## API Endpoints

### Health Check
```
GET /health
```

Returns server status and list of registered components.

### Render Component
```
POST /render
Content-Type: application/json

{
  "component": "resources/js/components/MyCounter.tsx",
  "props": { "initialCount": 5 }
}
```

Returns:
```json
{
  "html": "<div>...</div>"
}
```

## Component Considerations

### LivewireContext During Prerender

During server-side rendering, the `LivewireContext` provides a mock implementation:

- `$wire.$get(key)` - Returns from initial props
- `$wire.$set(key, value)` - Stores locally (won't sync until hydration)
- `$wire.$call(method)` - No-op (logs warning)
- All event methods - No-op (logs warning)

**Best Practice:** Design components to render correctly with just the initial props. Interactive features will work after hydration.

### Example Component

```tsx
import { useWire } from "livewiremesh";

const MyCounter = ({ initialCount = 0 }) => {
  const [count, setCount] = useWire("count", initialCount);
  
  // This renders correctly during prerender (shows initialCount)
  // After hydration, the button becomes interactive
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};
```

## Disabling Prerender for Specific Components

Override `shouldPrerender()` in your MeshComponent:

```php
class MyDynamicComponent extends MeshComponent
{
    public function component(): string
    {
        return 'resources/js/components/MyDynamic.tsx';
    }
    
    public function props(): array
    {
        return ['data' => $this->data];
    }
    
    // Disable prerendering for this component
    public function shouldPrerender(): bool
    {
        return false;
    }
}
```

## Production Deployment

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

ENV NODE_ENV=production
ENV PRERENDER_PORT=3001

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

### Process Manager (PM2)

```bash
pm2 start dist/server.js --name "livewiremesh-prerender"
```

### Running Behind Nginx

```nginx
upstream prerender {
    server 127.0.0.1:3001;
}

server {
    # ... your config ...
    
    location /prerender/ {
        proxy_pass http://prerender/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

Then update your Laravel config:
```env
LIVEWIREMESH_PRERENDER_URL=http://localhost/prerender
```

## Troubleshooting

### Component Not Found

Ensure the component name in `registerComponent()` matches exactly what your MeshComponent's `component()` method returns.

### Hydration Mismatch Warnings

These occur when the server-rendered HTML differs from what React renders on the client. Common causes:
- Using `Date.now()` or `Math.random()` in render
- Browser-only APIs during render
- Different data between server and client

### Timeout Errors

Increase the timeout in your Laravel config or optimize your components:
```env
LIVEWIREMESH_PRERENDER_TIMEOUT=10
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Request                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Laravel/Livewire                         │
│                    MeshComponent.php                        │
│         │                                                   │
│         │ HTTP POST (component + props)                     │
│         ▼                                                   │
│    ┌─────────────────────────────────────────┐             │
│    │     Node.js Prerender Server            │             │
│    │     renderToString(<Component />)       │             │
│    └─────────────────────────────────────────┘             │
│         │                                                   │
│         │ Returns HTML string                               │
│         ▼                                                   │
│    Blade template includes prerendered HTML                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Browser                               │
│    1. User sees prerendered content immediately             │
│    2. JavaScript loads                                      │
│    3. React hydrates (attaches interactivity)              │
└─────────────────────────────────────────────────────────────┘
```
