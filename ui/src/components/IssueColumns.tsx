import * as React from "react"
import { ReactNode } from "react"
import type { Issue } from "@paperclipai/shared"
import { StatusIcon } from "./StatusIcon"
import { cn } from "@/lib/utils"
import { timeAgo } from "../lib/timeAgo"
import { Identity } from "./Identity"
import { pickTextColorForPillBg } from "../lib/color-contrast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ColumnsIcon } from "lucide-react"

export type InboxIssueColumn = "assignee" | "project" | "labels" | "workspace" | "parent" | "updated" | "id" | "status";

export const issueColumnLabels: Record<InboxIssueColumn, string> = {
  assignee: "Assignee",
  project: "Project",
  labels: "Labels",
  workspace: "Workspace",
  parent: "Parent",
  updated: "Updated",
  id: "ID",
  status: "Status",
};

export const issueColumnDescriptions: Record<InboxIssueColumn, string> = {
  assignee: "Who is handling the work",
  project: "Associated project",
  labels: "Classification tags",
  workspace: "Execution context",
  parent: "Primary issue",
  updated: "Recency of activity",
  id: "Issue identifier",
  status: "Current state",
};

const ALL_ISSUE_TRAILING_COLUMNS: InboxIssueColumn[] = [
  "assignee",
  "project",
  "labels",
  "workspace",
  "parent",
  "updated",
  "id",
  "status",
];

export const issueTrailingColumns = ALL_ISSUE_TRAILING_COLUMNS;

function issueTrailingGridTemplate(columns: InboxIssueColumn[]): string {
  return columns
    .map((c) => {
      if (c === "updated") return "minmax(60px, auto)";
      if (c === "labels") return "minmax(80px, 120px)";
      if (c === "assignee") return "minmax(100px, 140px)";
      return "minmax(80px, 1fr)";
    })
    .join(" ");
}

function formatAssigneeUserLabel(assigneeUserId: string | null, currentUserId: string | null): string | null {
  if (!assigneeUserId) return null;
  return assigneeUserId === currentUserId ? "Me" : "User";
}

export function IssueColumnPicker({
  title,
  availableColumns,
  visibleColumnSet,
  onToggleColumn,
  onResetColumns,
  iconOnly = false,
}: {
  title: string;
  availableColumns: InboxIssueColumn[];
  visibleColumnSet: Set<InboxIssueColumn>;
  onToggleColumn: (column: InboxIssueColumn, visible: boolean) => void;
  onResetColumns: () => void;
  iconOnly?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={iconOnly ? "icon-xs" : "xs"} className="h-7 text-conchoidal-gray hover:text-vitreous-white" title={iconOnly ? "Observe Columns" : undefined}>
          <ColumnsIcon className={iconOnly ? "h-3.5 w-3.5" : "mr-1 h-3.5 w-3.5"} />
          {!iconOnly && "Columns"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px] glass-pane border-vitreous-white/10 p-1.5 shadow-2xl">
        <DropdownMenuLabel className="px-2 pb-1 pt-1.5">
          <div className="space-y-1">
            <div className="text-[10px] font-oracle font-bold uppercase tracking-[0.22em] text-roman-aqua">
              Desktop issue rows
            </div>
            <div className="text-sm font-scribe font-medium text-vitreous-white">
              {title}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-vitreous-white/10" />
        {availableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            checked={visibleColumnSet.has(column)}
            onSelect={(event) => event.preventDefault()}
            onCheckedChange={(checked) => onToggleColumn(column, checked === true)}
            className="items-start rounded-lg px-3 py-2.5 pl-8 focus:bg-vitreous-white/10"
          >
            <span className="flex flex-col gap-0.5 font-scribe">
              <span className="text-sm font-medium text-vitreous-white">
                {issueColumnLabels[column]}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-conchoidal-gray/70">
                {issueColumnDescriptions[column]}
              </span>
            </span>
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator className="bg-vitreous-white/10" />
        <DropdownMenuItem
          onSelect={onResetColumns}
          className="rounded-lg px-3 py-2 text-sm font-scribe text-roman-aqua hover:bg-roman-aqua/10"
        >
          Reset defaults
          <span className="ml-auto text-[10px] text-conchoidal-gray opacity-50 uppercase tracking-tight">status, id, updated</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InboxIssueMetaLeading({
  issue,
  isLive,
  showStatus = true,
  showIdentifier = true,
  statusSlot,
  checklistStepNumber = null,
}: {
  issue: Issue;
  isLive: boolean;
  showStatus?: boolean;
  showIdentifier?: boolean;
  statusSlot?: ReactNode;
  checklistStepNumber?: number | string | null;
}) {
  return (
    <>
      {showStatus ? (
        <span className="hidden shrink-0 sm:inline-flex">
          {statusSlot ?? <StatusIcon status={issue.status} blockerAttention={issue.blockerAttention} />}
        </span>
      ) : null}
      {checklistStepNumber !== null ? (
        <span className="shrink-0 font-scribe text-xs text-conchoidal-gray" aria-hidden="true">
          {checklistStepNumber}.
        </span>
      ) : null}
      {showIdentifier ? (
        <span className="shrink-0 font-scribe text-[10px] uppercase tracking-widest text-conchoidal-gray/70">
          {issue.identifier ?? issue.id.slice(0, 8)}
        </span>
      ) : null}
      {isLive && (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 sm:gap-1.5 sm:px-2",
            "bg-roman-aqua/10 border border-roman-aqua/20 backdrop-blur-sm",
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-roman-aqua opacity-75" />
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                "bg-roman-aqua shadow-[0_0_8px_rgba(32,178,170,0.8)]",
              )}
            />
          </span>
          <span
            className={cn(
              "hidden text-[10px] font-scribe font-bold uppercase tracking-widest sm:inline",
              "text-roman-aqua",
            )}
          >
            Live
          </span>
        </span>
      )}
    </>
  );
}

export function InboxIssueTrailingColumns({
  issue,
  columns,
  projectName,
  projectColor,
  workspaceId,
  workspaceName,
  assigneeName,
  assigneeUserName,
  assigneeUserAvatarUrl,
  currentUserId,
  parentIdentifier,
  parentTitle,
  assigneeContent,
  onFilterWorkspace,
}: {
  issue: Issue;
  columns: InboxIssueColumn[];
  projectName: string | null;
  projectColor: string | null;
  workspaceId?: string | null;
  workspaceName: string | null;
  assigneeName: string | null;
  assigneeUserName?: string | null;
  assigneeUserAvatarUrl?: string | null;
  currentUserId: string | null;
  parentIdentifier: string | null;
  parentTitle: string | null;
  assigneeContent?: ReactNode;
  onFilterWorkspace?: (workspaceId: string) => void;
}) {
  const activityText = timeAgo(issue.lastActivityAt ?? issue.lastExternalCommentAt ?? issue.updatedAt);
  const userLabel = assigneeUserName ?? formatAssigneeUserLabel(issue.assigneeUserId, currentUserId) ?? "User";

  return (
    <span
      className="grid items-center gap-2 font-scribe"
      style={{ gridTemplateColumns: issueTrailingGridTemplate(columns) }}
    >
      {columns.map((column) => {
        if (column === "assignee") {
          if (assigneeContent) {
            return <span key={column} className="min-w-0">{assigneeContent}</span>;
          }

          if (issue.assigneeAgentId) {
            return (
              <span key={column} className="min-w-0 text-xs text-vitreous-white">
                <Identity
                  name={assigneeName ?? issue.assigneeAgentId.slice(0, 8)}
                  size="sm"
                  className="min-w-0"
                />
              </span>
            );
          }

          if (issue.assigneeUserId) {
            return (
              <span key={column} className="min-w-0 text-xs text-vitreous-white">
                <Identity
                  name={userLabel}
                  avatarUrl={assigneeUserAvatarUrl}
                  size="sm"
                  className="min-w-0"
                />
              </span>
            );
          }

          return (
            <span key={column} className="min-w-0 truncate text-[10px] uppercase tracking-wider text-conchoidal-gray/50">
              Unassigned
            </span>
          );
        }

        if (column === "project") {
          if (projectName) {
            const accentColor = projectColor ?? "#64748b";
            return (
              <span
                key={column}
                className="inline-flex min-w-0 items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: pickTextColorForPillBg(accentColor, 0.12) }}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}80` }}
                />
                <span className="truncate">{projectName}</span>
              </span>
            );
          }

          return (
            <span key={column} className="min-w-0 truncate text-[10px] uppercase tracking-wider text-conchoidal-gray/50">
              No project
            </span>
          );
        }

        if (column === "labels") {
          if ((issue.labels ?? []).length > 0) {
            return (
              <span key={column} className="flex min-w-0 items-center gap-1 overflow-hidden">
                {(issue.labels ?? []).slice(0, 2).map((label) => (
                  <span
                    key={label.id}
                    className="inline-flex min-w-0 max-w-full shrink-0 items-center rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-tight backdrop-blur-md"
                    style={{
                      borderColor: `${label.color}40`,
                      color: pickTextColorForPillBg(label.color, 0.12),
                      backgroundColor: `${label.color}15`,
                    }}
                  >
                    <span className="truncate">{label.name}</span>
                  </span>
                ))}
                {(issue.labels ?? []).length > 2 ? (
                  <span className="shrink-0 text-[9px] font-bold text-conchoidal-gray opacity-60">
                    +{(issue.labels ?? []).length - 2}
                  </span>
                ) : null}
              </span>
            );
          }

          return <span key={column} className="min-w-0" aria-hidden="true" />;
        }

        if (column === "workspace") {
          if (!workspaceName) {
            return <span key={column} className="min-w-0" aria-hidden="true" />;
          }

          return (
            <span key={column} className="min-w-0 truncate text-[10px] uppercase tracking-widest text-conchoidal-gray">
              {workspaceId && onFilterWorkspace ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="truncate rounded-sm text-left text-[10px] uppercase tracking-widest text-conchoidal-gray transition-colors hover:text-roman-aqua hover:underline"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onFilterWorkspace(workspaceId);
                      }}
                    >
                      {workspaceName}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6} className="glass-pane border-vitreous-white/10 text-vitreous-white">
                    Filter by workspace
                  </TooltipContent>
                </Tooltip>
              ) : (
                workspaceName
              )}
            </span>
          );
        }

        if (column === "parent") {
          if (!issue.parentId) {
            return <span key={column} className="min-w-0" aria-hidden="true" />;
          }

          return (
            <span key={column} className="min-w-0 truncate text-[10px] uppercase tracking-widest text-conchoidal-gray/70" title={parentTitle ?? undefined}>
              {parentIdentifier ? (
                <span className="font-mono text-roman-aqua/80">{parentIdentifier}</span>
              ) : (
                <span className="italic opacity-50">Sub-issue</span>
              )}
            </span>
          );
        }

        if (column === "updated") {
          return (
            <span key={column} className="min-w-0 truncate text-right text-[10px] font-bold uppercase tracking-tighter text-conchoidal-gray/60">
              {activityText}
            </span>
          );
        }

        return null;
      })}
    </span>
  );
}

export { InboxIssueTrailingColumns as issueTrailingColumnsComponent };
export { timeAgo as issueActivityText };
