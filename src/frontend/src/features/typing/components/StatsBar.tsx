import { Card } from '@/components/ui/card';
import { Clock, Gauge, Target, AlertCircle } from 'lucide-react';

interface StatsBarProps {
  timeRemaining: number;
  wpm: number;
  accuracy: number;
  errors: number;
}

export function StatsBar({ timeRemaining, wpm, accuracy, errors }: StatsBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Time Left</div>
            <div className="text-xl font-bold text-foreground">{formatTime(timeRemaining)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Gauge className="w-5 h-5 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">WPM</div>
            <div className="text-xl font-bold text-foreground">{wpm}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
            <div className="text-xl font-bold text-foreground">{accuracy.toFixed(1)}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div>
            <div className="text-xs text-muted-foreground">Errors</div>
            <div className="text-xl font-bold text-foreground">{errors}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
