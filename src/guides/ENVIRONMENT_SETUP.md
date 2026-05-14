# SyntheticAI Environment Setup & Configuration

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/syntheticai/platform.git
cd platform

# 2. Install dependencies
npm install

# 3. Setup environment variables (see below)
cp server/.env.example server/.env
cp .env.example .env

# 4. Start development
npm run dev          # Frontend on http://localhost:5173
npm run server       # Backend on http://localhost:4000
```

---

## Environment Variables

### Required Variables

Create `server/.env` with the following:

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# API Keys for AI Services
OPENROUTER_API_KEY=sk_openrouter_xxxxxxxxxx
GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
FLUX_API_KEY=fk_xxxxxxxxxxxxxxxxxxxxxxxx
STABLE_DIFFUSION_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx

# Database (Supabase)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxxx
SUPPORT_EMAIL=support@syntheticai.com

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx

# AWS S3 for Asset Storage
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=syntheticai-assets

# Authentication
JWT_SECRET=your_jwt_secret_for_auth
JWT_EXPIRY=7d

# Analytics
MIXPANEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
SENTRY_DSN=https://xxxxxxxx@sentry.io/xxxxxxxx
```

### Optional Variables

```env
# Development
DEBUG=syntheticai:*
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=100

# Caching
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600

# CDN Configuration
CDN_URL=https://cdn.syntheticai.com
CDN_CACHE_TTL=86400
```

---

## API Key Setup

### OpenRouter (Text Generation - Priority 1)

1. Visit https://openrouter.ai
2. Sign up and create an account
3. Navigate to API Keys
4. Create new key
5. Copy and set as `OPENROUTER_API_KEY`

**Testing:**
```bash
curl "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

### Google Gemini (Text Generation - Priority 2)

1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy key and set as `GEMINI_API_KEY`

**Testing:**
```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$GEMINI_API_KEY \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Flux (Image Generation - Priority 1)

1. Visit https://www.black-forest-labs.com
2. Sign up for API access
3. Get your API key from dashboard
4. Set as `FLUX_API_KEY`

### Stable Diffusion (Image Generation - Priority 2)

1. Visit https://stability.ai
2. Create account and add payment method
3. Go to API Keys
4. Generate new key
5. Set as `STABLE_DIFFUSION_API_KEY`

### Supabase Database Setup

1. Visit https://supabase.com
2. Create new project
3. Copy Project URL → `SUPABASE_URL`
4. Copy anon key or service role key → `SUPABASE_KEY`
5. Run `src/database/schema.sql` in SQL editor to create tables
6. Enable Row Level Security (RLS) on production

### Stripe Payment Processing

1. Visit https://stripe.com
2. Create account
3. Get keys from Dashboard → Developers → API Keys
4. Copy Secret Key → `STRIPE_SECRET_KEY`
5. Copy Publishable Key → `STRIPE_PUBLISHABLE_KEY`
6. Setup webhooks to get → `STRIPE_WEBHOOK_SECRET`

### AWS S3 Asset Storage

1. Go to https://aws.amazon.com
2. Create S3 bucket: `syntheticai-assets`
3. Create IAM user with S3 access
4. Get Access Key ID and Secret
5. Set environment variables

### SendGrid Email

1. Visit https://sendgrid.com
2. Create account
3. Verify sender domain
4. Get API key
5. Configure SMTP credentials

---

## Development Environment

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Install Global Tools (Optional)

```bash
# Package management
npm install -g pnpm

# Environment variable validation
npm install -g dotenv-cli

# Testing
npm install -g vitest
```

### Database Development Setup

```bash
# Using Supabase locally (optional)
npm install -g supabase

# Start local Supabase
supabase start

# Stop local Supabase
supabase stop
```

---

## File Structure

```
project/
├── src/
│   ├── components/           # React components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── api/                 # API client
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   ├── design/              # Design system docs
│   ├── brand/               # Brand guidelines
│   ├── guides/              # Developer guides
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── vite-env.d.ts        # Vite types
├── server/
│   ├── routes/              # Express routes
│   ├── middleware/          # Express middleware
│   ├── services/            # Business logic
│   ├── aiOrchestrator.js    # AI service
│   ├── index.js             # Server entry
│   └── .env.example         # Environment template
├── public/                  # Static assets
├── dist/                    # Production build
├── node_modules/            # Dependencies
├── package.json             # Project metadata
├── vite.config.ts           # Vite config
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind config
├── .gitignore               # Git ignore
└── README.md                # Project docs
```

---

## Development Workflow

### Starting Development Server

```bash
# Terminal 1: Frontend (Vite dev server)
npm run dev

# Terminal 2: Backend (Node.js)
npm run server
```

Alternatively, use a process manager:

```bash
# Install concurrently
npm install -D concurrently

# Add to package.json scripts
"dev": "concurrently \"npm run dev:frontend\" \"npm run dev:server\""

# Run both
npm run dev
```

### Build for Production

```bash
# Build frontend
npm run build

# Build command compiles TypeScript + Vite
# Output: dist/ directory

# Preview production build locally
npm run preview
```

### Environment Variable Validation

```typescript
// src/config/validateEnv.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
});

export const env = envSchema.parse(import.meta.env);
```

---

## Database Migrations

### Create Migration

```bash
# Using Supabase CLI
supabase migration new add_new_table

# Edit the migration file
# Run migration
supabase db push
```

### Applying Schema Changes

1. Write SQL in `src/database/schema.sql`
2. Test locally first
3. Apply to development Supabase project
4. Test in staging
5. Apply to production

---

## Testing Environment Setup

### Unit Testing

```bash
# Install Vitest
npm install -D vitest

# Run tests
npm run test

# Watch mode
npm run test:watch
```

### Integration Testing

```bash
# Install Cypress
npm install -D cypress

# Open Cypress
npx cypress open

# Run tests
npm run test:e2e
```

---

## Debugging

### Frontend Debugging

```typescript
// React DevTools browser extension
// Chrome DevTools for JavaScript debugging
// VS Code debugger configuration (.vscode/launch.json)

{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### Backend Debugging

```bash
# Run with inspector
node --inspect server/index.js

# VS Code debugger for Node
# Install Debugger for Chrome extension
# Set breakpoints and debug
```

### Environment Variable Debugging

```bash
# Check loaded variables
npm run env:check

# Script to add to package.json:
# "env:check": "node -r dotenv/config -e \"console.log(process.env)\""
```

---

## Production Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add OPENROUTER_API_KEY
vercel env add GEMINI_API_KEY
# ... (add all required variables)
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4000
EXPOSE 5173

CMD ["npm", "run", "start"]
```

---

## Monitoring Production

```typescript
// Sentry error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## Security Checklist

- [ ] All API keys stored in environment variables (never in code)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] JWT tokens configured with expiration
- [ ] HTTPS enforced in production
- [ ] Database password strong
- [ ] API keys rotated regularly
- [ ] No sensitive data in logs
- [ ] XSS protection configured
- [ ] CSRF tokens implemented

---

## Troubleshooting

### API Connection Issues

```bash
# Check if backend is running
curl http://localhost:4000/api/health

# Check environment variables
echo $OPENROUTER_API_KEY
echo $GEMINI_API_KEY
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Kill process using port 4000
lsof -ti:4000 | xargs kill -9

# Or use different port
PORT=5000 npm run server
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run type-check

# Fix all fixable issues
npm run type-check -- --noEmit
```
