import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Post, PostType } from "@/types/post";
import { fetchPost } from "@/lib/post-api";
import { useSEO } from "@/hooks/useSEO";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface Props {
  type: PostType;
  basePath: string;
}

export const PostDetailPage = ({ type, basePath }: Props) => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    window.scrollTo(0, 0);
    fetchPost(type, slug)
      .then(setPost)
      .catch(() => setError("This post couldn't be found."))
      .finally(() => setIsLoading(false));
  }, [type, slug]);

  const sectionLabel = type === "blog" ? "Blog" : "News";
  const breadcrumbItems = [
    { name: sectionLabel, path: basePath },
    { name: post?.title ?? "Post", path: `${basePath}/${slug}` },
  ];

  useSEO({
    title: post ? post.title : sectionLabel,
    description: post?.excerpt ?? `A free AutomationHub ${sectionLabel.toLowerCase()} post.`,
    path: `${basePath}/${slug}`,
    type: "article",
    structuredData: post
      ? [
          buildArticleSchema({
            headline: post.title,
            description: post.excerpt,
            path: `${basePath}/${slug}`,
            datePublished: post.publishedAt,
            authorName: post.authorName,
          }),
          buildBreadcrumbSchema(breadcrumbItems),
        ]
      : undefined,
  });

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-20 text-ink-400">Loading...</div>;

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-red-400">{error || "Post not found."}</p>
        <Link to={basePath} className="mt-4 inline-block text-signal-500 hover:text-signal-400">
          &larr; Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbItems} />

      <Link to={basePath} className="text-sm text-ink-400 hover:text-signal-500">
        &larr; Back
      </Link>
      <p className="mt-4 text-xs text-ink-400">
        {new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        {" · "}
        {post.authorName}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>

      <div className="lesson-content mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};
