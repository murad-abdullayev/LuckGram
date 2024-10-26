import { Link, useNavigate, useParams } from "react-router-dom";
import { CloverIcon } from "lucide-react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useFormik } from "formik";
import { resetPassword } from "../../slices/authSlice";
import "../../../assets/clover-bg.jpg";

const ResetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { resetPasswordMessage, resetPasswordError: error } = useSelector(
    (state: RootState) => state.auth
  );
  const { token } = useParams<{ token: string }>();

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        await dispatch(
          resetPassword({ token: token!, newPassword: values.newPassword })
        ).unwrap();
        navigate("/login");
      } catch (err) {
        console.error("Reset password failed:", err);
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
            <CloverIcon size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Set a New Password
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="********"
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.newPassword}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="********"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>

            <button
              type="submit"
              className={`w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
            {resetPasswordMessage && (
              <p className="text-green-600 text-center mt-4">
                {resetPasswordMessage}
              </p>
            )}
            {error && (
              <p className="text-red-500 text-center text-sm mt-2">{error}</p>
            )}
          </form>

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

export default ResetPassword;
