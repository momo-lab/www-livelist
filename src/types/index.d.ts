interface LiveEvent {
  url: string;
  name: string;
  short_name: string;
  date: string;
  formatted_date: string;
  content: string;
  image?: string;
  link: string;
}

interface ProcessedLiveEvent extends LiveEvent {
  rowspan?: number;
  isFirstOfDay?: boolean;
  groupIndex?: number;
}
