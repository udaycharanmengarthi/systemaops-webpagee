import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  Briefcase,
  CheckCheck,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider.jsx";
import { canViewActivity, canViewUsers } from "../auth/permissions.js";
import { useToast } from "./Toast.jsx";
import { Avatar, RoleBadge } from "./ui.jsx";
import CommandPalette from "./CommandPalette.jsx";
import { notificationsApi } from "../api/resources.js";
import { avatarSrcFor } from "../utils/avatar.js";
import logo from "../assets/systemaops-icon-color.svg";

/* Navigation derives from the central capability model. Sections only
   render when at least one item is permitted — no empty groups. */
const SECTIONS = [
  {
    label: "Operations",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/contacts", label: "Contacts", icon: Users },
      { to: "/careers", label: "Careers", icon: Briefcase },
    ],
  },
  {
    label: "Workspace",
    items: [
      { to: "/activity", label: "Activity", icon: Activity, gate: canViewActivity },
      { to: "/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/users", label: "Users", icon: ShieldCheck, gate: canViewUsers },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const TITLES = {
  "/": "Operations Console",
  "/contacts": "Contacts",
  "/careers": "Careers",
  "/activity": "Activity",
  "/notifications": "Notifications",
  "/users": "Users",
  "/settings": "Settings",
  "/settings/profile": "Settings / Profile",
  "/settings/security": "Settings / Security",
  "/settings/team": "Settings / Team",
};

export default function Layout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [recentNotes, setRecentNotes] = useState([]);
  const userMenuRef = useRef(null);
  const bellRef = useRef(null);

  const expanded = pinned || hovering;

  useEffect(() => {
    let cancelled = false;
    let timer = null;
    const load = async () => {
      try {
        const result = await notificationsApi.list({ page: 1, limit: 5 });
        if (!cancelled && result && result.data) {
          setUnread(result.data.unread || 0);
          setRecentNotes(result.data.items || []);
        }
      } catch {
        /* badge stays stale rather than erroring the shell */
      }
      if (!cancelled) timer = setTimeout(load, 60000);
    };
    load();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setBellOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
    toast.notify("Logged out.");
  };

  const markAllRead = async () => {
    try {
      const result = await notificationsApi.markAllRead();
      toast.success(`Marked ${result.data.updated} as read.`);
      setUnread(0);
      setRecentNotes((list) => list.map((n) => ({ ...n, read: true })));
    } catch (err) {
      toast.error(err.message || "Unable to update notifications.");
    }
  };

  const pageTitle = TITLES[location.pathname] || "Operations Console";

  const visibleSections = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.gate || item.gate(user?.role)),
  })).filter((section) => section.items.length > 0);

  const sidebarInner = (wide) => (
    <div className="flex h-full flex-col">
      <div className={`flex items-center px-3 py-5 ${wide ? "gap-2.5" : "justify-center"}`}>
        <img src={logo} alt="SystemaOps" className="h-8 w-8 shrink-0" />
        {wide ? (
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold tracking-tight text-ink-900">SystemaOps</div>
            <div className="text-[11px] font-medium text-ink-500">Operations Console</div>
          </div>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2.5" aria-label="Primary">
        {visibleSections.map((section) => (
          <div key={section.label}>
            {wide ? (
              <div className="section-label px-3 pb-1.5">{section.label}</div>
            ) : (
              <div className="mx-auto mb-1.5 h-px w-6 bg-ink-200" aria-hidden="true" />
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  title={wide ? undefined : item.label}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition ${
                      wide ? "px-3" : "justify-center px-0"
                    } ${isActive ? "bg-brand-50 text-brand-800" : "text-ink-700 hover:bg-ink-100"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-brand-600" aria-hidden="true" />
                      ) : null}
                      <item.icon size={18} strokeWidth={1.9} className="shrink-0" aria-hidden="true" />
                      {wide ? <span className="flex-1 truncate">{item.label}</span> : null}
                      {wide && item.to === "/notifications" && unread > 0 ? (
                        <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {unread > 99 ? "99+" : unread}
                        </span>
                      ) : null}
                      {!wide && item.to === "/notifications" && unread > 0 ? (
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-600" aria-label="Unread notifications" />
                      ) : null}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-200 p-2.5">
        <NavLink
          to="/settings/profile"
          title={wide ? undefined : "Profile"}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg py-2 text-sm font-medium ${
              wide ? "px-3" : "justify-center"
            } ${isActive ? "bg-brand-50 text-brand-800" : "text-ink-700 hover:bg-ink-100"}`
          }
        >
          <UserRound size={18} strokeWidth={1.9} className="shrink-0" aria-hidden="true" />
          {wide ? (
            <span className="flex min-w-0 flex-1 items-center justify-between">
              <span className="truncate">Profile</span>
              <RoleBadge value={user?.role} />
            </span>
          ) : null}
        </NavLink>
        <button
          type="button"
          onClick={() => setPinned((p) => !p)}
          className={`hidden w-full items-center rounded-lg py-2 text-xs font-medium text-ink-500 hover:bg-ink-100 lg:flex ${
            wide ? "justify-start gap-2 px-3" : "justify-center"
          }`}
          aria-label={pinned ? "Unpin sidebar" : "Pin sidebar open"}
        >
          <span aria-hidden="true">{wide ? (pinned ? "◂" : "▸") : "▸"}</span>
          {wide ? <span>{pinned ? "Unpin sidebar" : "Pin sidebar"}</span> : null}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-ink-200 bg-white transition-[width] duration-200 ease-out lg:block ${
          expanded ? "w-60" : "w-[68px]"
        }`}
      >
        {sidebarInner(expanded)}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="absolute right-3 top-4 z-10">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            {sidebarInner(true)}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-ink-200 bg-white/90 px-4 backdrop-blur">
          <button
            type="button"
            className="rounded-lg p-1.5 text-ink-700 hover:bg-ink-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink-900">{pageTitle}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-500 transition hover:border-brand-600 md:flex"
              aria-label="Open command palette"
            >
              <Search size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden rounded border border-ink-200 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500 sm:inline">
                Ctrl K
              </kbd>
            </button>

            <div className="relative" ref={bellRef}>
              <button
                type="button"
                onClick={() => setBellOpen((v) => !v)}
                className="relative rounded-lg p-2 text-ink-700 hover:bg-ink-100"
                aria-expanded={bellOpen}
                aria-haspopup="dialog"
                aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
              >
                <Bell size={17} strokeWidth={1.9} aria-hidden="true" />
                {unread > 0 ? (
                  <span className="absolute right-1 top-1 rounded-full bg-brand-600 px-1 text-[9px] font-bold leading-4 text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                ) : null}
              </button>
              {bellOpen ? (
                <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-lg" role="dialog" aria-label="Notifications">
                  <div className="flex items-center justify-between border-b border-ink-200 px-3 py-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-700">Notifications</span>
                    <button type="button" onClick={markAllRead} className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline">
                      <CheckCheck size={13} aria-hidden="true" />
                      Mark all read
                    </button>
                  </div>
                  <ul className="max-h-72 overflow-y-auto">
                    {recentNotes.length === 0 ? (
                      <li className="px-4 py-6 text-center text-sm text-ink-500">No notifications yet.</li>
                    ) : (
                      recentNotes.map((n) => (
                        <li key={n._id} className="border-b border-ink-100 last:border-0">
                          <Link
                            to={
                              n.entityType === "contact" && n.entityId
                                ? `/contacts/${n.entityId}`
                                : n.entityType === "career" && n.entityId
                                  ? `/careers/${n.entityId}`
                                  : "/notifications"
                            }
                            className="flex gap-2 px-3 py-2.5 text-sm hover:bg-ink-50"
                          >
                            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-ink-200" : "bg-brand-600"}`} aria-hidden="true" />
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-ink-900">{n.title}</span>
                              {n.body ? <span className="block truncate text-xs text-ink-500">{n.body}</span> : null}
                            </span>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                  <Link to="/notifications" className="block border-t border-ink-200 px-3 py-2 text-center text-xs font-semibold text-brand-700 hover:bg-ink-50">
                    View all notifications
                  </Link>
                </div>
              ) : null}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-ink-100"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
              >
                <Avatar name={user?.name} src={avatarSrcFor(user)} size={30} />
                <span className="hidden text-left leading-tight md:block">
                  <span className="block text-xs font-semibold text-ink-900">{user?.name}</span>
                  <span className="block text-[10px] text-ink-500">{user?.role?.replace(/_/g, " ")}</span>
                </span>
              </button>
              {userMenuOpen ? (
                <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-lg" role="menu">
                  <div className="flex items-center gap-2.5 border-b border-ink-200 px-3 py-2.5">
                    <Avatar name={user?.name} src={avatarSrcFor(user)} size={34} />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-ink-900">{user?.name}</div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <RoleBadge value={user?.role} />
                      </div>
                    </div>
                  </div>
                  <Link to="/settings/profile" role="menuitem" className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-100">
                    <UserRound size={15} aria-hidden="true" />
                    View profile
                  </Link>
                  <Link to="/settings/security" role="menuitem" className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-100">
                    <KeyRound size={15} aria-hidden="true" />
                    Security
                  </Link>
                  <Link to="/notifications" role="menuitem" className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-100">
                    <Bell size={15} aria-hidden="true" />
                    Notifications
                  </Link>
                  {canViewUsers(user?.role) ? (
                    <Link to="/users" role="menuitem" className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-100">
                      <ShieldCheck size={15} aria-hidden="true" />
                      Team administration
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 border-t border-ink-200 px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-100"
                  >
                    <LogOut size={15} aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} /> : null}
    </div>
  );
}
