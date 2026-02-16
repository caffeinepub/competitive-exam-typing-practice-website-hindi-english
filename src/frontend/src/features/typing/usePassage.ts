import { useQuery } from '@tanstack/react-query';
import { Language, type Passage } from '../../backend';
import { getPassagesByLanguage } from '../../services/passages';

export function usePassage(language: Language) {
  const query = useQuery<Passage | null>({
    queryKey: ['passage', language],
    queryFn: async () => {
      const passages = await getPassagesByLanguage(language);
      if (passages.length === 0) return null;
      
      // Select random passage
      const randomIndex = Math.floor(Math.random() * passages.length);
      return passages[randomIndex];
    },
    staleTime: 0, // Always fetch fresh on language change
    refetchOnWindowFocus: false,
  });

  return {
    passage: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
