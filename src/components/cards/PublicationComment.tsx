import { useQuery, useMutation, useQueryClient } from "react-query";
import Avatar from "../avatar/Avatar";
import avatarImage from "../../assets/images/avatar-1.jpg";
import { useState } from "react";
import { useAppContext } from "../../context/authContext";
import { AiOutlineSend } from "react-icons/ai";
import { fetchPublicationsComments, postPublicationComment, deletePublicationComment, type PublicationComment as PublicationCommentType } from "../../api/publications/publications-api";

/**
 * Comments on a publication.
 *
 * Previously non-functional in two ways at once: the API calls pointed at Django routes
 * this backend does not mount, and the list rendering was commented out, so even a
 * successful fetch would have displayed nothing. Both are fixed — publications now carry
 * comments server-side, mirroring news.
 */

const authorOf = (comment: PublicationCommentType) => (typeof comment.userId === "object" && comment.userId ? comment.userId : null);

const formatWhen = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
};

/** Comments are fetched here, so unlike NewsComment this takes only the id. */
interface PublicationCommentProps {
  newsId: string;
}

export default function PublicationComment({ newsId }: PublicationCommentProps) {
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAppContext();

  const publicationId = newsId?.toString() || "";

  const { data, isLoading, isError } = useQuery(["publication-comments", publicationId], () => fetchPublicationsComments(publicationId), {
    enabled: Boolean(publicationId),
  });

  const comments: PublicationCommentType[] = Array.isArray(data) ? data : [];

  const invalidate = () => queryClient.invalidateQueries(["publication-comments", publicationId]);

  const postMutation = useMutation((comment: string) => postPublicationComment(comment, publicationId), { onSuccess: invalidate });

  const deleteMutation = useMutation((commentId: string) => deletePublicationComment(publicationId, commentId), { onSuccess: invalidate });

  const handleCommentSubmit = () => {
    const text = commentText.trim();
    if (!text || postMutation.isLoading) return;
    postMutation.mutate(text);
    setCommentText("");
  };

  // The context stores the member under a few different keys depending on how the
  // session was created; check all of them rather than hiding everyone's delete button.
  const myId = String((user as any)?._id ?? (user as any)?.id ?? (user as any)?.member_id ?? "");

  if (isLoading) return <div>Loading comments...</div>;
  if (isError) return <div>Error loading comments</div>;

  return (
    <div className="flex flex-col h-full justify-between gap-10">
      <div className="mt-10">
        <div>
          <h3 className="font-semibold text-xl">Comments</h3>
        </div>
        {/* This is the write a comment section */}
        <div className="h-[100px] flex items-center gap-2">
          <div className="rounded-full">
            <Avatar imageUrl={user?.profile_image ? user.profile_image : avatarImage} />
          </div>
          <div className="flex-1">
            <textarea
              className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2"
              placeholder="Write a comment"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
            ></textarea>
          </div>
          <button
            className="bg-org-primary text-white w-[full] px-4 h-[50px] rounded-md disabled:opacity-50"
            onClick={handleCommentSubmit}
            disabled={!commentText.trim() || postMutation.isLoading}
          >
            <AiOutlineSend />
          </button>
        </div>
        {postMutation.isError && <p className="text-red-500 text-sm">Could not post your comment. Please try again.</p>}
      </div>

      {/* This is the get comments section */}
      <div className="comments-container overflow-y-auto max-h-[300px] py-5">
        {comments.length > 0 ? (
          comments.map(comment => {
            const author = authorOf(comment);
            const isMine = Boolean(myId) && String(author?._id ?? comment.userId ?? "") === myId;

            return (
              <div key={comment._id} className="flex gap-2 mb-4 items-start">
                <div className="rounded-md">
                  <Avatar imageUrl={author?.imageUrl || avatarImage} />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-sm">{author?.name || "Member"}</h3>
                    <span className="text-xs text-gray-400">{formatWhen(comment.createdAt)}</span>
                  </div>
                  <p className="text-textColor font-light text-md">{comment.content}</p>
                  {isMine && (
                    <button
                      className="text-red-500 text-sm text-end disabled:opacity-50"
                      onClick={() => deleteMutation.mutate(comment._id)}
                      disabled={deleteMutation.isLoading}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center text-[20px]">No comments yet.</div>
        )}
      </div>
    </div>
  );
}
