import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Zap, AlertCircle } from 'lucide-react';
import { Language } from '../../../backend';

interface ResultsSummaryProps {
  wpm: number;
  accuracy: number;
  errors: number;
  language: Language;
  duration: number;
  onRetry: () => void;
  onNewPassage: () => void;
}

export function ResultsSummary({
  wpm,
  accuracy,
  errors,
  language,
  duration,
}: ResultsSummaryProps) {
  const getPerformanceLevel = () => {
    if (wpm >= 60 && accuracy >= 95) return { label: 'Excellent', color: 'bg-green-500' };
    if (wpm >= 40 && accuracy >= 90) return { label: 'Good', color: 'bg-blue-500' };
    if (wpm >= 25 && accuracy >= 80) return { label: 'Average', color: 'bg-yellow-500' };
    return { label: 'Keep Practicing', color: 'bg-orange-500' };
  };

  const performance = getPerformanceLevel();

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Test Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={`${performance.color} text-white`}>
            {performance.label}
          </Badge>
          <Badge variant="outline">
            {language === Language.english ? 'English' : 'Hindi'}
          </Badge>
          <Badge variant="outline">{duration} min</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
            <Zap className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Speed</div>
              <div className="text-2xl font-bold">{wpm} WPM</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
            <Target className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
              <div className="text-2xl font-bold">{accuracy.toFixed(1)}%</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div>
              <div className="text-xs text-muted-foreground">Errors</div>
              <div className="text-2xl font-bold">{errors}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
