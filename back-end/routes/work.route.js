import express from "express";
import {
  createWork,
  getWorks,
  deleteWork,
  getWork,
  updateWork,
  isWorkTableEmpty,
} from "../controllers/work.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-work", verifyToken, createWork);
router.get("/get-works", getWorks);
router.delete("/delete-work/:id", verifyToken, deleteWork);
router.get("/get-work/:id", getWork);
router.post("/update-work/:id", verifyToken, updateWork);
router.get('/is-empty', isWorkTableEmpty);

export default router;
