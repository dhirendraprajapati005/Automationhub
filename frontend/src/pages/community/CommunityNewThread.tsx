import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createThread } from "@/lib/community-api";

export const CommunityNewThread = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<"question" | "project">("question");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("title", title);
      formData.append("body", body);
      formData.append("tags", tags);
      if (images) {
        Array.from(images)
          .slice(0, 4)
          .forEach((file) => formData.append("images", file));
      }
      const thread = await createThread(formData);
      navigate(`/community/${thread._id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't post — try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-bold">New post</h1>
      <p className="mt-1 text-sm text-ink-400">Ask a question or share a project with the community.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="rounded-[var(--radius-panel)] border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          {(["question", "project"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={type === t ? "btn-primary py-1.5 px-4 text-sm" : "btn-secondary py-1.5 px-4 text-sm"}
            >
              {t === "question" ? "Question" : "Project"}
            </button>
          ))}
        </div>

        <div>
          <label className="text-sm text-ink-200">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-ink-200">{type === "question" ? "Details" : "Description"}</label>
          <textarea
            required
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-ink-200">Tags (comma-separated)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="PLC, Delta, ladder-logic"
            className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-ink-200">Images (optional, up to 4)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="mt-1 block w-full text-sm text-ink-400 file:mr-3 file:rounded-[var(--radius-panel)] file:border file:border-panel-600 file:bg-panel-900 file:px-3 file:py-1.5 file:text-sm file:text-ink-50"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};
