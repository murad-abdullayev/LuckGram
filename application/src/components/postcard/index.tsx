import { FC } from "react";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { Post } from "../../slices/postsSlice";
import { User } from "../../slices/authSlice";

interface PostCardProps {
  post: Post;
  users: User[];
}

const PostCard: FC<PostCardProps> = ({ post, users }) => {
  const getUserDetails = (userId: string) => {
    return users.find((user) => user._id === userId);
  };

  return (
    <div className="bg-white w-full shadow-lg border border-gray-200 rounded-lg max-w-md mx-auto overflow-hidden">
      <div className="flex items-center p-4">
        <div className="h-12 w-12 rounded-full bg-center bg-cover bg-[url('https://i.ytimg.com/vi/O4wcofGVb4E/maxresdefault.jpg')]" />
        <div className="ml-4">
          <span className="text-md font-semibold block leading-tight">
            {post.user.name} {post.user.surname}
          </span>
        </div>
      </div>

      <img
        className="w-full h-64 object-cover p-2"
        src={post.imageUrl}
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
        <div className="flex gap-4 text-gray-600">
          <HeartIcon className="hover:text-red-500 cursor-pointer" />
          <MessageCircleIcon className="hover:text-blue-500 cursor-pointer" />
        </div>
      </div>

      <div className="font-semibold text-sm px-4 pb-2 text-gray-600">
        92,372 likes
      </div>

      <div className="px-4 py-2 text-gray-500 text-sm border-t">
        <span className="font-semibold text-gray-800">Comments:</span>
        <div className="mt-1 space-y-1">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => {
              const commentUser = getUserDetails(comment.user);
              return (
                <p key={comment._id}>
                  <strong>
                    {commentUser
                      ? `${commentUser.name} ${commentUser.surname}`
                      : "Unknown User"}
                    :
                  </strong>{" "}
                  {comment.content}
                </p>
              );
            })
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
