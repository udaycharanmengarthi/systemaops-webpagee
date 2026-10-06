import { NavLink, Outlet } from "react-router-dom";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../auth/AuthProvider.jsx";
import { canViewUsers } from "../auth/permissions.js";

const TABS = [
  { to: "/settings/profile", label: "Profile", icon: UserRound },
  { to: "/settings/security", label: "Security", icon: KeyRound },
  { to: "/settings/team", label: "Team", icon: ShieldCheck, roles: true },
];

export default function Settings() {
  const { user } = useAuth();
  const tabs = TABS.filter((tab) => (tab.roles ? user && canViewUsers(user.role) : true));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-ink-500">Manage your account and team access.</p>
      </div>

      <div className="flex gap-1 border-b border-ink-200" role="tablist" aria-label="Settings sections">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            role="tab"
            className={({ isActive }) =>
              `-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                isActive ? "border-brand-600 text-brand-800" : "border-transparent text-ink-500 hover:text-ink-900"
              }`
            }
          >
            <tab.icon size={15} aria-hidden="true" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="max-w-2xl">
        <Outlet />
      </div>
    </div>
  );
}
