import { useState } from "react";
import { FiSend, FiTrash2, FiUser } from "react-icons/fi";

import { Card } from "../../../components/ui";
import { relativeTime } from "../../../utils/dates";

export interface ContentComment {
  _id: string;
  content: string;
  createdAt: string;
  userId?: { _id?: string; name?: string; email?: string; imageUrl?: string } | string;
}

interface Props {
  comments: ContentComment[];
  onSubmit: (content: string) => void;
  onDelete?: (commentId: string) => void;
  submitting?: boolean;
  /** Used to decide which comments the viewer may delete. */
  currentMemberId?: string | null;
}

const authorOf = (comment: ContentComment) => (typeof comment.userId === "object" && comment.userId ? comment.userId : undefined);

/**
 * Comments on News and Publications.
 *
 * **Flat, not threaded.** `News.comments` and `Publication.comments` are subdocument arrays
 * of `{ _id, userId, content, createdAt }` — there is no `parentId` field, so a reply has
 * nowhere to point, and no like field on a comment. `News-1.png` draws indented replies and
 * a thumbs-up per comment; both are recorded in REDESIGN.md §5 as not built rather than
 * faked with client-only state that would vanish on reload.
 */
const CommentsPanel = ({ comments, onSubmit, onDelete, submitting = false, currentMemberId }: Props) => {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const trimmed = draft.trim();
    if (!trimmed || submitting) return;
    onSubmit(trimmed);
    setDraft("");
  };

  return (
    <Card className="p-6">
      <h3 className="text-[18px] font-semibold text-ink mb-5">Comments</h3>

      {/* Composer */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
          <FiUser className="w-5 h-5 text-org-primary/60" />
        </span>
        <input
          type="text"
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyUp={event => event.key === "Enter" && submit()}
          placeholder="Write your comments here..."
          className="flex-1 min-w-0 h-11 px-4 rounded-lg bg-org-tint/60 border border-transparent focus:border-org-primary outline-none text-sm text-ink placeholder:text-muted"
        />
        <button type="button" onClick={submit} disabled={!draft.trim() || submitting} aria-label="Post comment" className="w-11 h-11 rounded-lg bg-org-tint grid place-items-center text-org-primary hover:bg-org-tint-strong disabled:opacity-40 flex-shrink-0">
          <FiSend className="w-5 h-5" />
        </button>
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-muted py-4">No comments yet. Be the first.</p>
      ) : (
        <ul className="flex flex-col gap-5">
          {comments.map(comment => {
            const author = authorOf(comment);
            const mine = !!currentMemberId && String(author?._id ?? "") === String(currentMemberId);
            return (
              <li key={comment._id} className="flex items-start gap-3">
                {author?.imageUrl ? (
                  <img src={author.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
                    <FiUser className="w-5 h-5 text-org-primary/60" />
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="rounded-lg overflow-hidden border border-hairline">
                    <div className="bg-org-tint px-4 py-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-ink truncate">{author?.name || "Member"}</span>
                      <span className="text-xs text-muted flex-shrink-0">{relativeTime(comment.createdAt)}</span>
                    </div>
                    <p className="px-4 py-3 text-sm text-muted whitespace-pre-line">{comment.content}</p>
                  </div>

                  {mine && onDelete && (
                    <button type="button" onClick={() => onDelete(comment._id)} className="mt-2 inline-flex items-center gap-1.5 text-xs text-status-danger hover:underline">
                      <FiTrash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default CommentsPanel;
