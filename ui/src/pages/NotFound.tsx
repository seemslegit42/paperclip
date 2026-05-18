import { useEffect } from "react";
import { Link, useLocation } from "@/lib/router";
import { Compass, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useCompany } from "../context/CompanyContext";

type NotFoundScope = "board" | "invalid_company_prefix" | "global";

interface NotFoundPageProps {
  scope?: NotFoundScope;
  requestedPrefix?: string;
}

export function NotFoundPage({ scope = "global", requestedPrefix }: NotFoundPageProps) {
  const location = useLocation();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { companies, selectedCompany } = useCompany();

  useEffect(() => {
    setBreadcrumbs([{ label: "Void Encountered" }]);
  }, [setBreadcrumbs]);

  const fallbackCompany = selectedCompany ?? companies[0] ?? null;
  const dashboardHref = fallbackCompany ? `/${fallbackCompany.issuePrefix}/dashboard` : "/";
  const currentPath = `${location.pathname}${location.search}${location.hash}`;
  const normalizedPrefix = requestedPrefix?.toUpperCase();

  const title = scope === "invalid_company_prefix" ? "Entity Unknown" : "Dimensional Anchor Missing";
  const description =
    scope === "invalid_company_prefix"
      ? `No entity matches the prefix "${normalizedPrefix ?? "unknown"}". Your search is as futile as it is poorly targeted.`
      : "You have wandered into the digital void. This route does not exist in any reality I recognize.";

  return (
    <div className="mx-auto max-w-2xl py-10">
      <div className="rounded-xl border border-vitreous-white/10 glass-pane p-8 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 shrink-0 sigil-pulse">
            <Ghost className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-oracle font-bold text-vitreous-white tracking-tight">{title}</h1>
            <p className="mt-2 text-sm font-scribe text-conchoidal-gray leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-vitreous-white/5 bg-obsidian-black/40 px-4 py-3 text-xs font-mono text-conchoidal-gray/70">
          <span className="uppercase tracking-widest text-[9px] block mb-1 opacity-50">Void Location</span>
          <code className="break-all">{currentPath}</code>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="acquisition" asChild>
            <Link to={dashboardHref}>
              <Compass className="mr-2 h-4 w-4" />
              Return to Reality
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Exit System</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
