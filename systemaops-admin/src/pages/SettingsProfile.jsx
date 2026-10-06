import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Camera, Clock, KeyRound, Mail, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import { usersApi } from "../api/resources.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { useToast } from "../components/Toast.jsx";
import { Avatar, ConfirmDialog, RoleBadge } from "../components/ui.jsx";
import { avatarSrcFor } from "../utils/avatar.js";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function SettingsProfile() {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [pending, setPending] = useState(null); // { file, previewUrl }

  useEffect(
    () => () => {
      if (pending && pending.previewUrl) URL.revokeObjectURL(pending.previewUrl);
    },
    [pending]
  );

  const pickFile = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }
    setPending({ file, previewUrl: URL.createObjectURL(file) });
  };

  const cancelPreview = () => {
    if (pending && pending.previewUrl) URL.revokeObjectURL(pending.previewUrl);
    setPending(null);
  };

  const uploadPending = async () => {
    if (!pending || busy) return;
    setBusy(true);
    const form = new FormData();
    form.append("avatar", pending.file);
    try {
      await usersApi.uploadAvatar(form);
      toast.success("Avatar updated.");
      await refresh();
      cancelPreview();
    } catch (err) {
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const removeAvatar = async () => {
    setBusy(true);
    try {
      await usersApi.removeAvatar();
      toast.success("Avatar removed.");
      await refresh();
    } catch (err) {
      toast.error(err.message || "Unable to remove avatar.");
    } finally {
      setBusy(false);
      setConfirmRemove(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-6">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={user?.name} src={pending ? pending.previewUrl : avatarSrcFor(user)} size={88} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-ink-900">{user?.name}</span>
              <RoleBadge value={user?.role} />
            </div>
            <p className="mt-1 text-sm text-ink-500">
              Name and email are managed by a SUPER_ADMIN in Team settings and cannot be self-edited.
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={pickFile} disabled={busy} className="btn-ghost gap-1.5 px-3 py-1.5 text-xs">
                <Camera size={13} aria-hidden="true" />
                {busy ? "Working…" : "Change photo"}
              </button>
              {user?.avatar?.hasAvatar && !pending ? (
                <button type="button" onClick={() => setConfirmRemove(true)} disabled={busy} className="btn-ghost gap-1.5 px-3 py-1.5 text-xs">
                  <Trash2 size={13} aria-hidden="true" />
                  Remove photo
                </button>
              ) : null}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFileChange}
                aria-label="Upload profile photo"
              />
            </div>
          </div>
        </div>
      </section>

      {pending ? (
        <section className="card p-5" aria-label="Preview new photo">
          <div className="flex flex-wrap items-center gap-4">
            <img
              src={pending.previewUrl}
              alt="New profile photo preview"
              className="h-20 w-20 rounded-full border border-ink-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold">Preview</h2>
              <p className="mt-0.5 text-sm text-ink-500">This photo will be used across the admin console.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={cancelPreview} disabled={busy} className="btn-ghost gap-1.5">
                <X size={14} aria-hidden="true" />
                Cancel
              </button>
              <button type="button" onClick={uploadPending} disabled={busy} className="btn-brand gap-1.5">
                <Upload size={14} aria-hidden="true" />
                {busy ? "Uploading…" : "Upload"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="card p-6">
        <h2 className="text-sm font-bold">Account details</h2>
        <dl className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-0.5 text-ink-500" aria-hidden="true" />
            <div>
              <dt className="section-label">Email</dt>
              <dd className="mt-0.5 text-sm text-ink-900">{user?.email}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="mt-0.5 text-ink-500" aria-hidden="true" />
            <div>
              <dt className="section-label">Role</dt>
              <dd className="mt-0.5 text-sm text-ink-900">{user?.role?.replace(/_/g, " ")}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-block h-4 w-4 rounded-full bg-emerald-500" aria-hidden="true" />
            <div>
              <dt className="section-label">Account status</dt>
              <dd className="mt-0.5 text-sm text-ink-900">Active</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <KeyRound size={16} className="mt-0.5 text-ink-500" aria-hidden="true" />
            <div>
              <dt className="section-label">Password</dt>
              <dd className="mt-0.5 text-sm text-ink-900">
                <Link to="/settings/security" className="font-semibold text-brand-700 hover:underline">
                  Change password →
                </Link>
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={16} className="mt-0.5 text-ink-500" aria-hidden="true" />
            <div>
              <dt className="section-label">Last login</dt>
              <dd className="mt-0.5 text-sm text-ink-900">
                {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarDays size={16} className="mt-0.5 text-ink-500" aria-hidden="true" />
            <div>
              <dt className="section-label">Account created</dt>
              <dd className="mt-0.5 text-sm text-ink-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <ConfirmDialog
        open={confirmRemove}
        title="Remove your profile photo?"
        body="Your initials will be shown instead. You can upload a new photo at any time."
        confirmLabel="Remove photo"
        danger
        onCancel={() => setConfirmRemove(false)}
        onConfirm={removeAvatar}
      />
    </div>
  );
}
