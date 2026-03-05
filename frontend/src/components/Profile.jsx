import Avatar from "react-avatar";
import { IoMdArrowBack } from "react-icons/io";
import {
  RiSettings3Line,
  RiMoonClearLine,
  RiSunLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useGetProfile from "../hooks/useGetProfile";
import useGetTweets from "../hooks/useGetTweets";
import useTheme from "../hooks/useTheme";
import API from "../api/axios";
import {
  setUser,
  getOtherUsers,
  getMyProfile,
  followingUpdate,
} from "../redux/userSlice";
import { getRefresh } from "../redux/tweetSlice";
import { toast } from "react-hot-toast";
import EditProfile from "./EditProfile";
import Tweet from "./Tweet";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, profile } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);
  const { isDark, toggleTheme } = useTheme();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useGetProfile(id);
  useGetTweets(id);

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

  if (!profile) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading profile...
        </p>
      </div>
    );
  }

  const isOwnProfile = profile?._id === user?._id;
  const isFollowing = user?.following?.includes(profile?._id);

  const followAndUnfollowHandler = async () => {
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";

      await API.post(`/user/${endpoint}/${profile._id}`, {
        id: user?._id,
      });

      dispatch(followingUpdate(profile._id));
      dispatch(getRefresh());
    } catch (error) {
      console.log(error);
    }
  };

  const userTweets = tweets?.filter(
    (tweet) => tweet.userId?._id === profile._id,
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <IoMdArrowBack size={22} />
          </Link>

          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {profile.name}
          </h1>
        </div>

        {/* Mobile Settings */}
        {isOwnProfile && (
          <div className="relative md:hidden">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <RiSettings3Line size={22} />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-4 top-12 w-48 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2 shadow-lg z-50">
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  {isDark ? (
                    <RiSunLine size={18} />
                  ) : (
                    <RiMoonClearLine size={18} />
                  )}
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>
                <button
                  onClick={logoutHandler}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <RiLogoutBoxRLine size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Banner */}
      <div className="relative">
        <div className="h-40 w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 sm:h-48">
          <img
            src={
              profile?.bannerUrl ||
              "https://placehold.co/600x200?text=Profile+Banner"
            }
            alt="Banner"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-10 left-6">
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt="Profile"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover ring-2 ring-white dark:ring-zinc-950 shadow-md"
            />
          ) : (
            <Avatar
              name={profile?.name}
              size="96"
              round
              className="ring-2 ring-white dark:ring-zinc-950 shadow-md"
            />
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-16 flex items-center justify-end gap-2 px-4">
        {isOwnProfile ? (
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={followAndUnfollowHandler}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition
              ${
                isFollowing
                  ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  : "bg-blue-500 text-white hover:bg-blue-400"
              }
            `}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="mt-4 px-4 pb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {profile.name}
        </h2>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          @{profile.username}
        </p>

        {profile.bio && profile.bio.trim() !== "" && (
          <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
            {profile.bio}
          </p>
        )}

        <div className="mt-3 flex gap-6 text-sm">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {profile.following?.length || 0}{" "}
            <span className="font-normal text-zinc-600 dark:text-zinc-500">
              Following
            </span>
          </span>

          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {profile.followers?.length || 0}{" "}
            <span className="font-normal text-zinc-600 dark:text-zinc-500">
              Followers
            </span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-200 dark:border-zinc-800" />

      {/* Tweets Section */}
      <div className="mt-2">
        {userTweets && userTweets.length > 0 ? (
          userTweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
        ) : (
          <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No tweets yet.
          </div>
        )}
      </div>

      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};

export default Profile;
