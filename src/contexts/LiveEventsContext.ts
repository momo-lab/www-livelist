import type { Idol, LiveEvent, Member } from '@/types';
import React from 'react';

interface LiveEventsContextType {
  idols: Idol[];
  allEvents: LiveEvent[];
  members: Member[];
  updatedAt?: Date;
  loading: boolean;
  error: string | null;
}

export const LiveEventsContext = React.createContext<LiveEventsContextType | undefined>(undefined);
