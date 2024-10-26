import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    surname: string;
  };
  publication: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comment/${postId}`);
      return response.data.comments;
    } catch (error) {
      return rejectWithValue("Failed to fetch comments");
    }
  }
);

export const createComment = createAsyncThunk(
  "comment/createComment",
  async (
    { postId, content }: { postId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/comment/leave-comment/${postId}`, {
        content,
      });
      return response.data.comment;
    } catch (error) {
      return rejectWithValue("Failed to create comment");
    }
  }
);

export const editComment = createAsyncThunk(
  "comment/editComment",
  async (
    { commentId, content }: { commentId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/comment/edit-comment/${commentId}`, {
        content,
      });
      return response.data.comment;
    } catch (error) {
      return rejectWithValue("Failed to edit comment");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/comment/delete-comment/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue("Failed to delete comment");
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) state.comments[index] = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
