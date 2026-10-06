import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../auth/AuthProvider.jsx";
import { useToast } from "../components/Toast.jsx";
import BrandExperience from "../components/BrandExperience.jsx";
import logo from "../assets/systemaops-icon-color.svg";

export default function Login() {
  const { user, loading, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back.");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <BrandExperience />

      {/* ── Right: authentication ── */}
      <main className="flex min-w-0 flex-1 flex-col bg-white">
        <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-4 md:hidden">
          <img src={logo} alt="SystemaOps" className="h-7 w-7" />
          <div className="leading-tight">
            <div className="text-xs font-bold tracking-[0.18em] text-ink-900">SYSTEMAOPS</div>
            <div className="text-[10px] font-medium tracking-[0.28em] text-ink-500">TECHNOLOGY</div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px]">
            <div className="hidden items-center gap-2.5 md:flex">
              <img src={logo} alt="" className="h-8 w-8" aria-hidden="true" />
              <span className="text-base font-bold tracking-tight text-ink-900">
                SystemaOps <span className="text-brand-700">Admin</span>
              </span>
            </div>

            <h1 className="mt-6 text-[26px] font-bold tracking-tight text-ink-900">Welcome back.</h1>
            <p className="mt-1 text-[15px] text-ink-500">Sign in to continue to the operations console.</p>

            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-900">
                Email
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input h-[50px] rounded-[10px] placeholder:text-ink-500/60"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-900">
                Password
                <span className="relative block">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="input h-[50px] w-full rounded-[10px] pr-11 placeholder:text-ink-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-ink-500 hover:text-ink-900"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </span>
              </label>

              <div className="-mt-1 text-right">
                <Link to="/forgot-password" className="text-xs font-medium text-brand-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="min-h-[46px]" aria-live="polite">
                {error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                    {error}
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[10px] bg-brand-600 text-[15px] font-semibold text-white transition hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-ink-500">
              <ShieldCheck size={13} aria-hidden="true" />
              Your session is protected with a secure HTTP-only cookie.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
