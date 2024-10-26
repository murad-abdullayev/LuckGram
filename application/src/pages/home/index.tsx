import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts } from "../../slices/postsSlice";
import { fetchAllUsers } from "../../slices/authSlice";
import Header from "../../components/header";
import PostCard from "../../components/postcard";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts } = useSelector((state: RootState) => state.posts);
  const { users } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <main className="p-8">
        <h1 className="text-4xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
          Welcome to LuckGram
        </h1>

        <p className="text-center text-gray-600 text-lg mb-12">
          Your daily dose of luck and inspiration
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1000px] mx-auto">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} users={users} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
