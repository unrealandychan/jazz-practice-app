'use client';

import { type ReactNode, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface IAnimateInProps {
  children: ReactNode;
  /** Stagger delay in milliseconds */
  delay?: number;
  className?: string;
}

/**
 * Wraps children in a div that fades + slides up once when scrolled into view.
 * Uses IntersectionObserver — no scroll listeners, fires once per element.
 */
export function AnimateIn({ children, delay = 0, className }: IAnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If reduced-motion is set, skip the observer entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={cn('scroll-fade', className)}>
      {children}
    </div>
  );
}
