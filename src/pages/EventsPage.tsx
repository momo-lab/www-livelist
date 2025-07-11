import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { formatDate } from '@/lib/utils';
import type { ProcessedLiveEvent, LiveEvent } from '@/types';
import React, { useEffect, useMemo, useState } from 'react';

interface EventsPageProps {
  mode: 'upcoming' | 'past';
}

export const EventsPage: React.FC<EventsPageProps> = ({ mode }) => {
  // LocalStorageから初期状態を読み込むか、空の配列で初期化
  const [selectedIdols, setSelectedIdols] = useState<string[]>(() => {
    const storedSelectedIdols = localStorage.getItem('selectedIdols');
    return storedSelectedIdols ? JSON.parse(storedSelectedIdols) : [];
  });

  // selectedIdolsが変更されたらLocalStorageに保存する
  useEffect(() => {
    localStorage.setItem('selectedIdols', JSON.stringify(selectedIdols));
  }, [selectedIdols]);

  // useLiveEventsからデータを取得
  const { idols, allEvents, loading, error } = useLiveEvents();

  // IdolFilterから選択されたアイドルリストを受け取るハンドラ
  const handleSelectedIdolsChange = (newSelectedIdols: string[]) => {
    setSelectedIdols(newSelectedIdols);
  };

  // イベントを今後の予定と過去の履歴に分類し、過去の履歴をソート
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const filteredEvents = useMemo(() => {
    if (selectedIdols.length === 0) {
      return allEvents;
    }
    return allEvents.filter((event) => selectedIdols.includes(event.id));
  }, [allEvents, selectedIdols]);

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

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  const eventsToDisplay = mode === 'upcoming' ? processedUpcomingEvents : processedPastEvents;
  const noEventsMessage =
    mode === 'upcoming' ? '今後のライブ予定はありません。' : '過去のライブ履歴はありません。';

  return (
    <div className="container mx-auto px-4 py-4">
      <IdolFilter
        initialSelectedIdols={selectedIdols}
        onSelectedIdolsChange={handleSelectedIdolsChange}
      />

      {eventsToDisplay.length > 0 ? (
        <LiveEventTable processedEvents={eventsToDisplay} idols={idols} />
      ) : (
        <p className="p-4 text-center">{noEventsMessage}</p>
      )}
    </div>
  );
};
