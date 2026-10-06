import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { authApi } from "../api/auth.js";
import BrandExperience from "../components/BrandExperience.jsx";
import logo from "../assets/systemaops-icon-color.svg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await authApi.forgotPassword(email.trim());
      setDone(true);
    } catch (err) {
      setError(err.message || "Unable to send reset instructions. Please try again.");
    } finally {
      setBusy(false);
    }
  };

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
                <h1 className="mt-6 text-[26px] font-bold tracking-tight text-ink-900">Check your inbox.</h1>
                <p className="mt-1 text-[15px] text-ink-500">
                  If an account exists for that email, reset instructions have been sent. The link expires shortly and can only be used once.
                </p>
                <Link to="/login" className="btn-primary mt-7 gap-2">
                  <ArrowLeft size={15} aria-hidden="true" />
                  Back to sign in
                </Link>
              </>
            ) : (
              <>
                <h1 className="mt-6 text-[26px] font-bold tracking-tight text-ink-900">Forgot your password?</h1>
                <p className="mt-1 text-[15px] text-ink-500">
                  Enter your admin email and we'll send reset instructions.
                </p>

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
                        Sending…
                      </>
                    ) : (
                      "Send reset instructions"
                    )}
                  </button>
                </form>

                <Link
                  to="/login"
                  className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Back to sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
