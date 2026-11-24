'use client';

import { STATES } from '@/lib/states';
import { cn } from '@/lib/utils';

interface StateTileMapProps {
  /** Two-letter code of the selected state, or null for the whole country */
  selected: string | null;
  disabled: boolean;
  onSelect: (code: string) => void;
}

export function StateTileMap({
  selected,
  disabled,
  onSelect,
}: StateTileMapProps) {
  return (
    <div
      role="group"
      aria-label="States, laid out roughly as a map"
      className="relative grid grid-cols-[repeat(11,minmax(0,1fr))] gap-1"
    >
      {STATES.map((s) => {
        const isSelected = s.code === selected;
        return (
          <button
            key={s.code}
            type="button"
            aria-label={s.name}
            aria-pressed={isSelected}
            aria-disabled={disabled}
            onClick={() => !disabled && onSelect(s.code)}
            style={{ gridColumn: s.col, gridRow: s.row }}
            className={cn(
              'aspect-square min-w-0 rounded-full border font-mono text-[11px] font-medium transition-colors sm:text-xs',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-tile bg-background text-foreground',
              disabled
                ? 'cursor-wait opacity-60'
                : !isSelected && 'hover:border-primary hover:bg-primary/20'
            )}
          >
            {s.code}
          </button>
        );
      })}
    </div>
  );
}
