const HISTORY_KEY = 'typing-history';
const MAX_HISTORY_ITEMS = 20;

export interface HistoryItem {
  language: string;
  duration: number;
  wpm: number;
  accuracy: number;
  errors: number;
  timestamp: number;
}

export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addToHistory(item: HistoryItem): void {
  try {
    const history = getHistory();
    history.unshift(item);
    
    // Keep only the most recent items
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.warn('Failed to save history:', error);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.warn('Failed to clear history:', error);
  }
}
