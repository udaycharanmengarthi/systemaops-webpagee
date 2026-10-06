import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";
import { can, hasMinRole } from "./permissions.js";
import AccessDenied from "../components/AccessDenied.jsx";

/* Route guard. `permission` (capability key) or `minRole` gates access.
   Unauthenticated -> login. Authenticated but unauthorized -> explicit
   AccessDenied state (never a silent redirect, never fake access). */
export default function ProtectedRoute({ children, permission, minRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50" role="status" aria-label="Loading">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-brand-600" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (permission && !can(user.role, permission)) {
    return <AccessDenied />;
  }
  if (minRole && !hasMinRole(user.role, minRole)) {
    return <AccessDenied />;
  }
  return children;
}
