import React, { useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { usePayment, Plan } from '../contexts/PaymentContext';
import { Button } from './ui/Button';

interface CheckoutButtonProps {
  plan: Plan;
  variant?: 'primary' | 'secondary';
}

export function CheckoutButton({ plan, variant }: CheckoutButtonProps) {
  const { setSelectedPlan, isCheckoutLoading, setIsCheckoutLoading } = usePayment();
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY).then(setStripe);
  }, []);

  const handleCheckout = async () => {
    if (!stripe) return;

    setIsCheckoutLoading(true);
    setSelectedPlan(plan);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          priceId: plan.priceId,
          planId: plan.id,
        }),
      });

      if (!response.ok) throw new Error('Checkout failed');

      const { sessionId } = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error('Stripe error:', result.error.message);
        alert(result.error.message || 'Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isCheckoutLoading}
      variant={variant}
      size="lg"
      className="w-full"
    >
      {isCheckoutLoading ? 'Processing...' : `Get ${plan.name}`}
    </Button>
  );
}
