import { cn } from "../lib/utils";
import { statusBadge, statusBadgeDefault } from "../lib/status-colors";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-scribe font-medium whitespace-nowrap shrink-0 uppercase tracking-wider backdrop-blur-md",
        statusBadge[status] ?? statusBadgeDefault
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
