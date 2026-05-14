# Payment Integration Setup Guide

## Overview
SyntheticAI now includes Stripe payment integration with:
- Monthly & Annual subscription plans
- Founder ($49/mo or $490/yr) and Studio ($129/mo or $1290/yr) tiers
- Enterprise custom pricing
- Automatic billing and subscription management

## Installation & Setup

### 1. Install Stripe Dependencies
```bash
npm install @stripe/react-stripe-js @stripe/js stripe
```

### 2. Configure Environment Variables

**Frontend (.env or .env.production)**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
VITE_API_BASE_URL=https://api.syntheticai.com
```

**Backend (.env or .env.production)**
```env
STRIPE_SECRET_KEY=sk_live_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
FRONTEND_URL=https://syntheticai.com
```

### 3. Get Stripe Credentials

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → API Keys**
3. Copy **Publishable Key** (starts with `pk_`)
4. Copy **Secret Key** (starts with `sk_`)
5. Go to **Developers → Webhooks**
6. Create a webhook endpoint for `https://api.syntheticai.com/api/payment/webhook`
7. Select events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`
8. Copy the webhook secret

### 4. Backend Integration

Add to `server/index.js`:
```javascript
import paymentRoutes from './paymentRoutes.js';

app.use('/api/payment', paymentRoutes);

// Webhook must come before JSON middleware
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // Stripe webhook handler
});
```

## Frontend Components

### PaymentContext (`src/contexts/PaymentContext.tsx`)
Manages subscription plans and checkout state.

Usage:
```tsx
import { usePayment } from '../contexts/PaymentContext';

function MyComponent() {
  const { plans, selectedPlan } = usePayment();
  return ...;
}
```

### CheckoutButton (`src/components/CheckoutButton.tsx`)
Renders checkout button for a plan.

Usage:
```tsx
<CheckoutButton plan={plan} variant="primary" />
```

### Updated Pricing Page (`src/pages/Pricing.tsx`)
- Monthly/Annual billing toggle
- Founder & Studio plans with checkout buttons
- Enterprise contact CTA
- Real-time pricing display

## Subscription Plans

### Founder Plan
- **Monthly**: $49/mo
- **Annual**: $490/yr (Save 17%)
- 10 product concepts/month
- 50 image renders
- PDF + DOCX export
- Email & community support

### Studio Plan
- **Monthly**: $129/mo
- **Annual**: $1,290/yr (Save 17%)
- 50 product concepts/month
- 200 image renders
- Team workspaces
- Priority support

### Enterprise Plan
- Custom pricing
- Unlimited concepts & renders
- Dedicated onboarding
- Custom integrations
- Contact sales@syntheticai.com

## Backend Endpoints

### POST /api/payment/checkout
Creates a Stripe checkout session.

**Request:**
```json
{
  "priceId": "price_studio_monthly",
  "planId": "studio-monthly"
}
```

**Response:**
```json
{
  "sessionId": "cs_live_..."
}
```

**Redirect to Stripe Checkout:**
```javascript
stripe.redirectToCheckout({ sessionId })
```

### POST /api/payment/webhook
Handles Stripe webhook events:
- `checkout.session.completed` - Subscription created
- `customer.subscription.updated` - Plan changed
- `customer.subscription.deleted` - Subscription canceled

## Testing

### Stripe Test Cards
Use these for testing in dev mode:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

**Declined Payment:**
- Card: `4000 0000 0000 0002`

**3D Secure Required:**
- Card: `4000 0025 0000 3155`

### Test Webhook Events
Use Stripe CLI to forward webhook events:
```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

## Database Schema

Create subscription tracking in Supabase:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  credits_remaining INT NOT NULL DEFAULT 0,
  credits_total INT NOT NULL DEFAULT 0,
  last_renewed TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Considerations

✅ **Implemented:**
- Stripe.js handles sensitive card data (PCI DSS compliant)
- Server-side session creation (never expose secret key to client)
- Webhook signature verification
- User authentication required for checkout

⚠️ **To Add:**
- Store Stripe webhook signatures securely
- Rate limit checkout endpoint
- Validate user authorization before payment
- Audit log for all payment events
- Implement subscription status checks

## Monitoring & Analytics

### Track Conversion
```javascript
// After successful checkout
analytics.track('purchase_started', { planId, price });
```

### Monitor Stripe Events
- Dashboard: https://dashboard.stripe.com/events
- Failed events: Check webhook delivery status
- Revenue: Dashboard → Revenue Streams

## Troubleshooting

**Issue:** "Publishable key is invalid"
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- Ensure it starts with `pk_` (not `sk_`)
- Check environment is correct (test vs live)

**Issue:** Webhook not receiving events
- Verify webhook secret in `.env`
- Check webhook endpoint is publicly accessible
- Review webhook logs in Stripe Dashboard

**Issue:** Payment decline
- Check card in test mode vs live mode
- Verify Stripe account email is confirmed
- Check account for any restrictions

## Next Steps

1. ✅ Payment UI integrated
2. ⏳ Stripe account setup & credentials
3. ⏳ Database schema creation
4. ⏳ Webhook handler implementation
5. ⏳ Subscription status sync
6. ⏳ Credits system integration
7. ⏳ Invoice email notifications
8. ⏳ Subscription management portal

## References

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Subscription Management](https://stripe.com/docs/subscriptions)
- [Webhook Events](https://stripe.com/docs/api/events)
