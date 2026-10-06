import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Contacts from "./pages/Contacts.jsx";
import ContactDetails from "./pages/ContactDetails.jsx";
import Careers from "./pages/Careers.jsx";
import CareerDetails from "./pages/CareerDetails.jsx";
import Activity from "./pages/Activity.jsx";
import Notifications from "./pages/Notifications.jsx";
import Users from "./pages/Users.jsx";
import Settings from "./pages/Settings.jsx";
import SettingsProfile from "./pages/SettingsProfile.jsx";
import SettingsSecurity from "./pages/SettingsSecurity.jsx";
import SettingsTeam from "./pages/SettingsTeam.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="contacts/:id" element={<ContactDetails />} />
        <Route path="careers" element={<Careers />} />
        <Route path="careers/:id" element={<CareerDetails />} />
        <Route
          path="activity"
          element={
            <ProtectedRoute permission="VIEW_ACTIVITY">
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route path="notifications" element={<Notifications />} />
        <Route
          path="users"
          element={
            <ProtectedRoute permission="VIEW_USERS">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="settings" element={<Settings />}>
          <Route index element={<Navigate to="/settings/profile" replace />} />
          <Route path="profile" element={<SettingsProfile />} />
          <Route path="security" element={<SettingsSecurity />} />
          <Route
            path="team"
            element={
              <ProtectedRoute permission="VIEW_TEAM_SETTINGS">
                <SettingsTeam />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
