import type { CalendarApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import { useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useHeaderRight } from '@/hooks/app/useHeaderRight';

export function CalendarPage() {
  const apiRef = useRef<CalendarApi | null>(null);

  // ヘッダ右側に差し込むUI
  const headerRightNode = useMemo(() => {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => apiRef.current?.prev()}>
          前月
        </Button>

        <Button variant="outline" size="sm" onClick={() => apiRef.current?.next()}>
          翌月
        </Button>
      </div>
    );
  }, []);
  useHeaderRight(headerRightNode);

  return (
    <div className="m-2">
      <FullCalendar
        ref={(instance) => {
          apiRef.current = instance?.getApi() ?? null;
        }}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        contentHeight="auto"
        expandRows={true}
        fixedWeekCount={true}
        showNonCurrentDates={true}
        headerToolbar={false}
        events={[
          { id: '1', title: '渋谷ワンマン', start: '2026-02-03' },
          { id: '2', title: '物販締切', start: '2026-02-03' },
          { id: '3', title: '新譜発売', start: '2026-02-08' },
          { id: '4', title: '大阪', start: '2026-03-01' },
        ]}
      />
    </div>
  );
}
