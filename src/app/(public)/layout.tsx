import { Suspense } from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <div className="min-h-screen">{children}</div>
    </Suspense>
  );
}
