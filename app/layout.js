import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/providers/StoreProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata = {
  title: 'Portfolio Pulse | Wealth Management Dashboard',
  description: 'Internal dashboard for Relationship Managers — monitor and manage HNI client portfolios.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Blocking script: reads pp_theme from localStorage BEFORE hydration to avoid dark-mode flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('pp_theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-900`}>
        <StoreProvider>
          <ThemeProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#fff',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13px',
                  padding: '10px 14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                },
              }}
            />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
