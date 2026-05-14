# Runtime Performance Profiling Guide

## What to Measure

Runtime performance focuses on how the application behaves after it's loaded. We measure:

1. **React Render Times**: How long components take to render
2. **Re-render Frequency**: How often components unnecessarily re-render
3. **Long Tasks**: JavaScript execution > 50ms
4. **Frame Rate**: Smooth 60fps (16.67ms per frame)
5. **Memory Usage**: Heap size and garbage collection

## Target Metrics

- ✅ **React Re-render**: < 16ms per component
- ✅ **User Interaction**: < 100ms response time
- ✅ **Long Tasks**: None > 50ms in critical paths
- ✅ **Frame Rate**: Consistent 60fps on interactions

---

## Method 1: React Profiler (Easiest)

### Setup
The React DevTools Profiler is automatically available in development.

### Steps
1. Start dev server: `npm run dev`
2. Open http://localhost:5173 in Chrome
3. Install **React DevTools** extension (if not already)
4. Open DevTools (F12)
5. Go to **Components** or **Profiler** tab

### What to Profile
1. **Dashboard Load**:
   - Interact with dashboard
   - Look for components rendering multiple times
   - Check render times for each component

2. **Form Submission**:
   - Fill out login form
   - Submit
   - Watch for unnecessary re-renders during validation

3. **Generation**:
   - Trigger generation
   - Watch loading state
   - Monitor for janky animations

4. **Export**:
   - Click export button
   - Monitor during file generation

### Reading the Profiler
- **Chart**: Shows render time per component
- **Duration**: Time spent rendering (target: < 16ms)
- **Commits**: Each React render cycle
- **Ranked Chart**: Slowest components at top

### Example Finding
```
LoginPage rendered in 12ms ✅
├─ Input (email field): 2ms ✅
├─ Input (password field): 2ms ✅
├─ Button: 1ms ✅
└─ ErrorMessage: 7ms ⚠️ (investigate)
```

---

## Method 2: Chrome DevTools Performance Tab

### Steps
1. Open DevTools (F12)
2. Go to **Performance** tab
3. Click **Record** (red circle)
4. Perform the action (click button, fill form, etc.)
5. Click **Record** again to stop
6. Analyze the timeline

### What to Look For

#### FPS Meter
- **Green**: 60fps (smooth)
- **Yellow/Red**: Dropped frames (jank)

#### Main Thread (JavaScript)
- Should have gaps between tasks
- No single task > 50ms
- Smooth curve, not spiky

#### Layout & Paint
- Keep paint time low
- Avoid forced reflows
- GPU-accelerated transforms preferred

#### Memory
- Should not continuously increase
- Garbage collection happens periodically
- No memory leaks (returning to baseline)

### Example Timeline
```
Good Performance:
├─ JavaScript task: 12ms
├─ Rendering: 8ms
├─ Paint: 3ms
├─ (idle): 2ms
└─ Total: ~25ms per frame ✅

Bad Performance:
├─ JavaScript task: 45ms
├─ Rendering: 20ms
├─ Paint: 15ms
├─ (idle): -20ms (OVER BUDGET!)
└─ Total: ~80ms per frame ⚠️ (causes jank)
```

---

## Method 3: Performance API (Code-based)

Add performance measurements directly in code:

```typescript
// Measure component render time
const start = performance.now();

// ... do work ...

const end = performance.now();
console.log(`Component rendered in ${end - start}ms`);
```

Or use React's built-in profiler:

```typescript
import { Profiler } from 'react';

export default function App() {
  const onRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  };

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <YourComponent />
    </Profiler>
  );
}
```

---

## Common Performance Issues & Fixes

### Issue 1: Component Re-renders Too Often
**Symptom**: React Profiler shows component rendering on every keystroke

**Causes**:
- Parent component state change
- Missing useCallback on event handlers
- Prop changes unnecessarily

**Fix**:
```typescript
// Before (bad)
const handleChange = (e) => setEmail(e.target.value);

// After (good)
const handleChange = useCallback((e) => setEmail(e.target.value), []);
```

### Issue 2: Long JavaScript Task
**Symptom**: 100ms+ task in Performance tab, causing jank

**Causes**:
- Heavy computation in event handler
- Large array sorting/filtering
- Synchronous API calls

**Fix**:
```typescript
// Before (bad)
handleClick() {
  const sorted = data.sort(...); // 200ms task
  setState(sorted);
}

// After (good)
handleClick() {
  // Defer heavy work
  requestIdleCallback(() => {
    const sorted = data.sort(...);
    setState(sorted);
  });
}
```

### Issue 3: Memory Leak
**Symptom**: Memory keeps increasing, never returns to baseline

**Causes**:
- Unmounted event listeners
- Uncleaned intervals/timeouts
- Circular references

**Fix**:
```typescript
// Before (bad)
useEffect(() => {
  window.addEventListener('scroll', handler);
});

// After (good)
useEffect(() => {
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);
```

### Issue 4: Forced Reflow
**Symptom**: Layout takes 50ms+, repeated in quick succession

**Causes**:
- Accessing offsetHeight in loop
- DOM reads after writes
- Layout thrashing

**Fix**:
```typescript
// Before (bad)
items.forEach(item => {
  item.style.width = item.parentElement.offsetWidth + 'px';
});

// After (good)
const width = container.offsetWidth;
items.forEach(item => {
  item.style.width = width + 'px';
});
```

---

## Profiling Checklist

- [ ] Profile Dashboard load - check for unnecessary re-renders
- [ ] Profile Form interactions - ensure input validation is fast
- [ ] Profile Generation - verify loading state is smooth
- [ ] Profile Export - ensure download doesn't freeze UI
- [ ] Check for memory leaks - no continuous memory growth
- [ ] Verify 60fps - no dropped frames on interactions
- [ ] Check long tasks - all < 50ms
- [ ] Verify animations are smooth - GPU accelerated

---

## Tools & Resources

### Browser DevTools
- Chrome DevTools Performance tab (built-in)
- React DevTools Profiler (extension)
- Memory tab for leak detection

### Command Line
```bash
# Check bundle analysis
npm run build
npx vite-plugin-visualizer dist/stats.html

# Check for large dependencies
npm list --depth=0
```

### Online Tools
- [Lighthouse](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Phobia](https://bundlephobia.com/)

---

## Expected Results for SyntheticAI

Based on Phase 8 optimizations:

| Component | Render Time | Target | Status |
|-----------|-------------|--------|--------|
| Login Form | 8-12ms | < 16ms | ✅ |
| Dashboard | 15-20ms | < 16ms | ⚠️ May need optimization |
| ProjectDetail | 10-15ms | < 16ms | ✅ |
| Export Modal | 5-8ms | < 16ms | ✅ |
| Toast Notification | 2-3ms | < 16ms | ✅ |

If Dashboard exceeds 16ms, investigate:
- Memoize ProjectCard component
- Lazy load project previews
- Virtualize long project lists

---

## Quick Start

1. **Quick Profile**: 
   ```bash
   npm run dev
   # Open DevTools → Profiler → Record interaction
   ```

2. **Deep Analysis**:
   ```bash
   npm run dev
   # Open DevTools → Performance → Record → Analyze
   ```

3. **Identify Slowest**:
   ```bash
   # React Profiler shows "Ranked Chart"
   # Look for components with longest bars
   ```

---

**Last Updated**: May 10, 2026
