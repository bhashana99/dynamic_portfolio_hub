import express from "express";
import {
  createEducation,
  getEducations,
  deleteEducation,
  getEducation,
  updateEducation,
  isEducationTableEmpty,
} from "../controllers/education.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-education", verifyToken, createEducation);
router.get("/get-educations", getEducations);
router.delete("/delete-education/:id", verifyToken, deleteEducation);
router.get("/get-education/:id", getEducation);
router.post("/update-education/:id", verifyToken, updateEducation);
router.get('/is-empty', isEducationTableEmpty);

export default router;
