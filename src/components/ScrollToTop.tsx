import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ページ遷移時にスクロールをトップに戻す
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
