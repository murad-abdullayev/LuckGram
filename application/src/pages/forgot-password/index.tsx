import { Link } from "react-router-dom";
import { CloverIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { clearError, forgotPassword } from "../../slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../../assets/clover-bg.jpg";
import { useEffect } from "react";

const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forgotPasswordMessage, forgotPasswordError: error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await dispatch(forgotPassword(values.email));
      setSubmitting(false);
    },
  });

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <CloverIcon size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Reset Your Password
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Please enter your registered email address to reset your password.
          </p>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="luck@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className={`w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 ${
                  formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>

          {forgotPasswordMessage && (
            <p className="text-green-600 text-center mt-4">
              {forgotPasswordMessage}
            </p>
          )}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-cover bg-[url('../../assets/clover-bg.jpg')]"></div>
    </div>
  );
};

export default ForgotPassword;
