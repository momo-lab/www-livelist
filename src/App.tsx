import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';
import type { ReactNode } from 'react';

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="pt-12">{children}</div>
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

export default App;
