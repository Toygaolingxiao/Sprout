import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container px-4 py-4 pb-24 sm:py-6 sm:pb-6 max-w-lg mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
