import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { heartbeatsApi, type LiveRunForIssue } from "../api/heartbeats";
import { queryKeys } from "../lib/queryKeys";
import { formatDateTime } from "../lib/utils";
import { ExternalLink, Square } from "lucide-react";
import { Identity } from "./Identity";
import { RunChatSurface } from "./RunChatSurface";
import { StatusBadge } from "./StatusBadge";
import { useLiveRunTranscripts } from "./transcript/useLiveRunTranscripts";
import { cn } from "@/lib/utils";

interface LiveRunWidgetProps {
  issueId: string;
  companyId?: string | null;
}

function toIsoString(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.toISOString();
}

function isRunActive(status: string): boolean {
  return status === "queued" || status === "running";
}

export function LiveRunWidget({ issueId, companyId }: LiveRunWidgetProps) {
  const queryClient = useQueryClient();
  const [cancellingRunIds, setCancellingRunIds] = useState(new Set<string>());

  const { data: liveRuns } = useQuery({
    queryKey: queryKeys.issues.liveRuns(issueId),
    queryFn: () => heartbeatsApi.liveRunsForIssue(issueId),
    enabled: !!issueId,
    refetchInterval: 3000,
  });

  const { data: activeRun } = useQuery({
    queryKey: queryKeys.issues.activeRun(issueId),
    queryFn: () => heartbeatsApi.activeRunForIssue(issueId),
    enabled: !!issueId,
    refetchInterval: 3000,
  });

  const runs = useMemo(() => {
    const deduped = new Map<string, LiveRunForIssue>();
    for (const run of liveRuns ?? []) {
      deduped.set(run.id, run);
    }
    if (activeRun) {
      deduped.set(activeRun.id, {
        id: activeRun.id,
        status: activeRun.status,
        invocationSource: activeRun.invocationSource,
        triggerDetail: activeRun.triggerDetail,
        startedAt: toIsoString(activeRun.startedAt),
        finishedAt: toIsoString(activeRun.finishedAt),
        createdAt: toIsoString(activeRun.createdAt) ?? new Date().toISOString(),
        agentId: activeRun.agentId,
        agentName: activeRun.agentName,
        adapterType: activeRun.adapterType,
        logBytes: activeRun.logBytes,
        lastOutputBytes: activeRun.lastOutputBytes,
        issueId,
      });
    }
    return [...deduped.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [activeRun, issueId, liveRuns]);

  const { transcriptByRun, hasOutputForRun } = useLiveRunTranscripts({ runs, companyId });

  const handleCancelRun = async (runId: string) => {
    setCancellingRunIds((prev) => new Set(prev).add(runId));
    try {
      await heartbeatsApi.cancel(runId);
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.liveRuns(issueId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.activeRun(issueId) });
    } finally {
      setCancellingRunIds((prev) => {
        const next = new Set(prev);
        next.delete(runId);
        return next;
      });
    }
  };

  if (runs.length === 0) return null;

  return (
    <div className="overflow-hidden glass-pane rounded-xl border-roman-aqua/20 shadow-[0_0_50px_rgba(32,178,170,0.1)]">
      <div className="border-b border-vitreous-white/10 bg-roman-aqua/5 px-4 py-3">
        <div className="text-xs font-oracle font-bold uppercase tracking-[0.2em] text-roman-aqua drop-shadow-[0_0_8px_rgba(32,178,170,0.5)]">
          Live Runs
        </div>
        <div className="mt-1 text-[10px] font-scribe text-conchoidal-gray/70 uppercase tracking-wider">
          Transmuting chaos into silence...
        </div>
      </div>

      <div className="divide-y divide-vitreous-white/5">
        {runs.map((run) => {
          const isActive = isRunActive(run.status);
          const transcript = transcriptByRun.get(run.id) ?? [];
          return (
            <section key={run.id} className={cn("px-4 py-4", isActive && "bg-roman-aqua/5")}>
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <Link to={`/agents/${run.agentId}`} className="inline-flex hover:opacity-80 transition-opacity">
                    <Identity name={run.agentName} size="sm" />
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-scribe text-conchoidal-gray/60 uppercase tracking-tight">
                    <Link
                      to={`/agents/${run.agentId}/runs/${run.id}`}
                      className="inline-flex items-center rounded-full border border-vitreous-white/10 bg-vitreous-white/5 px-2 py-1 font-mono hover:border-roman-aqua/30 hover:text-vitreous-white transition-colors"
                    >
                      {run.id.slice(0, 8)}
                    </Link>
                    <StatusBadge status={run.status} />
                    <span>{formatDateTime(run.startedAt ?? run.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isActive && (
                    <button
                      onClick={() => handleCancelRun(run.id)}
                      disabled={cancellingRunIds.has(run.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-[11px] font-scribe font-semibold text-destructive transition-all hover:bg-destructive/20 disabled:opacity-50"
                    >
                      <Square className="h-2.5 w-2.5" fill="currentColor" />
                      {cancellingRunIds.has(run.id) ? "Stopping…" : "Stop"}
                    </button>
                  )}
                  <Link
                    to={`/agents/${run.agentId}/runs/${run.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-roman-aqua/30 bg-roman-aqua/10 px-2.5 py-1 text-[11px] font-scribe font-semibold text-roman-aqua transition-all hover:bg-roman-aqua/20"
                  >
                    Open run
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="max-h-[320px] overflow-y-auto pr-1 scrollbar-auto-hide glass-pane border-vitreous-white/5 bg-obsidian-black/40 rounded-lg p-3">
                <RunChatSurface
                  run={run}
                  transcript={transcript}
                  hasOutput={hasOutputForRun(run.id)}
                  companyId={companyId}
                />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
