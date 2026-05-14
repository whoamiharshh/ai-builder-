import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How accurate is the niche analysis?',
      answer:
        'Our AI analyzes over 50 million data points from Google Trends, Reddit, TikTok, Amazon, and more. We achieve 95% accuracy in predicting product demand, validated across thousands of successful launches.',
    },
    {
      question: 'Can I use the generated products commercially?',
      answer:
        'Yes! All products generated through SyntheticAI are 100% yours to use, sell, or distribute. You maintain full ownership and commercial rights.',
    },
    {
      question: 'How long does it take to generate a product?',
      answer:
        'Most products are generated in 3-5 minutes, including research, content creation, image generation, and landing page design. Complex products may take up to 15 minutes.',
    },
    {
      question: 'What export formats are supported?',
      answer:
        'We support PDF, ZIP (with all assets), DOCX, and HTML formats. Each export includes all necessary files, images, and documentation for your product.',
    },
    {
      question: 'Is there a free trial?',
      answer:
        'Yes! Sign up for our free trial to analyze 3 niches and generate 1 complete product at no cost. No credit card required.',
    },
    {
      question: 'Can I integrate SyntheticAI with my tools?',
      answer:
        'Yes! Our Pro and Enterprise plans include API access. We support integrations with Zapier, Make, and custom webhooks for seamless workflow automation.',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-midnight to-slate-950 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-300">
            Got questions? We\'ve got answers. Can\'t find what you\'re looking for?{' '}
            <span className="text-cyan-400 hover:underline cursor-pointer">Contact us</span>
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left transition-all hover:bg-slate-900/60"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-cyan-400"
                  >
                    ▼
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10"
                  >
                    <p className="px-6 py-4 text-slate-300">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center"
        >
          <h3 className="mb-2 text-2xl font-bold text-white">Still have questions?</h3>
          <p className="mb-6 text-slate-300">
            Our support team is here to help. Reach out anytime.
          </p>
          <button className="rounded-3xl bg-cyan-600 px-8 py-3 font-semibold text-white transition hover:bg-cyan-700">
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
}
