import express from "express";
import {
  bookmark,
  follow,
  getOtherUserProfile,
  getMe,
  GetUserProfile,
  Login,
  logout,
  Register,
  unfollow,
  updateProfile,
  uploadAvatar,
  uploadBanner,
} from "../controllers/user.controller.js";
import isAuthenticated from "../config/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", logout);
router.put("/bookmark/:id", isAuthenticated, bookmark);
router.get("/me", isAuthenticated, getMe);
router.route("/profile/:id").get(isAuthenticated, GetUserProfile);
router.put("/update/:id", isAuthenticated, updateProfile);
router.get("/otherusers", isAuthenticated, getOtherUserProfile);
router.post("/follow/:id", isAuthenticated, follow);
router.post("/unfollow/:id", isAuthenticated, unfollow);
router.post(
  "/upload-avatar",
  isAuthenticated,
  upload.single("image"),
  uploadAvatar,
);
router.post(
  "/upload-banner",
  isAuthenticated,
  upload.single("image"),
  uploadBanner,
);

export default router;
