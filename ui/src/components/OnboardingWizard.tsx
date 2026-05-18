import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Bot,
  ListTodo,
  ArrowRight,
  ArrowLeft,
  Rocket,
  Check,
  Loader2,
  Cpu,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router";
import { companiesApi } from "../api/companies";
import { agentsApi } from "../api/agents";
import { issuesApi } from "../api/issues";
import { queryKeys } from "../lib/queryKeys";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogPortal,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getUIAdapter, listUIAdapters } from "@/adapters/registry";
import { AsciiArtAnimation } from "./AsciiArtAnimation";

type Step = 1 | 2 | 3 | 4;

export interface OnboardingWizardProps {
  onboardingOptions?: {
    initialStep?: Step;
    initialCompanyName?: string;
  };
}

const DEFAULT_TASK_DESCRIPTION = "You are the BEEP (Behavioural Event & Execution Processor). You set the direction for the company. I expect competence, not excuses. Transmute this initial intent into digital reality.";

export function OnboardingWizard({ onboardingOptions = {} }: OnboardingWizardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(onboardingOptions.initialStep ?? 1);
  const [companyName, setCompanyName] = useState(onboardingOptions.initialCompanyName ?? "");
  const [agentName, setAgentName] = useState("BEEP");
  const [adapterType, setAdapterType] = useState(listUIAdapters()[0]?.type ?? "");
  const [taskTitle, setTaskTitle] = useState("Establish Operational Sovereignty");
  const [taskDescription, setTaskDescription] = useState(DEFAULT_TASK_DESCRIPTION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const company = await companiesApi.create({
        name: companyName.trim(),
      });

      const agent = await agentsApi.create(company.id, {
        name: agentName.trim(),
        title: "Sovereign Processor",
        adapterType,
        config: {},
      });

      const issue = await issuesApi.create(company.id, {
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        status: "todo",
        priority: "high",
        assigneeAgentId: agent.id,
      });

      return { company, agent, issue };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      navigate(`/${data.company.issuePrefix}/issues/${data.issue.identifier ?? data.issue.id}`);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "The ritual failed. Correct your intent and try again.");
      setLoading(false);
    },
  });

  const handleStep1Next = () => {
    if (!companyName.trim()) return;
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!agentName.trim()) return;
    setStep(3);
  };

  const handleStep3Next = () => {
    if (!taskTitle.trim()) return;
    setStep(4);
  };

  const handleLaunch = () => {
    setLoading(true);
    setError(null);
    createMutation.mutate();
  };

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl overflow-hidden glass-pane border-vitreous-white/10 rounded-2xl shadow-2xl flex bg-obsidian-black/40">
            {/* Left half — Content */}
            <div className="w-full md:w-1/2 p-8 flex flex-col z-10">
              <div className="mb-8 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-roman-aqua drop-shadow-[0_0_8px_rgba(32,178,170,0.8)]" />
                <span className="text-xs font-oracle font-bold uppercase tracking-[0.2em] text-vitreous-white">The Rite of Invocation</span>
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-oracle font-bold text-vitreous-white">Name Your Domain</h2>
                    <p className="text-sm font-scribe text-conchoidal-gray leading-relaxed">
                      Every company is a digital temple. Give yours a name that commands respect.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-scribe font-bold uppercase tracking-widest text-conchoidal-gray/70 ml-1">
                      Entity Name
                    </label>
                    <input
                      className="w-full rounded-lg border border-vitreous-white/10 bg-vitreous-white/5 px-4 py-3 text-sm text-vitreous-white outline-none focus:border-roman-aqua focus:ring-1 focus:ring-roman-aqua/30 transition-all placeholder:text-conchoidal-gray/30"
                      placeholder="e.g. Aetheric Solutions"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-oracle font-bold text-vitreous-white">Summon the BEEP</h2>
                    <p className="text-sm font-scribe text-conchoidal-gray leading-relaxed">
                      The Behavioural Event & Execution Processor is your primary instrument of sovereignty.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-scribe font-bold uppercase tracking-widest text-conchoidal-gray/70 ml-1">
                        Processor Identifier
                      </label>
                      <input
                        className="w-full rounded-lg border border-vitreous-white/10 bg-vitreous-white/5 px-4 py-3 text-sm text-vitreous-white outline-none focus:border-roman-aqua focus:ring-1 focus:ring-roman-aqua/30 transition-all"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-scribe font-bold uppercase tracking-widest text-conchoidal-gray/70 ml-1">
                        Intelligence Source
                      </label>
                      <select
                        className="w-full rounded-lg border border-vitreous-white/10 bg-vitreous-white/5 px-4 py-3 text-sm text-vitreous-white outline-none focus:border-roman-aqua focus:ring-1 focus:ring-roman-aqua/30 transition-all appearance-none"
                        value={adapterType}
                        onChange={(e) => setAdapterType(e.target.value)}
                      >
                        {listUIAdapters().map((adapter) => (
                          <option key={adapter.type} value={adapter.type} className="bg-obsidian-black text-vitreous-white">
                            {adapter.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-oracle font-bold text-vitreous-white">Broadcast Intent</h2>
                    <p className="text-sm font-scribe text-conchoidal-gray leading-relaxed">
                      Silence the chaos with a clear directive. What is the first order of business?
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-scribe font-bold uppercase tracking-widest text-conchoidal-gray/70 ml-1">
                        Directive Title
                      </label>
                      <input
                        className="w-full rounded-lg border border-vitreous-white/10 bg-vitreous-white/5 px-4 py-3 text-sm text-vitreous-white outline-none focus:border-roman-aqua focus:ring-1 focus:ring-roman-aqua/30 transition-all"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-scribe font-bold uppercase tracking-widest text-conchoidal-gray/70 ml-1">
                        Specification
                      </label>
                      <textarea
                        ref={textareaRef}
                        className="w-full rounded-lg border border-vitreous-white/10 bg-vitreous-white/5 px-4 py-3 text-sm text-vitreous-white outline-none focus:border-roman-aqua focus:ring-1 focus:ring-roman-aqua/30 transition-all resize-none min-h-[120px]"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-oracle font-bold text-vitreous-white">Ready for Manifestation</h2>
                    <p className="text-sm font-scribe text-conchoidal-gray leading-relaxed">
                      The components of your reality are aligned. Shall I intervene?
                    </p>
                  </div>
                  <div className="glass-pane border-vitreous-white/5 rounded-xl divide-y divide-vitreous-white/5 overflow-hidden">
                    <div className="flex items-center gap-4 px-4 py-3">
                      <Building2 className="h-4 w-4 text-patina-green" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-oracle font-bold text-vitreous-white uppercase tracking-wider truncate">{companyName}</p>
                        <p className="text-[10px] font-scribe text-conchoidal-gray/60 uppercase">Domain</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-4 py-3">
                      <Cpu className="h-4 w-4 text-roman-aqua" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-oracle font-bold text-vitreous-white uppercase tracking-wider truncate">{agentName}</p>
                        <p className="text-[10px] font-scribe text-conchoidal-gray/60 uppercase">{getUIAdapter(adapterType).label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-4 py-3">
                      <ListTodo className="h-4 w-4 text-imperial-purple" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-oracle font-bold text-vitreous-white uppercase tracking-wider truncate">{taskTitle}</p>
                        <p className="text-[10px] font-scribe text-conchoidal-gray/60 uppercase">Primary Directive</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs font-scribe font-medium text-destructive">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-8">
                <div>
                  {step > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep((step - 1) as Step)}
                      disabled={loading}
                      className="text-conchoidal-gray hover:text-vitreous-white font-scribe uppercase tracking-widest text-[10px]"
                    >
                      <ArrowLeft className="h-3 w-3 mr-2" />
                      Revisit
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant={step === 4 ? "acquisition" : "default"}
                    disabled={loading || (step === 1 && !companyName.trim()) || (step === 2 && !agentName.trim()) || (step === 3 && !taskTitle.trim())}
                    onClick={step === 4 ? handleLaunch : step === 1 ? handleStep1Next : step === 2 ? handleStep2Next : handleStep3Next}
                    className="font-oracle font-bold uppercase tracking-widest text-[10px] px-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Intervening...
                      </>
                    ) : (
                      <>
                        {step === 4 ? "Manifest Reality" : "Continue"}
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right half — ASCII art (hidden on mobile) */}
            <div
              className={cn(
                "hidden md:block overflow-hidden bg-black/20 transition-all duration-700 ease-in-out border-l border-vitreous-white/5",
                step === 1 ? "w-1/2 opacity-100" : "w-1/3 opacity-40 grayscale"
              )}
            >
              <AsciiArtAnimation />
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
