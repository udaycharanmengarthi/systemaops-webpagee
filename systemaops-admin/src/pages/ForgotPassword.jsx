import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { authApi } from "../api/auth.js";
import {
  FORGOT_PASSWORD_MESSAGES as MSG,
  isValidEmailFormat,
  messageForForgotPasswordError,
  normalizeEmail,
} from "../utils/forgotPassword.js";
import BrandExperience from "../components/BrandExperience.jsx";
import logo from "../assets/systemaops-icon-color.svg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState(null);
  const [sentMessage, setSentMessage] = useState("");
  const [error, setError] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    /* Clear the previous outcome as soon as the user starts editing,
       so success and error are never visible together. */
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    const value = normalizeEmail(email);
    setEmail(value);

    if (!isValidEmailFormat(value)) {
      setError(MSG.invalidEmail);
      return;
    }

    setError("");
    setBusy(true);
    try {
      const { data } = await authApi.forgotPassword(value);
      /* Only reached on genuine success (2xx). The API client throws
         ApiError for every failure, so `sentTo` can never be set for
         an unknown email or a delivery failure. The TTL in the copy
         comes from the backend (env-configurable), not from here. */
      setSentTo(value);
      setSentMessage(
        typeof data?.message === "string" && data.message
          ? data.message
          : "Reset instructions have been sent. The link expires shortly and can only be used once."
      );
    } catch (err) {
      setError(messageForForgotPasswordError(err));
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

            {sentTo ? (
              <>
                <h1 className="mt-6 text-[26px] font-bold tracking-tight text-ink-900">Check your inbox.</h1>
                <p className="mt-1 text-[15px] text-ink-500">
                  {sentMessage}
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
                  Enter your admin email and we&rsquo;ll send reset instructions.
                </p>

                <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4" noValidate>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-900">
                    Email
                    <input
                      type="email"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={onChangeEmail}
                      placeholder="you@company.com"
                      aria-invalid={error ? "true" : undefined}
                      aria-describedby={error ? "forgot-error" : undefined}
                      className={`input h-[50px] rounded-[10px] placeholder:text-ink-500/60 ${
                        error ? "border-red-300 focus:border-red-400" : ""
                      }`}
                    />
                  </label>
                  <div className="min-h-[46px]" aria-live="polite">
                    {error ? (
                      <div
                        id="forgot-error"
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                      >
                        {error}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    aria-busy={busy}
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
