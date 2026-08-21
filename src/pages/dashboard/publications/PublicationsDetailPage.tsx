import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FiBookOpen, FiThumbsUp, FiDownload } from "react-icons/fi";

import { fetchPublicationById, fetchPublicationsComments, postPublicationComment, deletePublicationComment, togglePublicationLike } from "../../../api/publications/publications-api";
import { BackLink, Button, EmptyState, PageHeader, StatusPill } from "../../../components/ui";
import CommentsPanel from "../content/CommentsPanel";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useAppContext } from "../../../context/authContext";
import { formatCardDateTime, isPast } from "../../../utils/dates";
import { contentAuthor, contentBanner, hasLiked, likeCount, publicationBody, publicationTitle } from "../content/contentFields";
import { RichText } from "../../../utils/richText";

const PublicationsDetailPage = () => {
  const { publicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();

  const memberId = String((user as any)?._id ?? user?.id ?? "");

  const { data: item, isLoading, isError } = useQuery(["publication", publicationId], () => fetchPublicationById(publicationId as string), { enabled: !!publicationId });

  /**
   * Publications, unlike news, **do** have a `GET /publication/:id/comments` route, so the
   * comment list is its own query and can be refetched without re-pulling the article.
   */
  const { data: comments = [] } = useQuery(["publicationComments", publicationId], () => fetchPublicationsComments(publicationId as string), { enabled: !!publicationId });

  const invalidate = () => {
    queryClient.invalidateQueries(["publication", publicationId]);
    queryClient.invalidateQueries(["publicationComments", publicationId]);
    queryClient.invalidateQueries("publications");
  };

  const likeMutation = useMutation(() => togglePublicationLike(publicationId as string), {
    onSuccess: invalidate,
    onError: () => {
      notifyUser("Failed to toggle like", "error");
    },
  });

  const commentMutation = useMutation((content: string) => postPublicationComment(content, publicationId as string), {
    onSuccess: invalidate,
    onError: () => {
      notifyUser("Could not post your comment", "error");
    },
  });

  const deleteCommentMutation = useMutation((commentId: string) => deletePublicationComment(publicationId as string, commentId), {
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
        <BackLink to="/publications" label="Go back" />
        <PageHeader title="Publication Details" />
        <EmptyState icon={FiBookOpen} title="Publication not found" description="It may have been removed." action={<Button onClick={() => navigate("/publications")}>Back to publications</Button>} />
      </>
    );
  }

  const isRecent = !isPast(new Date(new Date(item.createdAt ?? 0).getTime() + 30 * 24 * 60 * 60 * 1000));
  const liked = hasLiked(item, memberId);

  return (
    <>
      <BackLink to="/publications" label="Go back" />
      <PageHeader title="Publication Details" subtitle="See the details of the latest publications here..." />

      <div className="max-w-4xl flex flex-col gap-6">
        <div>
          <h2 className="text-[22px] font-semibold text-org-primary">{publicationTitle(item)}</h2>
          <p className="text-sm text-muted mt-1">Date Posted: {formatCardDateTime(item.createdAt)}</p>
        </div>

        {contentBanner(item) && (
          <div className="relative rounded-xl overflow-hidden">
            <img src={contentBanner(item)} alt="" className="w-full max-h-[420px] object-cover" />
            {isRecent && <StatusPill label="New" tone="brand" className="!rounded-none absolute top-0 right-0 !px-4 !py-1.5" />}
          </div>
        )}

        {/* Editor HTML — sanitised and styled, not printed as text. */}
        <RichText html={publicationBody(item)} />

        {Array.isArray(item.attachmentUrls) && item.attachmentUrls.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {item.attachmentUrls.map((url: string, index: number) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 rounded-lg border border-hairline px-4 py-2.5 text-sm text-ink hover:border-org-primary hover:text-org-primary transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                Attachment {index + 1}
              </a>
            ))}
          </div>
        )}

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
            <span className="text-sm text-muted">Like this publication</span>
          </div>

          <p className="text-sm text-ink">
            Author: <span className="text-org-primary font-medium">{contentAuthor(item)}</span>
          </p>
        </div>

        <CommentsPanel
          comments={comments as any[]}
          currentMemberId={memberId}
          submitting={commentMutation.isLoading}
          onSubmit={content => commentMutation.mutate(content)}
          onDelete={commentId => deleteCommentMutation.mutate(commentId)}
        />
      </div>
    </>
  );
};

export default PublicationsDetailPage;
