import { useEffect, useState, type FormEvent } from "react";
import { Trash2, Plus } from "lucide-react";
import { fetchAllPostsAdmin, createPost, deletePost } from "@/lib/post-api";
import type { Post, PostType } from "@/types/post";

interface Props {
  type: PostType;
  label: string;
}

export const AdminPosts = ({ type, label }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const load = () => {
    setIsLoading(true);
    fetchAllPostsAdmin(type)
      .then(setPosts)
      .catch(() => setError(`Couldn't load ${label.toLowerCase()} posts.`))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [type]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      await createPost(type, { title, slug, excerpt, content, tags, isPublished: true });
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setTags("");
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't create post.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(type, id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">{label} Management</h1>
      <p className="mt-1 text-sm text-ink-400">Create and manage {label.toLowerCase()} posts.</p>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      <form onSubmit={handleCreate} className="panel-card mt-6 space-y-4">
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
          <Plus className="h-4 w-4" /> New {label.toLowerCase()} post
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-ink-200">Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-ink-200">Slug</label>
            <input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-friendly-slug" className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-sm text-ink-200">Excerpt</label>
          <textarea required rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
        </div>
        <div>
          <label className="text-sm text-ink-200">Content (Markdown)</label>
          <textarea required rows={8} value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 font-mono text-sm focus:border-signal-500 focus:outline-none" />
        </div>
        <div>
          <label className="text-sm text-ink-200">Tags (comma-separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2 text-sm focus:border-signal-500 focus:outline-none" />
        </div>
        <button type="submit" disabled={isCreating} className="btn-primary">
          {isCreating ? "Publishing..." : "Publish"}
        </button>
      </form>

      {isLoading && <p className="mt-6 text-ink-400">Loading posts...</p>}

      <div className="mt-6 space-y-2">
        {posts.map((post) => (
          <div key={post._id} className="panel-card flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold">{post.title}</p>
              <p className="text-xs text-ink-400">/{type}/{post.slug} · {post.isPublished ? "Published" : "Draft"}</p>
            </div>
            <button onClick={() => handleDelete(post._id)} className="rounded-[var(--radius-panel)] border border-panel-700 p-2 text-red-400 hover:border-red-800 hover:bg-red-950/30" aria-label={`Delete ${post.title}`}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
