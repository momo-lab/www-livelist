import type { Versions, Idol, LiveEvent, Member } from '@/types';

const getContrastYIQ = (hexcolor: string) => {
  const r = parseInt(hexcolor.substring(1, 3), 16);
  const g = parseInt(hexcolor.substring(3, 5), 16);
  const b = parseInt(hexcolor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

const fetchJsonOrThrow = async <T>(
  path: string,
  version: string | number
): Promise<{ res: Response; data: T }> => {
  const url = `${import.meta.env.BASE_URL}external-data/${path}?v=${version}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${path}の取得に失敗しました。`);
  }
  const data = (await res.json()) as T;
  return { res, data };
};

export const fetchLiveEventsData = async () => {
  const { data: versions } = await fetchJsonOrThrow<Versions>('versions.json', Date.now());

  const [events, idols, members] = await Promise.all([
    fetchJsonOrThrow<LiveEvent[]>('data.json', versions.data_version),
    fetchJsonOrThrow<Idol[]>('idols.json', versions.idols_version),
    fetchJsonOrThrow<Member[]>('members.json', versions.members_version),
  ]);

  const lastModified = events.res.headers.get('Last-Modified');
  const updatedAt = lastModified ? new Date(lastModified) : undefined;

  return {
    allEvents: events.data,
    idols: idols.data,
    members: members.data.map((member) => ({
      ...member,
      text_color_code: getContrastYIQ(member.color_code),
    })),
    updatedAt,
  };
};
