# 🧪 Testing Guide - Payment Integration & Monitoring

## Step 1: Payment System Testing

### Local Testing Setup

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows: Download from https://stripe.com/docs/stripe-cli/install
# Linux: sudo apt-get install stripe

# Authenticate
stripe login

# Get your API key and webhook signing secret
stripe api-keys
```

### Test Stripe Cards

Use these test cards to simulate different scenarios:

**Successful Payment**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/26)
- CVC: Any 3 digits (e.g., 123)
- Expected: ✅ Payment succeeds

**Card Declined**
- Card: `4000 0000 0000 0002`
- Expected: ❌ Payment declined

**Insufficient Funds**
- Card: `4000 0000 0000 9995`
- Expected: ❌ Insufficient funds error

**3D Secure Required**
- Card: `4000 0025 0000 3155`
- Expected: ⚠️ 3D Secure authentication required

**Expired Card**
- Card: `4000 0000 0000 0069`
- Expected: ❌ Card expired error

**CVC Check Fails**
- Card: `4000 0000 0000 0127`
- Expected: ❌ CVC check failed

### Testing the Checkout Flow

1. **Start local dev server**
   ```bash
   npm run dev
   # Frontend: http://localhost:5173
   
   npm start
   # Backend: http://localhost:3000
   ```

2. **Forward webhook events**
   ```bash
   stripe listen --forward-to localhost:3000/api/payment/webhook
   # Copy the signing secret (whsec_...)
   # Add to .env: STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

3. **Test checkout endpoint directly**
   ```bash
   curl -X POST http://localhost:3000/api/payment/checkout \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "priceId": "price_studio_monthly",
       "planId": "studio-monthly"
     }'
   
   # Expected response:
   # { "sessionId": "cs_test_..." }
   ```

4. **Test complete checkout flow**
   - Navigate to http://localhost:5173/pricing
   - Select a plan
   - Click "Get [Plan Name]"
   - Use test card `4242 4242 4242 4242`
   - Verify redirect to dashboard

5. **Monitor webhook events**
   - Watch the Stripe CLI output for webhook events
   - Should see:
     ```
     2026-05-10 12:23:17  ▶ evt_1test...
     Loaded evt_1test as event
     ✓ checkout.session.completed [ch_test...]
     Forwarding to http://localhost:3000/api/payment/webhook
     ✓ [200] POST /api/payment/webhook [2.5ms]
     ```

## Step 2: Email Notification Testing

### SendGrid Integration

1. **Create SendGrid Account**
   - Sign up at https://sendgrid.com
   - Create API key in Settings → API Keys
   - Add to .env: `SENDGRID_API_KEY=SG.xxxxx`

2. **Test Email Service Locally**
   ```typescript
   // server/test-email.ts
   import { sendOrderConfirmation } from './emailService';
   
   sendOrderConfirmation('test@example.com', {
     plan: 'Studio',
     amount: 12900,
     period: 'monthly',
     startDate: new Date(),
     endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
   });
   ```

3. **Verify Email Delivery**
   - Check SendGrid Activity → Processed
   - Check test inbox for email
   - Click links to verify formatting

### Email Templates Testing

Test each email type:
- ✅ Order confirmation
- ✅ Payment failed
- ✅ Subscription canceled
- ✅ Invoice PDF

## Step 3: Database Testing

### Create Test Data

```sql
-- Create test user
INSERT INTO auth.users (email, encrypted_password)
VALUES ('test@example.com', 'hashed_password');

-- Create test subscription
INSERT INTO subscriptions (
  user_id,
  stripe_subscription_id,
  stripe_customer_id,
  plan_id,
  status,
  current_period_start,
  current_period_end
) VALUES (
  'user-uuid',
  'sub_test123',
  'cus_test123',
  'studio-monthly',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days'
);

-- Create test order
INSERT INTO orders (
  user_id,
  stripe_session_id,
  plan_id,
  amount_paid,
  status,
  email
) VALUES (
  'user-uuid',
  'cs_test123',
  'studio-monthly',
  12900,
  'completed',
  'test@example.com'
);
```

### Query Test Data

```sql
-- Check subscriptions
SELECT * FROM subscriptions 
WHERE user_id = 'user-uuid';

-- Check orders
SELECT * FROM orders 
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC;

-- Check payment events
SELECT * FROM payment_events
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC;
```

## Step 4: Monitoring Setup

### Sentry Testing

1. **Create Sentry Project**
   - Sign up at https://sentry.io
   - Create new project (React + Node.js)
   - Get DSN: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
   - Add to .env: `VITE_SENTRY_DSN=https://xxxxx...`

2. **Test Frontend Monitoring**
   ```typescript
   // In browser console
   Sentry.captureException(new Error('Test error'));
   Sentry.captureMessage('Test message', 'info');
   ```

3. **Test Backend Monitoring**
   ```bash
   # Trigger error endpoint
   curl http://localhost:3000/api/test-error
   
   # Should appear in Sentry dashboard
   ```

4. **Verify Sentry Dashboard**
   - Events appear in real-time
   - Source maps work (show actual code lines)
   - Breadcrumbs show user actions
   - User context is captured

## Step 5: Load Testing

### Test Payment System Under Load

```bash
# Install Apache Bench
# macOS: brew install httpd
# Others: apt-get install apache2-utils

# Test checkout endpoint
ab -n 100 -c 10 http://localhost:3000/api/payment/webhook

# Test pricing page
ab -n 1000 -c 50 http://localhost:5173/pricing
```

### Expected Results
- Response time: <200ms
- Error rate: <1%
- No crashes or memory leaks

## Step 6: End-to-End Testing Checklist

### User Journey: Free → Founder Plan

- [ ] User navigates to /pricing
- [ ] Sees monthly plan at $49
- [ ] Clicks "Get Founder"
- [ ] Redirected to Stripe checkout
- [ ] Enters test card 4242 4242 4242 4242
- [ ] Completes payment
- [ ] Redirected to dashboard
- [ ] Receives order confirmation email
- [ ] Subscription appears in database
- [ ] Credits updated in user account

### User Journey: Founder → Studio Plan Upgrade

- [ ] User on dashboard with Founder plan
- [ ] Clicks upgrade link
- [ ] Navigates to /pricing
- [ ] Selects Studio plan
- [ ] Completes checkout
- [ ] Old subscription canceled
- [ ] New subscription created
- [ ] Credits updated
- [ ] Receives upgrade confirmation email

### Webhook Event Testing

Send test events via Stripe CLI:

```bash
# Test subscription created
stripe trigger checkout.session.completed

# Test subscription updated
stripe trigger customer.subscription.updated

# Test payment failed
stripe trigger invoice.payment_failed

# Monitor webhooks
stripe logs tail
```

## Step 7: Security Testing

### API Security Tests

```bash
# Test unauthorized access
curl -X POST http://localhost:3000/api/payment/checkout \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_studio_monthly"}'
# Expected: 401 Unauthorized

# Test invalid price
curl -X POST http://localhost:3000/api/payment/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VALID_TOKEN" \
  -d '{"priceId":"invalid_price"}'
# Expected: 400 Invalid price

# Test CORS
curl -H "Origin: http://evil.com" \
  http://localhost:3000/api/payment/checkout
# Expected: CORS blocked or whitelist error
```

### SQL Injection Prevention

```bash
# Try SQL injection in plan ID
curl -X POST http://localhost:3000/api/payment/checkout \
  -d '{"priceId":"price_studio_monthly\' OR 1=1--"}'
# Expected: Parameterized query prevents injection
```

### XSS Prevention

```bash
# Try XSS in checkout
curl -X POST http://localhost:3000/api/payment/checkout \
  -d '{"planId":"<script>alert(1)</script>"}'
# Expected: Input sanitized or escaped
```

## Step 8: Performance Testing

### Lighthouse Audit

```bash
# Build for production
npm run build

# Run Lighthouse
npm install -g lighthouse

lighthouse http://localhost:3000/pricing \
  --view \
  --output-path ./lighthouse-report.html
```

### Expected Scores
- Performance: >80
- Accessibility: >90
- Best Practices: >90
- SEO: >90

### Bundle Analysis

```bash
npm install -g vite-bundle-visualizer

npm run build
npx vite-plugin-visualizer
# Opens bundle analysis in browser
```

Expected:
- Total: <200KB gzipped
- Main JS: <100KB
- CSS: <30KB

## Step 9: Continuous Monitoring (Production)

### Sentry Alerts

Set up Sentry alerts for:
- ❌ Payment errors (alert immediately)
- ⚠️ Webhook failures (alert immediately)
- 📧 Email delivery failures (alert hourly)
- 🔍 High error rates (alert if >5% errors)

### Stripe Dashboard Monitoring

Check daily:
- 💰 Revenue (total transactions)
- ❌ Failed payments (should be <5%)
- 📊 Churn rate (plan cancellations)
- 🆕 New subscribers

### Database Performance

Monitor:
- Query execution time
- Index usage
- Connection pool utilization
- Storage growth rate

### Application Metrics

Track:
- Response times
- Error rates
- Webhook latency
- Email delivery time

## Step 10: Debugging Tips

### Common Issues

**Issue**: Webhook not firing
```bash
# Check webhook configuration
stripe api --method get webhooks

# Check webhook events
stripe logs tail --filter='resource_type:webhook*'

# Resend webhook manually
stripe api --method post webhook_endpoints/{id}/test_helpers/test_clock
```

**Issue**: Payment declined
```bash
# Check test card requirements
# Use full card number without spaces
# Use future expiry date
# Use CVC from test card list above
```

**Issue**: Email not sending
```bash
# Check SendGrid key in .env
# Verify from email is whitelisted
# Check email templates for syntax errors
# Monitor SendGrid activity dashboard
```

**Issue**: Sentry not capturing errors
```bash
# Verify DSN is correct
# Check network tab for 200 responses to Sentry
# Verify sourcemaps are uploaded
# Check Sentry project settings
```

---

**Testing Checklist Summary**
- [ ] Payment system: Tested with multiple cards
- [ ] Webhooks: Configured and tested locally
- [ ] Email: Templates tested and delivery verified
- [ ] Database: Schema created, test data inserted
- [ ] Monitoring: Sentry initialized and tested
- [ ] Security: API endpoints tested for vulnerabilities
- [ ] Performance: Lighthouse scores >80, bundle <200KB
- [ ] Load: Handled 100+ concurrent requests
- [ ] E2E: Complete user journey tested
- [ ] Production: Alerts configured, monitoring active

**You're ready for production! 🚀**
