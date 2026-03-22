import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      data-dark={dark ? "true" : "false"}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Use light mode" : "Use dark mode"}
      onClick={toggleTheme}
    >
      <span className="theme-toggle__track" aria-hidden>
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}
