import React, { createContext, useContext, useState } from 'react';

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  badge: string;
  interval: 'month' | 'year';
}

interface PaymentContextType {
  plans: Plan[];
  selectedPlan: Plan | null;
  setSelectedPlan: (plan: Plan) => void;
  isCheckoutLoading: boolean;
  setIsCheckoutLoading: (loading: boolean) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const plans: Plan[] = [
    {
      id: 'founder-monthly',
      name: 'Founder',
      price: 49,
      priceId: 'price_founder_monthly',
      description: 'For solo founders launching flagship AI products and premium collateral.',
      features: ['10 product concepts / month', '50 image renders', 'PDF + DOCX export', 'Email & community support'],
      badge: 'Best for early-stage',
      interval: 'month',
    },
    {
      id: 'founder-annual',
      name: 'Founder',
      price: 490,
      priceId: 'price_founder_annual',
      description: 'For solo founders launching flagship AI products and premium collateral.',
      features: ['10 product concepts / month', '50 image renders', 'PDF + DOCX export', 'Email & community support', 'Save 17%'],
      badge: 'Best for early-stage',
      interval: 'year',
    },
    {
      id: 'studio-monthly',
      name: 'Studio',
      price: 129,
      priceId: 'price_studio_monthly',
      description: 'For small teams and agencies building product suites and marketing bundles.',
      features: ['50 product concepts / month', '200 image renders', 'Team workspaces', 'Priority support'],
      badge: 'Most popular',
      interval: 'month',
    },
    {
      id: 'studio-annual',
      name: 'Studio',
      price: 1290,
      priceId: 'price_studio_annual',
      description: 'For small teams and agencies building product suites and marketing bundles.',
      features: ['50 product concepts / month', '200 image renders', 'Team workspaces', 'Priority support', 'Save 17%'],
      badge: 'Most popular',
      interval: 'year',
    },
  ];

  return (
    <PaymentContext.Provider value={{ plans, selectedPlan, setSelectedPlan, isCheckoutLoading, setIsCheckoutLoading }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
}
