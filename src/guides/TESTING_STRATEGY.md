# SyntheticAI Testing & QA Strategy

## Testing Pyramid

```
          🎯 E2E Tests (5-10%)
         ↑ Critical user flows
        /\
       /  \
      / UI  \
     /______\
    🧪 Integration (15-25%)
   ↑ Feature interactions
  /\
 /  \
/____\
📝 Unit Tests (70-80%)
Individual components & functions
```

---

## 1. Unit Testing

### Setup

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/dom
```

### Component Unit Tests

```typescript
// src/components/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="secondary">Text</Button>);
    expect(container.querySelector('button')).toHaveClass('variant-secondary');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Hook Unit Tests

```typescript
// src/hooks/__tests__/useDebounce.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('debounces value after delay', async () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });

    vi.useRealTimers();
  });
});
```

### Service Unit Tests

```typescript
// server/__tests__/unit/aiOrchestrator.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiOrchestrator } from '../../services/aiOrchestrator';

describe('AI Orchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates product with valid prompt', async () => {
    const prompt = 'AI productivity tools';
    const result = await aiOrchestrator.generateProduct(prompt);

    expect(result).toHaveProperty('niche');
    expect(result).toHaveProperty('demandScore');
    expect(result).toHaveProperty('title');
  });

  it('uses OpenRouter when available', async () => {
    const spy = vi.spyOn(aiOrchestrator, 'generateViaOpenRouter');
    await aiOrchestrator.generateText('test');
    expect(spy).toHaveBeenCalled();
  });

  it('falls back to Gemini on OpenRouter failure', async () => {
    vi.mocked(aiOrchestrator.generateViaOpenRouter).mockRejectedValueOnce(
      new Error('API Error')
    );
    const spy = vi.spyOn(aiOrchestrator, 'generateViaGemini');
    
    await aiOrchestrator.generateText('test');
    expect(spy).toHaveBeenCalled();
  });
});
```

---

## 2. Integration Testing

### API Integration Tests

```typescript
// tests/integration/api.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

describe('API Integration', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get auth token
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'testpass123',
    });
    authToken = response.data.token;
  });

  it('generates product successfully', async () => {
    const response = await axios.post(
      `${API_URL}/api/generate`,
      { prompt: 'AI tools' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('niche');
  });

  it('requires authentication', async () => {
    try {
      await axios.post(`${API_URL}/api/generate`, {
        prompt: 'AI tools',
      });
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });
});
```

### Database Integration Tests

```typescript
// tests/integration/database.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../server/services/database';

describe('Database Integration', () => {
  beforeEach(async () => {
    // Create test data
    await db.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [
      'test@example.com',
      'hashedpassword',
    ]);
  });

  afterEach(async () => {
    // Clean up test data
    await db.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
  });

  it('creates user successfully', async () => {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      ['test@example.com']
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].email).toBe('test@example.com');
  });

  it('enforces email uniqueness', async () => {
    try {
      await db.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
        ['test@example.com', 'hash']
      );
      expect.fail('Should have thrown unique constraint error');
    } catch (error) {
      expect(error.message).toContain('unique');
    }
  });
});
```

---

## 3. End-to-End Testing

### Setup Cypress

```bash
npm install -D cypress
npx cypress install
```

### E2E Test Examples

```typescript
// cypress/e2e/generation-flow.cy.ts
describe('Product Generation Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.login('test@example.com', 'testpass123');
  });

  it('generates product from prompt', () => {
    // Navigate to generation page
    cy.contains('Create Product').click();

    // Input prompt
    cy.get('input[placeholder*="interests"]').type('AI productivity tools');

    // Submit
    cy.contains('Generate').click();

    // Wait for results
    cy.contains('We Found a Profitable Niche', { timeout: 10000 }).should('be.visible');

    // Verify demand score is displayed
    cy.contains(/Demand Score: \d+\/100/).should('be.visible');

    // Verify product title
    cy.get('[data-testid="product-title"]').should('not.be.empty');
  });

  it('exports generated product', () => {
    // Generate a product
    cy.contains('Create Product').click();
    cy.get('input[placeholder*="interests"]').type('AI tools');
    cy.contains('Generate').click();

    // Wait for generation
    cy.contains('We Found a Profitable Niche', { timeout: 10000 }).should('be.visible');

    // Click export
    cy.contains('Export Package').click();

    // Select format
    cy.get('select[name="format"]').select('PDF');

    // Download
    cy.contains('Download').click();

    // Verify download started
    cy.readFile('cypress/downloads/SyntheticAI_Product.pdf').should('exist');
  });

  it('saves project successfully', () => {
    // Generate and save
    cy.contains('Create Product').click();
    cy.get('input[placeholder*="interests"]').type('AI tools');
    cy.contains('Generate').click();

    cy.contains('Save Project').click();
    cy.get('input[placeholder*="project name"]').type('My First Project');
    cy.contains('Save').click();

    // Verify saved
    cy.contains('Project saved successfully').should('be.visible');
    cy.contains('My First Project').should('be.visible');
  });
});
```

### API E2E Tests

```typescript
// cypress/e2e/api-endpoints.cy.ts
describe('API Endpoints', () => {
  it('health check returns ok', () => {
    cy.request('GET', 'http://localhost:4000/api/health').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'ok');
    });
  });

  it('generate endpoint requires auth', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/api/generate',
      body: { prompt: 'AI tools' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(401);
    });
  });

  it('generate endpoint with auth returns product', () => {
    cy.login('test@example.com', 'testpass123').then((token) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:4000/api/generate',
        headers: { Authorization: `Bearer ${token}` },
        body: { prompt: 'AI productivity tools' },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('niche');
        expect(response.body).to.have.property('demandScore');
      });
    });
  });
});
```

---

## 4. Performance Testing

### Lighthouse Testing

```bash
npm install -D @lighthouse/cli
npm run lighthouse
```

### Load Testing with Artillery

```yaml
# load-test.yml
config:
  target: 'http://localhost:4000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 120
      arrivalRate: 50
      name: 'Ramp up load'
    - duration: 60
      arrivalRate: 10
      name: 'Cool down'

scenarios:
  - name: 'Generation API'
    flow:
      - post:
          url: '/api/generate'
          headers:
            Authorization: 'Bearer {{ $randomString(20) }}'
          body: '{"prompt": "AI tools"}'
          expect:
            - statusCode: 200
              timeout: 30000
```

### Run Load Test

```bash
npm install -D artillery
artillery run load-test.yml
```

---

## 5. Visual Regression Testing

### Setup Percy (Visual Regression)

```bash
npm install -D @percy/cli @percy/cypress
npx percy app:install
```

### Visual Regression Tests

```typescript
// cypress/e2e/visual-regression.cy.ts
describe('Visual Regression Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('hero section looks correct', () => {
    cy.contains('Premium AI-Powered Digital Product Builder').should('be.visible');
    cy.percySnapshot('Hero Section');
  });

  it('generation form renders correctly', () => {
    cy.contains('Create Product').click();
    cy.percySnapshot('Generation Form');
  });

  it('product preview displays correctly', () => {
    // Navigate to product preview
    cy.contains('View Products').click();
    cy.percySnapshot('Product Preview');
  });
});
```

---

## 6. Test Coverage

### Setup Coverage

```bash
npm install -D @vitest/coverage-c8
```

### Run with Coverage

```bash
npm run test -- --coverage
```

### Coverage Targets

- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

---

## 7. Testing Best Practices

### Naming Conventions

```typescript
// ✅ Good: Clear, specific test names
it('generates demand score between 0 and 100', () => {});
it('shows error message when API fails', () => {});
it('saves project with correct timestamp', () => {});

// ❌ Bad: Vague names
it('works', () => {});
it('test generation', () => {});
it('checks data', () => {});
```

### Arrange-Act-Assert Pattern

```typescript
it('calculates correct demand score', () => {
  // Arrange
  const mockNiche = { name: 'AI tools', market: 'B2B' };
  
  // Act
  const score = calculateDemandScore(mockNiche);
  
  // Assert
  expect(score).toBeGreaterThanOrEqual(0);
  expect(score).toBeLessThanOrEqual(100);
});
```

### Avoid Testing Implementation Details

```typescript
// ❌ Bad: Tests implementation
it('calls generateViaOpenRouter', () => {
  vi.spyOn(aiOrchestrator, 'generateViaOpenRouter');
  aiOrchestrator.generateText('test');
  expect(aiOrchestrator.generateViaOpenRouter).toHaveBeenCalled();
});

// ✅ Good: Tests behavior
it('generates text successfully', async () => {
  const result = await aiOrchestrator.generateText('test');
  expect(result).toBeTruthy();
  expect(result.length).toBeGreaterThan(0);
});
```

---

## 8. Test Maintenance

### Flaky Tests

- Test should be deterministic
- Avoid `setTimeout` in tests (use `vi.useFakeTimers()`)
- Mock external APIs
- Use unique test data

### Test Isolation

```typescript
describe('User Creation', () => {
  beforeEach(async () => {
    // Setup before each test
    await db.query('DELETE FROM users');
  });

  afterEach(async () => {
    // Cleanup after each test
    await db.query('DELETE FROM users');
  });

  it('test 1', () => {});
  it('test 2', () => {}); // Independent from test 1
});
```

---

## 9. CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm install

      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 10. Testing Checklist

- [ ] Unit tests for all utilities and functions
- [ ] Component tests for interactive elements
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Visual regression tests for UI
- [ ] Performance tests (Lighthouse, load)
- [ ] 80%+ code coverage
- [ ] All tests passing in CI/CD
- [ ] No flaky tests
- [ ] Test data properly cleaned up
- [ ] Error scenarios tested
- [ ] Accessibility tested
- [ ] Mobile responsiveness tested

---

## 11. Testing Commands

```bash
# Run unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run specific test file
npm run test -- src/components/__tests__/Button.test.tsx

# Update snapshots
npm run test -- -u
```
