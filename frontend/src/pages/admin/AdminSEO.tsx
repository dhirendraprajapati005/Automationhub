import { useEffect, useState, type FormEvent } from "react";
import { fetchSettings, updateSettings, type SiteSettings } from "@/lib/settings-api";

export const AdminSEO = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => setError("Couldn't load settings."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Couldn't save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="text-ink-400">Loading settings...</p>;
  if (!settings) return <p className="text-red-400">{error || "Couldn't load settings."}</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">SEO Settings</h1>
      <p className="mt-1 text-sm text-ink-400">
        Site-wide defaults used as fallbacks for meta tags and search indexing. Individual pages
        (lessons, machines, posts) still set their own specific title/description via the site's{" "}
        <code className="font-mono text-xs">useSEO</code> hook — these are the site-wide defaults and controls.
      </p>

      {error && <p className="mt-4 text-red-400">{error}</p>}
      {saved && <p className="mt-4 text-signal-500">Settings saved.</p>}

      <form onSubmit={handleSubmit} className="panel-card mt-6 space-y-4">
        <div>
          <label className="text-sm text-ink-200">Site name</label>
          <input
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-ink-200">Default meta description</label>
          <textarea
            rows={3}
            maxLength={300}
            value={settings.defaultMetaDescription}
            onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink-400">{settings.defaultMetaDescription.length}/300</p>
        </div>

        <div>
          <label className="text-sm text-ink-200">Default Open Graph image URL</label>
          <input
            value={settings.defaultOgImageUrl}
            onChange={(e) => setSettings({ ...settings, defaultOgImageUrl: e.target.value })}
            placeholder="https://..."
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-ink-200">Twitter handle</label>
            <input
              value={settings.twitterHandle}
              onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
              placeholder="@automationhub"
              className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-ink-200">Google Search Console verification code</label>
            <input
              value={settings.googleSiteVerification}
              onChange={(e) => setSettings({ ...settings, googleSiteVerification: e.target.value })}
              className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allowSearchIndexing"
            checked={settings.allowSearchIndexing}
            onChange={(e) => setSettings({ ...settings, allowSearchIndexing: e.target.checked })}
          />
          <label htmlFor="allowSearchIndexing" className="text-sm text-ink-200">
            Allow search engines to index this site
          </label>
        </div>
        {!settings.allowSearchIndexing && (
          <p className="rounded-[var(--radius-panel)] border border-signal-500/40 bg-signal-500/10 px-3 py-2 text-xs text-signal-500">
            Indexing is OFF — a sitewide "noindex" tag will be sent. Use this for a staging deployment only.
          </p>
        )}

        <button type="submit" disabled={isSaving} className="btn-primary">
          {isSaving ? "Saving..." : "Save settings"}
        </button>
      </form>
    </div>
  );
};
