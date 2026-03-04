import { useState } from "react";
import Avatar from "react-avatar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getIsActive, getRefresh } from "../redux/tweetSlice";
import { uploadTweetImages } from "../utils/upload";
import { IoMdClose } from "react-icons/io";
import { BsImage } from "react-icons/bs";

const CreatePost = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.user);
  const { isActive } = useSelector((store) => store.tweet);
  const dispatch = useDispatch();

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (selectedImages.length + files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages([...selectedImages, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(selectedImages[index].preview);
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const submitHandler = async () => {
    if (!description.trim() && selectedImages.length === 0) {
      toast.error("Tweet cannot be empty!");
      return;
    }
    try {
      setLoading(true);
      let imageUrls = [];
      if (selectedImages.length > 0) {
        setUploading(true);
        const files = selectedImages.map((img) => img.file);
        imageUrls = await uploadTweetImages(files);
      }
      const res = await API.post("/tweet/create", {
        description,
        id: user?._id,
        images: imageUrls,
      });
      if (res.data.success) {
        dispatch(getRefresh());
        toast.success(res.data.message);
        setDescription("");
        selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
        setSelectedImages([]);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong!",
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const followingHandler = () => dispatch(getIsActive(true));
  const forYouHandler = () => dispatch(getIsActive(false));
  return (
    <>
      <div
        className="
        sticky top-0 z-10
        border-b border-zinc-200 bg-white/90 backdrop-blur-sm
        dark:border-zinc-800 dark:bg-zinc-950/90
      "
      >
        <div className="flex">
          <button
            onClick={forYouHandler}
            className={`
              relative flex-1 py-3 text-center text-sm transition-colors duration-150 ease-out
              ${
                !isActive
                  ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              }
            `}
          >
            For You
            {!isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
          <button
            onClick={followingHandler}
            className={`
              relative flex-1 py-3 text-center text-sm transition-colors duration-150 ease-out
              ${
                isActive
                  ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              }
            `}
          >
            Following
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
        </div>
      </div>
      <div
        className="
        my-4 rounded-xl border border-zinc-200 bg-white/95
        shadow-sm transition-all duration-150 ease-out
        hover:-translate-y-0.5 hover:shadow-md
        dark:border-zinc-800 dark:bg-zinc-900/95
      "
      >
        <div className="flex gap-3 px-4 py-4 sm:px-5 sm:py-4">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800"
            />
          ) : (
            <Avatar
              name={user?.name || "User"}
              size="44"
              round
              className="ring-2 ring-white dark:ring-zinc-800"
            />
          )}
          <div className="flex-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's happening?"
              rows={3}
              className="
                w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50
                p-3 text-sm leading-relaxed
                text-zinc-900 placeholder-zinc-500
                outline-none transition-colors duration-150 ease-out
                focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500
                dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500
                dark:focus:border-indigo-400 dark:focus:bg-zinc-950 dark:focus:ring-indigo-400
              "
            />
            {selectedImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoMdClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <label
                htmlFor="tweet-image-input"
                className={`cursor-pointer text-indigo-500 hover:text-indigo-600 transition-colors ${
                  selectedImages.length >= 4
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <BsImage size={20} />
                <input
                  type="file"
                  id="tweet-image-input"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={selectedImages.length >= 4}
                />
              </label>
              <div className="flex items-center gap-3">
                {selectedImages.length > 0 && (
                  <span className="text-xs text-zinc-500">
                    {selectedImages.length}/4
                  </span>
                )}
                <button
                  onClick={submitHandler}
                  disabled={
                    loading ||
                    uploading ||
                    (!description.trim() && selectedImages.length === 0)
                  }
                  className={`
                    rounded-full px-4 py-2 text-xs font-medium
                    transition-transform transition-colors duration-150 ease-out
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0
                    ${
                      loading ||
                      uploading ||
                      (!description.trim() && selectedImages.length === 0)
                        ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95"
                    }
                  `}
                >
                  {loading || uploading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreatePost;
