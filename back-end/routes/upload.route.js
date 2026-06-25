import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

// Keep the file in memory so we can stream it straight to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

router.post("/", upload.single("file"), uploadFile);

export default router;
