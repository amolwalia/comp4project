import { createContext, useContext, useLayoutEffect, useState } from "react";

const STORAGE_KEY = "wishlist-theme";

const ThemeContext = createContext(null);

function readStoredTheme() {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.localStorage.getItem(STORAGE_KEY) === "dark"
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
