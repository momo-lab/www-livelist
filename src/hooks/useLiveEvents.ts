import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils'; // formatDateをインポート

// データの型定義
interface LiveEvent {
  url: string;
  name: string;
  short_name: string;
  date: string;
  content: string;
  image: string;
  link: string;
}

interface ProcessedLiveEvent extends LiveEvent {
  rowspan?: number;
  isFirstOfDay?: boolean;
  groupIndex?: number;
}

export const useLiveEvents = () => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました。');
        }
        const data: LiveEvent[] = await response.json();
        setEvents(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '不明なエラーが発生しました。'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // イベントを今後の予定と過去の履歴に分類し、過去の履歴をソート
  const now = new Date();
  // 時刻情報をクリアして日付のみにする
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    // イベントの日付も時刻情報をクリアして日付のみにする
    const eventDay = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    return eventDay >= today;
  });

  const pastEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const eventDay = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );
      return eventDay < today;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 日付の降順でソート

  // 日付ごとにグループ化し、rowspan情報を付与するヘルパー関数
  const processEventsForTable = (
    eventsToProcess: LiveEvent[]
  ): ProcessedLiveEvent[] => {
    let currentGroupIndex = -1;
    let lastFormattedDate = '';

    return eventsToProcess.reduce((acc: ProcessedLiveEvent[], event) => {
      const formattedDate = formatDate(event.date);

      if (formattedDate !== lastFormattedDate) {
        currentGroupIndex++;
        lastFormattedDate = formattedDate;
        const dayEvents = eventsToProcess.filter(
          (e) => formatDate(e.date) === formattedDate
        );
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
    loading,
    error,
  };
};
