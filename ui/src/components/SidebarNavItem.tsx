import { NavLink } from "@/lib/router";
import { SIDEBAR_SCROLL_RESET_STATE } from "../lib/navigation-scroll";
import { cn } from "../lib/utils";
import { useSidebar } from "../context/SidebarContext";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  className?: string;
  badge?: number;
  badgeTone?: "default" | "danger";
  textBadge?: string;
  textBadgeTone?: "default" | "amber";
  alert?: boolean;
  liveCount?: number;
}

export function SidebarNavItem({
  to,
  label,
  icon: Icon,
  end,
  className,
  badge,
  badgeTone = "default",
  textBadge,
  textBadgeTone = "default",
  alert = false,
  liveCount,
}: SidebarNavItemProps) {
  const { isMobile, setSidebarOpen } = useSidebar();

  return (
    <NavLink
      to={to}
      state={SIDEBAR_SCROLL_RESET_STATE}
      end={end}
      onClick={() => { if (isMobile) setSidebarOpen(false); }}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 px-3 py-2 text-[13px] font-scribe transition-all",
          isActive
            ? "bg-vitreous-white/10 text-roman-aqua border-l-2 border-roman-aqua"
            : "text-vitreous-white/70 hover:bg-vitreous-white/5 hover:text-vitreous-white",
          className,
        )
      }
    >
      <span className="relative shrink-0">
        <Icon className={cn("h-4 w-4", alert && "text-destructive flicker-error")} />
        {alert && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        )}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {textBadge && (
        <span
          className={cn(
            "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none",
            textBadgeTone === "amber"
              ? "bg-gilded-accent/20 text-gilded-accent border border-gilded-accent/30"
              : "bg-vitreous-white/10 text-conchoidal-gray border border-vitreous-white/20",
          )}
        >
          {textBadge}
        </span>
      )}
      {liveCount != null && liveCount > 0 && (
        <span className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-roman-aqua opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-roman-aqua" />
          </span>
          <span className="text-[11px] font-medium text-roman-aqua">{liveCount} live</span>
        </span>
      )}
      {badge != null && badge > 0 && (
        <span
          className={cn(
            "ml-auto rounded-full px-1.5 py-0.5 text-xs leading-none",
            badgeTone === "danger"
              ? "bg-destructive text-vitreous-white"
              : "bg-imperial-purple text-vitreous-white",
          )}
        >
          {badge}
        </span>
      )}
    </NavLink>
  );
}
