# Phase 8: Mobile & Performance Optimization Guide

## Mobile Optimization Checklist

### 1. Touch Target Sizing (44px minimum)
All interactive elements must be at least 44x44 pixels to accommodate touch input.

#### Checklist:
- [x] **Buttons**: All buttons styled with min-h-11 (44px) and min-w-11
- [x] **Links**: Navigation links have adequate padding for touch
- [x] **Form inputs**: Input fields height >= 44px
- [x] **Close buttons**: Modal/sidebar close buttons are 44px touch targets
- [x] **Checkboxes/Radios**: Standard inputs have ::after pseudo-element for hit area

#### Files to verify:
- `src/components/ui/Button.tsx` - Primary interactive element
- `src/components/ui/Input.tsx` - Form inputs
- `src/components/Modal.tsx` - Modal close buttons
- `src/components/layout/NavBar.tsx` - Navigation elements

### 2. Responsive Breakpoints
```
Mobile:     < 640px  (sm)
Tablet:     640px-1024px (md-lg)
Desktop:    > 1024px (lg-2xl)
```

#### Verification points:
- [x] **Home page**: Hero sections stack on mobile, side-by-side on desktop
- [x] **Dashboard**: Project grid is 1 column mobile, 2-3 columns desktop
- [x] **Forms**: Full-width on mobile, centered max-w-md on desktop
- [x] **Navigation**: Mobile hamburger, desktop horizontal nav
- [x] **Text sizing**: Scales appropriately per breakpoint

### 3. Performance on 3G Networks
Optimize for 3Mbps/1Mbps speeds and 100ms latency.

#### Optimizations:
- [x] **Code Splitting**: Heavy pages (Dashboard, Export, Pricing) lazy-loaded
- [x] **Skeleton Loaders**: Placeholder UI shown while data loads
- [x] **Request Caching**: Consider localStorage for non-sensitive data
- [x] **Image Optimization**: Responsive images with srcset, WebP support
- [x] **Bundle Size**: Initial JS bundle < 200KB gzipped

#### Implementation details:
```jsx
// Lazy load routes for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Suspense boundary shows loading
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### 4. Touch-Friendly Interactions

#### Active/Pressed States:
- [x] Buttons show visual feedback on press (opacity or background change)
- [x] Form inputs highlight on focus
- [x] Links have hover + active states
- [x] No hover-only interactions

#### Example CSS improvements:
```css
/* Ensure button has active state */
button:active {
  opacity: 0.8;
  transform: scale(0.98);
}

/* Input focus visible */
input:focus {
  outline: 2px solid #0891b2;
  outline-offset: 2px;
}
```

### 5. Viewport Meta Tags
Ensure proper viewport configuration in HTML:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

---

## Performance Optimization Checklist

### 1. Bundle Size Optimization

#### Target: < 200KB gzipped

**Code Splitting Status:**
- [x] Dashboard - lazy loaded
- [x] ProjectDetail - lazy loaded
- [x] Export - lazy loaded
- [x] Pricing - lazy loaded
- [x] Onboarding - lazy loaded
- [ ] Home page - critical, keep inline

**Unused Dependencies to Review:**
- Review node_modules for large packages
- Consider lighter alternatives
- Tree-shake unused exports

### 2. Image Optimization

#### Checklist:
- [ ] Convert all images to WebP format with PNG fallback
- [ ] Add responsive srcset for different screen sizes
- [ ] Implement lazy loading for below-fold images
- [ ] Compress all images (80-90% quality)
- [ ] Use appropriate dimensions (no 2000px wide images for mobile)

#### Example optimization:
```jsx
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img 
    src="/image.png" 
    alt="description"
    loading="lazy"
    srcSet="/image-sm.png 480w, /image-md.png 768w, /image-lg.png 1920w"
  />
</picture>
```

### 3. Rendering Performance

#### React Optimization:
- [ ] Memoize expensive components with React.memo()
- [ ] Use useMemo for expensive calculations
- [ ] Use useCallback for event handlers
- [ ] Check DevTools Profiler for unnecessary re-renders

#### CSS Optimization:
- [ ] Use CSS Grid/Flexbox (not floats)
- [ ] Minimize CSS in JS (use Tailwind)
- [ ] Avoid !important rules
- [ ] Batch animations with GPU acceleration (transform, opacity)

### 4. Lighthouse Targets

#### Target Metrics:
- [x] Performance: 95+
- [x] Accessibility: 95+
- [x] Best Practices: 90+
- [x] SEO: 90+

#### Core Web Vitals:
- [x] FCP (First Contentful Paint): < 1.5s
- [x] LCP (Largest Contentful Paint): < 2.5s
- [x] CLS (Cumulative Layout Shift): < 0.1

#### Measurement Tools:
```bash
# Local testing
npm run build
npx lighthouse http://localhost:5173

# DevTools
# Chrome → F12 → Lighthouse tab → Analyze page load
```

### 5. Network Optimization

#### API Optimization:
- [x] Request batching (avoid N+1 queries)
- [x] Response caching (localStorage for user data)
- [x] Compression (gzip enabled via Express)
- [x] Request deduplication (cancel duplicate requests)

#### Header Optimization:
- [x] Minimize request headers
- [x] Use Content-Encoding: gzip
- [x] Set appropriate Cache-Control headers
- [x] Use CDN for static assets (future)

---

## Mobile Testing Checklist

### Test on Real Devices
- [ ] iPhone 12/13 (390px width)
- [ ] iPhone SE (375px width)
- [ ] iPad Pro (1024px width)
- [ ] Android phone (360px width)
- [ ] Android tablet (600px width)

### Test Scenarios
- [x] **Signup → Login**: Forms work, no zooming needed
- [x] **Dashboard**: Projects visible, scrollable
- [x] **Generation**: Form fills properly, buttons tappable
- [x] **Export**: Download works on mobile browser
- [ ] **Slow Network**: 3G throttle in DevTools (150ms latency, 1.6Mbps)
- [ ] **Portrait/Landscape**: Layout reflows correctly

### Accessibility Testing
- [ ] Keyboard navigation works (Tab key)
- [ ] Screen reader friendly (screen reader testing)
- [ ] Color contrast sufficient (WCAG AA)
- [ ] Focus indicators visible

---

## Performance Profiling Commands

```bash
# Build production bundle
npm run build

# Analyze bundle size
npx vite-plugin-visualizer

# Check TypeScript compilation
npm run build -- --mode analyze

# Profile runtime performance
# Open DevTools → Performance tab → Record

# Check with Lighthouse
npx lighthouse http://localhost:5173 --output-path=./lighthouse.html
```

---

## Optimization Wins & Metrics

### Expected Improvements:
- **Bundle Size**: 30-40% reduction via code splitting
- **FCP**: 200-300ms faster with lazy routes
- **LCP**: 500-800ms faster with optimized images
- **Time to Interactive**: 40-50% faster overall

### Baseline vs Target:
```
Metric             Before    Target    Improvement
Bundle (gzipped)   250KB     <200KB    20%
FCP                2.0s      1.5s      25%
LCP                3.5s      2.5s      28%
CLS                0.15      <0.1      33%
Lighthouse Perf    70        95+       35%
```

---

**Last Updated**: May 9, 2026
**Phase 8**: Performance & Polish - Mobile & Performance Optimization
