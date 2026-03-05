import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice.js";
import useTheme from "../hooks/useTheme";
import { RiMoonClearLine, RiSunLine, RiArrowLeftLine } from "react-icons/ri";

const Login = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const { isDark, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { name, email, username, password, confirmPassword } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (isLogin) {
      try {
        const res = await API.post("/user/login", { email, password });

        if (res.data.success) {
          dispatch(setUser(res?.data?.user));
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          navigate("/home");

          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Login failed");
        console.log(error);
      }
    } else {
      try {
        const res = await API.post("/user/register", {
          name,
          email,
          username,
          password,
          confirmPassword,
        });

        if (res.data.success) {
          dispatch(setUser(res?.data?.user));
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          navigate("/home");
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Registration failed");
        console.log(error);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed top-4 right-4 z-50 flex items-center justify-center rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        {isDark ? <RiMoonClearLine size={20} /> : <RiSunLine size={20} />}
      </button>
      <a
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <RiArrowLeftLine size={18} />
        Back
      </a>

      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-zinc-50/90 p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950/90 transition-colors">
        <img
          src="/NodesLogoForEcho.png"
          alt="Logo"
          className="mx-auto mb-4 h-10 w-10"
        />
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Welcome to Echo
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in or create an account to continue.
          </p>
        </div>

        <h2 className="mb-4 text-center text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          {!isLogin && (
            <>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  id="name"
                  autoComplete="name"
                  required
                  onChange={handleChange}
                  value={formData.name}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 transition-colors duration-150"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  id="username"
                  autoComplete="username"
                  required
                  onChange={handleChange}
                  value={formData.username}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 transition-colors duration-150"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              id="email"
              autoComplete="email"
              required
              onChange={handleChange}
              value={formData.email}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 transition-colors duration-150"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              id="password"
              autoComplete="new-password"
              required
              onChange={handleChange}
              value={formData.password}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 transition-colors duration-150"
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
                onChange={handleChange}
                value={formData.confirmPassword}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 transition-colors duration-150"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl border border-blue-600 bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform transition-colors duration-150 hover:bg-blue-500 hover:shadow-md active:scale-95"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="cursor-pointer font-medium text-zinc-900 dark:text-zinc-100 underline-offset-4 hover:underline"
            onClick={handleToggle}
          >
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
