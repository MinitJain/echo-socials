import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";

export const createTweet = async (req, res) => {
  try {
    const { description, id, images } = req.body;

    if (!description || !id) {
      return res.status(400).json({
        message: "Description and user ID are required.",
        success: false,
      });
    }

    // Verify user exists
    const user = await User.findById(id).select("_id");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Only store userId reference (no snapshot)
    await Tweet.create({
      description,
      userId: id,
      images: images || [],
    });

    return res.status(201).json({
      message: "Tweet created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while creating the tweet.",
      success: false,
    });
  }
};

export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.id; // From auth middleware

    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found.",
        success: false,
      });
    }

    if (tweet.userId.toString() !== loggedInUserId) {
      return res.status(403).json({
        message: "You can only delete your own tweets.",
        success: false,
      });
    }

    await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Tweet deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log("Delete Tweet Error:", error);
    return res.status(500).json({
      message: "Error deleting tweet.",
      success: false,
    });
  }
};

export const likeorDislikeTweet = async (req, res) => {
  try {
    const LoggedInUserId = req.body.id;
    const tweetId = req.params.id;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found.",
        success: false,
      });
    }

    if (tweet.likes.includes(LoggedInUserId)) {
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { likes: LoggedInUserId },
      });

      return res.status(200).json({
        message: "User disliked your tweet.",
        success: true,
      });
    } else {
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { likes: LoggedInUserId },
      });
      return res.status(200).json({
        message: "User liked your tweet.",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while liking or disliking the tweet.",
      success: false,
    });
  }
};

export const getAllTweets = async (req, res) => {
  try {
    const allTweets = await Tweet.find()
      .populate("userId", "name username profileImageUrl bannerUrl bio") // Always latest data
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All tweets fetched successfully.",
      success: true,
      tweets: allTweets,
    });
  } catch (error) {
    console.log("GetAllTweets Error:", error);
    return res.status(500).json({
      message: "Error in fetching tweets.",
      success: false,
    });
  }
};

export const getFollowingTweets = async (req, res) => {
  try {
    const id = req.params.id;

    const loggedInUser = await User.findById(id);
    if (!loggedInUser) {
      return res.status(404).json({
        message: "Logged-in user not found.",
        success: false,
      });
    }

    const followingUsersTweets = await Tweet.find({
      userId: { $in: loggedInUser.following },
    })
      .populate("userId", "name username profileImageUrl bannerUrl bio")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All following tweets fetched successfully.",
      success: true,
      tweets: followingUsersTweets,
    });
  } catch (error) {
    console.log("getFollowingTweets Error:", error);
    return res.status(500).json({
      message: "Error in fetching following tweets.",
      success: false,
    });
  }
};

export const getTweetById = async (req, res) => {
  try {
    const { id } = req.params;

    const tweet = await Tweet.findById(id).populate(
      "userId",
      "name username profileImageUrl bannerUrl bio",
    );

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Tweet fetched successfully.",
      success: true,
      tweet: tweet,
    });
  } catch (error) {
    console.log("getTweetById Error:", error);
    return res.status(500).json({
      message: "Error in fetching tweet.",
      success: false,
    });
  }
};

export const uploadTweetImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "No files uploaded", success: false });
    }
    if (req.files.length > 4) {
      return res
        .status(400)
        .json({ message: "Max 4 images allowed", success: false });
    }
    const imageUrls = req.files.map((file) => file.path);
    res.json({ success: true, imageUrls });
  } catch (error) {
    console.error("Upload Tweet Images Error:", error);
    res.status(500).json({ message: "Upload failed", success: false });
  }
};
