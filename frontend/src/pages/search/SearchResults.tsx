import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { search, type SearchResult } from "@/lib/search-api";
import { useSEO } from "@/hooks/useSEO";

const typeColor: Record<string, string> = {
  Lesson: "text-circuit-400",
  Machine: "text-signal-500",
  Blog: "text-ink-400",
  News: "text-ink-400",
  "Wiring Diagram": "text-circuit-400",
  "Fault Finder": "text-signal-500",
};

export const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [input, setInput] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: query ? `Search: ${query}` : "Search",
    description: "Search lessons, machines, wiring diagrams, fault finder entries, and articles across AutomationHub.",
    path: `/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
  });

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    search(query)
      .then(setResults)
      .catch(() => setError("Search failed. Is the API running?"))
      .finally(() => setIsLoading(false));
  }, [query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(input ? { q: input } : {});
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Search</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Search AutomationHub</h1>

      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search PLC, HMI, VFD, wiring, faults..."
            className="w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 py-2.5 pl-9 pr-3 text-sm focus:border-signal-500 focus:outline-none"
          />
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {isLoading && <p className="mt-8 text-ink-400">Searching...</p>}
      {error && <p className="mt-8 text-red-400">{error}</p>}
      {!isLoading && query && query.length >= 2 && results.length === 0 && (
        <p className="mt-8 text-ink-400">No results for "{query}".</p>
      )}

      <div className="mt-8 space-y-3">
        {results.map((r, i) => (
          <Link key={i} to={r.path} className="panel-card block hover:border-signal-500/50 transition-colors">
            <span className={`font-mono text-xs ${typeColor[r.type] || "text-ink-400"}`}>{r.type}</span>
            <h3 className="mt-1 font-display font-semibold">{r.title}</h3>
            <p className="mt-1 text-sm text-ink-400 line-clamp-2">{r.snippet}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
