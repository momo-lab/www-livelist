import { useMemo, createContext, useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { usePageTracking } from '@/hooks/common/usePageTracking';

interface HeaderContextType {
  setHeaderRight: (node: ReactNode) => void;
}

export const HeaderContext = createContext<HeaderContextType | null>(null);

export function Layout() {
  usePageTracking();
  const [headerRight, setHeaderRight] = useState<ReactNode>(null);

  const value = useMemo(() => ({ setHeaderRight }), []);

  return (
    <>
      <HeaderContext.Provider value={value}>
        <ScrollToTop />
        <Header right={headerRight} />
        <div className="bg-background text-foreground pt-[var(--header-height)] pb-2">
          <Outlet />
        </div>
        <Footer />
      </HeaderContext.Provider>
    </>
  );
}
