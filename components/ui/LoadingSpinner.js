export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={`
        rounded-full border-blue-200 dark:border-slate-700
        border-t-blue-600 dark:border-t-blue-400
        animate-spin
        ${sizes[size] ?? sizes.md}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
    </div>
  );
}

export function SectionLoader({ message = 'Loading data...' }) {
  return (
    <div className="flex items-center justify-center py-12 gap-3">
      <LoadingSpinner size="md" />
      <span className="text-sm text-slate-500 dark:text-slate-400">{message}</span>
    </div>
  );
}
