import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const plans = {
  'price_founder_monthly': { name: 'Founder Monthly', credits: 10 },
  'price_founder_annual': { name: 'Founder Annual', credits: 120 },
  'price_studio_monthly': { name: 'Studio Monthly', credits: 50 },
  'price_studio_annual': { name: 'Studio Annual', credits: 600 },
};

// Create checkout session
router.post('/checkout', async (req, res) => {
  try {
    const { priceId, planId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!priceId || !plans[priceId as keyof typeof plans]) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      client_reference_id: userId,
      metadata: {
        planId,
        userId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Handle webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    console.log(`[WEBHOOK] Event: ${event.type}`, event.id);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Subscription created:', {
          userId: session.client_reference_id,
          customerId: session.customer,
          planId: (session.metadata as any)?.planId,
        });
        // TODO: Update user subscription in database
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('✅ Subscription active:', {
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
        // TODO: Store subscription in database
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('📝 Subscription updated:', {
          subscriptionId: subscription.id,
          status: subscription.status,
        });
        // TODO: Update subscription in database
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('❌ Subscription canceled:', {
          subscriptionId: subscription.id,
          canceledAt: new Date(subscription.canceled_at! * 1000),
        });
        // TODO: Update subscription status to canceled
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('💳 Payment succeeded:', {
          invoiceId: invoice.id,
          amount: invoice.amount_paid / 100,
          customerId: invoice.customer,
        });
        // TODO: Log payment in database
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('⚠️ Payment failed:', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          nextRetry: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000) : 'none',
        });
        // TODO: Send email notification to customer
        // TODO: Log failed payment in database
        break;
      }

      default:
        console.log(`⏭️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Get subscription status
router.get('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Get subscription from database using userId
    // For now, return mock data
    res.json({
      status: 'active',
      plan: 'studio-monthly',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      credits: { available: 50, used: 5 },
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

export default router;
