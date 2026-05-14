import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="block text-sm font-medium text-slate-100">
      {label && <span className="mb-2 block text-slate-300">{label}</span>}
      <input
        className={cn(
          'w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20',
          className,
        )}
        {...props}
      />
    </label>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ label, className, ...props }: TextAreaProps) {
  return (
    <label className="block text-sm font-medium text-slate-100">
      {label && <span className="mb-2 block text-slate-300">{label}</span>}
      <textarea
        className={cn(
          'min-h-[160px] w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20',
          className,
        )}
        {...props}
      />
    </label>
  );
}
