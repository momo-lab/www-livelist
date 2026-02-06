import { useMemo } from 'react';
import { getToday } from '@/lib/date';
import { useLiveEvents } from '@/providers/LiveEventsProvider';
import type { LiveEvent, TableEvent } from '@/types';

export const useEventTableData = (mode: 'upcoming' | 'past', selectedIdols: string[]) => {
  const { allEvents } = useLiveEvents();

  const today = getToday();

  const enrichedEvents = useMemo(() => {
    let result = allEvents
      .filter((e) => (mode === 'upcoming' ? e.date >= today : e.date < today))
      .map((e) => {
        return {
          ...e,
          isToday: e.date === today,
          colors: e.idol.colors,
          short_name: e.idol.short_name,
        };
      });
    if (mode === 'past') {
      result = result.map(({ image: _, ...e }) => e).sort((a, b) => b.date.localeCompare(a.date));
    }
    return result;
  }, [allEvents, mode, today]);

  const idolFilteredEvents = useMemo(() => {
    if (selectedIdols.length === 0) {
      return enrichedEvents;
    }
    return enrichedEvents.filter((event) => selectedIdols.includes(event.idol.id));
  }, [enrichedEvents, selectedIdols]);

  const createTableEvents = (liveEvents: LiveEvent[]): TableEvent[] => {
    let currentGroupIndex = -1;
    let lastDate = '';

    return liveEvents.reduce((acc: TableEvent[], event) => {
      if (event.date !== lastDate) {
        currentGroupIndex++;
        lastDate = event.date;
        const dayEvents = liveEvents.filter((e) => e.date === event.date);
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

  const eventTableData = createTableEvents(idolFilteredEvents);

  return { eventTableData };
};
