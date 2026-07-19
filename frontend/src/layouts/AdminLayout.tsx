import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Download,
  Newspaper,
  MessageSquare,
  BarChart3,
  Search,
  Megaphone,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/downloads", label: "Downloads", icon: Download },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/community", label: "Community Moderation", icon: MessageSquare },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/seo", label: "SEO Settings", icon: Search },
  { to: "/admin/ads", label: "Advertisement", icon: Megaphone },
];

export const AdminLayout = () => (
  <div className="mx-auto flex max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
    <aside className="hidden w-56 shrink-0 lg:block">
      <p className="mb-3 px-3 font-mono text-xs uppercase tracking-widest text-signal-500">Admin Panel</p>
      <nav className="space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-[var(--radius-panel)] px-3 py-2 text-sm transition-colors ${
                isActive ? "bg-panel-800 text-signal-500" : "text-ink-400 hover:bg-panel-900 hover:text-ink-50"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>

    <div className="min-w-0 flex-1">
      <Outlet />
    </div>
  </div>
);
