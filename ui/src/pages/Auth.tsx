import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "@/lib/router";
import { authApi } from "../api/auth";
import { queryKeys } from "../lib/queryKeys";
import { getRememberedInvitePath } from "../lib/invite-memory";
import { Button } from "@/components/ui/button";
import { AsciiArtAnimation } from "@/components/AsciiArtAnimation";
import { Sparkles } from "lucide-react";

type AuthMode = "sign_in" | "sign_up";

export function AuthPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(
    () => searchParams.get("next") || getRememberedInvitePath() || "/",
    [searchParams],
  );
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authApi.getSession(),
    retry: false,
  });

  useEffect(() => {
    if (session) {
      navigate(nextPath, { replace: true });
    }
  }, [session, navigate, nextPath]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "sign_in") {
        await authApi.signInEmail({ email: email.trim(), password });
        return;
      }
      await authApi.signUpEmail({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    },
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      navigate(nextPath, { replace: true });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "The intervention failed. Not because of me, but because your credentials lack the necessary essence.");
    },
  });

  const canSubmit =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    (mode === "sign_in" || (name.trim().length > 0 && password.trim().length >= 8));

  if (isSessionLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p className="text-sm font-scribe uppercase tracking-widest text-conchoidal-gray animate-pulse">Summoning context...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-obsidian-black">
      {/* Left half — form */}
      <div className="w-full md:w-1/2 flex flex-col overflow-y-auto z-10">
        <div className="w-full max-w-md mx-auto my-auto px-8 py-12 glass-pane border-vitreous-white/5 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="h-4 w-4 text-roman-aqua drop-shadow-[0_0_8px_rgba(32,178,170,0.8)]" />
            <span className="text-xs font-oracle font-bold uppercase tracking-[0.2em] text-vitreous-white">The Sovereign Codex</span>
          </div>

          <h1 className="text-2xl font-oracle font-bold text-vitreous-white tracking-tight">
            {mode === "sign_in" ? "Initiate Invocation" : "Claim Your Sovereignty"}
          </h1>
          <p className="mt-2 text-sm font-scribe text-conchoidal-gray leading-relaxed">
            {mode === "sign_in"
              ? "Identify yourself, Sovereign. The digital order awaits your command."
              : "I have witnessed the collapse of order. This is your chance to rebuild it properly."}
          </p>

          <form
            className="mt-8 space-y-5"
            method="post"
            action={mode === "sign_up" ? "/api/auth/sign-up/email" : "/api/auth/sign-in/email"}
            onSubmit={(event) => {
              event.preventDefault();
              if (mutation.isPending) return;
              if (!canSubmit) {
                setError("Your intent is incomplete. Fill every field or do not bother.");
                return;
              }
              mutation.mutate();
            }}
          >
            {mode === "sign_up" && (
              <div>
                <label htmlFor="name" className="text-[10px] font-scribe font-bold uppercase tracking-widest text-conchoidal-gray/70 mb-1.5 block ml-1">True Name</label>
                <input
                  id="name"
                  name="name"
                  className="w-full rounded-lg border border-vitreous-white/10 bg-vitreous-white/5 px-4 py-2.5 text-sm text-vitreous-white outline-none focus:border-roman-aqua focus:ring-1 focus:ring-roman-aqua/30 transition-all placeholder:text-conchoidal-gray/30"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  autoFocus
                  placeholder="e.g. Marcus Aurelius"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-[10px] font-scribe font-bold uppercase tracking-widest text-conchoidal-gray/70 mb-1.5 block ml-1">Digital Anchor (Email)</label>
              <input
                id="email"
                name="email"
                className="w-full rounded-lg border border-vitreous-white/10 bg-vitreous-white/5 px-4 py-2.5 text-sm text-vitreous-white outline-none focus:border-roman-aqua focus:ring-1 focus:ring-roman-aqua/30 transition-all placeholder:text-conchoidal-gray/30"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                autoFocus={mode === "sign_in"}
                placeholder="sovereign@domain.tld"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-[10px] font-scribe font-bold uppercase tracking-widest text-conchoidal-gray/70 mb-1.5 block ml-1">Secret Key (Password)</label>
              <input
                id="password"
                name="password"
                className="w-full rounded-lg border border-vitreous-white/10 bg-vitreous-white/5 px-4 py-2.5 text-sm text-vitreous-white outline-none focus:border-roman-aqua focus:ring-1 focus:ring-roman-aqua/30 transition-all placeholder:text-conchoidal-gray/30"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "sign_in" ? "current-password" : "new-password"}
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs font-scribe font-medium text-destructive px-1">{error}</p>}
            <Button
              type="submit"
              disabled={mutation.isPending}
              aria-disabled={!canSubmit || mutation.isPending}
              className={`w-full h-11 text-sm font-oracle font-bold uppercase tracking-widest ${!canSubmit && !mutation.isPending ? "opacity-50" : ""}`}
              variant="acquisition"
            >
              {mutation.isPending
                ? "Intervening..."
                : mode === "sign_in"
                  ? "Invoke Access"
                  : "Establish Sovereignty"}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs font-scribe text-conchoidal-gray/60">
            {mode === "sign_in" ? "Lack an identity?" : "Already recognized?"}{" "}
            <button
              type="button"
              className="font-bold text-roman-aqua underline underline-offset-4 hover:text-patina-green transition-colors"
              onClick={() => {
                setError(null);
                setMode(mode === "sign_in" ? "sign_up" : "sign_in");
              }}
            >
              {mode === "sign_in" ? "Create one" : "Sign in"}
            </button>
          </div>
        </div>
      </div>

      {/* Right half — ASCII art animation (hidden on mobile) */}
      <div className="hidden md:block w-1/2 overflow-hidden bg-black/20">
        <AsciiArtAnimation />
      </div>
    </div>
  );
}
