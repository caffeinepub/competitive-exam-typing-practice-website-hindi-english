import { useState, useEffect, useCallback, useRef } from 'react';
import { segmentText, compareSegments } from './unicode';

type Status = 'ready' | 'running' | 'finished';

interface Stats {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
}

export function useTypingEngine(passage: string, durationSeconds: number) {
  const [status, setStatus] = useState<Status>('ready');
  const [typedText, setTypedText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate stats
  const stats: Stats = (() => {
    if (!passage || !typedText) {
      return { wpm: 0, cpm: 0, accuracy: 100, errors: 0 };
    }

    const passageSegments = segmentText(passage);
    const typedSegments = segmentText(typedText);
    const comparison = compareSegments(passageSegments, typedSegments);

    const correctChars = comparison.filter(c => c === 'correct').length;
    const incorrectChars = comparison.filter(c => c === 'incorrect').length;
    const totalTyped = typedSegments.length;

    const accuracy = totalTyped > 0 ? (correctChars / totalTyped) * 100 : 100;
    
    const elapsedMinutes = startTime 
      ? (Date.now() - startTime) / 1000 / 60 
      : durationSeconds / 60;
    
    const wpm = elapsedMinutes > 0 ? Math.round(correctChars / 5 / elapsedMinutes) : 0;
    const cpm = elapsedMinutes > 0 ? Math.round(correctChars / elapsedMinutes) : 0;

    return {
      wpm,
      cpm,
      accuracy: Math.round(accuracy * 10) / 10,
      errors: incorrectChars,
    };
  })();

  // Start test
  const start = useCallback(() => {
    setStatus('running');
    setStartTime(Date.now());
    setTypedText('');
    setTimeRemaining(durationSeconds);
  }, [durationSeconds]);

  // Reset test
  const reset = useCallback(() => {
    setStatus('ready');
    setTypedText('');
    setTimeRemaining(durationSeconds);
    setStartTime(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [durationSeconds]);

  // Retry same passage
  const retry = useCallback(() => {
    start();
  }, [start]);

  // Handle input
  const handleInput = useCallback((text: string) => {
    if (status === 'running') {
      setTypedText(text);
    }
  }, [status]);

  // Timer effect
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setStatus('finished');
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  // Reset when passage changes
  useEffect(() => {
    reset();
  }, [passage, reset]);

  return {
    status,
    typedText,
    timeRemaining,
    stats,
    handleInput,
    start,
    reset,
    retry,
  };
}
