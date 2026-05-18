import { cn } from "@/lib/utils";

interface QuotaBarProps {
  label: string;
  // value between 0 and 100
  percentUsed: number;
  leftLabel: string;
  rightLabel?: string;
  // shows a 2px destructive notch at the fill tip when true
  showDeficitNotch?: boolean;
  className?: string;
}

function fillColor(pct: number): string {
  if (pct > 90) return "bg-destructive";
  if (pct > 70) return "bg-gilded-accent";
  return "bg-patina-green";
}

export function QuotaBar({
  label,
  percentUsed,
  leftLabel,
  rightLabel,
  showDeficitNotch = false,
  className,
}: QuotaBarProps) {
  const clampedPct = Math.min(100, Math.max(0, percentUsed));
  const notchLeft = Math.min(clampedPct, 97);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider text-conchoidal-gray font-scribe font-medium">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-scribe font-semibold tabular-nums text-vitreous-white">{leftLabel}</span>
          {rightLabel && (
            <span className="text-xs text-conchoidal-gray tabular-nums">{rightLabel}</span>
          )}
        </div>
      </div>

      <div className="relative h-2 w-full glass-pane border-vitreous-white/10 overflow-hidden rounded-full">
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-all duration-500 ease-out",
            fillColor(clampedPct),
            "shadow-[0_0_10px_rgba(62,185,145,0.4)]"
          )}
          style={{ width: `${clampedPct}%` }}
        >
          {/* The Flow: wave overlay animation */}
          <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-vitreous-white/50 to-transparent animate-breathing" style={{ backgroundSize: '200% 100%' }}></div>
        </div>

        {showDeficitNotch && clampedPct > 0 && (
          <div
            className="absolute inset-y-0 w-[2px] bg-destructive z-10 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            style={{ left: `${notchLeft}%` }}
          />
        )}
      </div>
    </div>
  );
}
