export interface Versions {
  data_version: string;
  idols_version: string;
  members_version: string;
  updatedAt: string; // ISO 8601 format
}

export interface IdolColors {
  background: string;
  foreground: string;
  text: string;
}

export interface Idol {
  id: string;
  name: string;
  short_name: string;
  twitter_id?: string;
  tiktok_id?: string;
  instagram_id?: string;
  colors: IdolColors;
}

export interface LiveEvent {
  id: string;
  date: string; // yyyy-MM-dd
  content: string;
  image?: string;
  link?: string;
}

export interface TableEvent extends LiveEvent {
  short_name?: string;
  isToday?: boolean;
  colors?: IdolColors;

  rowspan?: number;
  isFirstOfDay?: boolean;
  groupIndex?: number;
}

export interface Member {
  id: string;
  idol_id: string;
  name: string;
  name_ruby: string;
  color: string;
  color_code: string; // #xxxxxx
  text_color_code?: string; // 計算で付与
  litlink_id?: string;
  twitter_id?: string;
  tiktok_id?: string;
  instagram_id?: string;
  joining_date?: string; // yyyy-MM-dd
  leaving_date?: string; // yyyy-MM-dd
}
