# SyntheticAI Frontend Performance Optimization Guide

## Performance Targets

- **First Contentful Paint (FCP):** < 1.5 seconds
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3.5 seconds
- **Total Bundle Size:** < 200KB gzipped
- **60 FPS Animations:** Target 60fps for all motion

---

## 1. CODE SPLITTING & LAZY LOADING

```typescript
// React lazy loading for routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Generate = lazy(() => import('./pages/Generate'));
const Analytics = lazy(() => import('./pages/Analytics'));

export function Router() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

### Implementation Strategy

1. **Route-based splitting** - Each main route gets its own chunk
2. **Component-based splitting** - Heavy components split into separate chunks
3. **Vendor splitting** - Separate node_modules from application code
4. **Dynamic imports** - Load heavy features on-demand

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Use Webpack Bundle Analyzer
# Target: Total < 200KB gzipped
# Breakdown:
# - React & dependencies: ~50KB
# - TailwindCSS: ~30KB
# - Framer Motion: ~40KB
# - App code: ~40KB
# - Remaining: ~40KB (utilities, libs)
```

---

## 2. IMAGE OPTIMIZATION

### Image Delivery Strategy

```typescript
// Optimized image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      onError={(e) => {
        e.currentTarget.src = '/fallback-image.png';
      }}
    />
  );
}
```

### Image Optimization Techniques

1. **WebP Format** - Use .webp with .jpg fallback
2. **Responsive Images** - srcset for different screen sizes
3. **Image CDN** - Use Cloudinary or Imgix for optimized delivery
4. **Lazy Loading** - Only load images when in viewport
5. **Compression** - TinyPNG/ImageOptim for 50-70% size reduction
6. **Aspect Ratio** - Prevent layout shift with aspect-ratio CSS

```css
/* Prevent CLS with aspect ratio */
.image-container {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 3. ANIMATION PERFORMANCE OPTIMIZATION

### GPU-Accelerated Animations

```typescript
// Use transforms and opacity for optimal performance
export function OptimizedAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      // Use transform and opacity, not position/top/left
      style={{
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
    >
      Content
    </motion.div>
  );
}
```

### Animation Best Practices

1. **Only animate GPU properties** - transform, opacity, filter
2. **Avoid animating** - width, height, position, box-shadow
3. **Use will-change sparingly** - Only for critical animations
4. **Reduce frame rate** - 30fps is often sufficient for subtle animations
5. **Test on low-end devices** - Ensure 60fps even on budget phones

```css
/* GPU acceleration */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

---

## 4. STREAMING & PROGRESSIVE RENDERING

### Streaming AI Responses

```typescript
// Stream text responses for perceived performance
async function *streamGeneratedText(prompt) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value);
  }
}

// Use with React
function StreamingContent({ prompt }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    (async () => {
      for await (const chunk of streamGeneratedText(prompt)) {
        setContent((prev) => prev + chunk);
      }
    })();
  }, [prompt]);

  return <div>{content}</div>;
}
```

### Progressive Enhancement

1. **Show skeleton screens** first
2. **Stream content** as it's generated
3. **Load images** in background
4. **Fetch analytics** after page load

---

## 5. CACHING STRATEGIES

### Service Worker Caching

```typescript
// Cache static assets and API responses
const CACHE_NAME = 'syntheticai-v1';
const CACHED_URLS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/fonts/inter.ttf',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;

        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });

        return response;
      });
    })
  );
});
```

### Browser Caching Headers

```
# .htaccess or Vercel.json
Cache-Control: max-age=86400 (for static assets)
Cache-Control: max-age=3600 (for HTML)
Cache-Control: max-age=60 (for API responses)
ETag: (for cache validation)
```

---

## 6. LAZY RENDERING & VIRTUALIZATION

### Virtual Lists for Large Data

```typescript
import { FixedSizeList } from 'react-window';

function VirtualizedProjectList({ projects }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={projects.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ProjectCard project={projects[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Intersection Observer for Lazy Content

```typescript
function LazySection({ children }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{isVisible && children}</div>;
}
```

---

## 7. VITE BUILD OPTIMIZATION

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          ui: ['tailwindcss'],
        },
      },
    },
  },
  server: {
    middlewareMode: false,
  },
});
```

---

## 8. NETWORK OPTIMIZATION

### API Request Optimization

```typescript
// Debounce search requests
function useSearch(query) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const data = await fetch(`/api/search?q=${query}`).then((r) => r.json());
      setResults(data);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return results;
}

// Batch API requests
async function batchFetchProjects(ids) {
  const response = await fetch('/api/projects/batch', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  return response.json();
}
```

### Compression

```
# Enable gzip/brotli compression on server
Accept-Encoding: gzip, deflate, br
Content-Encoding: br
```

---

## 9. MONITORING & METRICS

### Performance Monitoring

```typescript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function initPerformanceMonitoring() {
  getCLS((metric) => console.log('CLS:', metric));
  getFID((metric) => console.log('FID:', metric));
  getFCP((metric) => console.log('FCP:', metric));
  getLCP((metric) => console.log('LCP:', metric));
  getTTFB((metric) => console.log('TTFB:', metric));
}
```

### Analytics Integration

```typescript
function trackPerformance(metricName, value) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      metric_name: metricName,
      value: value,
    });
  }
}
```

---

## 10. PRODUCTION CHECKLIST

- [ ] Bundle size < 200KB gzipped
- [ ] FCP < 1.5 seconds
- [ ] LCP < 2.5 seconds
- [ ] CLS < 0.1
- [ ] All images optimized (WebP, compressed)
- [ ] Service worker implemented
- [ ] Code splitting configured
- [ ] Lazy loading implemented
- [ ] Animations GPU-accelerated
- [ ] Cache headers configured
- [ ] Gzip/Brotli compression enabled
- [ ] CDN configured for assets
- [ ] Monitoring implemented
- [ ] 404 page optimized
- [ ] Accessibility audit passed

---

## Performance Commands

```bash
# Build with analysis
npm run build:analyze

# Lighthouse audit
npm run lighthouse

# Monitor bundle size
npm run bundle-size

# Test performance locally
npm run build && npm run preview
```

---

## Expected Results

With these optimizations, SyntheticAI should achieve:
- Lighthouse score: 90+
- FCP: ~1.2 seconds
- LCP: ~2.2 seconds
- CLS: ~0.08
- TTI: ~3.0 seconds
- Mobile performance: 85+
- Desktop performance: 95+
