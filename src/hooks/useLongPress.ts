import { useRef, useEffect, useCallback } from 'react';

interface LongPressOptions {
  onLongPress: () => void;
  onClick: () => void;
  delay?: number;
}

export const useLongPress = ({
  onLongPress,
  onClick,
  delay = 500,
}: LongPressOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);
  const isTouch = useRef(false); // タッチイベントが発火したかどうかを追跡

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (event.type === 'touchstart') {
        isTouch.current = true;
      } else if (isTouch.current) {
        // タッチイベントの後にマウスイベントが発火した場合、無視する
        return;
      }

      isLongPressTriggered.current = false;
      timerRef.current = setTimeout(() => {
        onLongPress();
        isLongPressTriggered.current = true;
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (event.type === 'touchend' || event.type === 'touchcancel') {
        // タッチイベントの後にマウスイベントが発火するのを防ぐため、一定時間フラグをリセットしない
        setTimeout(() => {
          isTouch.current = false;
        }, 50); // 短い遅延
      } else if (isTouch.current) {
        // タッチイベントの後にマウスイベントが発火した場合、無視する
        return;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // mouseleave イベントでは onClick をトリガーしない
      if (!isLongPressTriggered.current && event.type !== 'mouseleave') {
        onClick();
      }
    },
    [onClick]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onTouchEnd: clear,
    onMouseLeave: clear,
    onTouchCancel: clear,
  };
};
