// Centralized frontend permission model. UX ONLY — the backend
// re-checks every request and remains the single authority.
// Ranks mirror Server/src/config/workflow.js ROLE_RANK.

const RANK = { VIEWER: 1, MANAGER: 2, ADMIN: 3, SUPER_ADMIN: 4 };

/* Capability -> minimum role. Matches the backend route guards:
   - operational reads: VIEWER
   - operational mutations: MANAGER
   - activity feed: MANAGER (audit surface)
   - user administration: SUPER_ADMIN (list AND mutations)
   - assignee directory: MANAGER (lean dropdown endpoint)            */
export const CAPABILITIES = {
  VIEW_DASHBOARD: "VIEWER",
  VIEW_CONTACTS: "VIEWER",
  EDIT_CONTACTS: "MANAGER",
  ASSIGN_CONTACTS: "MANAGER",
  VIEW_CAREERS: "VIEWER",
  EDIT_CAREERS: "MANAGER",
  ASSIGN_CAREERS: "MANAGER",
  VIEW_ACTIVITY: "MANAGER",
  VIEW_NOTIFICATIONS: "VIEWER",
  VIEW_ASSIGNABLE: "MANAGER",
  VIEW_USERS: "SUPER_ADMIN",
  MANAGE_USERS: "SUPER_ADMIN",
  VIEW_SETTINGS: "VIEWER",
  VIEW_TEAM_SETTINGS: "SUPER_ADMIN",
  CHANGE_OWN_PASSWORD: "VIEWER",
  MANAGE_BULK_ACTIONS: "MANAGER",
  REOPEN_CLOSED_CONTACT: "ADMIN",
};

export function hasMinRole(role, minimum) {
  return (RANK[role] || 0) >= (RANK[minimum] || 0);
}

export function can(role, capability) {
  const minimum = CAPABILITIES[capability];
  if (!minimum) return false;
  return hasMinRole(role, minimum);
}

/* Convenience helpers (compatibility with existing call sites). */
export const canMutate = (role) => can(role, "EDIT_CONTACTS");
export const canManageUsers = (role) => can(role, "MANAGE_USERS");
export const canViewUsers = (role) => can(role, "VIEW_USERS");
export const canViewActivity = (role) => can(role, "VIEW_ACTIVITY");
export const canReopen = (role) => can(role, "REOPEN_CLOSED_CONTACT");
export const canViewTeamSettings = (role) => can(role, "VIEW_TEAM_SETTINGS");
