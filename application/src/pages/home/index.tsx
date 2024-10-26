import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts } from "../../slices/postsSlice";
import { fetchAllUsers, fetchCurrentUser } from "../../slices/authSlice";
import Header from "../../components/header";
import PostCard from "../../components/postcard";
import CreatePostDialog from "../../components/create-post-dialog";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts } = useSelector((state: RootState) => state.posts);
  const { users, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchAllUsers());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <main className="pt-[120px] p-8">
        <h1 className="text-4xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
          Welcome to LuckGram
        </h1>
        <p className="text-center text-gray-600 text-lg mb-8">
          Your daily dose of luck and inspiration
        </p>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Create New Post
          </button>
        </div>

        <CreatePostDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1000px] mx-auto">
          {posts.map((post) =>
            currentUser ? (
              <PostCard
                key={post._id}
                post={post}
                users={users}
                currentUser={currentUser}
              />
            ) : null
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
