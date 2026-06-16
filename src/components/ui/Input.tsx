'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

const INPUT_BASE =
  'w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: ReactNode;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, suffix, className = '', wrapperClassName = '', ...props },
  ref
) {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={`${INPUT_BASE} ${suffix ? 'pr-10' : ''} ${error ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
