import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const steps = [
  { label: '1', title: 'Define your vision', description: 'Share your product opportunity, target audience, and brand tone.' },
  { label: '2', title: 'Review AI insights', description: 'Receive demand analysis, copy direction, and launch packaging recommendations.' },
  { label: '3', title: 'Generate assets', description: 'Create cinematic visuals, branding mockups, and launch-ready content.' },
  { label: '4', title: 'Export launch bundle', description: 'Download professional packages and start your go-to-market execution.' },
];

export default function Onboarding() {
  return (
    <main className="px-6 pb-16 pt-8 sm:px-10 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[40px] border border-white/10 bg-slate-950/90 p-10 shadow-plasma backdrop-blur-xl">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Onboarding</p>
            <h1 className="text-5xl font-semibold text-white">Launch your first AI product with guided prompts and one-click workflows.</h1>
            <p className="text-lg leading-8 text-slate-300">SyntheticAI is built to help founders and studios move from concept to finished assets quickly, without losing creative control.</p>
            <Button variant="primary" size="lg">Start onboarding</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.label} className="rounded-[32px] border-white/10 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-xl font-semibold text-cyan-200">{step.label}</div>
              <h2 className="mt-5 text-2xl font-semibold text-white">{step.title}</h2>
              <p className="mt-3 text-slate-300">{step.description}</p>
            </Card>
          ))}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#020617]/90 p-8">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Success path</p>
              <h2 className="text-3xl font-semibold text-white">Supercharge your launch cadence with AI-first workflows.</h2>
              <p className="text-slate-300">Get clear recommendations, branded assets, and export-ready launch kits in a polished interface designed for premium creators.</p>
              <Button variant="secondary" size="lg">Begin now</Button>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[28px] bg-slate-900/80 p-6 text-slate-300">AI prompts optimized for conversion copy, product naming, and branded storytelling.</div>
              <div className="rounded-[28px] bg-slate-900/80 p-6 text-slate-300">Real-time confidence scoring for demand, pricing, and launch velocity.</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
