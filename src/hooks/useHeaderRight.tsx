import { useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { HeaderContext } from '@/components/Layout';

export function useHeaderRight(node: ReactNode) {
  const header = useContext(HeaderContext);

  useEffect(() => {
    header?.setHeaderRight(node);
    return () => header?.setHeaderRight(null);
  }, [header, node]);
}
