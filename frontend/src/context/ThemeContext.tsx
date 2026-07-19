import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("ah-theme") as Theme | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("ah-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
