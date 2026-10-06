import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";
import { authApi } from "../api/auth.js";
import BrandExperience from "../components/BrandExperience.jsx";
import logo from "../assets/systemaops-icon-color.svg";

/* Password reset (public route — no login required; security comes from
   the single-use, short-lived token). Token hygiene:
   - extracted once from the URL into MEMORY ONLY (never localStorage /
     sessionStorage / analytics);
   - the browser URL is then scrubbed via history.replaceState so the
     token no longer appears in the address bar / history entry;
   - cleared from memory after success or rejection. */

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const initial = useRef({
    token: searchParams.get("token") || "",
    email: searchParams.get("email") || "",
  });

  const [token] = useState(() => initial.current.token);
  const [email] = useState(() => initial.current.email);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  /* Scrub the token from the URL as soon as it is safely in memory. */
  useEffect(() => {
    if (initial.current.token || initial.current.email) {
      window.history.replaceState({}, "", "/admin/reset-password");
    }
  }, []);

  const checks = useMemo(
    () => [
      { label: "At least 12 characters", ok: password.length >= 12 },
      { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
      { label: "Lowercase letter", ok: /[a-z]/.test(password) },
      { label: "Number", ok: /[0-9]/.test(password) },
      { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
    ],
    [password]
  );

  const hasLink = token.length > 0 && email.length > 0;
  const rejected = error.length > 0 && /invalid|expired/i.test(error);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy || !hasLink) return;
    setError("");
    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await authApi.resetPassword({ token, email, password });
      setDone(true);
    } catch (err) {
      setError(err.message || "Reset link is invalid or expired. Request a new one.");
    } finally {
      setBusy(false);
    }
  };

  const missingLink = (
    <div className="flex flex-col gap-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
        <KeyRound size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h1 className="text-[26px] font-bold tracking-tight text-ink-900">Reset link unavailable</h1>
      <p className="text-[15px] text-ink-500">
        This password reset link is missing required information or is no longer valid.
      </p>
      <div className="flex flex-col gap-2">
        <Link to="/forgot-password" className="btn-primary">
          Request a new reset link
        </Link>
        <Link
          to="/login"
          className="btn-ghost gap-1.5"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to login
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <BrandExperience />

      <main className="flex min-w-0 flex-1 flex-col bg-white">
        <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-4 md:hidden">
          <img src={logo} alt="SystemaOps" className="h-7 w-7" />
          <span className="text-xs font-bold tracking-[0.18em] text-ink-900">SYSTEMAOPS</span>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px]">
            <div className="hidden items-center gap-2.5 md:flex">
              <img src={logo} alt="" className="h-8 w-8" aria-hidden="true" />
              <span className="text-base font-bold tracking-tight text-ink-900">
                SystemaOps <span className="text-brand-700">Admin</span>
              </span>
            </div>

            {done ? (
              <>
                <h1 className="mt-6 text-[26px] font-bold tracking-tight text-ink-900">Password updated.</h1>
                <p className="mt-1 text-[15px] text-ink-500">
                  Your password has been changed. Please sign in with your new password.
                </p>
                <Link to="/login" className="btn-primary mt-7">
                  Continue to sign in
                </Link>
              </>
            ) : !hasLink ? (
              <div className="mt-6">{missingLink}</div>
            ) : rejected ? (
              <div className="mt-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <KeyRound size={22} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h1 className="mt-4 text-[26px] font-bold tracking-tight text-ink-900">
                  This reset link is invalid or has expired.
                </h1>
                <p className="mt-1 text-[15px] text-ink-500">
                  The link may have already been used or expired. Request a new one to continue.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <Link to="/forgot-password" className="btn-primary">
                    Request a new reset link
                  </Link>
                  <Link to="/login" className="btn-ghost gap-1.5">
                    <ArrowLeft size={15} aria-hidden="true" />
                    Back to login
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h1 className="mt-6 text-[26px] font-bold tracking-tight text-ink-900">Create a new password</h1>
                <p className="mt-1 text-[15px] text-ink-500">
                  Choose a strong password for your account. The reset link can only be used once.
                </p>

                <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-900">
                    New password
                    <span className="relative block">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
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
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-900">
                    Confirm new password
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••••••"
                      className="input h-[50px] rounded-[10px] placeholder:text-ink-500/60"
                    />
                  </label>

                  <ul className="flex flex-col gap-1 rounded-lg border border-ink-200 p-3" aria-label="Password requirements">
                    {checks.map((check) => (
                      <li key={check.label} className="flex items-center gap-2 text-xs text-ink-500">
                        {check.ok ? (
                          <Check size={13} className="text-emerald-600" aria-hidden="true" />
                        ) : (
                          <X size={13} className="text-ink-300" aria-hidden="true" />
                        )}
                        {check.label}
                      </li>
                    ))}
                  </ul>

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
                        Updating…
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
