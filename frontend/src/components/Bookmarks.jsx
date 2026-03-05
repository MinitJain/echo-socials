import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import Tweet from "./Tweet";
import { useMemo } from "react";

const Bookmarks = () => {
  const { user } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);

  const localBookmarks = useMemo(() => {
    if (!tweets?.length || !user?.bookmarks) {
      return [];
    }
    return tweets.filter((tweet) => user.bookmarks.includes(tweet._id));
  }, [tweets, user]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="rounded-full p-2 text-zinc-500 transition-colors duration-150 ease-out hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100"
          >
            <IoMdArrowBack size={22} />
          </Link>

          <div>
            <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Bookmarks
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {localBookmarks.length} saved
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-2">
        {localBookmarks.length > 0 ? (
          localBookmarks.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              No bookmarks yet
            </h2>
            <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
              When you save tweets, they’ll appear here so you can easily find
              them later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
