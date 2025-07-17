import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const ga4Id = import.meta.env.VITE_GA4_ID;
    if (ga4Id) {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
      });
    }
  }, [location]);
};
