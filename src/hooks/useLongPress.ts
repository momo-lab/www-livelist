import { useCallback, useRef } from 'react';

interface LongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
}

export const useLongPress = ({ onLongPress, onClick, delay = 500 }: LongPressOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isClickable = useRef(false);

  const start = useCallback(() => {
    isClickable.current = true;
    timerRef.current = setTimeout(() => {
      isClickable.current = false;
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (isClickable.current && onClick) {
      onClick();
      isClickable.current = false;
    }
  }, [onClick]);

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
  };
};
