import imageCompression from "browser-image-compression";
import API from "../api/axios";

const validateFile = (file, maxSizeinMB, allowedTypes) => {
  const maxSizeInBytes = maxSizeinMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    return { valid: false, error: `Maximum size is ${maxSizeinMB} MB.` };
  }
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types are: ${allowedTypes.join(", ")}`,
    };
  }
  return { valid: true, error: null };
};

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);

    return file;
  }
};

export const uploadAvatar = async (file) => {
  const validation = validateFile(file, 2, [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

  if (!validation.valid) {
    throw new Error(validation.error);
  }
  const compressedFile = await compressImage(file);

  const formData = new FormData();
  formData.append("image", compressedFile);

  const response = await API.post("/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (response.data.success) {
    return response.data.imageUrl;
  }
  throw new Error(response.data.message || "Failed to upload avatar.");
};

export const uploadBanner = async (file) => {
  const validation = validateFile(file, 2, [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

  if (!validation.valid) {
    throw new Error(validation.error);
  }
  const compressedFile = await compressImage(file);
  const formData = new FormData();
  formData.append("image", compressedFile);

  const response = await API.post("/user/upload-banner", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (response.data.success) {
    return response.data.imageUrl;
  }
  throw new Error(response.data.message || "Failed to upload banner.");
};

export const uploadTweetImages = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }
  if (files.length > 4) {
    throw new Error("You can upload a maximum of 4 images.");
  }
  const formData = new FormData();

  for (const file of files) {
    const validation = validateFile(file, 5, [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ]);

    if (!validation.valid) {
      throw new Error(` ${file.name} : ${validation.error}`);
    }
    const compressedFile = await compressImage(file);
    formData.append("images", compressedFile);
  }
  const response = await API.post("/tweet/upload-images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.data.success) {
    return response.data.imageUrls;
  }

  throw new Error(response.data.message || "Upload failed");
};
