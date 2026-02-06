import { useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/common/useLocalStorage';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

export const useSelectedIdols = () => {
  const [selectedIdols, setSelectedIdolsRaw] = useLocalStorage<string[]>('selectedIdols', []);
  const { idols: rawIdols, loading } = useLiveEvents();

  const idols = useMemo(() => {
    return rawIdols.filter((idol) => idol.litlink_id);
  }, [rawIdols]);

  const setSelectedIdols = useCallback(
    (selectedIdols: string[]) => {
      const newSelectedIdols = selectedIdols.filter(
        (idolId) => idols.findIndex((idol) => idol.id === idolId) >= 0
      );
      setSelectedIdolsRaw(newSelectedIdols);
    },
    [idols, setSelectedIdolsRaw]
  );

  useEffect(() => {
    const isNotInitialized = selectedIdols.length === 0;
    if (isNotInitialized && !loading && idols.length > 0) {
      setSelectedIdolsRaw(idols.map((idol) => idol.id));
    }
  }, [loading, idols, selectedIdols, setSelectedIdolsRaw]);

  return [selectedIdols, setSelectedIdols] as const;
};
