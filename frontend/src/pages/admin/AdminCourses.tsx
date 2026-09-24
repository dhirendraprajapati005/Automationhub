import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { StatusLED } from "@/components/ui/StatusLED";
import {
  fetchAllLessonsAdmin,
  fetchLessonByIdAdmin,
  createLesson,
  updateLesson,
  deleteLesson,
  type AdminLesson,
  type TrackMeta,
} from "@/lib/course-api";

const emptyForm: {
  track: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  order: number;
  tags: string;
  isPublished: boolean;
} = {
  track: "",
  slug: "",
  title: "",
  summary: "",
  content: "",
  difficulty: "beginner",
  estimatedMinutes: 10,
  order: 0,
  tags: "",
  isPublished: true,
};

export const AdminCourses = () => {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [tracks, setTracks] = useState<TrackMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setIsLoading(true);
    fetchAllLessonsAdmin()
      .then((data) => {
        setLessons(data.lessons);
        setTracks(data.tracks);
      })
      .catch(() => setError("Couldn't load lessons."))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm, track: tracks[0]?.slug || "" });
    setShowForm(true);
  };

  const openEdit = async (id: string) => {
    setError(null);
    try {
      const lesson = await fetchLessonByIdAdmin(id);
      setEditingId(id);
      setForm({
        track: lesson.track,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        content: lesson.content || "",
        difficulty: lesson.difficulty,
        estimatedMinutes: lesson.estimatedMinutes,
        order: lesson.order,
        tags: (lesson.tags || []).join(", "),
        isPublished: lesson.isPublished,
      });
      setShowForm(true);
    } catch {
      setError("Couldn't load this lesson.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateLesson(editingId, form);
      } else {
        await createLesson(form);
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't save lesson.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lesson permanently?")) return;
    await deleteLesson(id);
    setLessons((prev) => prev.filter((l) => l._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Course Management</h1>
          <p className="mt-1 text-sm text-ink-400">Create, edit, and manage lessons directly — no seed script needed.</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" /> New lesson
        </button>
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
              {editingId ? "Edit lesson" : "New lesson"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-ink-400 hover:text-ink-50">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-ink-200">Track</label>
              <select
                required
                value={form.track}
                onChange={(e) => setForm({ ...form, track: e.target.value })}
                className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none"
              >
                {tracks.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-ink-200">Slug</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-sm text-ink-200">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
          </div>

          <div>
            <label className="text-sm text-ink-200">Summary</label>
            <textarea required rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
          </div>

          <div>
            <label className="text-sm text-ink-200">Content (Markdown)</label>
            <textarea required rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 font-mono text-sm focus:border-signal-500 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="text-sm text-ink-200">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-ink-200">Minutes</label>
              <input type="number" min={1} value={form.estimatedMinutes} onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-ink-200">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
            </div>
            <div className="flex items-end gap-2 pb-2">
              <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
              <label htmlFor="isPublished" className="text-sm text-ink-200">Published</label>
            </div>
          </div>

          <div>
            <label className="text-sm text-ink-200">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
          </div>

          <button type="submit" disabled={isSaving} className="btn-primary">
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create lesson"}
          </button>
        </form>
      )}

      {isLoading && <p className="mt-6 text-ink-400">Loading lessons...</p>}

      <div className="mt-6 space-y-2">
        {lessons.map((lesson) => (
          <div key={lesson._id} className="panel-card flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold">{lesson.title}</p>
              <p className="text-xs text-ink-400">{lesson.track}/{lesson.slug} · {lesson.difficulty}</p>
              <StatusLED status={lesson.isPublished ? "on" : "off"} label={lesson.isPublished ? "Published" : "Draft"} className="mt-1 text-ink-400" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(lesson._id)} className="rounded-[var(--radius-panel)] border border-panel-700 p-2 text-ink-400 hover:border-signal-500 hover:text-signal-500" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(lesson._id)} className="rounded-[var(--radius-panel)] border border-panel-700 p-2 text-red-400 hover:border-red-800 hover:bg-red-950/30" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
