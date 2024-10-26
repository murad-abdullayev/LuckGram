import { Link, useNavigate } from "react-router-dom";
import "../../../assets/clover-bg.jpg";
import { CloverIcon } from "lucide-react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useFormik } from "formik";
import { register } from "../../slices/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { registerError: error } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    surname: Yup.string().required("Surname is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "Kinji",
      surname: "Hakari",
      email: "luck@example.com",
      password: "123Salam!",
      confirmPassword: "123Salam!",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { confirmPassword, ...userData } = values;
      try {
        setSubmitting(true);
        await dispatch(register(userData)).unwrap();
        navigate("/login");
      } catch (err) {
        console.error("Registration failed:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-lg w-full bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
          <div className="flex justify-center mb-3">
            <CloverIcon size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
            Create Your Account
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium text-sm mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Kinji"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.name}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="surname"
                className="block text-gray-700 font-medium text-sm mb-1"
              >
                Surname
              </label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formik.values.surname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Hakari"
              />
              {formik.touched.surname && formik.errors.surname && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.surname}
                </div>
              )}
            </div>

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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium text-sm mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="********"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>

            <button
              type="submit"
              className={`w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 text-sm ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
            {error && (
              <p className="text-red-500 text-center text-sm mt-2">{error}</p>
            )}
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
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

export default RegisterPage;
