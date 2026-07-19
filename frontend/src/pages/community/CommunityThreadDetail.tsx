import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Eye, UserPlus, UserMinus, Trash2 } from "lucide-react";
import {
  fetchThread,
  addComment,
  toggleThreadLike,
  toggleFollow,
  deleteThread,
  deleteComment,
  communityImageUrl,
} from "@/lib/community-api";
import { useAuth } from "@/context/AuthContext";
import { useSEO } from "@/hooks/useSEO";
import type { ThreadDetail, Comment } from "@/types/community";

export const CommunityThreadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  useSEO({
    title: thread ? thread.title : "Community Post",
    description: thread ? thread.body.slice(0, 160) : "A community post on AutomationHub.",
    path: `/community/${id}`,
  });
  const load = () => {
    if (!id) return;
    setIsLoading(true);
    fetchThread(id)
      .then((data) => {
        setThread(data.thread);
        setComments(data.comments);
      })
      .catch(() => setError("This post couldn't be found."))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [id]);

  const handleLike = async () => {
    if (!thread || !user) return;
    const result = await toggleThreadLike(thread._id);
    setThread({ ...thread, likedBy: result.liked ? [...thread.likedBy, user.id] : thread.likedBy.filter((i) => i !== user.id) });
  };

  const handleFollow = async () => {
    if (!thread) return;
    const result = await toggleFollow(thread.author._id);
    setIsFollowing(result.following);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !commentBody.trim()) return;
    const comment = await addComment(thread._id, commentBody);
    setComments((prev) => [...prev, comment]);
    setCommentBody("");
  };

  const handleDeleteThread = async () => {
    if (!thread || !confirm("Delete this post and all its comments?")) return;
    await deleteThread(thread._id);
    window.location.href = "/community";
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-20 text-ink-400">Loading...</div>;

  if (error || !thread) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-red-400">{error || "Post not found."}</p>
        <Link to="/community" className="mt-4 inline-block text-signal-500 hover:text-signal-400">
          &larr; Back to community
        </Link>
      </div>
    );
  }

  const canModerate = user && (user.role === "admin" || user.role === "moderator");
  const liked = user ? thread.likedBy.includes(user.id) : false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link to="/community" className="text-sm text-ink-400 hover:text-signal-500">
        &larr; Community
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-ink-400">
          <span className={thread.type === "question" ? "text-circuit-400" : "text-signal-500"}>
            {thread.type === "question" ? "Question" : "Project"}
          </span>
          <span>·</span>
          <span>{thread.author.name}</span>
          <span>({thread.author.reputationPoints} rep)</span>
        </div>
        {canModerate && (
          <button onClick={handleDeleteThread} className="text-red-400 hover:text-red-300" aria-label="Delete post">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{thread.title}</h1>
      <p className="mt-4 whitespace-pre-wrap text-ink-200">{thread.body}</p>

      {thread.images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {thread.images.map((img) => (
            <img key={img} src={communityImageUrl(img)} alt="" loading="lazy" decoding="async" className="rounded-[var(--radius-panel)] border border-panel-700" />
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={!user}
          className={liked ? "btn-primary py-1.5 px-3 text-sm" : "btn-secondary py-1.5 px-3 text-sm"}
        >
          <Heart className="h-3.5 w-3.5" /> {thread.likedBy.length}
        </button>
        <span className="flex items-center gap-1 text-xs text-ink-400">
          <Eye className="h-3.5 w-3.5" /> {thread.viewCount} views
        </span>
        {user && user.id !== thread.author._id && (
          <button onClick={handleFollow} className="btn-secondary py-1.5 px-3 text-sm">
            {isFollowing ? <UserMinus className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
            {isFollowing ? "Following" : `Follow ${thread.author.name.split(" ")[0]}`}
          </button>
        )}
      </div>

      <div className="mt-10 border-t border-panel-700 pt-8">
        <h2 className="font-display text-lg font-semibold">{comments.length} comments</h2>

        <div className="mt-4 space-y-4">
          {comments.map((c) => (
            <div key={c._id} className="panel-card">
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-400">
                  {c.author.name} · {new Date(c.createdAt).toLocaleDateString()}
                </p>
                {canModerate && (
                  <button onClick={() => handleDeleteComment(c._id)} className="text-red-400 hover:text-red-300" aria-label="Delete comment">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink-200">{c.body}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={handleComment} className="mt-6">
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              rows={3}
              placeholder="Add a comment..."
              className="w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
            />
            <button type="submit" className="btn-primary mt-2">
              Post comment
            </button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-ink-400">
            <Link to="/login" className="text-signal-500 hover:text-signal-400">
              Log in
            </Link>{" "}
            to comment.
          </p>
        )}
      </div>
    </div>
  );
};
