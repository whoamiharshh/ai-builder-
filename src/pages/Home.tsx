import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { SocialProofSection } from '../components/SocialProofSection';
import { PricingSection } from '../components/PricingSection';
import { FAQSection } from '../components/FAQSection';

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-midnight">
      {/* All sections */}
      <HeroSection />
      <FeaturesSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />

      {/* CTA Footer */}
      <section className="bg-gradient-to-b from-slate-950 to-black px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">Ready to get started?</h2>
          <p className="mb-8 text-xl text-slate-300">
            Join thousands of digital creators launching successful products with SyntheticAI.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-3xl bg-cyber px-8 py-4 font-semibold text-white shadow-lg shadow-cyber/20 transition hover:bg-cyan-600">
              Start Your Free Trial
            </button>
            <button className="rounded-3xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition hover:bg-white/10">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
