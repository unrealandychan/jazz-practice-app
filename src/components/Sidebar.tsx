'use client';

import { BarChart2, BookOpen, Clock, ListMusic, LogOut, Music, Timer, User, X } from 'lucide-react';
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

interface ISidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: ISidebarProps) {
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
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-60 flex flex-col border-r border-[var(--border)] bg-[var(--card)] z-40 transition-transform duration-300',
          // mobile: hidden off-screen by default, slides in when open
          open ? 'translate-x-0' : '-translate-x-full',
          // desktop: always visible regardless of open state
          'md:translate-x-0',
        )}
      >
        {/* Logo — click icon to go home */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--border)]">
          <Link
            href="/"
            title="Back to Home"
            className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <Music className="w-4 h-4 text-[var(--accent-foreground)]" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)] leading-none">
              JazzSession
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Your practice companion</p>
          </div>
          {/* Close button — mobile only */}
          <button
            className="md:hidden p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
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
                    onClick={onClose}
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
    </>
  );
}
