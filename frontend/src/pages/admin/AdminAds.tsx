import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2, Pencil, X, Eye, MousePointerClick } from "lucide-react";
import { fetchAllAdsAdmin, createAd, updateAd, deleteAd, AD_PLACEMENTS, type Ad } from "@/lib/ad-api";
import { StatusLED } from "@/components/ui/StatusLED";

const emptyForm: {
  placement: (typeof AD_PLACEMENTS)[number];
  title: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  sponsorName: string;
  isActive: boolean;
} = {
  placement: AD_PLACEMENTS[0],
  title: "",
  imageUrl: "",
  linkUrl: "",
  altText: "",
  sponsorName: "",
  isActive: true,
};

const placementLabels: Record<string, string> = {
  "homepage-banner": "Homepage Banner",
  sidebar: "Sidebar",
  "in-content": "In-Content",
  footer: "Footer",
};

export const AdminAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  const load = () => {
    setIsLoading(true);
    fetchAllAdsAdmin()
      .then(setAds)
      .catch(() => setError("Couldn't load ads."))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (ad: Ad) => {
    setEditingId(ad._id);
    setForm({
      placement: ad.placement,
      title: ad.title,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      altText: ad.altText,
      sponsorName: ad.sponsorName,
      isActive: ad.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateAd(editingId, form);
      } else {
        await createAd(form);
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't save ad.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this ad permanently?")) return;
    await deleteAd(id);
    setAds((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Advertisement Management</h1>
          <p className="mt-1 text-sm text-ink-400">
            Manage ad placements. If several ads are active for the same placement, one is shown at random per
            page load so they rotate.
          </p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" /> New ad
        </button>
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
              {editingId ? "Edit ad" : "New ad"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-ink-400 hover:text-ink-50">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-ink-200">Placement</label>
              <select
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value as any })}
                className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
              >
                {AD_PLACEMENTS.map((p) => (
                  <option key={p} value={p}>{placementLabels[p]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-ink-200">Title (internal reference)</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-sm text-ink-200">Image URL</label>
            <input required value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
          </div>

          <div>
            <label className="text-sm text-ink-200">Link URL (where clicking the ad goes)</label>
            <input required value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://..." className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-ink-200">Alt text</label>
              <input value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-ink-200">Sponsor name</label>
              <input value={form.sponsorName} onChange={(e) => setForm({ ...form, sponsorName: e.target.value })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <label htmlFor="isActive" className="text-sm text-ink-200">Active</label>
          </div>

          <button type="submit" disabled={isSaving} className="btn-primary">
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create ad"}
          </button>
        </form>
      )}

      {isLoading && <p className="mt-6 text-ink-400">Loading ads...</p>}

      <div className="mt-6 space-y-2">
        {ads.map((ad) => (
          <div key={ad._id} className="panel-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img src={ad.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{ad.title}</p>
                <p className="text-xs text-ink-400">
                  {placementLabels[ad.placement]}
                  {ad.sponsorName && ` · ${ad.sponsorName}`}
                </p>
                <StatusLED status={ad.isActive ? "on" : "off"} label={ad.isActive ? "Active" : "Inactive"} className="mt-1 text-ink-400" />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="flex items-center gap-1 text-xs text-ink-400">
                <Eye className="h-3.5 w-3.5" /> {ad.impressionCount || 0}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-400">
                <MousePointerClick className="h-3.5 w-3.5" /> {ad.clickCount || 0}
              </span>
              <button onClick={() => openEdit(ad)} className="rounded-[var(--radius-panel)] border border-panel-700 p-2 text-ink-400 hover:border-signal-500 hover:text-signal-500" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(ad._id)} className="rounded-[var(--radius-panel)] border border-panel-700 p-2 text-red-400 hover:border-red-800 hover:bg-red-950/30" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {!isLoading && ads.length === 0 && <p className="text-ink-400">No ads yet.</p>}
      </div>
    </div>
  );
};
