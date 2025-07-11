import { formatDate } from '@/lib/utils';
import type { Idol, LiveEvent, ProcessedLiveEvent } from '@/types';
import { useEffect, useMemo, useState } from 'react';

export const useLiveEvents = (
  selectedIdols: string[] // フィルタリング対象のアイドル名を受け取る
) => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [idols, setIdols] = useState<Idol[]>([]); // アイドルデータを保持するstate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, idolsResponse] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data.json?cachebuster=${new Date().getTime()}`),
          fetch(`${import.meta.env.BASE_URL}idols.json?cachebuster=${new Date().getTime()}`),
        ]);

        if (!eventsResponse.ok) {
          throw new Error('イベントデータの取得に失敗しました。');
        }
        const eventsData: LiveEvent[] = await eventsResponse.json();
        setEvents(eventsData);

        if (!idolsResponse.ok) {
          throw new Error('アイドルデータの取得に失敗しました。');
        }
        const idolsData: Idol[] = await idolsResponse.json();
        setIdols(idolsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // フィルタリングされたイベントを計算
  const filteredEvents = useMemo(() => {
    if (selectedIdols.length === 0) {
      return events;
    }
    return events.filter((event) => selectedIdols.includes(event.id));
  }, [events, selectedIdols]);

  // イベントを今後の予定と過去の履歴に分類し、過去の履歴をソート
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcomingEvents = filteredEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      return eventDay >= today;
    })
    .map((event) => ({
      ...event,
      formatted_date: formatDate(event.date, 'upcoming'),
    }));

  const pastEvents = filteredEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      return eventDay < today;
    })
    .map(({ image: _, ...event }) => ({
      ...event,
      formatted_date: formatDate(event.date, 'past'),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 日付ごとにグループ化し、rowspan情報を付与するヘルパー関数
  const processEventsForTable = (eventsToProcess: LiveEvent[]): ProcessedLiveEvent[] => {
    let currentGroupIndex = -1;
    let lastFormattedDate = '';

    return eventsToProcess.reduce((acc: ProcessedLiveEvent[], event) => {
      if (event.formatted_date !== lastFormattedDate) {
        currentGroupIndex++;
        lastFormattedDate = event.formatted_date;
        const dayEvents = eventsToProcess.filter((e) => e.formatted_date === event.formatted_date);
        acc.push({
          ...event,
          rowspan: dayEvents.length,
          isFirstOfDay: true,
          groupIndex: currentGroupIndex,
        });
      } else {
        acc.push({
          ...event,
          isFirstOfDay: false,
          groupIndex: currentGroupIndex,
        });
      }
      return acc;
    }, []);
  };

  const processedUpcomingEvents = processEventsForTable(upcomingEvents);
  const processedPastEvents = processEventsForTable(pastEvents);

  return {
    processedUpcomingEvents,
    processedPastEvents,
    idols, // フェッチしたアイドルデータを返す
    loading,
    error,
  };
};
