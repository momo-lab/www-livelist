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
  const isTouchEvent = useRef(false);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if ('touches' in event) {
        isTouchEvent.current = true;
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!isLongPressTriggered.current && event.type !== 'mouseleave') {
        onClick();
      }

      // リセットを少し遅らせる
      setTimeout(() => {
        isTouchEvent.current = false;
      }, 100);
    },
    [onClick]
  );

  // prevent default to suppress mouse events after touch
  useEffect(() => {
    const preventMouse = (e: MouseEvent) => {
      if (isTouchEvent.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('mousedown', preventMouse, true);
    document.addEventListener('mouseup', preventMouse, true);

    return () => {
      document.removeEventListener('mousedown', preventMouse, true);
      document.removeEventListener('mouseup', preventMouse, true);
    };
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault(); // suppresses mouse event
      start(e);
    },
    onMouseUp: clear,
    onTouchEnd: clear,
    onMouseLeave: clear,
    onTouchCancel: clear,
  };
};
