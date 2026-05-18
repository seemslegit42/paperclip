import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  description?: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "roman" | "patina" | "purple";
}

export function MetricCard({
  icon: Icon,
  value,
  label,
  description,
  to,
  onClick,
  variant = "roman"
}: MetricCardProps) {
  const isClickable = !!(to || onClick);

  const variantClasses = {
    roman: "text-roman-aqua drop-shadow-[0_0_8px_rgba(32,178,170,0.3)]",
    patina: "text-patina-green drop-shadow-[0_0_8px_rgba(62,185,145,0.3)]",
    purple: "text-imperial-purple drop-shadow-[0_0_8px_rgba(106,13,173,0.3)]",
  };

  const inner = (
    <div className={cn(
      "h-full px-4 py-4 sm:px-5 sm:py-5 rounded-lg glass-pane border-vitreous-white/5 transition-all",
      isClickable ? "hover:bg-vitreous-white/10 hover:border-vitreous-white/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-2xl sm:text-3xl font-oracle font-bold tracking-tighter tabular-nums",
            variantClasses[variant]
          )}>
            {value}
          </p>
          <p className="text-[10px] sm:text-xs font-scribe font-semibold uppercase tracking-widest text-conchoidal-gray mt-2">
            {label}
          </p>
          {description && (
            <div className="text-xs text-conchoidal-gray/60 font-scribe mt-2 hidden sm:block">{description}</div>
          )}
        </div>
        <div className="p-2 rounded-full bg-vitreous-white/5 border border-vitreous-white/10 sigil-pulse">
          <Icon className={cn("h-4 w-4 shrink-0", variantClasses[variant])} />
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="no-underline text-inherit h-full block" onClick={onClick}>
        {inner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div className="h-full" onClick={onClick}>
        {inner}
      </div>
    );
  }

  return inner;
}
