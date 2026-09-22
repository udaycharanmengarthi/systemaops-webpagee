import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../theme/theme-context";
import "./ThemeToggle.css";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={
        isLight
          ? "Switch to dark theme"
          : "Switch to light theme"
      }
      aria-pressed={!isLight}
      title={
        isLight
          ? "Switch to dark theme"
          : "Switch to light theme"
      }
    >
      {isLight ? (
        <Moon size={16} aria-hidden="true" />
      ) : (
        <Sun size={16} aria-hidden="true" />
      )}
    </button>
  );
}
