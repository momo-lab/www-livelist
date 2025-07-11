import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 日付を「6/1(月)」形式にフォーマットする関数
export const formatDate = (dateString: string, mode: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return mode == 'past' ? `${year}/${month}/${day}(${dayOfWeek})` : `${month}/${day}(${dayOfWeek})`;
};
