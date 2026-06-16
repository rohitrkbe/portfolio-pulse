import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'conservative' | 'moderate' | 'aggressive';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    default:      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    primary:      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    success:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning:      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    danger:       'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    conservative: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    moderate:     'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    aggressive:   'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  };

  const sizes: Record<string, string> = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant] ?? variants.default} ${sizes[size] ?? sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
}
