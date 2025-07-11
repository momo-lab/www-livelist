import { LiveEventsContext } from '@/contexts/LiveEventsContext';
import { useContext } from 'react';

export const useLiveEvents = () => {
  const context = useContext(LiveEventsContext);
  if (context === undefined) {
    throw new Error('useLiveEvents must be used within a LiveEventsProvider');
  }
  return context;
};
