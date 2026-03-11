import { Music } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { AnimateIn } from '@/components/AnimateIn';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important information about JazzSession — a personal, non-commercial project.',
};

const SECTIONS = [
  {
    title: 'Personal Project',
    body: 'JazzSession is an independent, non-commercial personal project built and maintained by a single developer. It is not affiliated with, endorsed by, or associated with any music institution, conservatory, or commercial music software provider.',
  },
  {
    title: 'No Professional Advice',
    body: 'The content provided in JazzSession — including scale references, chord charts, jazz standards, practice suggestions, and metronome settings — is for informational and personal practice purposes only. It does not constitute professional music instruction, music therapy, or any form of clinical advice. Please consult a qualified music teacher or instructor for personalised guidance.',
  },
  {
    title: 'Data & Privacy',
    body: "JazzSession uses Google Sign-In (Firebase Authentication) to identify users, and Firebase Firestore to store your practice sessions and preferences. Your data is tied to your Google account and is not sold or shared with third parties. By signing in, you agree to Google's Terms of Service and Privacy Policy in addition to your use of this app.",
  },
  {
    title: 'Third-Party Services',
    body: 'This app relies on third-party services including Firebase (Google), Tone.js, Vercel, and Google Fonts. These services are subject to their own terms of service and privacy policies. JazzSession has no control over the practices of these third-party providers.',
  },
  {
    title: 'Accuracy of Content',
    body: 'While every effort has been made to ensure the accuracy of the jazz scales, chord charts, standards library, and other musical content, no guarantees are made regarding completeness or correctness. Jazz theory can vary between sources and traditions. Use your ear and your teacher as the final authority.',
  },
  {
    title: 'No Warranties',
    body: 'JazzSession is provided "as is", without warranty of any kind — express or implied. The developer is not liable for any loss of data, interruption of service, or any other damages arising from the use of this application. Your practice data is stored in Firebase Firestore; while durable, no storage system is infallible — back up anything critical.',
  },
  {
    title: 'Changes to This Disclaimer',
    body: 'This disclaimer may be updated at any time without prior notice. Continued use of JazzSession after any changes constitutes acceptance of the revised disclaimer. The date of the last update will be reflected at the bottom of this page.',
  },
  {
    title: 'Contact',
    body: 'If you have questions or concerns about JazzSession, please reach out through the GitHub repository or any contact channel made available by the developer.',
  },
];

export default function DisclaimerPage() {
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
            href="/about"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden sm:block"
          >
            About
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-14">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4 anim-fade-in-up"
            style={{ animationDelay: '0ms' }}
          >
            Legal
          </p>
          <h1
            className="text-4xl font-bold text-[var(--foreground)] mb-4 anim-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            Disclaimer
          </h1>
          <p
            className="text-[var(--muted-foreground)] text-sm anim-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            Please read this disclaimer carefully before using JazzSession. By accessing or using
            this application, you acknowledge that you have read, understood, and agreed to the
            terms below.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map(({ title, body }, i) => (
            <AnimateIn key={title} delay={i * 60}>
              <section>
                <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">{title}</h2>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{body}</p>
              </section>
            </AnimateIn>
          ))}
        </div>

        {/* Last updated */}
        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)]">
            Last updated: <span className="text-[var(--foreground)]">March 2026</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
              href="/about"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
