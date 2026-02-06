import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchLiveEventsData } from '@/services/fetchLiveEventsData';
import type { Idol, LiveEvent, Member, Versions } from '@/types';

const mockVersions: Versions = {
  data_version: 'v1',
  idols_version: 'v1',
  members_version: 'v1',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockIdols: Idol[] = [
  {
    id: 'idol1',
    name: 'Idol 1',
    short_name: 'IDL1',
    colors: { background: '#FFF', foreground: '#000', text: '#000' },
  },
];

const mockAllEvents: LiveEvent[] = [
  {
    id: '1',
    idol: mockIdols[0],
    content: 'Live Event 1',
    date: '2024-01-10',
  },
];

const mockMembers: Member[] = [
  {
    id: 'member1',
    name: 'Member 1',
    name_ruby: 'めんばー 1',
    color: 'white',
    idol_id: 'idol1',
    color_code: '#FFFFFF', // YIQ >= 128
  },
  {
    id: 'member2',
    name: 'Member 2',
    name_ruby: 'めんばー 2',
    color: 'black',
    idol_id: 'idol1',
    color_code: '#000000', // YIQ < 128
  },
];

const mockFetch = vi.fn();
vi.spyOn(globalThis, 'fetch').mockImplementation(mockFetch);

describe('fetchLiveEventsData', () => {
  beforeEach(() => {
    mockFetch.mockImplementation((url: string) => {
      const urlObj = new URL(url, 'http://localhost');
      const path = urlObj.pathname.split('/').pop();

      switch (path) {
        case 'versions.json':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockVersions),
          } as Response);
        case 'data.json':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAllEvents),
          } as Response);
        case 'idols.json':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockIdols),
          } as Response);
        case 'members.json':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockMembers),
          } as Response);
        default:
          return Promise.reject(new Error(`Unknown path: ${path}`));
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('正常にデータを取得し、整形して返すこと', async () => {
    const { allEvents, idols, members, updatedAt } = await fetchLiveEventsData();

    expect(allEvents).toEqual(mockAllEvents);
    expect(idols).toEqual(mockIdols);
    expect(members).toEqual([
      { ...mockMembers[0], text_color_code: '#000000' },
      { ...mockMembers[1], text_color_code: '#FFFFFF' },
    ]);
    expect(updatedAt).toEqual(new Date(mockVersions.updatedAt));

    expect(mockFetch).toHaveBeenCalledTimes(4);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/versions\.json/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/data\.json\?v=v1/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/idols\.json\?v=v1/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/members\.json\?v=v1/));
  });

  it('versions.jsonの取得に失敗した場合、エラーをスローすること', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('versions.json')) {
        return Promise.resolve({ ok: false } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);
    });

    await expect(fetchLiveEventsData()).rejects.toThrow('versions.jsonの取得に失敗しました。');
  });

  it('data.jsonの取得に失敗した場合、エラーをスローすること', async () => {
    mockFetch.mockImplementation((url: string) => {
      const urlObj = new URL(url, 'http://localhost');
      const path = urlObj.pathname.split('/').pop();

      if (path === 'data.json') {
        return Promise.resolve({ ok: false } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockVersions),
      } as Response);
    });

    await expect(fetchLiveEventsData()).rejects.toThrow('data.jsonの取得に失敗しました。');
  });
});
