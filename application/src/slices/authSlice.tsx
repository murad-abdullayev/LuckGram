import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

interface AuthState {
  user: any | null;
  loading: boolean;
  registerError: string | null;
  loginError: string | null;
  forgotPasswordMessage: string | null;
  forgotPasswordError: string | null;
  resetPasswordMessage: string | null;
  resetPasswordError: string | null;
}

interface AuthError {
  response: { data: { message: string } };
}

const initialState: AuthState = {
  user: null,
  loading: true,
  registerError: null,
  loginError: null,
  forgotPasswordMessage: null,
  forgotPasswordError: null,
  resetPasswordMessage: null,
  resetPasswordError: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (
    data: { name: string; surname: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/register", data);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        (error as AuthError)?.response?.data?.message ?? "Registration failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        (error as AuthError)?.response?.data?.message ??
          "Failed to send reset password email"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, newPassword }: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password: newPassword,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        (error as AuthError)?.response?.data?.message ??
          "Failed to reset password"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", data);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        (error as AuthError)?.response?.data?.message ?? "Login failed"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/current-user", {
        withCredentials: true,
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        (error as AuthError)?.response?.data?.message ?? "Failed to fetch user"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout", {
    withCredentials: true,
  });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.loginError = null;
      state.registerError = null;
      state.forgotPasswordError = null;
      state.resetPasswordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerError = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginError = action.payload as string;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordError = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordError = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
