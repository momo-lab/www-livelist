import { createContext, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { usePageTracking } from '@/hooks/common/usePageTracking';
import { HeaderSlotsProvider } from '@/providers/HeaderSlotsProvider';

interface HeaderContextType {
  setHeaderRight: (node: ReactNode) => void;
}

export const HeaderContext = createContext<HeaderContextType | null>(null);

export function Layout() {
  usePageTracking();

  return (
    <div className="min-h-screen">
      <HeaderSlotsProvider>
        <ScrollToTop />
        <Header />
        <div className="bg-background text-foreground pt-[var(--header-height)]">
          <Outlet />
        </div>
        <Footer />
      </HeaderSlotsProvider>
    </div>
  );
}
