import { useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

export const useSelectedIdols = () => {
  const [selectedIdols, setSelectedIdols] = useLocalStorage<string[]>('selectedIdols', []);
  const { idols, loading } = useLiveEvents();

  useEffect(() => {
    const isNotInitialized = selectedIdols.length === 0;
    if (isNotInitialized && !loading && idols.length > 0) {
      setSelectedIdols(idols.map((idol) => idol.id));
    }
  }, [loading, idols, selectedIdols, setSelectedIdols]);

  return [selectedIdols, setSelectedIdols] as const;
};
