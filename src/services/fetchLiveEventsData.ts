import type { Versions, Idol, LiveEventRaw, LiveEvent, Member } from '@/types';

const getContrastYIQ = (hexcolor: string) => {
  const r = parseInt(hexcolor.substring(1, 3), 16);
  const g = parseInt(hexcolor.substring(3, 5), 16);
  const b = parseInt(hexcolor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

const fetchJsonOrThrow = async <T>(path: string, version: string | number): Promise<T> => {
  const url = `${import.meta.env.BASE_URL}external-data/${path}?v=${version}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${path}の取得に失敗しました。`);
  }
  const data = (await res.json()) as T;
  return data;
};

export const fetchLiveEventsData = async (): Promise<{
  allEvents: LiveEvent[];
  idols: Idol[];
  members: Member[];
  updatedAt: Date;
}> => {
  const versions = await fetchJsonOrThrow<Versions>('versions.json', Date.now());

  const [allEvents, idols, members] = await Promise.all([
    fetchJsonOrThrow<LiveEventRaw[]>('data.json', versions.data_version),
    fetchJsonOrThrow<Idol[]>('idols.json', versions.idols_version),
    fetchJsonOrThrow<Member[]>('members.json', versions.members_version),
  ]);

  const throwError = (message: string): never => {
    throw new Error(message);
  };
  return {
    allEvents: allEvents.map(({ idolId, ...event }) => ({
      ...event,
      idolId,
      idol: idols.find(({ id }) => idolId === id) ?? throwError(`idolId(${idolId}) is not found`),
    })),
    idols,
    members: members.map((member) => ({
      ...member,
      text_color_code: getContrastYIQ(member.color_code),
    })),
    updatedAt: new Date(versions.updatedAt),
  };
};
