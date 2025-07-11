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

  // 表示範囲のイベントのみ抽出
  const toDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = toDate(new Date());

  const events = useMemo(() => {
    let events = allEvents
      .filter((e) => mode == 'upcoming'
        ? toDate(e.date) >= today
        : toDate(e.date) < today)
      .map(e => ({
        ...e,
        formatted_date: formatDate(e.date, mode)
      }));
    if (mode == 'past') {
      // 過去履歴なら画像は不要で逆順
      events = events
        .map(({image: _, ...e}) => e)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    return events;
  }, [allEvents, mode, today]);

  // フィルタ
  const filteredEvents = useMemo(() => {
    if (selectedIdols.length === 0) {
      return allEvents;
    }
    return events.filter((event) => selectedIdols.includes(event.id));
  }, [events, selectedIdols]);

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
  const eventsToDisplay = processEventsForTable(filteredEvents);

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

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
