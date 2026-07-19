import { useEffect, useState } from "react";
import { Download as DownloadIcon, FileText } from "lucide-react";
import { fetchDownloads, downloadFileUrl } from "@/lib/download-api";
import { useSEO } from "@/hooks/useSEO";
import type { DownloadItem } from "@/types/download";

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const Downloads = () => {
  useSEO({
    title: "Download Center — Free PLC Programs, HMI Projects & Schematics",
    description: "Free downloads: PLC programs, HMI projects, CAD drawings, electrical schematics, wiring diagrams, sample projects, and PDF manuals. No sign-up required.",
    path: "/downloads",
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchDownloads(activeCategory ?? undefined)
      .then((data) => {
        setDownloads(data.downloads);
        setCategories(data.categories);
      })
      .catch(() => setError("Couldn't load the download center. Is the API running?"))
      .finally(() => setIsLoading(false));
  }, [activeCategory]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Download Center</p>
      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">PLC programs, HMI projects, and schematics</h1>
      <p className="mt-3 max-w-2xl text-ink-400">
        Free downloads — PLC programs, HMI projects, CAD drawings, electrical schematics, wiring diagrams,
        sample projects, and manuals. No sign-up required.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={activeCategory === null ? "btn-primary py-1.5 px-3 text-xs" : "btn-secondary py-1.5 px-3 text-xs"}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? "btn-primary py-1.5 px-3 text-xs" : "btn-secondary py-1.5 px-3 text-xs"}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading && <p className="mt-10 text-ink-400">Loading downloads...</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}
      {!isLoading && !error && downloads.length === 0 && (
        <p className="mt-10 text-ink-400">No downloads in this category yet — check back soon.</p>
      )}

      <div className="mt-8 space-y-3">
        {downloads.map((item) => (
          <div key={item._id} className="panel-card flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-signal-500" />
              <div>
                <h3 className="font-display font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-ink-400">{item.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-400">
                  <span className="font-mono uppercase">{item.fileExtension}</span>
                  <span>{formatBytes(item.fileSizeBytes)}</span>
                  <span>{item.downloadCount} downloads</span>
                  <span className="rounded-[var(--radius-panel)] border border-panel-700 px-2 py-0.5">{item.category}</span>
                </div>
              </div>
            </div>
            <a
              href={downloadFileUrl(item._id)}
              className="btn-secondary shrink-0 py-1.5 px-3 text-xs"
              download
            >
              <DownloadIcon className="h-3.5 w-3.5" /> Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
