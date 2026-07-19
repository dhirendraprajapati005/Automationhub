import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Sun, Moon, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const primaryLinks = [
  { to: "/learn", label: "Learn" },
  { to: "/machine-library", label: "Machine Library" },
  { to: "/calculators", label: "Calculators" },
  { to: "/downloads", label: "Downloads" },
  { to: "/community", label: "Community" },
  { to: "/news", label: "News" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-signal-500" : "text-ink-200 hover:text-ink-50"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-panel-700 bg-panel-950/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <Zap className="h-5 w-5 text-signal-500" strokeWidth={2.5} />
          AutomationHub
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="rounded-[var(--radius-panel)] border border-panel-700 p-2 text-ink-200 hover:text-signal-500"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Link to="/admin" className="text-sm font-medium text-signal-500 hover:text-signal-400">
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="text-sm font-medium text-ink-200 hover:text-ink-50">
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={() => logout()} className="btn-secondary py-1.5 px-3 text-sm">
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-200 hover:text-ink-50">
                Log in
              </Link>
              <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">
                Sign up free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen((v) => !v)} aria-label="Toggle menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-panel-700 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {primaryLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setIsOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <div className="flex items-center gap-3 pt-2">
              {user ? (
                <button onClick={() => logout()} className="btn-secondary flex-1 text-sm">
                  Log out
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary flex-1 text-center text-sm">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary flex-1 text-center text-sm">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
