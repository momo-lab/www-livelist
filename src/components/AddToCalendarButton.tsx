import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, toDateString } from '@/lib/utils';
import type { LiveEvent } from '@/types';
import { CalendarPlus } from 'lucide-react';
import React from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa6';

const escapeICSText = (text: string): string => {
  return text
    .replace(/\\n/g, '\\n') // すでにエスケープされてる場合
    .replace(/\r?\n/g, '\\n') // 改行 → \n（ics仕様）
    .replace(/,/g, '\\,') // カンマ → エスケープ（念のため）
    .replace(/;/g, '\\;'); // セミコロン → エスケープ（念のため）
};

interface AddToCalendarButtonProps extends React.ComponentProps<'button'> {
  event: LiveEvent;
}

const toYYYYMMDD = (date: string): string => date.replace(/-/g, '');

const getNextDay = (date: string): string => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return toDateString(next);
};

const makeTitle = (event: LiveEvent): string =>
  (event.content.split('\n')[0] ?? '').replace(/a/, '');

const makeLocation = (event: LiveEvent): string =>
  (event.content.split('\n')[1] ?? '').replace(/a/, '');

export const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  event,
  className,
  ...props
}) => {
  // Googleカレンダーに追加のリンク生成
  const generateGoogleCalendarLink = () => {
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
      text: makeTitle(event),
      dates: `${toYYYYMMDD(event.date)}/${toYYYYMMDD(getNextDay(event.date))}`,
      location: makeLocation(event),
      details: event.content,
    });
    return `${baseUrl}&${params.toString()}`;
  };

  const handleIcsDownload = () => {
    const title = makeTitle(event);
    const startDate = toYYYYMMDD(event.date);
    const endDate = toYYYYMMDD(getNextDay(event.date));

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${escapeICSText(title)}
LOCATION:${escapeICSText(makeLocation(event))}
DESCRIPTION:${escapeICSText(event.content)}
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center text-sm',
            'text-blue-500 hover:text-blue-600',
            className
          )}
          {...props}
        >
          <CalendarPlus className="h-4 w-4 me-0.5" />
          <span className="underline me-0.5">登録</span>▾
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-border">
        <DropdownMenuItem asChild>
          <a href={generateGoogleCalendarLink()} target="_blank" rel="noopener noreferrer">
            <FaGoogle className="h-4 w-4" />
            Googleカレンダーに登録
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleIcsDownload}>
          <FaApple className="h-4 w-4" />
          iPhoneに登録(.ics)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
