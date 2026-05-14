import React from 'react';
import { useToast, type ToastType } from '../contexts/ToastContext';

const toastStyles: Record<ToastType, { bg: string; icon: string; text: string }> = {
  success: {
    bg: 'bg-green-500/90',
    icon: '✓',
    text: 'text-white'
  },
  error: {
    bg: 'bg-red-500/90',
    icon: '✕',
    text: 'text-white'
  },
  warning: {
    bg: 'bg-yellow-500/90',
    icon: '⚠',
    text: 'text-white'
  },
  info: {
    bg: 'bg-blue-500/90',
    icon: 'ℹ',
    text: 'text-white'
  }
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        return (
          <div
            key={toast.id}
            className={`${style.bg} ${style.text} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 pointer-events-auto max-w-sm animate-slideIn`}
          >
            <span className="text-lg font-bold">{style.icon}</span>
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
