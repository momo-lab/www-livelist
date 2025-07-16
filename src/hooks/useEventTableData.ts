import { useLiveEvents } from '@/hooks/useLiveEvents';
import { formatDate, getToday, toDate } from '@/lib/utils';
import type { LiveEvent, TableEvent } from '@/types';
import { useMemo } from 'react';

export const useEventTableData = (mode: 'upcoming' | 'past', selectedIdols: string[]) => {
  const { allEvents, idols } = useLiveEvents();

  const today = getToday();

  const enrichedEvents = useMemo(() => {
    let result = allEvents
      .filter((e) => (mode === 'upcoming' ? toDate(e.date) >= today : toDate(e.date) < today))
      .map((e) => {
        const idol = idols.find((i) => i.id === e.id);
        return {
          ...e,
          formatted_date: formatDate(e.date, mode),
          ...(idol && { colors: idol.colors }),
        };
      });
    if (mode === 'past') {
      result = result
        .map(({ image: _, ...e }) => e)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
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
    let lastFormattedDate = '';

    return liveEvents.reduce((acc: TableEvent[], event) => {
      if (event.formatted_date !== lastFormattedDate) {
        currentGroupIndex++;
        lastFormattedDate = event.formatted_date;
        const dayEvents = liveEvents.filter((e) => e.formatted_date === event.formatted_date);
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
