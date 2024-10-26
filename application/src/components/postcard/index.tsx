import { FC, useState, useEffect } from "react";
import {
  HeartIcon,
  MessageCircleIcon,
  Trash2Icon,
  Edit3Icon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { deletePost, Post, toggleLikePost } from "../../slices/postsSlice";
import {
  createComment,
  editComment,
  deleteComment,
} from "../../slices/commentsSlice";
import { toast } from "sonner";
import Swal from "sweetalert2";
import EditPostDialog from "../edit-post-dialog";
import api from "../../utils/api";
import { User } from "../../slices/authSlice";
import moment from "moment";

interface PostCardProps {
  post: Post;
  currentUser: User | null;
}

interface Comment {
  _id: string;
  content: string;
  user: { _id: string; name: string; surname: string };
  createdAt: string;
  updatedAt: string;
}

const PostCard: FC<PostCardProps> = ({ post, currentUser }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [liked, setLiked] = useState<boolean>(
    post.likes.includes(currentUser?._id || "")
  );
  const [likesCount, setLikesCount] = useState<number>(post.likes.length);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    if (isCommentSectionOpen) {
      fetchComments();
    }
  }, [isCommentSectionOpen, post._id]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/publication/${post._id}/comments`);
      setComments(response.data.comments || []);
    } catch {
      setComments([]);
    }
  };

  const toggleLike = () => {
    dispatch(toggleLikePost(post._id))
      .unwrap()
      .then((updatedPost) => {
        const isLiked = updatedPost.likes.includes(currentUser?._id || "");
        setLiked(isLiked);
        setLikesCount(updatedPost.likes.length);
      })
      .catch(() => {
        toast.error("An error occurred while toggling like.");
      });
  };

  const handleDeletePost = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deletePost(post._id)).unwrap();
        toast.success("Post deleted successfully!");
      }
    });
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const addedComment = await dispatch(
        createComment({ postId: post._id, content: newComment })
      ).unwrap();
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment("");
    }
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setCommentContent(content);
  };

  const handleSaveEditComment = async () => {
    if (editingCommentId && commentContent.trim()) {
      const updatedComment = await dispatch(
        editComment({ commentId: editingCommentId, content: commentContent })
      ).unwrap();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
      setEditingCommentId(null);
      setCommentContent("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deleteComment(commentId)).unwrap();
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
        toast.success("Comment deleted successfully!");
      }
    });
  };

  return (
    <div className="bg-white w-full shadow-lg border border-gray-200 rounded-lg max-w-md mx-auto relative">
      <div className="flex items-center p-4">
        <div className="h-12 w-12 rounded-full bg-center bg-cover bg-[url('https://i.ytimg.com/vi/O4wcofGVb4E/maxresdefault.jpg')]" />
        <div className="ml-4">
          <span className="text-md font-semibold">
            {post.user.name} {post.user.surname}
          </span>
          <p className="text-xs text-gray-400">
            {moment(post.createdAt).format("dddd, MMMM D, YYYY h:mm A")}
          </p>
        </div>
        {post.user._id === currentUser?._id && (
          <div className="ml-auto flex gap-2">
            <Edit3Icon
              size={20}
              className="text-blue-500 hover:text-blue-600 cursor-pointer"
              onClick={() => setIsEditingPost(true)}
            />
            <Trash2Icon
              size={20}
              className="text-red-500 hover:text-red-600 cursor-pointer"
              onClick={handleDeletePost}
            />
          </div>
        )}
      </div>

      <img
        className="w-full h-64 object-cover p-2"
        src={`http://localhost:3000${post.imageUrl}`}
        alt="post"
      />

      <div className="px-4 py-2">
        <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
        <p className="text-gray-700 mt-2">{post.description}</p>
      </div>

      <div className="px-4 py-2 text-gray-600 text-sm">
        <span className="font-semibold">Tags: </span>
        {post.tags.split(",").map((tag, index) => (
          <span key={index} className="text-green-600">
            {tag.trim()}
            {index < post.tags.split(",").length - 1 && ", "}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 text-gray-600">
          <HeartIcon
            className={`cursor-pointer ${
              liked ? "text-red-500 fill-current" : "hover:text-red-500"
            }`}
            onClick={toggleLike}
          />
          <span className="text-sm">{likesCount}</span>
          <MessageCircleIcon
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}
          />
        </div>
      </div>

      {isCommentSectionOpen && (
        <div className="px-4 py-4 text-gray-500 text-sm border-t bg-gray-50 rounded-b-lg">
          <span className="font-semibold text-gray-800">Comments:</span>
          <div className="mt-3 space-y-3 max-h-48 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-400">No comments yet.</p>
            ) : (
              comments.map((comment) => {
                const isCommentOwner =
                  comment.user._id === currentUser?._id ||
                  post.user._id === currentUser?._id;

                return (
                  <div
                    key={comment._id}
                    className="relative group p-3 bg-white rounded-lg shadow-md"
                  >
                    {editingCommentId === comment._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg p-2 flex-grow"
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                        />
                        <button
                          onClick={handleSaveEditComment}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700">
                          <strong>
                            {comment.user.name} {comment.user.surname}:
                          </strong>{" "}
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {moment(comment.createdAt).fromNow()}
                          {comment.createdAt !== comment.updatedAt && (
                            <span>
                              {" "}
                              (edited {moment(comment.updatedAt).fromNow()})
                            </span>
                          )}
                        </p>
                        {isCommentOwner && (
                          <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100">
                            <Edit3Icon
                              size={16}
                              className="text-blue-500 hover:text-blue-600 cursor-pointer"
                              onClick={() =>
                                handleEditComment(comment._id, comment.content)
                              }
                            />
                            <Trash2Icon
                              size={16}
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                              onClick={() => handleDeleteComment(comment._id)}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="border border-gray-300 rounded-lg p-2 flex-grow"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingPost && (
        <EditPostDialog
          isOpen={isEditingPost}
          onClose={() => setIsEditingPost(false)}
          post={post}
        />
      )}
    </div>
  );
};

export default PostCard;
