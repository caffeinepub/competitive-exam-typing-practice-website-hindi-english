import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Clock } from 'lucide-react';

interface DurationSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const DURATIONS = [
  { value: 1, label: '1 min' },
  { value: 3, label: '3 min' },
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
];

export function DurationSelector({ value, onChange }: DurationSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Clock className="w-4 h-4 text-primary" />
        Select Test Duration
      </Label>
      <ToggleGroup
        type="single"
        value={value.toString()}
        onValueChange={(v) => v && onChange(Number(v))}
        className="justify-start"
      >
        {DURATIONS.map((duration) => (
          <ToggleGroupItem
            key={duration.value}
            value={duration.value.toString()}
            aria-label={`${duration.label} duration`}
            className="px-6"
          >
            {duration.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
