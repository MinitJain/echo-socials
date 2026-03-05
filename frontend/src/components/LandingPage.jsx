import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiSparkling2Line, RiRobot2Line, RiFlashlightFill } from "react-icons/ri";
import Avatar from "react-avatar";

const sampleTweets = [
  {
    _id: "1",
    description: "Just launched my new project! The future of microblogging is here. Excited to see where this goes 🚀 #EchoApp #LaunchDay",
    likes: ["user1", "user2", "user3"],
    userId: {
      _id: "u1",
      name: "Sarah Chen",
      username: "sarahc",
      profileImageUrl: null
    },
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: "2",
    description: "The AI assistant feature in Echo is incredible. It helped me write the perfect tweet about our team announcement. Game changer!",
    likes: ["user1", "user4"],
    userId: {
      _id: "u2",
      name: "Marcus Johnson",
      username: "marcusj",
      profileImageUrl: null
    },
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: "3",
    description: "Beautiful design, lightning fast performance. Echo proves you can have both aesthetics and speed. Happy to be here!",
    likes: ["user2", "user3", "user5"],
    userId: {
      _id: "u3",
      name: "Emily Rodriguez",
      username: "emilyr",
      profileImageUrl: null
    },
    createdAt: new Date(Date.now() - 10800000).toISOString()
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <nav className="flex items-center justify-between px-4 py-4 sm:px-8 lg:px-16">
        <div className="flex items-center gap-2">
          <img src="/NodesLogoForEcho.png" alt="Echo" className="h-8 w-8" />
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Echo</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login?mode=login")}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/login?mode=signup")}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Join Echo
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
            Your voice, amplified.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Zero friction. No walls. Just ideas.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/explore")}
              className="w-full rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-xl active:scale-95 sm:w-auto"
            >
              Explore Feed
            </button>
            <button
              onClick={() => navigate("/login?mode=signup")}
              className="w-full rounded-full border border-zinc-300 bg-white px-8 py-3 text-base font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-95 sm:w-auto dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Join Echo
            </button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-8">
        <div className="absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-zinc-50 to-transparent dark:from-zinc-950"></div>
        <div className="absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-zinc-50 to-transparent dark:from-zinc-950"></div>
        
        <div className="flex overflow-x-hidden">
          <div className="flex animate-marquee gap-4">
            {[...sampleTweets, ...sampleTweets].map((tweet, index) => (
              <div
                key={`${tweet._id}-${index}`}
                className="w-80 flex-shrink-0 rounded-xl border border-zinc-200/50 bg-white/70 backdrop-blur-md p-4 shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/70"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {tweet.userId.profileImageUrl ? (
                      <img
                        src={tweet.userId.profileImageUrl}
                        alt={tweet.userId.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <Avatar
                        name={tweet.userId.name}
                        size="40"
                        round
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                        {tweet.userId.name}
                      </h3>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        @{tweet.userId.username}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatTimeAgo(tweet.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
                  {tweet.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/explore")}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
          >
            See more in Explore
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-zinc-900 transition-colors">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <h2 className="mb-12 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Why Choose Echo?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <RiSparkling2Line size={28} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Instant Access
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Don&apos;t wait. Browse the public feed and see what&apos;s trending right now.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <RiRobot2Line size={28} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                AI Assistant
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Gemini-powered writing help at your fingertips
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <RiFlashlightFill size={28} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Lightning Fast
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Built with React 19 and Vite for instant performance
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-8">
        <h2 className="mb-8 text-center text-xl font-bold text-zinc-900 dark:text-zinc-50">
          See What People Are Saying
        </h2>
        <div className="space-y-4">
          {sampleTweets.map((tweet) => (
            <div
              key={tweet._id}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/95"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {tweet.userId.profileImageUrl ? (
                    <img
                      src={tweet.userId.profileImageUrl}
                      alt={tweet.userId.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar
                      name={tweet.userId.name}
                      size="44"
                      round
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {tweet.userId.name}
                    </h3>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      @{tweet.userId.username}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      · {formatTimeAgo(tweet.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                    {tweet.description}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{tweet.likes.length} likes</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-8">
          <div className="flex justify-center gap-6 mb-4">
            <button
              onClick={() => navigate("/login?mode=login")}
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login?mode=signup")}
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Join Echo
            </button>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            © 2026 Echo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
