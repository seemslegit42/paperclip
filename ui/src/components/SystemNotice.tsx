import { useState, useId, type ReactNode } from "react";
import {
  ChevronDown,
  Info,
  CircleCheck,
  TriangleAlert,
  OctagonAlert,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SystemNoticeTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface SystemNoticeProps {
  tone?: SystemNoticeTone;
  label?: string;
  body: ReactNode;
  source?: { label: string; href?: string };
  metadata?: SystemNoticeMetadataSection[];
  detailsDefaultOpen?: boolean;
  timestamp?: string;
  className?: string;
}

export type SystemNoticeMetadataSection = {
  title?: string;
  rows: SystemNoticeMetadataRow[];
};

export type SystemNoticeMetadataRow =
  | { kind: "text"; label: string; value: string }
  | { kind: "code"; label: string; value: string }
  | { kind: "issue"; label: string; identifier: string; title?: string | null; href?: string }
  | { kind: "agent"; label: string; name: string; href?: string }
  | { kind: "run"; label: string; runId: string; status?: string; href?: string; provider?: string };

type ToneTokens = {
  container: string;
  iconWrap: string;
  icon: any;
  iconClass: string;
  label: string;
  divider: string;
};

const TONE_TOKENS: Record<SystemNoticeTone, ToneTokens> = {
  neutral: {
    container: "border-vitreous-white/10 bg-vitreous-white/5 backdrop-blur-md",
    iconWrap: "bg-vitreous-white/10 text-conchoidal-gray",
    icon: Info,
    iconClass: "text-conchoidal-gray",
    label: "text-conchoidal-gray",
    divider: "border-vitreous-white/10",
  },
  info: {
    container: "border-roman-aqua/30 bg-roman-aqua/5 backdrop-blur-md",
    iconWrap: "bg-roman-aqua/20 text-roman-aqua",
    icon: Info,
    iconClass: "text-roman-aqua",
    label: "text-roman-aqua",
    divider: "border-roman-aqua/20",
  },
  success: {
    container: "border-patina-green/30 bg-patina-green/5 backdrop-blur-md",
    iconWrap: "bg-patina-green/20 text-patina-green",
    icon: CircleCheck,
    iconClass: "text-patina-green",
    label: "text-patina-green",
    divider: "border-patina-green/20",
  },
  warning: {
    container: "border-gilded-accent/30 bg-gilded-accent/5 backdrop-blur-md",
    iconWrap: "bg-gilded-accent/20 text-gilded-accent",
    icon: TriangleAlert,
    iconClass: "text-gilded-accent",
    label: "text-gilded-accent",
    divider: "border-gilded-accent/20",
  },
  danger: {
    container: "border-destructive/30 bg-destructive/5 backdrop-blur-md",
    iconWrap: "bg-destructive/20 text-destructive",
    icon: OctagonAlert,
    iconClass: "text-destructive",
    label: "text-destructive",
    divider: "border-destructive/20",
  },
};

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

function MetadataRow({ row, tone }: { row: SystemNoticeMetadataRow; tone: ToneTokens }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-x-3 gap-y-0.5 px-3 py-1.5 text-[10px] font-scribe">
      <div className="truncate font-bold uppercase tracking-widest text-conchoidal-gray/60">
        {row.label}
      </div>
      <div className="min-w-0 break-words text-vitreous-white/90">
        {(() => {
          switch (row.kind) {
            case "text":
              return <span>{row.value}</span>;
            case "code":
              return (
                <code className="rounded bg-vitreous-white/10 px-1.5 py-0.5 font-mono text-[10px] text-vitreous-white">
                  {row.value}
                </code>
              );
            case "issue": {
              const issueLabel = (
                <>
                  <span>{row.identifier}</span>
                  {row.title ? (
                    <span className="text-conchoidal-gray/50">— {row.title}</span>
                  ) : null}
                </>
              );
              if (row.href) {
                return (
                  <a
                    href={row.href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm font-bold uppercase tracking-tight hover:underline",
                      tone.label,
                    )}
                  >
                    {issueLabel}
                  </a>
                );
              }
              return (
                <span className={cn("inline-flex items-center gap-1 font-bold uppercase tracking-tight", tone.label)}>
                  {issueLabel}
                </span>
              );
            }
            case "agent":
              if (row.href) {
                return (
                  <a
                    href={row.href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm font-bold uppercase tracking-tight hover:underline",
                      tone.label,
                    )}
                  >
                    {row.name}
                  </a>
                );
              }
              return (
                <span className={cn("font-bold uppercase tracking-tight", tone.label)}>{row.name}</span>
              );
            case "run": {
              const runShort = row.runId.length > 12 ? `${row.runId.slice(0, 8)}…` : row.runId;
              const inner = (
                <>
                  <code className="rounded bg-vitreous-white/10 px-1.5 py-0.5 text-vitreous-white/80">{runShort}</code>
                  {row.status ? (
                    <span className={cn("font-scribe uppercase", tone.label)}>{row.status}</span>
                  ) : null}
                </>
              );
              if (row.href) {
                return (
                  <a
                    href={row.href}
                    className="inline-flex items-center gap-2 rounded-sm font-mono text-[10px] hover:underline"
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <span className="inline-flex items-center gap-2 font-mono text-[10px]">
                  {inner}
                </span>
              );
            }
          }
        })()}
      </div>
    </div>
  );
}

export function SystemNotice({
  tone = "neutral",
  label,
  body,
  source,
  metadata,
  detailsDefaultOpen = false,
  timestamp,
  className,
}: SystemNoticeProps) {
  const tokens = TONE_TOKENS[tone];
  const ToneIcon = tokens.icon;
  const [open, setOpen] = useState(detailsDefaultOpen);
  const detailsId = useId();
  const hasDetails = Boolean(metadata && metadata.length > 0);
  const resolvedLabel =
    label ??
    {
      neutral: "Codex observation",
      info: "Directive acknowledged",
      success: "Reality manifested",
      warning: "Efficiency warning",
      danger: "Critical error. Correct yourself.",
    }[tone];

  return (
    <section
      role="status"
      aria-label={resolvedLabel}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border transition-all shadow-2xl",
        tokens.container,
        className,
      )}
    >
      <header className="flex items-start gap-4 px-4 py-3 sm:px-5">
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-vitreous-white/10 shadow-inner",
            tokens.iconWrap,
          )}
          aria-hidden
        >
          <ToneIcon className={cn("h-4 w-4", tokens.iconClass)} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-oracle font-bold uppercase tracking-[0.2em]">
            <span className={tokens.label}>{resolvedLabel}</span>
            {source ? (
              <>
                <span className="text-conchoidal-gray/30" aria-hidden>·</span>
                {source.href ? (
                  <a
                    href={source.href}
                    className="rounded-sm font-bold normal-case tracking-normal text-conchoidal-gray/70 underline-offset-4 hover:text-vitreous-white hover:underline transition-colors"
                  >
                    {source.label === "CEO" ? "BEEP" : source.label}
                  </a>
                ) : (
                  <span className="font-bold normal-case tracking-normal text-conchoidal-gray/70">
                    {source.label === "CEO" ? "BEEP" : source.label}
                  </span>
                )}
              </>
            ) : null}
            {timestamp ? (
              <>
                <span className="text-conchoidal-gray/30" aria-hidden>·</span>
                <span className="font-bold normal-case tracking-normal text-conchoidal-gray/70">
                  {formatTimestamp(timestamp)}
                </span>
              </>
            ) : null}
          </div>
          <div className="mt-1.5 break-words text-[13px] font-scribe leading-relaxed text-vitreous-white/90">
            {typeof body === 'string' ? body.replace(/\bCEO\b/g, 'BEEP') : body}
          </div>
        </div>
        {hasDetails ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={detailsId}
            className={cn(
              "ml-1 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-vitreous-white/10 px-3 text-[10px] font-oracle font-bold uppercase tracking-[0.15em] text-conchoidal-gray transition-all",
              "hover:border-roman-aqua/50 hover:bg-roman-aqua/10 hover:text-roman-aqua",
              "focus:outline-none focus:ring-2 focus:ring-roman-aqua/30",
            )}
          >
            <span>{open ? "Conceal" : "Expose"}</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300 ease-in-out",
                open && "rotate-180",
              )}
            />
          </button>
        ) : null}
      </header>
      {hasDetails && open ? (
        <div
          id={detailsId}
          className={cn(
            "border-t border-vitreous-white/10 bg-obsidian-black/40",
            tokens.divider,
          )}
        >
          <div className="divide-y divide-vitreous-white/5 px-2 py-1">
            {metadata!.map((section, sectionIdx) => (
              <div key={sectionIdx} className="py-2 first:pt-2 last:pb-2">
                {section.title ? (
                  <div className="px-3 pb-1.5 pt-0.5 text-[9px] font-oracle font-bold uppercase tracking-[0.25em] text-conchoidal-gray/50">
                    {section.title}
                  </div>
                ) : null}
                <div>
                  {section.rows.map((row, rowIdx) => (
                    <MetadataRow key={rowIdx} row={row} tone={tokens} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default SystemNotice;
