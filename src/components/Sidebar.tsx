'use client';

import { BarChart2, BookOpen, Clock, ListMusic, LogOut, Music, Timer, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Music },
  { href: '/sessions', label: 'Sessions', icon: Clock },
  { href: '/scales', label: 'Scales & Chords', icon: BookOpen },
  { href: '/standards', label: 'Standards', icon: ListMusic },
  { href: '/metronome', label: 'Metronome', icon: Timer },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logOut } = useAuth();

  async function handleSignOut() {
    await logOut();
    router.push('/');
  }

  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col border-r border-[var(--border)] bg-[var(--card)] z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <Music className="w-4 h-4 text-[var(--accent-foreground)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)] leading-none">
            Jazz Practice
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Your practice companion</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                    active
                      ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-medium'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User panel */}
      <div className="px-3 py-3 border-t border-[var(--border)] space-y-1">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-md">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName ?? 'User'}
                  width={28}
                  height={28}
                  className="rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-[var(--accent)]" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--foreground)] truncate leading-none">
                  {user.displayName ?? 'Musician'}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
                  {user.email ?? ''}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 rounded-full bg-[var(--muted)] flex items-center justify-center">
              <span className="text-xs font-bold text-[var(--muted-foreground)]">{initials}</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Not signed in</p>
          </div>
        )}
      </div>
    </aside>
  );
}
