import { LiveEventsContext } from '@/contexts/LiveEventsContext';
import type { Idol, LiveEvent } from '@/types';
import React, { useContext, useEffect, useMemo, useState } from 'react';

interface LiveEventsProviderProps {
  children: React.ReactNode;
}

export const LiveEventsProvider: React.FC<LiveEventsProviderProps> = ({ children }) => {
  const [idols, setIdols] = useState<Idol[]>([]);
  const [allEvents, setAllEvents] = useState<LiveEvent[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const makeFetchUrl = (name: string) =>
    `${import.meta.env.BASE_URL}external-data/${name}?cachebuster=${new Date().getTime()}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, idolsResponse] = await Promise.all([
          fetch(makeFetchUrl('data.json')),
          fetch(makeFetchUrl('idols.json')),
        ]);

        if (!idolsResponse.ok) {
          throw new Error('アイドルデータの取得に失敗しました。');
        }
        const idolsData: Idol[] = await idolsResponse.json();
        setIdols(idolsData);

        if (!eventsResponse.ok) {
          throw new Error('イベントデータの取得に失敗しました。');
        }
        const lastModified = eventsResponse.headers.get('Last-Modified');
        if (lastModified) {
          setUpdatedAt(new Date(lastModified));
        }
        const eventsData: LiveEvent[] = await eventsResponse.json();
        setAllEvents(eventsData);
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
      updatedAt,
      loading,
      error,
    }),
    [idols, allEvents, updatedAt, loading, error]
  );

  return <LiveEventsContext.Provider value={contextValue}>{children}</LiveEventsContext.Provider>;
};

export const useLiveEventsContext = () => {
  const context = useContext(LiveEventsContext);
  if (context === undefined) {
    throw new Error('useLiveEventsContext must be used within a LiveEventsProvider');
  }
  return context;
};
