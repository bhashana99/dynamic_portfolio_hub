import express from "express";
import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
  getProject,
  isProjectTableEmpty,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-project", verifyToken, createProject);
router.get("/get-projects", getProjects);
router.delete("/delete-project/:id", verifyToken, deleteProject);
router.post("/update-project/:id", verifyToken, updateProject);
router.get("/get-project/:id", getProject);
router.get('/is-empty', isProjectTableEmpty);

export default router;
