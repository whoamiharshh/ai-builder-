import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn('rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-plasma backdrop-blur-xl', className)}
    >
      {children}
    </div>
  );
}
