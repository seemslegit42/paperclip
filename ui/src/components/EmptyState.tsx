import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  action?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, message, action, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
      <div className="glass-pane border-vitreous-white/5 bg-vitreous-white/5 p-6 rounded-2xl mb-6 sigil-pulse">
        <Icon className="h-12 w-12 text-roman-aqua/40 drop-shadow-[0_0_12px_rgba(32,178,170,0.3)]" />
      </div>
      <p className="text-sm font-scribe text-conchoidal-gray leading-relaxed mb-8">
        {message || "The silence here is profound. Perhaps you should fill it with intent."}
      </p>
      {action && onAction && (
        <Button variant="acquisition" onClick={onAction}>
          <Plus className="h-4 w-4 mr-2" />
          {action}
        </Button>
      )}
    </div>
  );
}
