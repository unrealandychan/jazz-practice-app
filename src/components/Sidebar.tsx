'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Music,
  BookOpen,
  Clock,
  BarChart2,
  Timer,
  ListMusic,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Music },
  { href: '/sessions', label: 'Sessions', icon: Clock },
  { href: '/scales', label: 'Scales & Chords', icon: BookOpen },
  { href: '/standards', label: 'Standards', icon: ListMusic },
  { href: '/metronome', label: 'Metronome', icon: Timer },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col border-r border-[var(--border)] bg-[var(--card)] z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <Music className="w-4 h-4 text-[var(--accent-foreground)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)] leading-none">Jazz Practice</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Your practice companion</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                    active
                      ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-medium'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--muted-foreground)]">
          Guitar · Saxophone · Piano
        </p>
      </div>
    </aside>
  )
}
