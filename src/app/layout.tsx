import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { AuthProvider } from '@/contexts/AuthContext';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'JazzSession',
    template: '%s | JazzSession',
  },
  description:
    'JazzSession — your personal jazz practice companion. Track sessions, explore scales, browse standards, and keep your tempo sharp. Built by Eddie Chan.',
  authors: [{ name: 'Eddie Chan' }],
  keywords: [
    'jazz',
    'practice',
    'guitar',
    'saxophone',
    'piano',
    'scales',
    'standards',
    'metronome',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
