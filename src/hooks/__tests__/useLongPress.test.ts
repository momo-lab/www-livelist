import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { useLongPress } from '../useLongPress';

describe('useLongPress', () => {
  let onLongPressMock: Mock;
  let onClickMock: Mock;

  beforeEach(() => {
    onLongPressMock = vi.fn();
    onClickMock = vi.fn();
    vi.useFakeTimers(); // フェイクタイマーを使用
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers(); // テスト後にリアルタイマーに戻す
  });

  it('calls onLongPress after delay if no click occurs', () => {
    const { result } = renderHook(() =>
      useLongPress({
        onLongPress: onLongPressMock,
        onClick: onClickMock,
        delay: 500,
      })
    );

    act(() => {
      result.current.onPointerDown();
    });

    vi.advanceTimersByTime(499); // 遅延時間未満
    expect(onLongPressMock).not.toHaveBeenCalled();
    expect(onClickMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1); // 遅延時間経過
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('calls onClick if pointerup occurs before delay', () => {
    const { result } = renderHook(() =>
      useLongPress({
        onLongPress: onLongPressMock,
        onClick: onClickMock,
        delay: 500,
      })
    );

    act(() => {
      result.current.onPointerDown();
    });

    vi.advanceTimersByTime(200); // 遅延時間未満

    act(() => {
      result.current.onPointerUp();
    });

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onLongPressMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500); // 遅延時間経過後もonLongPressは呼ばれない
    expect(onLongPressMock).not.toHaveBeenCalled();
  });

  it('does not call onClick if onLongPress has already been triggered', () => {
    const { result } = renderHook(() =>
      useLongPress({
        onLongPress: onLongPressMock,
        onClick: onClickMock,
        delay: 500,
      })
    );

    act(() => {
      result.current.onPointerDown();
    });

    vi.advanceTimersByTime(500); // onLongPressがトリガーされる
    expect(onLongPressMock).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.onPointerUp(); // クリックイベントをシミュレート
    });

    expect(onClickMock).not.toHaveBeenCalled(); // onClickは呼ばれない
  });

  it('clears timer and does not call onLongPress if pointerleave occurs before delay', () => {
    const { result } = renderHook(() =>
      useLongPress({
        onLongPress: onLongPressMock,
        onClick: onClickMock,
        delay: 500,
      })
    );

    act(() => {
      result.current.onPointerDown();
    });

    vi.advanceTimersByTime(200); // 遅延時間未満

    act(() => {
      result.current.onPointerLeave();
    });

    vi.advanceTimersByTime(500); // 遅延時間経過
    expect(onLongPressMock).not.toHaveBeenCalled();
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('clears timer and does not call onLongPress if onPointerCancel occurs before delay', () => {
    const { result } = renderHook(() =>
      useLongPress({
        onLongPress: onLongPressMock,
        onClick: onClickMock,
        delay: 500,
      })
    );

    act(() => {
      result.current.onPointerDown();
    });

    vi.advanceTimersByTime(200); // 遅延時間未満

    act(() => {
      result.current.onPointerCancel();
    });

    vi.advanceTimersByTime(500); // 遅延時間経過
    expect(onLongPressMock).not.toHaveBeenCalled();
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('uses custom delay', () => {
    const customDelay = 1000;
    const { result } = renderHook(() =>
      useLongPress({
        onLongPress: onLongPressMock,
        onClick: onClickMock,
        delay: customDelay,
      })
    );

    act(() => {
      result.current.onPointerDown();
    });

    vi.advanceTimersByTime(customDelay - 1);
    expect(onLongPressMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
  });
});
