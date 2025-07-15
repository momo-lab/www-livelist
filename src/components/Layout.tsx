import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="pt-12">
        <Outlet />
      </div>
      <footer className="mt-2 border-t border-gray-200 py-2 text-center text-sm text-gray-500">
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
