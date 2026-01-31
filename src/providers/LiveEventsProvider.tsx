import React, { useContext, useEffect, useMemo, useState } from 'react';
import { fetchLiveEventsData } from '@/services/fetchLiveEventsData';
import type { Idol, LiveEvent, Member } from '@/types';

interface LiveEventsContextType {
  idols: Idol[];
  allEvents: LiveEvent[];
  members: Member[];
  updatedAt?: Date;
  loading: boolean;
  error: string | null;
}

export const LiveEventsContext = React.createContext<LiveEventsContextType | undefined>(undefined);

interface LiveEventsProviderProps {
  children: React.ReactNode;
}

export const LiveEventsProvider: React.FC<LiveEventsProviderProps> = ({ children }) => {
  const [idols, setIdols] = useState<Idol[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [allEvents, setAllEvents] = useState<LiveEvent[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLiveEventsData();
        setAllEvents(data.allEvents);
        setIdols(data.idols);
        setMembers(data.members);
        setUpdatedAt(data.updatedAt);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const contextValue = useMemo(
    () => ({
      idols,
      allEvents,
      members,
      updatedAt,
      loading,
      error,
    }),
    [idols, allEvents, members, updatedAt, loading, error]
  );

  return <LiveEventsContext.Provider value={contextValue}>{children}</LiveEventsContext.Provider>;
};

export const useLiveEvents = () => {
  const context = useContext(LiveEventsContext);
  if (context === undefined) {
    throw new Error('useLiveEventsContext must be used within a LiveEventsProvider');
  }
  return context;
};
