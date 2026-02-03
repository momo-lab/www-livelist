import { useMemo, createContext, useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';
import { usePageTracking } from '@/hooks/usePageTracking';

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
        <footer className="bg-background text-foreground/50 border-t py-2 text-center text-sm">
          Created by{' '}
          <a
            href="https://x.com/momolab"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-blue-600"
          >
            @momolab
          </a>
        </footer>
      </HeaderContext.Provider>
    </>
  );
}
