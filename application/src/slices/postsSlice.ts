import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export interface Post {
  _id: string;
  title: string;
  description: string;
  tags: string;
  imageUrl: string;
  user: {
    _id: string;
    name: string;
    surname: string;
    email: string;
  };
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  content: string;
  user: string;
  publication: string;
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  selectedPost: Post | null;
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  selectedPost: null,
  comments: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "publication?includeUsers=true&includeComments=true"
      );
      return response.data.posts;
    } catch (error) {
      return rejectWithValue("Failed to fetch posts");
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (
    data: {
      title: string;
      description: string;
      tags: string;
      image: File;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("tags", data.tags);
      formData.append("image", data.image);

      const response = await api.post("/publication/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.publication;
    } catch (error) {
      return rejectWithValue("Failed to create post");
    }
  }
);

export const editPost = createAsyncThunk(
  "posts/editPost",
  async (
    {
      postId,
      title,
      description,
      tags,
      image,
    }: {
      postId: string;
      title: string;
      description: string;
      tags: string;
      image?: File;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);

      if (image) {
        formData.append("image", image);
      }

      const response = await api.patch(
        `/publication/edit-post/${postId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.post;
    } catch (error) {
      return rejectWithValue("Failed to edit post");
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/publication/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue("Failed to delete post");
    }
  }
);

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/publication/${postId}`);
      return response.data.post;
    } catch (error) {
      return rejectWithValue("Failed to fetch post");
    }
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/publication/${postId}/comments`);
      return response.data.comments;
    } catch (error) {
      return rejectWithValue("Failed to fetch comments");
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.selectedPost = action.payload;
        state.loading = false;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;
