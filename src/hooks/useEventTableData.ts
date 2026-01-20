import { useMemo } from 'react';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { getToday } from '@/lib/utils';
import type { LiveEvent, TableEvent } from '@/types';

export const useEventTableData = (mode: 'upcoming' | 'past', selectedIdols: string[]) => {
  const { allEvents, idols } = useLiveEvents();

  const today = getToday();

  const enrichedEvents = useMemo(() => {
    let result = allEvents
      .filter((e) => (mode === 'upcoming' ? e.date >= today : e.date < today))
      .map((e) => {
        const idol = idols.find((i) => i.id === e.id);
        return {
          ...e,
          isToday: e.date === today,
          ...(idol && {
            colors: idol.colors,
            short_name: idol.short_name,
          }),
        };
      });
    if (mode === 'past') {
      result = result.map(({ image: _, ...e }) => e).sort((a, b) => b.date.localeCompare(a.date));
    }
    return result;
  }, [allEvents, mode, today, idols]);

  const idolFilteredEvents = useMemo(() => {
    if (selectedIdols.length === 0) {
      return enrichedEvents;
    }
    return enrichedEvents.filter((event) => selectedIdols.includes(event.id));
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
