import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  path: string;
}

export const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
    {items.map((item, i) => (
      <span key={item.path} className="flex items-center gap-1.5">
        {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
        {i === items.length - 1 ? (
          <span className="text-ink-200">{item.name}</span>
        ) : (
          <Link to={item.path} className="hover:text-signal-500 transition-colors">
            {item.name}
          </Link>
        )}
      </span>
    ))}
  </nav>
);
