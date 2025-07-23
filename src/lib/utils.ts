import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 日付を「6/1(月)」形式にフォーマットする関数
export const formatDate = (date: string): string => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
  return `${month}/${day}(${dayOfWeek})`;
};

export const toDateString = (d: Date) => d.toLocaleDateString('sv-SE');

export const getToday = () => toDateString(new Date());
