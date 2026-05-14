import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'status' | 'tag' | 'score';
  status?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'tag', 
  status = 'info',
  className 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all';
  
  const variantStyles: Record<string, string> = {
    tag: 'bg-white/10 text-white ring-1 ring-white/10',
    status: {
      success: 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/30',
      warning: 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/30',
      error: 'bg-red-500/20 text-red-200 ring-1 ring-red-500/30',
      info: 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/30',
    }[status],
    score: 'bg-cyber/20 text-cyan-200 ring-1 ring-cyber/30',
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
}
