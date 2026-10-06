import { useState } from "react";
import { usersApi } from "../api/resources.js";
import { useFetch } from "../hooks/useFetch.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { canManageUsers } from "../auth/permissions.js";
import { useToast } from "../components/Toast.jsx";
import { Avatar, ConfirmDialog, EmptyState, ErrorState, Pagination, RoleBadge, SkeletonRows } from "../components/ui.jsx";
import { avatarSrcFor } from "../utils/avatar.js";

const ROLES = ["VIEWER", "MANAGER", "ADMIN", "SUPER_ADMIN"];

const ROLE_RANK = { VIEWER: 1, MANAGER: 2, ADMIN: 3, SUPER_ADMIN: 4 };

export default function Users() {
  const { user } = useAuth();
  const toast = useToast();
  const manager = canManageUsers(user?.role);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmRole, setConfirmRole] = useState(null); // { user, nextRole }
  const [confirmStatus, setConfirmStatus] = useState(null); // user object

  const { data, meta, loading, error, refresh } = useFetch(
    () => usersApi.list({ page, limit: 25 }),
    `${page}`
  );

  const create = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await usersApi.create({ email: email.trim(), name: name.trim(), role, password });
      toast.success(`Admin ${email.trim()} created.`);
      setShowCreate(false);
      setEmail("");
      setName("");
      setRole("VIEWER");
      setPassword("");
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to create user.");
    } finally {
      setBusy(false);
    }
  };

  const applyRoleChange = async () => {
    if (!confirmRole) return;
    const { target, nextRole } = confirmRole;
    try {
      await usersApi.update(target._id, { role: nextRole });
      toast.success(`Role changed to ${nextRole.replace(/_/g, " ")}. Existing sessions revoked.`);
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to update role.");
    } finally {
      setConfirmRole(null);
    }
  };

  const applyStatusChange = async () => {
    if (!confirmStatus) return;
    const target = confirmStatus;
    const next = target.status === "active" ? "suspended" : "active";
    try {
      await usersApi.update(target._id, { status: next });
      toast.success(next === "suspended" ? "User suspended." : "User reactivated.");
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to update status.");
    } finally {
      setConfirmStatus(null);
    }
  };

  const roleConsequence = (from, to) => {
    if ((ROLE_RANK[to] || 0) > (ROLE_RANK[from] || 0)) {
      return "This is a privilege escalation. The user will gain additional access immediately and all their sessions will be revoked.";
    }
    if ((ROLE_RANK[to] || 0) < (ROLE_RANK[from] || 0)) {
      return "This reduces the user's access. Their existing sessions will be revoked.";
    }
    return "Existing sessions will be revoked.";
  };

  const resetPassword = async () => {
    if (!confirmReset || newPassword.length < 12) {
      toast.error("New password must be at least 12 characters.");
      return;
    }
    try {
      await usersApi.resetPassword(confirmReset, newPassword);
      toast.success("Password reset. That user's sessions were revoked.");
      setConfirmReset(null);
      setNewPassword("");
    } catch (err) {
      toast.error(err.message || "Unable to reset password.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-ink-500">Role changes and suspensions revoke sessions immediately.</p>
        </div>
        {manager ? (
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {showCreate ? "Cancel" : "New admin"}
          </button>
        ) : null}
      </div>

      {manager && showCreate ? (
        <form onSubmit={create} className="grid grid-cols-1 gap-3 rounded-2xl border border-ink-200 bg-white p-5 text-sm sm:grid-cols-2">
          <label className="flex flex-col gap-1 font-medium">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-ink-300 px-3 py-2 font-normal" />
          </label>
          <label className="flex flex-col gap-1 font-medium">
            Name
            <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className="rounded-lg border border-ink-300 px-3 py-2 font-normal" />
          </label>
          <label className="flex flex-col gap-1 font-medium">
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border border-ink-300 px-3 py-2 font-normal">
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 font-medium">
            Temporary password (min 12 chars)
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} minLength={12} className="rounded-lg border border-ink-300 px-3 py-2 font-normal" />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy} className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white disabled:opacity-40">
              {busy ? "Creating…" : "Create admin"}
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <SkeletonRows count={5} />
      ) : error ? (
        <ErrorState message={error.message} onRetry={refresh} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No admin users." hint="Create the first administrator to get started." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-xs uppercase tracking-wider text-ink-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3">Created</th>
                {manager ? <th className="px-4 py-3">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => {
                const isSelf = user && u._id === user.id;
                return (
                  <tr key={u._id} className="border-b border-ink-100 last:border-0">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2.5">
                        <Avatar name={u.name} src={avatarSrcFor(u)} size={30} />
                        <span className="font-semibold">{u.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      {manager && !isSelf ? (
                        <select
                          value={u.role}
                          onChange={(e) => {
                            if (e.target.value !== u.role) {
                              setConfirmRole({ target: u, nextRole: e.target.value });
                            }
                          }}
                          aria-label={`Role for ${u.name}`}
                          className="rounded-lg border border-ink-300 px-2 py-1"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <RoleBadge value={u.role} />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${u.status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-500">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                    </td>
                    <td className="px-4 py-3 text-ink-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    {manager ? (
                      <td className="px-4 py-3">
                        {!isSelf ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setConfirmStatus(u)}
                              className="rounded-lg border border-ink-300 px-2 py-1 text-xs font-semibold"
                            >
                              {u.status === "active" ? "Suspend" : "Reactivate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmReset(u._id)}
                              className="rounded-lg border border-ink-300 px-2 py-1 text-xs font-semibold"
                            >
                              Reset password
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-ink-500">You</span>
                        )}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination meta={meta} onPage={setPage} />

      <ConfirmDialog
        open={!!confirmRole}
        title={`Change ${confirmRole?.target?.name || "user"}'s role to ${(confirmRole?.nextRole || "").replace(/_/g, " ")}?`}
        body={confirmRole ? roleConsequence(confirmRole.target.role, confirmRole.nextRole) : ""}
        confirmLabel="Change role"
        danger={(ROLE_RANK[confirmRole?.nextRole] || 0) > (ROLE_RANK[confirmRole?.target?.role] || 0)}
        onCancel={() => setConfirmRole(null)}
        onConfirm={applyRoleChange}
      />

      <ConfirmDialog
        open={!!confirmStatus}
        title={`${confirmStatus?.status === "active" ? "Suspend" : "Reactivate"} ${confirmStatus?.name || "user"}?`}
        body={
          confirmStatus?.status === "active"
            ? "The user will be signed out and unable to access the console until reactivated."
            : "The user will regain access with their previous role."
        }
        confirmLabel={confirmStatus?.status === "active" ? "Suspend user" : "Reactivate user"}
        danger={confirmStatus?.status === "active"}
        onCancel={() => setConfirmStatus(null)}
        onConfirm={applyStatusChange}
      />

      <ConfirmDialog
        open={!!confirmReset}
        title="Reset password?"
        body="The user will need the new password to sign in. Their existing sessions are revoked immediately."
        confirmLabel="Reset password"
        danger
        onCancel={() => {
          setConfirmReset(null);
          setNewPassword("");
        }}
        onConfirm={resetPassword}
      />
      {confirmReset ? (
        <div className="fixed inset-0 z-[95] flex items-end justify-center p-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 12 chars)"
            aria-label="New password"
            className="w-full max-w-md rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm shadow-xl"
          />
        </div>
      ) : null}
    </div>
  );
}
