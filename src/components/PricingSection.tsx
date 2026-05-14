import { motion } from 'framer-motion';
import { Button, Badge } from './ui';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  index: number;
}

function PricingTier({
  name,
  price,
  description,
  features,
  highlighted = false,
  index,
}: PricingTierProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative rounded-3xl border p-8 transition-all ${
        highlighted
          ? 'border-cyan-500/50 bg-slate-950/80 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/20'
          : 'border-white/10 bg-slate-900/40'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
          <Badge variant="status" status="success">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white">{name}</h3>
          <p className="mt-2 text-slate-400">{description}</p>
        </div>

        <div>
          <div className="text-4xl font-bold text-white">
            {price === 'Custom' ? price : `$${price}`}
            {price !== 'Custom' && <span className="text-lg text-slate-400">/month</span>}
          </div>
        </div>

        <Button variant={highlighted ? 'primary' : 'outline'} size="lg" className="w-full">
          Get Started
        </Button>

        <div className="space-y-3 border-t border-white/10 pt-6">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-1 text-cyan-400">✓</span>
              <span className="text-slate-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function PricingSection() {
  const tiers = [
    {
      name: 'Starter',
      price: '29',
      description: 'Perfect for trying it out',
      features: [
        '5 niche analyses per month',
        '1 product generation',
        'Basic demand scoring',
        'Email support',
        'PDF export',
      ],
    },
    {
      name: 'Pro',
      price: '99',
      description: 'For serious creators',
      features: [
        'Unlimited niche analyses',
        '50 product generations',
        'Advanced demand scoring',
        'Priority support',
        'All export formats',
        'API access',
        'Custom branding',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'Unlimited generations',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        'On-premise deployment',
        'SLA guarantee',
      ],
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-950 to-midnight px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-300">
            Choose the plan that fits your needs. Always flexible, no hidden fees.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <PricingTier
              key={i}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              highlighted={tier.highlighted}
              index={i}
            />
          ))}
        </div>

        {/* FAQ CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-300">
            Not sure which plan? <span className="cursor-pointer text-cyan-400 hover:underline">Contact us</span> for a free consultation
          </p>
        </motion.div>
      </div>
    </section>
  );
}
