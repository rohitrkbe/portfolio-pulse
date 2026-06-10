'use client';

import { useState, useTransition, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';
import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  SpinnerIcon,
  ExclamationCircleIcon,
} from '@/components/ui/Icons';
import Input from '@/components/ui/Input';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import { setUserSession } from '@/lib/auth';
import { MOCK_CREDENTIALS } from '@/lib/mockData';
import { LOGIN_STRINGS, FEATURE_BULLETS, DEMO_STATS, APP } from '@/lib/strings';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!email.trim() || !password) return;
    setError('');

    const match = MOCK_CREDENTIALS.find(
      (c) => c.email === email.trim().toLowerCase() && c.password === password
    );

    if (!match) {
      setError('Invalid email or password. Please check the demo credentials below.');
      return;
    }

    const user = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      loginAt: new Date().toISOString(),
    };
    setUserSession(user);
    dispatch(loginSuccess(user));

    startTransition(() => {
      router.replace('/dashboard');
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex-col justify-between p-10">
        <ParticleCanvas />

        {/* Ambient blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-10 -right-16 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-blue-300/10 blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">{APP.NAME}</p>
            <p className="text-blue-200 text-xs tracking-wide">{APP.TAGLINE}</p>
          </div>
        </div>

        {/* Main copy + features */}
        <div className="relative z-10 space-y-7">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Your clients&apos;<br />portfolios,<br />
              <span className="text-blue-200">at a glance.</span>
            </h1>
            <p className="mt-4 text-blue-100/80 text-sm leading-relaxed max-w-sm">
              {LOGIN_STRINGS.LEFT_SUB}
            </p>
          </div>

          {/* Feature checkmarks */}
          <div className="space-y-3">
            {FEATURE_BULLETS.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
                <span className="text-blue-100 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Star-pattern stats */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/25" />
              <span className="text-white/45 text-base select-none">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/25" />
            </div>

            <div className="grid grid-cols-3">
              {DEMO_STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center py-1 ${i < DEMO_STATS.length - 1 ? 'border-r border-white/15' : ''}`}
                >
                  <p className="text-white/30 text-[9px] mb-1.5 select-none">✦</p>
                  <p className="text-[22px] font-bold text-white tabular-nums leading-none">{stat.value}</p>
                  <p className="text-[11px] text-blue-200/70 mt-1.5 font-medium tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-5">
              <span className="text-white/30 text-[9px] select-none">✦</span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              <span className="text-white/45 text-base select-none">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent" />
              <span className="text-white/30 text-[9px] select-none">✦</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-blue-300/60 text-xs">{APP.COPYRIGHT}</p>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="p-2 bg-blue-600 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">{APP.NAME}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{LOGIN_STRINGS.HEADING}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{LOGIN_STRINGS.SUB_HEADING}</p>
          </div>

          <div className="space-y-4">
            <Input
              label={LOGIN_STRINGS.EMAIL_LABEL}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={LOGIN_STRINGS.EMAIL_PLACEHOLDER}
              autoComplete="email"
            />

            <Input
              label={LOGIN_STRINGS.PASSWORD_LABEL}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={LOGIN_STRINGS.PASSWORD_PLACEHOLDER}
              autoComplete="current-password"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeSlashIcon className="w-4 h-4" />
                    : <EyeIcon className="w-4 h-4" />}
                </button>
              }
            />

            {error && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <ExclamationCircleIcon className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !email.trim() || !password}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              {isPending ? (
                <>
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                  {LOGIN_STRINGS.SUBMIT_LOADING}
                </>
              ) : (
                LOGIN_STRINGS.SUBMIT_IDLE
              )}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">{LOGIN_STRINGS.DEMO_SECTION_LABEL}</p>
            <div className="space-y-1.5">
              {MOCK_CREDENTIALS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setEmail(c.email); setPassword(c.password); setError(''); }}
                  className="w-full flex items-center justify-between p-2 text-xs rounded-md bg-white dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-slate-600 transition-colors text-left group"
                >
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">{c.name}</span>
                    <span className="text-slate-400 mx-1">·</span>
                    <span className="text-slate-500 dark:text-slate-400">{c.role}</span>
                  </div>
                  <span className="text-blue-500 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Use →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
