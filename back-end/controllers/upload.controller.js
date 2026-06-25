import cloudinary from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";

// Uploads a single file (image or PDF) to Cloudinary and returns its URL.
// The file is provided in-memory by multer (req.file.buffer).
export const uploadFile = (req, res, next) => {
  if (!req.file) {
    return next(errorHandler(400, "No file provided!"));
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "portfolio",
      resource_type: "auto", // handles both images and PDFs
    },
    (error, result) => {
      if (error) {
        return next(errorHandler(500, "File upload failed!"));
      }
      return res.status(200).json({ url: result.secure_url });
    }
  );

  uploadStream.end(req.file.buffer);
};
