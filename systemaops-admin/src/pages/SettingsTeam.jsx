import { Link } from "react-router-dom";
import { ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../auth/AuthProvider.jsx";
import { canManageUsers } from "../auth/permissions.js";

export default function SettingsTeam() {
  const { user } = useAuth();
  const manager = canManageUsers(user?.role);

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Users size={16} className="text-ink-500" aria-hidden="true" />
          Team management
        </h2>
        <p className="mt-2 text-sm text-ink-500">
          {manager
            ? "Create admins, assign roles and manage access for the operations team."
            : "Your role can view the team but not modify it."}
        </p>
        <Link to="/users" className="btn-primary mt-4">
          Open user management
        </Link>
      </section>

      <section className="card p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <ShieldCheck size={16} className="text-ink-500" aria-hidden="true" />
          Roles & permissions
        </h2>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-ink-100 py-2">
            <dt className="font-medium text-ink-900">VIEWER</dt>
            <dd className="text-ink-500">Read-only access to operations data</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-ink-100 py-2">
            <dt className="font-medium text-ink-900">MANAGER</dt>
            <dd className="text-ink-500">Manage contacts and applications</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-ink-100 py-2">
            <dt className="font-medium text-ink-900">ADMIN</dt>
            <dd className="text-ink-500">Broader operational administration</dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="font-medium text-ink-900">SUPER_ADMIN</dt>
            <dd className="text-ink-500">User management and administrative controls</dd>
          </div>
        </dl>
        <p className="mt-3 rounded-xl bg-ink-50 px-4 py-3 text-xs text-ink-500">
          Permissions are enforced server-side. This panel is informational only.
        </p>
      </section>
    </div>
  );
}
