import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterAll, beforeAll } from 'vitest';
import type { Mock } from 'vitest';
import { useLocation } from 'react-router-dom';
import { ScrollToTop } from '../ScrollToTop';

// useLocationをモック化
const mockUseLocationValue = { pathname: '/' };
vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...originalModule,
    useLocation: vi.fn(() => mockUseLocationValue),
  };
});

describe('ScrollToTop', () => {
  // window.scrollToをモック化
  const scrollToSpy = vi.fn();
  const originalScrollTo = window.scrollTo;

  beforeAll(() => {
    window.scrollTo = scrollToSpy;
  });

  afterAll(() => {
    window.scrollTo = originalScrollTo;
  });

  beforeEach(() => {
    scrollToSpy.mockClear();
  });

  it('scrolls to top on initial render', () => {
    render(<ScrollToTop />);
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('scrolls to top when pathname changes', () => {
    const mockUseLocation = useLocation as Mock;

    const { rerender } = render(<ScrollToTop />);
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    scrollToSpy.mockClear();

    // pathnameを変更して再レンダリングをシミュレート
    mockUseLocation.mockReturnValue({ pathname: '/new-path' });
    rerender(<ScrollToTop />); // rerenderを使用

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  });
