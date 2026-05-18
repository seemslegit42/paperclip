/**
 * Verdigris Interface Protocol™ - Canonical status & priority color definitions.
 */

// ---------------------------------------------------------------------------
// Issue status colors
// ---------------------------------------------------------------------------

/** StatusIcon circle: text + border classes */
export const issueStatusIcon: Record<string, string> = {
  backlog: "text-conchoidal-gray border-conchoidal-gray",
  todo: "text-roman-aqua border-roman-aqua",
  in_progress: "text-roman-aqua border-roman-aqua animate-pulse-vein",
  in_review: "text-imperial-purple border-imperial-purple",
  done: "text-patina-green border-patina-green",
  cancelled: "text-conchoidal-gray border-conchoidal-gray opacity-50",
  blocked: "text-destructive border-destructive flicker-error",
};

export const issueStatusIconDefault = "text-conchoidal-gray border-conchoidal-gray";

/** Text-only color for issue statuses (dropdowns, labels) */
export const issueStatusText: Record<string, string> = {
  backlog: "text-conchoidal-gray",
  todo: "text-roman-aqua",
  in_progress: "text-roman-aqua",
  in_review: "text-imperial-purple",
  done: "text-patina-green",
  cancelled: "text-conchoidal-gray",
  blocked: "text-destructive",
};

export const issueStatusTextDefault = "text-conchoidal-gray";

// ---------------------------------------------------------------------------
// Badge colors — used by StatusBadge for all entity types
// ---------------------------------------------------------------------------

export const statusBadge: Record<string, string> = {
  // Agent statuses
  active: "bg-patina-green/20 text-patina-green border border-patina-green/30",
  running: "bg-roman-aqua/20 text-roman-aqua border border-roman-aqua/30 animate-pulse-vein",
  scheduled_retry: "bg-roman-aqua/10 text-roman-aqua/80 border border-roman-aqua/20",
  paused: "bg-gilded-accent/20 text-gilded-accent border border-gilded-accent/30",
  idle: "bg-conchoidal-gray/20 text-conchoidal-gray border border-conchoidal-gray/30",
  archived: "bg-transparent text-conchoidal-gray/50 border border-conchoidal-gray/20",

  // Goal statuses
  planned: "bg-transparent text-conchoidal-gray border border-conchoidal-gray/30",
  achieved: "bg-patina-green/20 text-patina-green border border-patina-green/30",
  completed: "bg-patina-green/20 text-patina-green border border-patina-green/30",

  // Run statuses
  failed: "bg-destructive/20 text-destructive border border-destructive/30",
  timed_out: "bg-gilded-accent/20 text-gilded-accent border border-gilded-accent/30",
  succeeded: "bg-patina-green/20 text-patina-green border border-patina-green/30",
  ok: "bg-patina-green/20 text-patina-green border border-patina-green/30",
  warning: "bg-gilded-accent/20 text-gilded-accent border border-gilded-accent/30",
  error: "bg-destructive/20 text-destructive border border-destructive/30",
  info: "bg-roman-aqua/20 text-roman-aqua border border-roman-aqua/30",
  terminated: "bg-destructive/20 text-destructive border border-destructive/30",
  pending: "bg-imperial-purple/20 text-imperial-purple border border-imperial-purple/30",

  // Approval statuses
  pending_approval: "bg-imperial-purple/20 text-imperial-purple border border-imperial-purple/30",
  revision_requested: "bg-gilded-accent/20 text-gilded-accent border border-gilded-accent/30",
  approved: "bg-patina-green/20 text-patina-green border border-patina-green/30",
  rejected: "bg-destructive/20 text-destructive border border-destructive/30",

  // Issue statuses
  backlog: "bg-transparent text-conchoidal-gray border border-conchoidal-gray/30",
  todo: "bg-roman-aqua/20 text-roman-aqua border border-roman-aqua/30",
  in_progress: "bg-roman-aqua/20 text-roman-aqua border border-roman-aqua/30 animate-pulse-vein",
  in_review: "bg-imperial-purple/20 text-imperial-purple border border-imperial-purple/30",
  blocked: "bg-destructive/20 text-destructive border border-destructive/30",
  done: "bg-patina-green/20 text-patina-green border border-patina-green/30",
  cancelled: "bg-transparent text-conchoidal-gray/50 border border-conchoidal-gray/20",
};

export const statusBadgeDefault = "bg-transparent text-conchoidal-gray border border-conchoidal-gray/30";

// ---------------------------------------------------------------------------
// Agent status dot — solid background for small indicator dots
// ---------------------------------------------------------------------------

export const agentStatusDot: Record<string, string> = {
  running: "bg-roman-aqua animate-pulse",
  active: "bg-patina-green",
  paused: "bg-gilded-accent",
  idle: "bg-conchoidal-gray",
  pending_approval: "bg-imperial-purple",
  error: "bg-destructive",
  archived: "bg-conchoidal-gray/50",
};

export const agentStatusDotDefault = "bg-conchoidal-gray";

// ---------------------------------------------------------------------------
// Priority colors
// ---------------------------------------------------------------------------

export const priorityColor: Record<string, string> = {
  critical: "text-destructive",
  high: "text-gilded-accent",
  medium: "text-roman-aqua",
  low: "text-conchoidal-gray",
};

export const priorityColorDefault = "text-roman-aqua";
