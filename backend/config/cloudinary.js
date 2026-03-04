import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "echo/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { radius: "max" },
    ],
  },
});

const bannerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "echo/banners",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1500, height: 500, crop: "limit" }],
  },
});

const tweetImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "echo/tweets",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
  },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadBanner = multer({
  storage: bannerStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadTweetImages = multer({
  storage: tweetImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
