import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Language } from '../../../backend';
import { segmentText, compareSegments } from '../unicode';

interface PassageDisplayProps {
  passage: string;
  typedText: string;
  language: Language;
}

export function PassageDisplay({ passage, typedText, language }: PassageDisplayProps) {
  const segments = useMemo(() => {
    const passageSegments = segmentText(passage);
    const typedSegments = segmentText(typedText);
    const comparison = compareSegments(passageSegments, typedSegments);

    return passageSegments.map((char, index) => ({
      char,
      status: comparison[index],
      isCurrent: index === typedSegments.length,
    }));
  }, [passage, typedText]);

  return (
    <Card className="p-6 bg-muted/30">
      <div
        className={`text-lg leading-relaxed select-none ${
          language === Language.hindi ? 'font-sans text-xl' : 'font-mono'
        }`}
        style={{ wordBreak: 'break-word' }}
      >
        {segments.map((segment, index) => (
          <span
            key={index}
            className={`
              ${segment.status === 'correct' ? 'char-correct' : ''}
              ${segment.status === 'incorrect' ? 'char-incorrect' : ''}
              ${segment.status === 'untyped' ? 'char-untyped' : ''}
              ${segment.isCurrent ? 'char-current' : ''}
              inline-block
            `}
          >
            {segment.char === ' ' ? '\u00A0' : segment.char}
          </span>
        ))}
      </div>
    </Card>
  );
}
