import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";

import { fetchNewsById, likeDislikeNews, dislikeNews, postNewsComment, deleteNewsComment } from "../../../api/news/news-api";
import { BackLink, Button, Card, EmptyState, PageHeader, StatusPill } from "../../../components/ui";
import CommentsPanel from "../content/CommentsPanel";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useAppContext } from "../../../context/authContext";
import { formatCardDateTime, isPast } from "../../../utils/dates";
import { commentCount, contentAuthor, contentBanner, dislikeCount, hasDisliked, hasLiked, likeCount, newsBody, newsTitle } from "../content/contentFields";
import { RichText } from "../../../utils/richText";

const NewsDetailPage = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();

  const memberId = String((user as any)?._id ?? user?.id ?? "");

  /**
   * One request, not two. `GET /api/content/news/:id` returns the article **with its
   * comments already populated** (`comments.userId` → name/email/imageUrl), and there is no
   * `GET /news/:id/comments` route on this backend — only POST/PUT/DELETE. The page this
   * replaced also pulled the whole news list and searched it client-side.
   */
  const { data: item, isLoading, isError } = useQuery(["news", newsId], () => fetchNewsById(newsId as string), { enabled: !!newsId });

  const comments = useMemo(() => (Array.isArray(item?.comments) ? item.comments : []), [item]);

  const invalidate = () => {
    queryClient.invalidateQueries(["news", newsId]);
    queryClient.invalidateQueries("news");
  };

  const likeMutation = useMutation(() => likeDislikeNews(newsId as string), {
    onSuccess: invalidate,
    onError: () => {
      notifyUser("Failed to toggle like", "error");
    },
  });

  const dislikeMutation = useMutation(() => dislikeNews(newsId as string), {
    onSuccess: invalidate,
    onError: () => {
      notifyUser("Failed to toggle dislike", "error");
    },
  });

  const commentMutation = useMutation((content: string) => postNewsComment(content, newsId as string), {
    onSuccess: invalidate,
    onError: () => {
      notifyUser("Could not post your comment", "error");
    },
  });

  const deleteCommentMutation = useMutation((commentId: string) => deleteNewsComment(newsId as string, commentId), {
    onSuccess: invalidate,
    onError: () => {
      notifyUser("Could not delete the comment", "error");
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 grid place-items-center">
        <CircleLoader />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <>
        <BackLink to="/news" label="Go back" />
        <PageHeader title="News Details" />
        <EmptyState icon={HiOutlineNewspaper} title="Article not found" description="It may have been removed." action={<Button onClick={() => navigate("/news")}>Back to news</Button>} />
      </>
    );
  }

  const isRecent = !isPast(new Date(new Date(item.createdAt ?? 0).getTime() + 30 * 24 * 60 * 60 * 1000));
  const liked = hasLiked(item, memberId);
  const disliked = hasDisliked(item, memberId);

  return (
    <>
      <BackLink to="/news" label="Go back" />
      <PageHeader title="News Details" subtitle="See the details of Latest News here..." />

      <div className="max-w-4xl flex flex-col gap-6">
        <div>
          <h2 className="text-[22px] font-semibold text-org-primary">{newsTitle(item)}</h2>
          <p className="text-sm text-muted mt-1">Date Posted: {formatCardDateTime(item.createdAt)}</p>
        </div>

        {contentBanner(item) && (
          <div className="relative rounded-xl overflow-hidden">
            <img src={contentBanner(item)} alt="" className="w-full max-h-[420px] object-cover" />
            {isRecent && <StatusPill label="New" tone="brand" className="!rounded-none absolute top-0 right-0 !px-4 !py-1.5" />}
          </div>
        )}

        {/* Editor HTML — sanitised and styled, not printed as text. */}
        <RichText html={newsBody(item)} />

        {Array.isArray(item.attachmentUrls) && item.attachmentUrls.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {item.attachmentUrls.map((url: string, index: number) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" download className="text-sm text-org-primary underline">
                Attachment {index + 1}
              </a>
            ))}
          </div>
        )}

        {/* Like / dislike + author */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isLoading}
              aria-pressed={liked}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${liked ? "bg-org-primary text-white" : "bg-org-tint text-org-primary hover:bg-org-tint-strong"}`}
            >
              <FiThumbsUp className="w-4 h-4" />
              {likeCount(item)}
            </button>
            <button
              type="button"
              onClick={() => dislikeMutation.mutate()}
              disabled={dislikeMutation.isLoading}
              aria-pressed={disliked}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${disliked ? "bg-status-danger text-white" : "bg-status-neutral-bg text-muted hover:bg-hairline"}`}
            >
              <FiThumbsDown className="w-4 h-4" />
              {dislikeCount(item)}
            </button>
            <span className="text-sm text-muted">Like this news</span>
          </div>

          <p className="text-sm text-ink">
            Author: <span className="text-org-primary font-medium">{contentAuthor(item)}</span>
          </p>
        </div>

        <CommentsPanel
          comments={comments}
          currentMemberId={memberId}
          submitting={commentMutation.isLoading}
          onSubmit={content => commentMutation.mutate(content)}
          onDelete={commentId => deleteCommentMutation.mutate(commentId)}
        />

        {commentCount(item) > 0 && <p className="sr-only">{commentCount(item)} comments</p>}
      </div>
    </>
  );
};

export default NewsDetailPage;
