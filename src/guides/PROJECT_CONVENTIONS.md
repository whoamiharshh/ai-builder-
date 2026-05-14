# SyntheticAI Project Structure & Code Conventions

## Directory Structure

```
syntheticai/
├── src/
│   ├── components/
│   │   ├── ui/                      # Core UI components (reusable)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── sections/                # Page sections (composition)
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeatureSection.tsx
│   │   │   └── ...
│   │   ├── DesignTokens.tsx         # Design system tokens
│   │   └── index.ts                 # Component exports
│   ├── pages/
│   │   ├── Home.tsx                 # Landing page
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── Generate.tsx             # Generation flow
│   │   ├── Projects.tsx             # Projects list
│   │   ├── Analytics.tsx            # Analytics dashboard
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── ResetPassword.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useAuth.ts               # Authentication
│   │   ├── useGeneration.ts         # Generation state
│   │   ├── useProjects.ts           # Projects management
│   │   ├── useAnalytics.ts          # Analytics data
│   │   ├── useFetch.ts              # Data fetching
│   │   └── useLocalStorage.ts       # Local storage
│   ├── services/
│   │   ├── api.ts                   # API client
│   │   ├── auth.ts                  # Authentication logic
│   │   ├── analytics.ts             # Analytics tracking
│   │   └── storage.ts               # Local storage utilities
│   ├── utils/
│   │   ├── cn.ts                    # Utility for classnames
│   │   ├── format.ts                # Formatting utilities
│   │   ├── validation.ts            # Form validation
│   │   ├── errors.ts                # Error handling
│   │   └── constants.ts             # App constants
│   ├── types/
│   │   ├── index.ts                 # Type exports
│   │   ├── api.ts                   # API types
│   │   ├── models.ts                # Domain models
│   │   └── ui.ts                    # UI component types
│   ├── context/
│   │   ├── AuthContext.tsx          # Auth context
│   │   ├── ThemeContext.tsx         # Theme context
│   │   └── AppContext.tsx           # Global app context
│   ├── design/
│   │   ├── DESIGN_SYSTEM.md
│   │   └── UX_WIREFRAMES.md
│   ├── brand/
│   │   ├── BRAND_IDENTITY.md
│   │   ├── COPYWRITING_GUIDE.md
│   │   └── COLOR_PALETTE.ts
│   ├── guides/
│   │   ├── API_REFERENCE.md
│   │   ├── ENVIRONMENT_SETUP.md
│   │   └── PROJECT_CONVENTIONS.md (this file)
│   ├── database/
│   │   └── schema.sql
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── server/
│   ├── routes/
│   │   ├── health.js                # Health check
│   │   ├── api.js                   # Generation API
│   │   ├── projects.js              # Project management
│   │   ├── auth.js                  # Authentication
│   │   └── analytics.js             # Analytics
│   ├── middleware/
│   │   ├── auth.js                  # Auth middleware
│   │   ├── errorHandler.js          # Error handling
│   │   ├── rateLimit.js             # Rate limiting
│   │   ├── cors.js                  # CORS configuration
│   │   └── logging.js               # Request logging
│   ├── services/
│   │   ├── aiOrchestrator.js        # AI service
│   │   ├── database.js              # Database client
│   │   ├── email.js                 # Email service
│   │   ├── stripe.js                # Payment processing
│   │   └── storage.js               # Asset storage (S3)
│   ├── controllers/
│   │   ├── generationController.js
│   │   ├── projectController.js
│   │   └── authController.js
│   ├── utils/
│   │   ├── logger.js                # Logging
│   │   ├── validation.js            # Server validation
│   │   └── helpers.js               # Helper functions
│   ├── config/
│   │   ├── database.js              # DB config
│   │   └── environment.js           # Environment setup
│   ├── index.js                     # Server entry point
│   ├── .env.example                 # Environment template
│   └── package.json                 # Server dependencies
├── public/                          # Static assets
│   ├── icons/
│   ├── images/
│   └── fonts/
├── tests/
│   ├── unit/                        # Unit tests
│   ├── integration/                 # Integration tests
│   └── e2e/                         # E2E tests
├── .github/
│   └── workflows/                   # GitHub Actions
├── .vscode/                         # VS Code settings
├── .gitignore
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── prettier.config.js
└── README.md
```

---

## TypeScript Conventions

### File Naming

```
Component files:       MyComponent.tsx
Hook files:          useMyHook.ts
Service files:       myService.ts
Type definitions:    types.ts or models.ts
Utility files:       utils.ts or helpers.ts
```

### Type Definitions

```typescript
// ✅ Good: Descriptive names, grouped logically
interface GenerationRequest {
  prompt: string;
  style?: 'professional' | 'casual' | 'luxury';
  targetAudience?: string;
  includeImages?: boolean;
}

interface GenerationResponse {
  id: string;
  niche: NicheAnalysis;
  demandScore: DemandScore;
  productType: string;
  title: string;
  // ...
}

// ❌ Bad: Vague names, no structure
interface Data {
  p: string;
  s?: string;
  t?: string;
}
```

### Component Structure

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

// 1. Type definitions
interface MyComponentProps {
  title: string;
  description?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

// 2. Constants (if any)
const ANIMATION_DURATION = 0.3;

// 3. Component
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onClick,
  variant = 'primary',
  className,
}) => {
  // 4. State and hooks
  const [isOpen, setIsOpen] = React.useState(false);

  // 5. Effects
  React.useEffect(() => {
    // Effect logic
  }, []);

  // 6. Handlers
  const handleClick = () => {
    onClick?.();
    setIsOpen(!isOpen);
  };

  // 7. Render
  return (
    <motion.div
      className={cn('component-base', {
        'variant-primary': variant === 'primary',
        'variant-secondary': variant === 'secondary',
      }, className)}
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </motion.div>
  );
};
```

---

## React Conventions

### Functional Components Only

```typescript
// ✅ Good: Functional component with hooks
export const MyComponent: React.FC<Props> = ({ prop }) => {
  const [state, setState] = useState(false);
  return <div>{state ? 'On' : 'Off'}</div>;
};

// ❌ Avoid: Class components
class MyComponent extends React.Component {
  // ...
}
```

### Custom Hooks

```typescript
// ✅ Good: Descriptive name, handles side effects
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const debouncedSearch = useDebounce(searchTerm, 300);
```

### Component Export Pattern

```typescript
// Good: Named export
export const MyComponent = () => {/* */};

// Also good: Default export for pages only
export default MyPage;
```

---

## Styling Conventions

### TailwindCSS

```typescript
// ✅ Good: Semantic, organized classes
<div className="flex items-center justify-between rounded-lg bg-slate-900 p-4 shadow-lg">
  <span className="text-lg font-semibold text-slate-100">Title</span>
  <button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
    Action
  </button>
</div>

// ❌ Avoid: Long class strings, hard to read
<div className="flex w-full h-full justify-center items-center rounded border border-gray-300 p-2 m-2 bg-white text-black">
```

### Using cn() Utility

```typescript
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'rounded-lg font-semibold transition-colors',
        {
          'bg-purple-600 text-white hover:bg-purple-700': variant === 'primary',
          'bg-slate-200 text-slate-900 hover:bg-slate-300': variant === 'secondary',
        },
        {
          'px-3 py-1 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
};
```

---

## API Integration

### API Client Pattern

```typescript
// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 30000,
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  generation: {
    create: (prompt: string) => apiClient.post('/api/generate', { prompt }),
    list: () => apiClient.get('/api/generations'),
    get: (id: string) => apiClient.get(`/api/generations/${id}`),
  },
  projects: {
    create: (data: ProjectData) => apiClient.post('/api/projects', data),
    list: () => apiClient.get('/api/projects'),
    delete: (id: string) => apiClient.delete(`/api/projects/${id}`),
  },
};
```

---

## Error Handling

### Error Strategy

```typescript
// src/utils/errors.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Usage in components
try {
  await api.generation.create(prompt);
} catch (error) {
  const message = handleApiError(error);
  showErrorToast(message);
}
```

---

## State Management

### Context API Pattern

```typescript
// src/context/AppContext.tsx
import React, { createContext, useState } from 'react';

interface AppContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for easy access
export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

---

## Node.js Backend Conventions

### Express Route Structure

```javascript
// server/routes/api.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as generationController from '../controllers/generationController.js';

const router = express.Router();

// All generation routes
router.post(
  '/generate',
  authenticateToken,
  generationController.create
);

router.get(
  '/generations',
  authenticateToken,
  generationController.list
);

router.get(
  '/generations/:id',
  authenticateToken,
  generationController.getById
);

export default router;
```

### Controller Pattern

```javascript
// server/controllers/generationController.js
import { aiOrchestrator } from '../services/aiOrchestrator.js';
import { logger } from '../utils/logger.js';

export async function create(req, res, next) {
  try {
    const { prompt } = req.body;
    const userId = req.user.id;

    // Validate
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Process
    const result = await aiOrchestrator.generateProduct(prompt);

    // Respond
    return res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Generation error:', error);
    next(error);
  }
}

export async function list(req, res, next) {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const userId = req.user.id;

    const generations = await db.query(
      'SELECT * FROM ai_generations WHERE user_id = $1 LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    return res.json({ data: generations.rows });
  } catch (error) {
    next(error);
  }
}
```

### Middleware Pattern

```javascript
// server/middleware/auth.js
import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
```

---

## Testing Conventions

### Unit Tests

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies variant className', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('variant-secondary');
  });
});
```

---

## Naming Conventions

### Variables & Functions

```typescript
// ✅ Good: Clear, descriptive names
const isGenerating = true;
const generatedProductTitle = 'My Product';
const handleGenerationComplete = () => {};
const calculateDemandScore = () => {};

// ❌ Avoid: Cryptic abbreviations
const gen = true;
const pt = 'My Product';
const handle = () => {};
const calc = () => {};
```

### Constants

```typescript
// ✅ Good: SCREAMING_SNAKE_CASE
const API_TIMEOUT = 30000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const DEFAULT_PAGE_SIZE = 20;

// Also good: Grouped in objects
const CONFIG = {
  API: {
    TIMEOUT: 30000,
    BASE_URL: 'http://localhost:4000',
  },
  LIMITS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    MAX_REQUESTS_PER_HOUR: 100,
  },
};
```

---

## Import/Export Conventions

```typescript
// ✅ Good: Organized, grouped by source
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Local imports
import { Button } from './Button';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import type { User } from '@/types';

export const MyComponent = () => {};

// ❌ Avoid: Scattered imports, no organization
import type { User } from '@/types';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import React from 'react';
import { Button } from './Button';
```

---

## Documentation & Comments

### JSDoc for Functions

```typescript
/**
 * Calculate the demand score for a niche
 * @param niche - The niche to analyze
 * @param dataSource - Which data sources to use
 * @returns The calculated demand score (0-100)
 * @throws {ApiError} If the API call fails
 * @example
 * const score = await calculateDemandScore('AI tools', 'comprehensive');
 */
export async function calculateDemandScore(
  niche: string,
  dataSource: 'quick' | 'comprehensive' = 'quick'
): Promise<number> {
  // Implementation
}
```

### Component Documentation

```typescript
/**
 * PrimaryButton Component
 * 
 * A reusable button component with primary styling. Supports multiple
 * sizes and states (loading, disabled, etc).
 * 
 * @component
 * @example
 * return (
 *   <PrimaryButton onClick={() => alert('Clicked')}>
 *     Click me
 *   </PrimaryButton>
 * )
 */
export const PrimaryButton: React.FC<ButtonProps> = (props) => {};
```

---

## Git Conventions

### Commit Messages

```
Format: <type>(<scope>): <subject>

Types:
- feat:    New feature
- fix:     Bug fix
- docs:    Documentation
- style:   Formatting
- refactor: Code restructure
- perf:    Performance improvement
- test:    Test additions
- chore:   Build/dependency updates

Examples:
feat(generation): add AI product generation endpoint
fix(ui): resolve button alignment issue
docs(api): add endpoint documentation
refactor(hooks): simplify useGeneration hook
```

### Branch Naming

```
feature/user-authentication
fix/generation-timeout
docs/api-documentation
chore/update-dependencies
```

---

## Performance Best Practices

1. **Lazy load heavy components** with React.lazy()
2. **Memoize expensive computations** with useMemo
3. **Memoize callbacks** with useCallback
4. **Use virtual lists** for large datasets
5. **Debounce search/filter** inputs
6. **Implement request caching** in API client
7. **Use skeleton screens** for loading states
8. **Optimize images** with WebP and lazy loading
9. **Code split** by route
10. **Monitor bundle size** regularly

---

## Code Quality Tools

### Setup ESLint

```bash
npm install -D eslint @typescript-eslint/eslint-plugin
npm init @eslint/config
```

### Setup Prettier

```bash
npm install -D prettier
echo '{}' > prettier.config.js
```

### VS Code Settings (.vscode/settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["typescript", "typescriptreact"],
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true
  }
}
```
