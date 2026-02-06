import { useMemo } from 'react';
import { getToday } from '@/lib/date';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

export function useFilteredEvents({
  target,
  targetIdols,
  yearMonth,
}: {
  target: 'all' | 'upcoming' | 'past';
  targetIdols: string[]; // 空なら全件
  yearMonth?: string; // yyyy or yyyy-MM
}) {
  const { allEvents } = useLiveEvents();
  const today = getToday();

  const filteredEvents = useMemo(() => {
    let result = allEvents
      // 過去/未来フィルタ
      .filter((e) =>
        target === 'upcoming' ? e.date >= today : target === 'past' ? e.date < today : true
      )
      // アイドルフィルタ
      .filter((e) => (targetIdols.length > 0 ? targetIdols.includes(e.idol.id) : true))
      // 年月フィルタ
      .filter((e) => (yearMonth ? e.date.startsWith(yearMonth) : true));
    // 'past'の場合は日付の降順にソート
    if (target === 'past') {
      result = result.sort((a, b) => b.date.localeCompare(a.date));
    }
    return result;
  }, [allEvents, target, targetIdols, yearMonth, today]);

  return {
    today,
    filteredEvents,
  };
}
