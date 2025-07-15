import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="bg-background text-foreground pt-12 pb-2">
        <Outlet />
      </div>
      <footer className="bg-background text-foreground/50 border-t border-border py-2 text-center text-sm">
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
    </>
  );
}
