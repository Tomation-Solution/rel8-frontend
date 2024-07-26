import { fetchNewsComments, postNewsComment, deleteNewsComment } from "../../api/news/news-api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Avatar from "../avatar/Avatar";
import avatarImage from '../../assets/images/avatar-1.jpg';
import { useState } from 'react';
import { NewsCommentProps, Comment } from "../../types/myTypes";

// Define the component with props type
export default function NewsComment({ newsId }: NewsCommentProps) {
    const [commentText, setCommentText] = useState('');
    const queryClient = useQueryClient();
    
    const { data, isLoading, isError } = useQuery(['news', newsId], () => fetchNewsComments(newsId?.toString() || null),
        // {   enabled: !!newsId,}
    );
    const comments: Comment[] = data?.data || [];

    const postMutation = useMutation((newComment: { comment: string; newsId: number }) => postNewsComment(newComment.comment, newComment.newsId), {
        onSuccess: () => {
            queryClient.invalidateQueries(['news', newsId]);
        },
    });

    const deleteMutation = useMutation((commentId: number) => deleteNewsComment(commentId), {
        onSuccess: () => {
            queryClient.invalidateQueries(['news', newsId]);
        },
    });

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = () => {
        postMutation.mutate({ comment: commentText, newsId });
        setCommentText('');
    };

    const handleCommentDelete = (commentId: number) => {
        deleteMutation.mutate(commentId);
    };

    if (isLoading) return <div>Loading comments...</div>;
    if (isError) return <div>Error loading comments</div>;

    return (
        <div className="flex flex-col h-full justify-between gap-10">
            <div className="mt-10">
                <div>
                    <h3 className="font-semibold text-sm">Comments</h3>
                </div>
                {/* This is the write a comment section */}
                <div className="bg-[] h-[100px] flex items-center gap-2">
                    <div className="rounded-full">
                        <Avatar imageUrl={avatarImage} />
                    </div>
                    <div className="flex-1">
                        <textarea
                            className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2"
                            placeholder="Write a comment"
                            value={commentText}
                            onChange={handleCommentChange}
                        ></textarea>
                    </div>
                    <button
                        className="bg-primary-blue text-white w-[90px] h-[50px] rounded-md"
                        onClick={handleCommentSubmit}
                    >
                        Comment
                    </button>
                </div>
            </div>
            {/* This is the get comments section */}
            <div>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2 mb-4 items-center">
                            <div className="rounded-md">
                                <Avatar imageUrl={comment.member.photo_url || avatarImage} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="font-semibold text-sm">{comment.member.full_name}</h3>
                                <p className="text-textColor font-light text-md">{comment.comment}</p>
                                <button
                                    className="text-red-500 text-sm text-end"
                                    onClick={() => handleCommentDelete(comment.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No comments yet.</div>
                )}
            </div>
        </div>
    );
}
