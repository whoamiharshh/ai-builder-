interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      ) : null}
      <div className="h-3 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full bg-cyber transition-[width] duration-500" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
      </div>
    </div>
  );
}
