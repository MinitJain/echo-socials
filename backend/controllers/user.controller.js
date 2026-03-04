import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      console.log("Missing Fields:", name, username, email);
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const isUserALreadyExisting = await User.findOne({
      $or: [{ email }, { username }],
    }).lean();

    if (isUserALreadyExisting) {
      const field =
        isUserALreadyExisting.email === email ? "Email" : "Username";
      return res.status(409).json({
        message: `${field} already in use.`,
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    const user = { ...userWithoutPassword, id: newUser._id.toString() };

    // Set cookie and return user
    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Account created successfully.",
        success: true,
        user,
      });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email }).lean();
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const token = await jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const { password: _, ...userWithoutPassword } = existingUser;

    // re-map _id -> id
    const user = {
      ...userWithoutPassword,
      id: existingUser._id.toString(),
    };
    // Send token in cookie with correct expiry
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back! ${user.name}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  return res
    .cookie("token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      expires: new Date(0),
    })
    .status(200)
    .json({
      message: "Logged out successfully",
      success: true,
    });
};

export const bookmark = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const tweetId = req.params.id;

    // Step 1: Try to remove the tweetId from the bookmarks array
    const result = await User.updateOne(
      { _id: loggedInUserId, bookmarks: tweetId },
      { $pull: { bookmarks: tweetId } },
    );

    // Step 2: If modifiedCount is 0, it wasn't bookmarked, so we add it
    if (result.modifiedCount === 0) {
      await User.updateOne(
        { _id: loggedInUserId },
        { $addToSet: { bookmarks: tweetId } },
      );
      return res.status(200).json({
        message: "Tweet bookmarked successfully.",
        success: true,
      });
    }

    return res.status(200).json({
      message: "Bookmark removed successfully.",
      success: true,
    });
  } catch (error) {
    console.log("Bookmark Error:", error);
    return res.status(500).json({
      message: "Error updating bookmark.",
      success: false,
    });
  }
};
export const GetUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password").lean();
    return res.status(200).json({
      message: "User profile fetched successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.log("GetUserProfile Error:", error);
    return res.status(500).json({
      message: "Error fetching user profile.",
      success: false,
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("getMe Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getOtherUserProfile = async (req, res) => {
  try {
    const loggedInUserId = req.id;

    const otherUsers = await User.find({
      _id: { $ne: loggedInUserId },
      followers: { $nin: [loggedInUserId] },
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      otherUsers,
    });
  } catch (error) {
    console.log("Suggestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching suggestions",
    });
  }
};

export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const userIdToFollow = req.params.id;

    if (loggedInUserId === userIdToFollow) {
      return res
        .status(400)
        .json({ message: "You cannot follow yourself.", success: false });
    }

    const [targetUpdate, selfUpdate] = await Promise.all([
      User.updateOne(
        { _id: userIdToFollow, followers: { $ne: loggedInUserId } },
        { $addToSet: { followers: loggedInUserId } },
      ),
      User.updateOne(
        { _id: loggedInUserId },
        { $addToSet: { following: userIdToFollow } },
      ),
    ]);

    // If targetUpdate.matchedCount is 0, the user to follow doesn't exist.
    if (targetUpdate.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    return res.status(200).json({
      message: "Followed successfully",
      success: true,
    });
  } catch (error) {
    console.log("Follow Error:", error);
    return res
      .status(500)
      .json({ message: "Error following user.", success: false });
  }
};
export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const userIdToUnfollow = req.params.id;

    // Parallel atomic removal
    await Promise.all([
      User.updateOne(
        { _id: loggedInUserId },
        { $pull: { following: userIdToUnfollow } },
      ),
      User.updateOne(
        { _id: userIdToUnfollow },
        { $pull: { followers: loggedInUserId } },
      ),
    ]);

    return res.status(200).json({
      message: "Unfollowed successfully",
      success: true,
    });
  } catch (error) {
    console.log("Unfollow Error:", error);
    return res
      .status(500)
      .json({ message: "Error unfollowing user.", success: false });
  }
};

// Update Profile Controller
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, username, bio, profileImageUrl, bannerUrl } = req.body;
    const loggedInUserId = req.id; // req.id is already the user ID from auth middleware

    // Check if user is trying to update their own profile
    if (userId !== loggedInUserId) {
      return res.status(403).json({
        message: "You can only update your own profile.",
        success: false,
      });
    }

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name cannot be empty.",
        success: false,
      });
    }

    if (!username || username.trim() === "") {
      return res.status(400).json({
        message: "Username cannot be empty.",
        success: false,
      });
    }

    // Check username format (alphanumeric and underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "Username can only contain letters, numbers, and underscores.",
        success: false,
      });
    }

    // Check bio length
    if (bio && bio.length > 160) {
      return res.status(400).json({
        message: "Bio cannot exceed 160 characters.",
        success: false,
      });
    }

    // Check if username is already taken by another user
    const existingUser = await User.findOne({
      username: username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username is already taken.",
        success: false,
      });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        username: username.trim(),
        bio: bio ? bio.trim() : "",
        profileImageUrl: profileImageUrl || "",
        bannerUrl: bannerUrl || "",
      },
      { new: true, select: "-password" },
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Update Profile Error:", error);
    return res.status(500).json({
      message: "Error updating profile.",
      success: false,
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        message: "No image file uploaded.",
        success: false,
      });
    }
    const imageUrl = req.file.path;
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    res.status(500).json({
      message: "Error uploading avatar.",
      success: false,
    });
  }
};

export const uploadBanner = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        message: "No image file uploaded.",
        success: false,
      });
    }
    const imageUrl = req.file.path;
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Upload Banner Error:", error);
    res.status(500).json({
      message: "Error uploading banner.",
      success: false,
    });
  }
};
