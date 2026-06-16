'use client';

import ParticleCanvas from '@/components/ui/ParticleCanvas';
import { APP } from '@/constants/strings';
import { ANIMATION } from '@/constants/animation';

export default function AuthLoader() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex items-center justify-center">
      <ParticleCanvas />

      {/* Ambient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDuration: ANIMATION.BLOB_1_DURATION }} />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl animate-pulse" style={{ animationDuration: ANIMATION.BLOB_2_DURATION, animationDelay: ANIMATION.BLOB_2_DELAY }} />
      <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-blue-300/10 blur-2xl animate-pulse" style={{ animationDuration: ANIMATION.BLOB_3_DURATION, animationDelay: ANIMATION.BLOB_3_DELAY }} />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8">

        {/* Logo + branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl tracking-tight">{APP.NAME}</p>
            <p className="text-blue-200 text-xs tracking-widest uppercase mt-0.5">{APP.TAGLINE}</p>
          </div>
        </div>

        {/* Pulsing ring loader */}
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: ANIMATION.LOADER_RING_DURATION }} />
          <div className="absolute inset-1 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: ANIMATION.LOADER_RING_DURATION, animationDelay: ANIMATION.LOADER_RING_DELAY }} />
          <div className="w-5 h-5 rounded-full bg-white/80 animate-pulse" style={{ animationDuration: ANIMATION.LOADER_RING_DURATION }} />
        </div>

        {/* Bouncing dots */}
        <div className="flex items-center gap-1.5">
          {ANIMATION.BOUNCE_DELAYS.map((delay) => (
            <span
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
              style={{ animationDelay: `${delay}ms`, animationDuration: ANIMATION.BOUNCE_DURATION }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
