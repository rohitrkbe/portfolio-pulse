import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — Portfolio Pulse',
  description: 'Sign in to your Portfolio Pulse wealth management dashboard.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
