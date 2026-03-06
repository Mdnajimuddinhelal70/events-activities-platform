import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
import path from "path";
import config from "../config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

async function uploadToCloudinary(file: Express.Multer.File) {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  });
  console.log(file);

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: `${file.originalname}-${Date.now()}`,
    })
    .catch((error) => {
      throw error;
    });
  fs.unlinkSync(file.path);

  return uploadResult;
}
async function deleteFromCloudinary(imageUrl: string) {
  const publicId = imageUrl.split("/").pop()?.split(".")[0];
  if (publicId) {
    return cloudinary.uploader.destroy(publicId);
  }
}

const upload = multer({ storage: storage });

export const fileUploader = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
};
