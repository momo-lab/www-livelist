import '@/styles/calendar.css';
import type { CalendarApi } from '@fullcalendar/core';
import jaLocale from '@fullcalendar/core/locales/ja';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { useMemo, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Button } from '@/components/ui/button';
import { isHoliday } from '@/lib/holidays-jp';
import { useHeaderTitle, useHeaderRight } from '@/providers/HeaderSlotsProvider';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

export function CalendarPage() {
  const { allEvents, idols, error, loading } = useLiveEvents();
  const apiRef = useRef<CalendarApi | null>(null);
  const [headerTitle, setHeaderTitle] = useState('');

  const events = useMemo(
    () =>
      allEvents.map((event) => ({
        id: event.id,
        start: event.date,
        title: event.content,
      })),
    [allEvents, idols]
  );

  const swipeHandlers = useSwipeable({
    onSwiped: (eventData) => console.log('UserSwiped!', eventData),
    onSwipedLeft: () => apiRef.current?.next(),
    onSwipedRight: () => apiRef.current?.prev(),
  });

  const headerTitleNode = useMemo(() => {
    return <>{headerTitle}</>;
  }, [headerTitle]);
  useHeaderTitle(headerTitleNode);

  // ヘッダ右側に差し込むUI
  const headerRightNode = useMemo(() => {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => apiRef.current?.today()}>
          今日
        </Button>

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
    <div className="" {...swipeHandlers}>
      <FullCalendar
        locale={jaLocale}
        ref={(instance) => {
          apiRef.current = instance?.getApi() ?? null;
        }}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        firstDay={1}
        contentHeight={`calc(100vh - var(--header-height) - var(--footer-height))`}
        showNonCurrentDates={true}
        datesSet={(dateInfo) => {
          // ヘッダタイトルに年月をセット
          const cur = dateInfo.view.currentStart;
          setHeaderTitle(`${cur.getFullYear()}年${cur.getMonth() + 1}月`);
        }}
        dayCellContent={({ date }) => <div className="text-sm">{date.getDate()}</div>}
        dayCellClassNames={({ date }) => {
          const classes: string[] = [];
          if (isHoliday(date)) classes.push('day--holiday');
          return classes;
        }}
        /* 日付クリック */
        dateClick={(info) => {
          console.log('Clicked on: ' + info.dateStr);
        }}
        eventClick={(info) => {
          console.log('Event clicked: ' + info.event.title);
        }}
        /* イベント表示関連 */
        dayMaxEvents={true}
        moreLinkClick="month"
        moreLinkContent={({ num }) => (
          <div className="flex w-full">
            <span className="text-muted-foreground ml-auto text-xs">+{num}</span>
          </div>
        )}
        events={events}
      />
    </div>
  );
}
