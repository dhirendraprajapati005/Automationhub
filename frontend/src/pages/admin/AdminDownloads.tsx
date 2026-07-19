import { useEffect, useState, type FormEvent } from "react";
import { Trash2, Upload } from "lucide-react";
import { fetchDownloads, uploadDownload, deleteDownload as deleteDownloadApi } from "@/lib/download-api";
import type { DownloadItem } from "@/types/download";

const CATEGORIES = [
  "PLC Programs",
  "HMI Projects",
  "CAD Drawings",
  "Electrical Schematics",
  "Wiring Diagrams",
  "Sample Projects",
  "PDF Manuals",
];

export const AdminDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);

  const load = () => {
    setIsLoading(true);
    fetchDownloads()
      .then((data) => setDownloads(data.downloads))
      .catch(() => setError("Couldn't load downloads."))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("file", file);
      await uploadDownload(formData);
      setTitle("");
      setDescription("");
      setFile(null);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this download permanently? This also removes the file from storage.")) return;
    try {
      await deleteDownloadApi(id);
      setDownloads((prev) => prev.filter((d) => d._id !== id));
    } catch {
      setError("Couldn't delete this download.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Downloads</h1>
      <p className="mt-1 text-sm text-ink-400">Upload and manage files in the Download Center.</p>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      <form onSubmit={handleUpload} className="panel-card mt-6 space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">Upload new file</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-ink-200">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-ink-200">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm text-ink-200">Description</label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-ink-200">File</label>
          <input
            type="file"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-ink-400 file:mr-3 file:rounded-[var(--radius-panel)] file:border file:border-panel-600 file:bg-panel-900 file:px-3 file:py-1.5 file:text-sm file:text-ink-50"
          />
          <p className="mt-1 text-xs text-ink-400">PDF, ZIP, DWG, DXF, GXW, HMI, DOP, DOC(X), XLS(X) — up to 50MB.</p>
        </div>
        <button type="submit" disabled={isUploading} className="btn-primary">
          <Upload className="h-4 w-4" /> {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {isLoading && <p className="mt-6 text-ink-400">Loading downloads...</p>}

      <div className="mt-6 space-y-2">
        {downloads.map((item) => (
          <div key={item._id} className="panel-card flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-ink-400">
                {item.category} · {item.originalFileName} · {item.downloadCount} downloads
              </p>
            </div>
            <button
              onClick={() => handleDelete(item._id)}
              className="rounded-[var(--radius-panel)] border border-panel-700 p-2 text-red-400 hover:border-red-800 hover:bg-red-950/30"
              aria-label={`Delete ${item.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
