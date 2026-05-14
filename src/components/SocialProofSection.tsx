import { motion } from 'framer-motion';
import { Badge } from './ui';

export function SocialProofSection() {
  const stats = [
    { value: '10K+', label: 'Products Created' },
    { value: '50M+', label: 'Market Data Points' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Digital Creator',
      text: 'SyntheticAI helped me launch 3 successful digital products in a month. The niche analysis is incredibly accurate.',
      avatar: '👩‍💼',
    },
    {
      name: 'Michael Torres',
      role: 'Entrepreneur',
      text: 'The AI-powered generation saved me hundreds of hours. I\'m now generating products 10x faster than before.',
      avatar: '👨‍💼',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      text: 'The demand scoring is a game-changer. We can now validate ideas in minutes instead of weeks.',
      avatar: '👩‍🔬',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-midnight to-slate-950 px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-20">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-center backdrop-blur"
              >
                <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-12 text-center text-3xl font-bold text-white">
            Loved by Digital Creators
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur"
              >
                <div className="space-y-4">
                  <p className="text-slate-300">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div className="mt-2">
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-slate-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <span key={j} className="text-lg">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Badge variant="tag">🔒 Bank-level Security</Badge>
          <Badge variant="tag">✅ GDPR Compliant</Badge>
          <Badge variant="tag">⚡ 99.9% Uptime</Badge>
          <Badge variant="tag">🌍 Global Support</Badge>
        </motion.div>
      </div>
    </section>
  );
}
