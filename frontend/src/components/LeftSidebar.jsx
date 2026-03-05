import {
  RiHome5Line,
  RiUser3Line,
  RiBookmarkLine,
  RiRobotLine,
  RiMoonClearLine,
  RiSunLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import API from "../api/axios";
import { setUser, getOtherUsers, getMyProfile } from "../redux/userSlice";
import { toast } from "react-hot-toast";

const SidebarItem = ({ to, icon: Icon, label, onClick }) => { // eslint-disable-line no-unused-vars
  if (to) {
    return (
      <NavLink
        to={to}
        end
        className={({ isActive }) => `
          flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
          transition-colors duration-150 ease-out
          ${
            isActive
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0
        `}
      >
        <Icon size={20} />
        <span className="font-medium tracking-tight">{label}</span>
      </NavLink>
    );
  }

  return (
    <button
      onClick={onClick}
      className="
        flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm
        text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900
        transition-colors duration-150 ease-out
        dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0
      "
    >
      <Icon size={20} />
      <span className="text-[15px] font-medium tracking-tight">{label}</span>
    </button>
  );
};

const LeftSidebar = ({ isAIChatOpen, setIsAIChatOpen }) => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
  };

  const logoutHandler = async () => {
    try {
      localStorage.clear();
      dispatch(setUser(null));
      dispatch(getOtherUsers(null));
      dispatch(getMyProfile(null));

      await API.get("/user/logout");

      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <aside className="hidden md:flex w-64 flex-col h-screen border-r border-zinc-200 dark:border-zinc-800">
      {/* Scrollable content */}
      <div className="flex flex-col h-full overflow-y-auto px-4 pt-6">
        {/* Logo */}
        <div className="mb-10">
          <img
            src="/ZoomedLogo.png"
            alt="Logo"
            className="h-16 w-16 object-contain hover:scale-105 transition"
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1.5">
          <SidebarItem to="/home" icon={RiHome5Line} label="Home" />
          {user && (
            <SidebarItem
              to={`/profile/${user._id}`}
              icon={RiUser3Line}
              label="Profile"
            />
          )}
          <SidebarItem
            to="/bookmarks"
            icon={RiBookmarkLine}
            label="Bookmarks"
          />
        </nav>

        <div className="flex flex-col space-y-1.5 mt-1.5">
          {/* Echo AI Button */}
          <button
            onClick={toggleAIChat}
            className={`
            flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
            transition-colors duration-150 ease-out
            ${
              isAIChatOpen
                ? "bg-indigo-500 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            }
          `}
            aria-label="Toggle Echo AI"
          >
            <RiRobotLine size={20} />
            <span className="font-medium tracking-tight">Echo AI</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors duration-150 ease-out"
          >
            <div className="flex items-center gap-3">
              {isDark ? <RiMoonClearLine size={20} /> : <RiSunLine size={20} />}
              <span className="font-medium tracking-tight">Theme</span>
            </div>
            <div className="relative w-10 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-colors duration-200">
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  isDark ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={logoutHandler}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors duration-150 ease-out"
          >
            <RiLogoutBoxRLine size={20} />
            <span className="font-medium tracking-tight">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
