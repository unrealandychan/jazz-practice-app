import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { AuthProvider } from '@/contexts/AuthContext';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Jazz Practice',
    template: '%s | Jazz Practice',
  },
  description:
    'Your personal jazz practice companion — track sessions, explore scales, browse standards, and keep your tempo sharp. Built by Eddie Chan.',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
