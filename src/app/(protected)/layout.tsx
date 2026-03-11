'use client';

import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          <p className="text-[var(--muted-foreground)] text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Middleware handles redirect; this is a client-side fallback
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 h-14 flex items-center gap-3 px-4 bg-[var(--card)] border-b border-[var(--border)]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-[var(--foreground)]">JazzSession</span>
      </div>

      <main className="flex-1 md:ml-60 pt-14 md:pt-0 min-h-screen">{children}</main>
    </div>
  );
}
