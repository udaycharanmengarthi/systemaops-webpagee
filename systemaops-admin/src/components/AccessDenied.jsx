import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";

/* Reusable forbidden state. Shown for authenticated users who hit a
   route their role cannot access — no backend details, clear path back. */
export default function AccessDenied({ message }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
        <ShieldOff size={24} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-ink-900">Access restricted</h1>
      <p className="mt-1 max-w-sm text-sm text-ink-500">
        {message || "This area is available to authorized administrators only."}
      </p>
      <Link to="/" className="btn-primary mt-6">
        Return to dashboard
      </Link>
    </div>
  );
}
