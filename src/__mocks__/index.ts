import type { Idol, LiveEventRaw, LiveEvent, Member, Versions, TableEvent } from '@/types';

export const mockVersions: Versions = {
  data_version: 'v1',
  idols_version: 'v1',
  members_version: 'v1',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockIdols: Idol[] = [
  {
    id: 'idol1',
    name: 'Idol A',
    short_name: 'Idol A',
    twitter_id: 'idol1_x',
    instagram_id: 'idol1_inst',
    litlink_id: 'idol1_lit',
    colors: { background: '#FF0000', foreground: '#FFFFFF', text: '#000000' },
  },
  {
    id: 'idol2',
    name: 'Idol B',
    short_name: 'Idol B',
    twitter_id: 'idol2_x',
    tiktok_id: 'idol2_tiktok',
    litlink_id: 'idol2_lit',
    colors: { background: '#00FF00', foreground: '#000000', text: '#000000' },
  },
  {
    id: 'idol3',
    name: 'Idol C',
    short_name: 'Idol C',
    colors: { background: '#0000FF', foreground: '#FFFFFF', text: '#000000' },
  },
  {
    id: 'mofcro',
    name: 'もふくろちゃん',
    short_name: 'もふ',
    twitter_id: 'mofcro_x',
    instagram_id: 'mofcro_inst',
    litlink_id: 'mofcro_lit',
    colors: { background: '#fff', foreground: '#000', text: '#000' },
  },
  {
    id: 'lumi7',
    name: 'LUMiNATiO',
    short_name: 'るみな',
    twitter_id: 'lumi7_x',
    tiktok_id: 'lumi7_tiktok',
    litlink_id: 'lumi7_lit',
    colors: { background: '#fff', foreground: '#000', text: '#000' },
  },
];

export const mockEvents: LiveEvent[] = [
  {
    id: '1',
    idol: mockIdols[0],
    content: '未来のテストイベント1',
    date: '2025-07-15',
    image: 'image1',
    link: 'link1',
  },
  {
    id: '2',
    idol: mockIdols[1],
    content: 'Event 2',
    date: '2025-07-15',
    image: 'image2',
    link: 'link2',
  },
  {
    id: '3',
    idol: mockIdols[0],
    content: 'Event 3',
    date: '2025-07-16',
    link: 'link3',
  },
  {
    id: '4',
    idol: mockIdols[3],
    content: '過去のテストイベント1',
    date: '2025-07-14',
    image: 'image4',
    link: 'link4',
  },
  {
    id: '5',
    idol: mockIdols[1],
    content: '過去のテストイベント2',
    date: '2025-01-10',
    image: 'image5',
    link: 'link5',
  },
];

export const mockRawEvents: LiveEventRaw[] = mockEvents.map(({ idol, ...event }) => ({
  ...event,
  idolId: idol.id,
}));

export const mockMembers: Member[] = [
  {
    id: 'mofcrokoharu',
    idol_id: 'mofcro',
    name: '一野瀬 心晴',
    name_ruby: 'いちのせ こはる',
    color: 'yellow',
    color_code: '#FFFFFF',
    twitter_id: 'koharu',
  },
  {
    id: 'mofcroELLiE',
    idol_id: 'mofcro',
    name: '六星 エリィ',
    name_ruby: 'ろくほし えりぃ',
    color: 'purple',
    color_code: '#000000',
    twitter_id: 'ellie',
  },
  {
    id: 'lumi7rina',
    idol_id: 'lumi7',
    name: '高橋 りな',
    name_ruby: 'たかはし りな',
    color: 'blue',
    color_code: '#000000',
    twitter_id: 'rina',
    leaving_date: '2024-01-01',
  },
];

export const mockTableEvents: TableEvent[] = [
  {
    ...mockEvents[0],
    short_name: mockEvents[0].idol.short_name,
    isToday: true,
    colors: mockEvents[0].idol.colors,
    rowspan: 2,
    isFirstOfDay: true,
    groupIndex: 0,
  },
  {
    ...mockEvents[1],
    short_name: mockEvents[1].idol.short_name,
    isToday: false,
    colors: mockEvents[1].idol.colors,
    rowspan: 2,
    isFirstOfDay: false,
    groupIndex: 1,
  },
  {
    ...mockEvents[2],
    short_name: mockEvents[2].idol.short_name,
    isToday: false,
    colors: mockEvents[2].idol.colors,
    rowspan: 1,
    isFirstOfDay: true,
    groupIndex: 0,
  },
  {
    ...mockEvents[3],
    short_name: mockEvents[3].idol.short_name,
    isToday: false,
    colors: mockEvents[3].idol.colors,
    rowspan: 1,
    isFirstOfDay: true,
    groupIndex: 0,
  },
  {
    ...mockEvents[4],
    short_name: mockEvents[4].idol.short_name,
    isToday: false,
    colors: mockEvents[4].idol.colors,
    rowspan: 1,
    isFirstOfDay: true,
    groupIndex: 0,
  },
];
