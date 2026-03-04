import express from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getFollowingTweets,
  getTweetById,
  likeorDislikeTweet,
  uploadTweetImages,
} from "../controllers/tweet.controller.js";
import isAuthenticated from "../config/auth.js";
import { uploadTweetImages as upload } from "../config/cloudinary.js";

const router = express.Router();

router.post("/create", isAuthenticated, createTweet);
router.delete("/delete/:id", isAuthenticated, deleteTweet);
router.put("/like/:id", isAuthenticated, likeorDislikeTweet);
router.get("/allTweets", getAllTweets);
router.get("/followingtweets/:id", isAuthenticated, getFollowingTweets);
router.get("/tweet/:id", isAuthenticated, getTweetById);
router.post(
  "/upload-images",
  isAuthenticated,
  upload.array("images", 4),
  uploadTweetImages,
);

export default router;
