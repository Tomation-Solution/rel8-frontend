import { fetchNewsComments, postNewsComment, deleteNewsComment } from "../../api/news/news-api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Avatar from "../avatar/Avatar";
import avatarImage from '../../assets/images/avatar-1.jpg';
import { useState } from 'react';
import { NewsCommentProps, Comment } from "../../types/myTypes";
import { useAppContext } from "../../context/authContext";
import { AiOutlineSend } from "react-icons/ai";
import { getInitials } from "../../utils/strings";

// Define the component with props type
export default function NewsComment({ comments, newsId }: NewsCommentProps) {
    const [commentText, setCommentText] = useState('');
    const queryClient = useQueryClient();
    const context = useAppContext();
    
    const user = context.user;
    console.log(comments,'comments')
    // const { data, isLoading, isError} = useQuery(['news', newsId], () => fetchNewsComments(newsId?.toString() || null));

    // const comments: Comment[] = data?.data || [];
    const postMutation = useMutation(async (newComment: { comment: string; newsId: string }) => postNewsComment(newComment.comment, newsId), {
        onSuccess: () => {
            queryClient.invalidateQueries(['news']);
        },
    });

    const deleteMutation = useMutation((commentId: string) => deleteNewsComment(newsId,commentId), {
        onSuccess: () => {
            queryClient.invalidateQueries(['news', newsId]);
        },
    });

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = () => {
        if(commentText === '') return;
        postMutation.mutate({ comment: commentText, newsId });
        setCommentText('');
    };

    const handleCommentDelete = (commentId: string) => {
        deleteMutation.mutate(commentId);
    };

    // if (isLoading) return <div>Loading comments...</div>;
    // if (isError) return <div>Error loading comments</div>;

    return (
        <div className="flex flex-col h-full justify-between gap-10">
            <div className="mt-10">
                <div>
                    <h3 className="font-semibold text-xl">Comments</h3>
                </div>
                {/* This is the write a comment section */}
                <div className="h-[100px] flex items-center gap-x-2">
                    <div className="rounded-full">                        
                        <Avatar imageUrl={user?.profile_image ? user.profile_image : `https://placehold.co/100x100?text=${getInitials(user?.name)}`} />
                    </div>
                        <textarea
                            className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2"
                            placeholder="Write a comment"
                            value={commentText}
                            onChange={handleCommentChange}
                        ></textarea>
                    <button
                        className={`${commentText ? "bg-org-primary" : "bg-org-primary/50"} text-white w-[full] px-4 h-[50px] rounded-md`}
                        onClick={handleCommentSubmit}
                        disabled={!commentText}
                    >
                        { postMutation.isLoading ? "..." : <AiOutlineSend /> }
                    </button>
                </div>
            </div>
            {/* This is the get comments section */}
            <div className="comments-container overflow-y-auto max-h-[300px]">
                {comments.length > 0 ? (
                    comments.toReversed().map((comment) => (
                        <div key={comment._id} className="flex gap-2 mb-4">
                            <div className="rounded-md">
                                <Avatar imageUrl={comment?.userId?.imageUrl ||
                                      `https://placehold.co/100x100?text=${getInitials(comment?.userId?.name || "")}`
                                } />
                            </div>
                            <div className="flex flex-col gap-1 border p-4 rounded-lg w-full md:w-2/3">
                                <h3 className="font-semibold text-sm">{comment.userId?.name}</h3>
                                <p className="text-textColor font-light text-md">{comment.content}</p>
                                {user?.id == comment.userId?._id && (
                                    <button
                                        className="text-red-500 text-sm text-end"
                                        onClick={() => handleCommentDelete(comment._id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center text-[20px]">No comments yet.</div>
                )}
            </div>
        </div>
    );
}
