import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePayment } from '../contexts/PaymentContext';
import { CheckoutButton } from '../components/CheckoutButton';

export default function Pricing() {
  const { plans } = usePayment();
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');

  const filteredPlans = plans.filter((p) => p.interval === billingCycle);
  const displayPlans = filteredPlans.length > 0 ? filteredPlans : plans.filter((p) => p.interval === 'month');

  const groupedPlans = Array.from(
    displayPlans.reduce((acc, plan) => {
      if (!acc.has(plan.name)) acc.set(plan.name, plan);
      return acc;
    }, new Map<string, typeof plans[0]>()).values()
  );

  return (
    <main className="px-6 pb-16 pt-8 sm:px-10 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[40px] border border-white/10 bg-slate-950/90 p-10 shadow-plasma backdrop-blur-xl">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Pricing</p>
            <h1 className="text-5xl font-semibold text-white">Choose the tier that matches your launch ambition.</h1>
            <p className="text-lg leading-8 text-slate-300">Scale from solo founders to premium studios with AI-powered product creation, image generation, and export workflows built for high-end launches.</p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setBillingCycle('month')}
              className={`rounded-lg px-6 py-3 font-semibold transition ${
                billingCycle === 'month'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-900/50 text-slate-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('year')}
              className={`rounded-lg px-6 py-3 font-semibold transition ${
                billingCycle === 'year'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-900/50 text-slate-300 hover:text-white'
              }`}
            >
              Annual (Save 17%)
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {groupedPlans.map((plan) => (
            <motion.div
              key={`${plan.name}-${billingCycle}`}
              whileHover={{ y: -6 }}
              className="rounded-[32px] border border-white/10 bg-[#020617]/90 p-8 shadow-plasma backdrop-blur-xl transition-transform duration-200"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{plan.badge}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">{plan.name}</h2>
                </div>
                <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-right">
                  <div className="text-sm font-semibold text-cyan-200">${plan.price}</div>
                  <div className="text-xs text-slate-400">/{billingCycle === 'month' ? 'mo' : 'yr'}</div>
                </div>
              </div>
              <p className="mt-6 text-slate-300">{plan.description}</p>
              <ul className="mt-8 space-y-3 text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="rounded-3xl bg-slate-900/80 p-4">
                    {feature}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                plan={plan}
                variant={plan.name === 'Studio' ? 'primary' : 'secondary'}
              />
            </motion.div>
          ))}

          {/* Enterprise CTA */}
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-[32px] border border-white/10 bg-[#020617]/90 p-8 shadow-plasma backdrop-blur-xl transition-transform duration-200"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Custom</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Enterprise</h2>
            </div>
            <p className="mt-6 text-slate-300">
              For premium agencies and high-volume AI launches with custom workflows.
            </p>
            <ul className="mt-8 space-y-3 text-slate-300">
              {['Unlimited concepts', 'Unlimited renders', 'Dedicated onboarding', 'Custom integrations'].map(
                (feature) => (
                  <li key={feature} className="rounded-3xl bg-slate-900/80 p-4">
                    {feature}
                  </li>
                )
              )}
            </ul>
            <a
              href="mailto:sales@syntheticai.com"
              className="mt-8 inline-block w-full rounded-lg border border-slate-400 bg-transparent px-4 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-900/50 hover:text-white"
            >
              Contact Sales
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
