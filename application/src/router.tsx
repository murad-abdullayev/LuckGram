import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import ResetPassword from "./pages/reset-password";
import ForgotPassword from "./pages/forgot-password";
import ProtectedRoute from "./components/protected-route";
import AuthGuard from "./components/auth-guard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/register",
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/reset-password/:token",
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/forgot-password",
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <ForgotPassword />,
      },
    ],
  },
]);
