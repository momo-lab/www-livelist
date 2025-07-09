import type { ReactNode } from 'react';
import { Header } from '@/components/Header';

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <>
      <Header />
      <div className="pt-16">{children}</div>
    </>
  );
}

export default App;
