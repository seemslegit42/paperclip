import { cn } from "@/lib/utils";

interface FlowProgressProps {
  value: number; // 0 to 100
  size?: "sm" | "md" | "lg";
  color?: "patina" | "roman" | "purple";
  className?: string;
}

export function FlowProgress({
  value,
  size = "md",
  color = "roman",
  className
}: FlowProgressProps) {
  const colors = {
    patina: "bg-patina-green shadow-[0_0_10px_rgba(62,185,145,0.4)]",
    roman: "bg-roman-aqua shadow-[0_0_10px_rgba(32,178,170,0.4)]",
    purple: "bg-imperial-purple shadow-[0_0_10px_rgba(106,13,173,0.4)]",
  };

  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-4",
  };

  return (
    <div className={cn("relative w-full glass-pane overflow-hidden rounded-full border-vitreous-white/5", heights[size], className)}>
      <div
        className={cn(
          "absolute inset-y-0 left-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          colors[color]
        )}
        style={{ width: `${value}%` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
