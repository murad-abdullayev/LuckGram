import { Link, useNavigate } from "react-router-dom";
import "../../../assets/clover-bg.jpg";
import { CloverIcon } from "lucide-react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useFormik } from "formik";
import { login } from "../../slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loginError: error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        await dispatch(login(values)).unwrap();
        navigate("/");
      } catch (err) {
        console.error("Login failed:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <CloverIcon size={36} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-5">
            Login to Your Account
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium text-sm mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="luck@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium text-sm mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="********"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition duration-200 text-sm ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Logging In..." : "Login"}
            </button>
            {error && (
              <p className="text-red-500 text-center text-sm mt-2">{error}</p>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-gray-600 mt-2 text-sm">
              <Link
                to="/forgot-password"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-cover bg-[url('../../assets/clover-bg.jpg')]"></div>
    </div>
  );
};

export default LoginPage;
