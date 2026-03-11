import {
  ArrowRight,
  BarChart2,
  BookOpen,
  Check,
  Clock,
  ListMusic,
  Music,
  Timer,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { AnimateIn } from '@/components/AnimateIn';

export const metadata: Metadata = {
  title: 'JazzSession — Your Personal Jazz Practice Companion',
};

const FEATURES = [
  {
    icon: Clock,
    title: 'Practice Session Logger',
    desc: 'Start a built-in timer or log manually. Track instrument, topics, BPM, and notes for every session.',
  },
  {
    icon: BookOpen,
    title: 'Scale & Mode Reference',
    desc: '12 essential jazz scales — Dorian, Bebop, Altered, Whole Tone and more — with interactive piano keyboard diagrams.',
  },
  {
    icon: ListMusic,
    title: 'Jazz Standards Library',
    desc: '30+ standards with chord progressions, feel, tempo range, and difficulty. Search and filter in seconds.',
  },
  {
    icon: Timer,
    title: 'Precise Metronome',
    desc: 'Tone.js audio engine — no drift. Tap tempo, swing feel (straight / light / heavy), and any time signature.',
  },
  {
    icon: BarChart2,
    title: 'Progress Charts',
    desc: 'See your daily practice minutes over 30 days, streak counter, and time breakdown by instrument and topic.',
  },
  {
    icon: Music,
    title: 'All Your Instruments',
    desc: 'Guitar, saxophone, piano, or anything else. Filter your stats and sessions by instrument anytime.',
  },
];

const INSTRUMENTS = ['🎸 Guitar', '🎷 Saxophone', '🎹 Piano'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <Music className="w-3.5 h-3.5 text-[var(--accent-foreground)]" />
          </div>
          <span className="font-semibold text-[var(--foreground)] text-sm">JazzSession</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="#features"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden sm:block"
          >
            Features
          </Link>
          <Link
            href="/about"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden sm:block"
          >
            About
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center max-w-4xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--muted)] text-xs text-[var(--muted-foreground)] mb-8 anim-fade-in-up"
          style={{ animationDelay: '0ms' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          Built for serious jazz musicians
        </div>

        <h1
          className="text-5xl sm:text-6xl font-bold text-[var(--foreground)] leading-tight mb-6 anim-fade-in-up"
          style={{ animationDelay: '120ms' }}
        >
          Practice jazz with <span className="text-[var(--accent)]">intention.</span>
        </h1>

        <p
          className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-relaxed anim-fade-in-up"
          style={{ animationDelay: '240ms' }}
        >
          JazzSession is your all-in-one companion for guitar, saxophone, and piano — track every
          session, explore scales and standards, lock your tempo with a drift-free metronome, and
          watch your progress grow day by day.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 anim-fade-in-up"
          style={{ animationDelay: '360ms' }}
        >
          <Link
            href="/login"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-base hover:opacity-90 transition-opacity"
          >
            Start Practicing Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#features"
            className="px-7 py-3.5 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] font-medium text-base hover:border-[var(--muted-foreground)] transition-colors"
          >
            See Features
          </Link>
        </div>

        <div
          className="flex items-center justify-center gap-6 mt-10 anim-fade-in-up"
          style={{ animationDelay: '480ms' }}
        >
          {INSTRUMENTS.map((inst) => (
            <span key={inst} className="text-sm text-[var(--muted-foreground)]">
              {inst}
            </span>
          ))}
        </div>
      </section>

      {/* App preview strip */}
      <section className="py-8 px-6 border-y border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '30+', label: 'Jazz Standards' },
            { value: '12', label: 'Jazz Scales' },
            { value: '∞', label: 'BPM Range' },
            { value: '100%', label: 'Free to Start' },
          ].map(({ value, label }, i) => (
            <AnimateIn key={label} delay={i * 100}>
              <p className="text-3xl font-bold text-[var(--accent)]">{value}</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{label}</p>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <AnimateIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
            Everything you need to practice better
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
            Six core tools, one focused app. No clutter, no ads, no distractions — just you and the
            music.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <AnimateIn key={title} delay={i * 70}>
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 transition-colors group h-full">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <AnimateIn className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
            Who is JazzSession for?
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
            Whether you’re just starting out or woodshedding through the Real Book, JazzSession fits
            where you are.
          </p>
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              emoji: '🎸',
              who: 'Beginners',
              desc: 'Start logging sessions from day one. Build a habit, track your streak, and see the hours add up — without any complicated setup.',
            },
            {
              emoji: '🎷',
              who: 'Intermediate Players',
              desc: 'Dig into the scale & mode reference, work through jazz standards by difficulty, and use the metronome to push your tempo safely.',
            },
            {
              emoji: '🎹',
              who: 'Serious Students',
              desc: 'Analyze your practice patterns with 30-day charts. Spot what you’re over- or under-practicing and course-correct fast.',
            },
          ].map(({ emoji, who, desc }, i) => (
            <AnimateIn key={who} delay={i * 100}>
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center h-full">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{who}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
            Simple to start, built to last
          </h2>
          <p className="text-[var(--muted-foreground)]">
            One Google sign-in, and your practice data is synced and safe forever.
          </p>
        </AnimateIn>

        <div className="max-w-2xl mx-auto space-y-6">
          {[
            {
              step: '01',
              title: 'Sign in with Google',
              desc: 'One click. No passwords. Your data is private and tied to your account.',
            },
            {
              step: '02',
              title: 'Log your first session',
              desc: 'Hit start, practice, hit stop. Pick what you worked on and add any notes.',
            },
            {
              step: '03',
              title: 'Track your growth',
              desc: 'Watch your streak grow, see what you practice most, and identify gaps.',
            },
          ].map(({ step, title, desc }, i) => (
            <AnimateIn key={step} delay={i * 120}>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">{title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{desc}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Pricing / Free section */}
      <section className="py-24 px-6 max-w-3xl mx-auto text-center">
        <AnimateIn>
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Free, always.</h2>
          <p className="text-[var(--muted-foreground)] mb-10">
            JazzSession is free to use. Sign in and take your practice seriously — no credit card
            needed.
          </p>

          <div className="p-8 rounded-2xl border border-[var(--accent)]/50 bg-[var(--accent)]/5 text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
              Everything included
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited practice session logging',
                'Full scale & mode reference (12 scales)',
                '30+ jazz standards with chord charts',
                'Drift-free Tone.js metronome with swing',
                '30-day progress charts & streak tracking',
                'Synced to your account across devices',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[var(--foreground)]">
                  <Check className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimateIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <Music className="w-3 h-3 text-[var(--accent-foreground)]" />
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">JazzSession</span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Built with ♪ by <span className="text-[var(--foreground)] font-medium">Eddie Chan</span>
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/disclaimer"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Disclaimer
            </Link>
            <Link
              href="/login"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
