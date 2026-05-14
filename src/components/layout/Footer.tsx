import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10"
    >
      <div className="rounded-[32px] border border-white/10 bg-[#020617]/90 p-8 text-slate-400 shadow-plasma backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">SyntheticAI</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Premium AI product launch workflows, cinematic visuals, exports, and analytics in one polished platform.</p>
          </div>
          <p className="text-sm text-slate-500">© 2026 SyntheticAI. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}
