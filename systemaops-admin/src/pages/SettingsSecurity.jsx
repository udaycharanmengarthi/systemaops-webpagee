import { useMemo, useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { usersApi } from "../api/resources.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { useToast } from "../components/Toast.jsx";

function PasswordInput({ value, onChange, autoComplete, label, srLabel }) {
  const [show, setShow] = useState(false);
  return (
    <label className="flex flex-col gap-1 font-medium">
      {label}
      <span className="relative block">
        <input
          type={show ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="input w-full pr-10"
          aria-label={srLabel || label}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-500 hover:text-ink-900"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
        </button>
      </span>
    </label>
  );
}

/* Strength checklist. The BACKEND requires 12-128 characters; the
   complexity items below are advisory guidance only. The UI hard-blocks
   only the backend's actual minimum plus a matching confirmation. */
function strengthOf(password) {
  const checks = [
    password.length >= 12,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const passed = checks.filter(Boolean).length;
  return { passed, total: checks.length, label: passed <= 2 ? "Weak" : passed <= 4 ? "Fair" : "Strong" };
}

export default function SettingsSecurity() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const strength = useMemo(() => strengthOf(newPassword), [newPassword]);
  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (newPassword.length < 12) {
      toast.error("New password must be at least 12 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    setBusy(true);
    try {
      await usersApi.changeMyPassword(currentPassword, newPassword);
      toast.success("Password changed. Please sign in again.");
      await logout();
      window.location.assign("/admin/login");
    } catch (err) {
      toast.error(err.message || "Unable to change password.");
    } finally {
      setBusy(false);
    }
  };

  const checks = [
    { label: "At least 12 characters (required)", ok: newPassword.length >= 12, required: true },
    { label: "Uppercase letter", ok: /[A-Z]/.test(newPassword) },
    { label: "Lowercase letter", ok: /[a-z]/.test(newPassword) },
    { label: "Number", ok: /[0-9]/.test(newPassword) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  return (
    <section className="card p-6">
      <h2 className="text-base font-bold">Change password</h2>
      <p className="mt-1 text-sm text-ink-500">
        Signed in as <span className="font-medium text-ink-900">{user?.email}</span>. Changing your password
        revokes all existing sessions and signs you out everywhere.
      </p>

      <form onSubmit={submit} className="mt-5 flex max-w-md flex-col gap-4 text-sm">
        <PasswordInput
          label="Current password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {newPassword.length > 0 ? (
          <div className="flex flex-col gap-2 rounded-xl border border-ink-200 p-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    strength.passed <= 2 ? "bg-red-500" : strength.passed <= 4 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${(strength.passed / strength.total) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-ink-700">{strength.label}</span>
            </div>
            <ul className="flex flex-col gap-1">
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
          </div>
        ) : null}
        {mismatch ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            Passwords do not match.
          </div>
        ) : null}

        <button type="submit" disabled={busy} className="btn-primary self-start">
          {busy ? "Changing…" : "Change password"}
        </button>
      </form>
    </section>
  );
}
