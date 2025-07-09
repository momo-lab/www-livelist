import { useEffect, useState, useMemo } from 'react'; // useMemoを追加
import { formatDate } from '@/lib/utils';

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

export const useLiveEvents = (
  selectedIdols: string[] // フィルタリング対象のアイドル名を受け取る
) => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uniqueIdolNames, setUniqueIdolNames] = useState<string[]>([]); // ユニークなアイドル名を追加

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data.json`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました。');
        }
        const data: LiveEvent[] = await response.json();
        setEvents(data);

        // ユニークなアイドル名を取得
        const names = Array.from(
          new Set(data.map((event) => event.short_name))
        );
        setUniqueIdolNames(names);
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

  // フィルタリングされたイベントを計算
  const filteredEvents = useMemo(() => {
    // selectedIdolsが空の場合は、全てのイベントを返す
    // App.tsxでselectedIdolsがuniqueIdolNamesで初期化されるため、この条件はselectedIdolsが空の配列として渡された場合にのみ適用される
    if (selectedIdols.length === 0) {
      return events;
    }
    return events.filter((event) => selectedIdols.includes(event.short_name));
  }, [events, selectedIdols]);

  // イベントを今後の予定と過去の履歴に分類し、過去の履歴をソート
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcomingEvents = filteredEvents.filter((event) => {
    // filteredEventsを使用
    const eventDate = new Date(event.date);
    const eventDay = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    return eventDay >= today;
  });

  const pastEvents = filteredEvents // filteredEventsを使用
    .filter((event) => {
      const eventDate = new Date(event.date);
      const eventDay = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );
      return eventDay < today;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    uniqueIdolNames,
    loading,
    error,
  };
};
