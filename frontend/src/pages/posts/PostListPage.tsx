import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PostSummary, PostType } from "@/types/post";
import { fetchPosts } from "@/lib/post-api";
import { useSEO } from "@/hooks/useSEO";

interface Props {
  type: PostType;
  title: string;
  description: string;
  basePath: string; // "/blog" or "/news"
}

export const PostListPage = ({ type, title, description, basePath }: Props) => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({ title, description, path: basePath });

  useEffect(() => {
    fetchPosts(type)
      .then(setPosts)
      .catch(() => setError("Couldn't load posts. Is the API running?"))
      .finally(() => setIsLoading(false));
  }, [type]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-500">{type === "blog" ? "Blog" : "News"}</p>
      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-ink-400">{description}</p>

      {isLoading && <p className="mt-10 text-ink-400">Loading...</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}
      {!isLoading && !error && posts.length === 0 && <p className="mt-10 text-ink-400">Nothing published yet.</p>}

      <div className="mt-10 space-y-4">
        {posts.map((post) => (
          <Link key={post.slug} to={`${basePath}/${post.slug}`} className="panel-card block hover:border-signal-500/50 transition-colors">
            <p className="text-xs text-ink-400">
              {new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              {" · "}
              {post.authorName}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-ink-400">{post.excerpt}</p>
            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-[var(--radius-panel)] border border-panel-700 px-2 py-0.5 font-mono text-xs text-ink-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};
