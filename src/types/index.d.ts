export interface IdolColors {
  background: string;
  foreground: string;
  text: string;
}

export interface Idol {
  id: string;
  name: string;
  short_name: string;
  colors: IdolColors;
}

export interface LiveEvent {
  id: string;
  url: string;
  name: string;
  short_name: string;
  date: Date;
  formatted_date: string;
  content: string;
  image?: string;
  link: string;
}

export interface TableEvent extends LiveEvent {
  rowspan?: number;
  isFirstOfDay?: boolean;
  groupIndex?: number;
  colors?: IdolColors;
}
