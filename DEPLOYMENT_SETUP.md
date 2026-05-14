# 🚀 Deployment Setup Guide

## Step 1: Environment Configuration

### Frontend (.env.production)
```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# API Configuration
VITE_API_BASE_URL=https://api.syntheticai.com

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Backend (.env.production)
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application Configuration
FRONTEND_URL=https://syntheticai.com
NODE_ENV=production
PORT=3000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (for notifications)
SENDGRID_API_KEY=your_sendgrid_key_here
SENDGRID_FROM_EMAIL=noreply@syntheticai.com
```

## Step 2: Database Schema Setup

Execute these SQL commands in Supabase:

```sql
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'paused')),
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Credits tracking table
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_available INT NOT NULL DEFAULT 0,
  credits_used INT NOT NULL DEFAULT 0,
  monthly_limit INT NOT NULL DEFAULT 10,
  reset_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);

-- Payments/Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  plan_id TEXT NOT NULL,
  amount_paid INT NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_stripe_id ON orders(stripe_session_id);

-- Payment events log
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_events_stripe_id ON payment_events(stripe_event_id);
CREATE INDEX idx_payment_events_user_id ON payment_events(user_id);
```

## Step 3: Stripe Webhook Configuration

### Create Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → Webhooks**
3. Click "Add endpoint"
4. **Endpoint URL**: `https://api.syntheticai.com/api/payment/webhook`
5. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click "Add endpoint"
7. Copy the **Signing secret** to `STRIPE_WEBHOOK_SECRET` in .env

### Test Webhook Locally (Optional)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Authenticate
stripe login

# Forward webhook events to localhost
stripe listen --forward-to localhost:3000/api/payment/webhook

# Copy the webhook signing secret
# Use "whsec_" key in .env for testing
```

## Step 4: Backend Payment Routes Enhancement

File: `server/paymentRoutes.ts` already includes:
- ✅ POST /api/payment/checkout - Create checkout session
- ✅ POST /api/payment/webhook - Handle Stripe events

Ensure your `server/index.js` includes:
```javascript
import paymentRoutes from './paymentRoutes.js';

// Webhook must come BEFORE express.json()
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // Handle events...
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
});

// Regular routes
app.use(express.json());
app.use('/api/payment', paymentRoutes);
```

## Step 5: Email Notifications

### Create Email Templates

Install SendGrid:
```bash
npm install @sendgrid/mail
```

Create `server/emailService.ts`:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendOrderConfirmation(
  email: string,
  orderData: {
    plan: string;
    amount: number;
    period: string;
  }
) {
  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: `Welcome to SyntheticAI - ${orderData.plan} Plan`,
      html: `
        <h1>Order Confirmation</h1>
        <p>Welcome to SyntheticAI!</p>
        <p>Plan: <strong>${orderData.plan}</strong></p>
        <p>Amount: <strong>$${orderData.amount}</strong></p>
        <p>Billing Cycle: <strong>${orderData.period}</strong></p>
        <p>Your subscription is now active. Start creating amazing AI products!</p>
      `,
    });
  } catch (error) {
    console.error('Email send error:', error);
  }
}

export async function sendPaymentFailed(
  email: string,
  reason: string
) {
  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'Payment Failed - Action Required',
      html: `
        <h1>Payment Issue</h1>
        <p>We had trouble processing your payment:</p>
        <p>${reason}</p>
        <p><a href="https://syntheticai.com/account/billing">Update Payment Method</a></p>
      `,
    });
  } catch (error) {
    console.error('Email send error:', error);
  }
}
```

### Trigger Emails from Webhook
```typescript
case 'checkout.session.completed':
  const session = event.data.object;
  await sendOrderConfirmation(session.customer_email, {
    plan: metadata.planId,
    amount: session.amount_total / 100,
    period: 'monthly', // or 'annual'
  });
  break;

case 'invoice.payment_failed':
  const invoice = event.data.object;
  await sendPaymentFailed(invoice.customer_email, 'Your payment method was declined');
  break;
```

## Step 6: Monitoring & Error Tracking

### Sentry Setup

Install Sentry:
```bash
npm install @sentry/react @sentry/tracing
```

Update `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

Add to `.env.production`:
```
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Server-side Monitoring
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Log payment errors
app.post('/api/payment/webhook', (req, res) => {
  try {
    // ... webhook handling
  } catch (error) {
    Sentry.captureException(error);
    res.status(400).send('Webhook error');
  }
});
```

## Step 7: Deployment Platforms

### Option A: Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Set environment variables in Vercel dashboard
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_API_BASE_URL=https://api.syntheticai.com
```

### Option B: Railway (Recommended for Backend)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up

# Set environment variables in dashboard
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Option C: Docker (Any Platform)
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t syntheticai:latest .
docker run -p 3000:3000 -e STRIPE_SECRET_KEY=sk_live_xxx syntheticai:latest
```

### Option D: AWS (Backend)
```bash
# Using AWS Elastic Beanstalk
eb init -p node.js-18 syntheticai
eb create syntheticai-env
eb deploy
```

## Step 8: Health Checks

Add health check endpoint to `server/index.js`:
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

Monitor with:
```bash
# Check API is running
curl https://api.syntheticai.com/health

# Check frontend is accessible
curl https://syntheticai.com

# Check payment endpoint
curl -X POST https://api.syntheticai.com/api/payment/checkout \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_studio_monthly"}'
```

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database schema created in Supabase
- [ ] Stripe webhook configured
- [ ] SendGrid API key obtained
- [ ] Sentry project created
- [ ] Build passes without errors

### Deployment
- [ ] Frontend deployed to Vercel/hosting
- [ ] Backend deployed to Railway/hosting
- [ ] Environment variables set in production
- [ ] DNS configured (if using custom domain)
- [ ] SSL certificate installed

### Post-Deployment
- [ ] Test checkout flow end-to-end
- [ ] Verify webhook connectivity
- [ ] Check Sentry for errors
- [ ] Monitor payment processing
- [ ] Verify email notifications
- [ ] Load test with Stripe

## Rollback Plan

If deployment fails:
```bash
# Revert to previous version
git revert HEAD
npm run build
vercel deploy --prod  # or your deployment platform
```

Keep backups:
```bash
# Backup Supabase
pg_dump postgresql://user:pass@db.supabase.co/postgres > backup.sql

# Backup Stripe data
stripe_cli export data > stripe_backup.json
```
