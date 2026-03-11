import { BarChart2, BookOpen, Clock, ListMusic, Music, Timer } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { AnimateIn } from '@/components/AnimateIn';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about JazzSession — who built it, why it exists, and the tools powering your practice.',
};

const STACK = [
  { name: 'Next.js 15', desc: 'App Router, server components, and blazing fast builds.' },
  { name: 'Firebase', desc: 'Google sign-in and Firestore for real-time, synced practice data.' },
  { name: 'Tone.js', desc: 'WebAudio-based metronome with zero drift and swing support.' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling that keeps the UI fast and consistent.' },
  { name: 'Vercel', desc: 'Edge-deployed and globally distributed for instant load times.' },
];

const FEATURES_SUMMARY = [
  { icon: Clock, label: 'Session Logger' },
  { icon: BookOpen, label: 'Scale Reference' },
  { icon: ListMusic, label: 'Standards Library' },
  { icon: Timer, label: 'Metronome' },
  { icon: BarChart2, label: 'Progress Charts' },
  { icon: Music, label: 'Multi-instrument' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <Music className="w-3.5 h-3.5 text-[var(--accent-foreground)]" />
          </div>
          <span className="font-semibold text-[var(--foreground)] text-sm">JazzSession</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden sm:block"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4 anim-fade-in-up"
            style={{ animationDelay: '0ms' }}
          >
            About
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] leading-tight mb-6 anim-fade-in-up"
            style={{ animationDelay: '120ms' }}
          >
            Built for musicians who take practice seriously.
          </h1>
          <p
            className="text-lg text-[var(--muted-foreground)] leading-relaxed anim-fade-in-up"
            style={{ animationDelay: '240ms' }}
          >
            JazzSession started as a personal tool — a place to log sessions, reference scales
            quickly, and stop fiddling with spreadsheets mid-practice. It grew into something worth
            sharing.
          </p>
        </div>

        {/* Mission */}
        <AnimateIn>
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">The Mission</h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              Great jazz practice isn&apos;t about quantity — it&apos;s about intention. Knowing
              what you worked on, spotting what you&apos;re avoiding, and showing up consistently
              over months and years. JazzSession tries to make that reflection effortless.
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              No subscriptions, no bloat, no ads. Just a focused set of tools that get out of the
              way and let you focus on the music.
            </p>
          </section>
        </AnimateIn>

        {/* What's inside */}
        <AnimateIn>
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
              What&apos;s inside
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {FEATURES_SUMMARY.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
                </div>
              ))}
            </div>
          </section>
        </AnimateIn>

        {/* Who built it */}
        <AnimateIn>
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Who built this</h2>
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-lg font-bold text-[var(--accent)]">
                  EC
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Eddie Chan</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Developer &amp; Jazz Enthusiast
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                JazzSession is a personal passion project. I built it because I wanted a practice
                log that actually understood jazz — scales by name, standards with chord charts, a
                metronome that wouldn&apos;t drift. If you&apos;re using it, I hope it&apos;s
                helping you play better.
              </p>
            </div>
          </section>
        </AnimateIn>

        {/* Tech stack */}
        <AnimateIn>
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Built with</h2>
            <ul className="space-y-3">
              {STACK.map(({ name, desc }) => (
                <li key={name} className="flex gap-4 items-start">
                  <span className="text-xs font-mono font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded mt-0.5 flex-shrink-0">
                    {name}
                  </span>
                  <p className="text-sm text-[var(--muted-foreground)]">{desc}</p>
                </li>
              ))}
            </ul>
          </section>
        </AnimateIn>

        {/* CTA */}
        <AnimateIn>
          <div className="text-center pt-8 border-t border-[var(--border)]">
            <p className="text-[var(--muted-foreground)] mb-6">Ready to start your practice log?</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </AnimateIn>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[var(--muted-foreground)]">
            © 2026 JazzSession · Built with ♪ by Eddie Chan
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/disclaimer"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
