import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getHistory, addToHistory, type HistoryItem } from './historyStore';

export function useHistory() {
  const queryClient = useQueryClient();

  const query = useQuery<HistoryItem[]>({
    queryKey: ['history'],
    queryFn: getHistory,
    staleTime: Infinity,
  });

  const addResult = (item: HistoryItem) => {
    addToHistory(item);
    queryClient.invalidateQueries({ queryKey: ['history'] });
  };

  return {
    history: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addResult,
  };
}
