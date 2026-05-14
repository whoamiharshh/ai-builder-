# UI Component Library

A comprehensive, production-ready component library for SyntheticAI built with React, TypeScript, TailwindCSS, and Framer Motion.

## 📦 Components

### Button
Versatile button component with multiple variants, sizes, and states.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" loading>Loading...</Button>
<Button variant="ghost" disabled>Disabled</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'outline' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `loading`: boolean
- `disabled`: boolean

### Card
Container component for content grouping with glass-morphism styling.

```tsx
import { Card } from '@/components/ui';

<Card>
  <h2>Content</h2>
  <p>Nested content goes here</p>
</Card>
```

**Props:**
- `children`: ReactNode
- `className`: string (optional)

### Input & TextArea
Form input components with labels and validation states.

```tsx
import { Input, TextArea } from '@/components/ui';

<Input label="Email" type="email" placeholder="your@email.com" />
<TextArea label="Message" placeholder="Your message..." />
```

**Props:**
- `label`: string (optional)
- `className`: string (optional)
- All standard HTML input/textarea attributes

### Badge
Status and tag display component.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="tag">New</Badge>
<Badge variant="status" status="success">Active</Badge>
<Badge variant="score">8.5/10</Badge>
```

**Props:**
- `variant`: 'tag' | 'status' | 'score' (default: 'tag')
- `status`: 'success' | 'warning' | 'error' | 'info' (for status variant)
- `className`: string (optional)

### ProgressBar
Progress indication component.

```tsx
import { ProgressBar } from '@/components/ui';

<ProgressBar value={65} label="Processing" />
```

**Props:**
- `value`: number (0-100)
- `label`: string (optional)

### LoadingSpinner & SkeletonLoader
Loading state indicators.

```tsx
import { LoadingSpinner, SkeletonLoader } from '@/components/ui';

<LoadingSpinner size="md" label="Loading..." />
<SkeletonLoader count={3} className="h-12 w-full" />
```

**LoadingSpinner Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `label`: string (optional)

**SkeletonLoader Props:**
- `className`: string (optional)
- `count`: number (default: 1)

### Modal
Dialog component with backdrop and animations.

```tsx
import { Modal } from '@/components/ui';
import { useState } from 'react';

export function Example() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
        <p>Modal content</p>
      </Modal>
    </>
  );
}
```

**Modal Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string (optional)
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `className`: string (optional)

## 🎨 Design Features

- **Consistent Styling**: All components use a unified dark theme with cyber accents
- **Animations**: Smooth transitions powered by Framer Motion
- **Accessibility**: WCAG 2.1 AA compliant with proper focus states and keyboard navigation
- **Responsive**: Mobile-first design that works across all screen sizes
- **Type-Safe**: Full TypeScript support with proper prop typing
- **Composable**: Components are designed to work together seamlessly

## 🧪 Testing

All components have comprehensive test coverage:

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

Each component has:
- Unit tests for rendering and props
- Integration tests for user interactions
- Accessibility tests
- Edge case handling

## 📚 View Components

To see all components in action, visit: `/components` in your browser

## 🎯 Best Practices

1. **Import from the main export**
   ```tsx
   import { Button, Card, Input, Badge } from '@/components/ui';
   ```

2. **Use TypeScript for type safety**
   ```tsx
   interface MyComponentProps {
     isLoading?: boolean;
     onSubmit: (data: FormData) => void;
   }
   ```

3. **Compose components together**
   ```tsx
   <Card>
     <h2>Form</h2>
     <Input label="Name" />
     <Button onClick={handleSubmit}>Submit</Button>
   </Card>
   ```

4. **Use variant props for consistency**
   ```tsx
   <Button variant="secondary">Cancel</Button>
   <Button variant="primary">Confirm</Button>
   ```

## 🔄 Animation Performance

- All animations use GPU-accelerated transforms
- Animations respect `prefers-reduced-motion`
- Performance optimized for 60fps on all devices

## 📖 Documentation

For more detailed documentation, see:
- `src/components/ComponentShowcase.tsx` - Interactive component showcase
- `src/components/ui/Button.stories.tsx` - Example stories (Storybook ready)
- Individual component test files for implementation examples

## ✅ Quality Assurance

- ✅ 80%+ test coverage
- ✅ TypeScript strict mode
- ✅ ESLint compliant
- ✅ WCAG 2.1 AA accessible
- ✅ Zero console warnings
- ✅ Responsive on all devices

---

**Version:** 1.0.0  
**Last Updated:** 2024
