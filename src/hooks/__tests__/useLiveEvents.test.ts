import { LiveEventsContext } from '@/contexts/LiveEventsContext';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { useLiveEvents } from '../useLiveEvents';

describe('useLiveEvents', () => {
  it('throws error when used outside LiveEventsProvider', () => {
    // renderHookのwrapperオプションを使わずに、直接フックを呼び出すことでエラーを検証
    expect(() => renderHook(() => useLiveEvents())).toThrow(
      'useLiveEvents must be used within a LiveEventsProvider'
    );
  });

  it('returns context value when used inside LiveEventsProvider', () => {
    const mockContextValue = {
      idols: [
        {
          id: '1',
          name: 'Idol 1',
          short_name: 'Idol 1',
          twitter_id: 'idol1_x',
          colors: { background: '#000', foreground: '#fff', text: '#000' },
        },
      ],
      allEvents: [],
      loading: false,
      error: null,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(LiveEventsContext.Provider, { value: mockContextValue }, children);

    const { result } = renderHook(() => useLiveEvents(), { wrapper });
    expect(result.current).toEqual(mockContextValue);
  });
});
