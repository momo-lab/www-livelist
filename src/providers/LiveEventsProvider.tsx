import React, { useContext, useEffect, useMemo, useState } from 'react';
import { LiveEventsContext } from '@/contexts/LiveEventsContext';
import type { Idol, LiveEvent, Member } from '@/types';

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

  const makeFetchUrl = (name: string) =>
    `${import.meta.env.BASE_URL}external-data/${name}?cachebuster=${new Date().getTime()}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, idolsResponse, membersResponse] = await Promise.all([
          fetch(makeFetchUrl('data.json')),
          fetch(makeFetchUrl('idols.json')),
          fetch(makeFetchUrl('members.json')),
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

        if (!membersResponse.ok) {
          throw new Error('メンバーデータの取得に失敗しました。');
        }
        const membersData: Member[] = await membersResponse.json();
        setMembers(membersData);
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

export const useLiveEventsContext = () => {
  const context = useContext(LiveEventsContext);
  if (context === undefined) {
    throw new Error('useLiveEventsContext must be used within a LiveEventsProvider');
  }
  return context;
};
