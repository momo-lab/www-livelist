import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="pt-12">{children}</div>
      <footer className="text-center text-sm text-gray-500 py-2 border-t border-gray-200 mt-2">
        Created by{' '}
        <a
          href="https://x.com/momolab"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600 transition-colors"
        >
          @momolab
        </a>
      </footer>
    </>
  );
}

export default App;
