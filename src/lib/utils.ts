import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 日付を「6/1(月)」形式にフォーマットする関数
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${month}/${day}(${dayOfWeek})`;
};

// Badgeのvariant型を定義
type BadgeVariant =
  | 'default'
  | 'mofcro'
  | 'mofcro-outline'
  | 'girudoru'
  | 'girudoru-outline'
  | 'mofrurock'
  | 'mofrurock-outline'
  | 'osahoto'
  | 'osahoto-outline';

// グループIDに基づいてバッジの色を決定する関数
export const getBadgeVariant = (url: string): BadgeVariant => {
  const urlPart = url.replace(/^.*\//, '');
  switch (urlPart) {
    case 'mofcro':
      return 'mofcro';
    case 'girudoru':
      return 'girudoru';
    case 'mofrurock':
      return 'mofrurock';
    case 'osahoto':
      return 'osahoto';
    default:
      return 'default';
  }
};
