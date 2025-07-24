import type { Idol, LiveEvent } from '@/types';
import React from 'react';

interface LiveEventsContextType {
  idols: Idol[];
  allEvents: LiveEvent[];
  updatedAt?: Date;
  loading: boolean;
  error: string | null;
}

export const LiveEventsContext = React.createContext<LiveEventsContextType | undefined>(undefined);
