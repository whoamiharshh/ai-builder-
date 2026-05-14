import { motion } from 'framer-motion';
import { Card } from './ui';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:shadow-cyan-500/20">
        <div className="space-y-4">
          <div className="text-4xl">{icon}</div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-slate-300">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: '🔍',
      title: 'Niche Intelligence',
      description: 'Analyze Google Trends, Reddit pain points, TikTok trends, and more to discover profitable niches.',
    },
    {
      icon: '📊',
      title: 'Demand Scoring',
      description: 'Get accurate demand scores based on search volume, buyer intent, competition, and trend growth.',
    },
    {
      icon: '🎯',
      title: 'Smart Generation',
      description: 'Generate complete digital products with AI - titles, branding, content, and pricing strategies.',
    },
    {
      icon: '🖼️',
      title: 'Image Generation',
      description: 'Create cinematic thumbnails, 3D mockups, and professional product showcases with AI.',
    },
    {
      icon: '🚀',
      title: 'Landing Pages',
      description: 'Auto-generate high-converting sales pages with emotional hooks and optimized layouts.',
    },
    {
      icon: '📦',
      title: 'Export Everything',
      description: 'Download complete product packages in PDF, ZIP, DOCX, or HTML format.',
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
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">Powerful Features</h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">
            Everything you need to discover profitable niches and launch digital products in minutes
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
