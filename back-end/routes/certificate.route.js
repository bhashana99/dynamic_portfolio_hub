import express from "express";
import {
  createCertificate,
  getCertificates,
  deleteCertificate,
  getCertificate,
  updateCertificate,
  isCertificateTableEmpty
} from "../controllers/certificate.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-certificate", verifyToken, createCertificate);
router.get("/get-certificates", getCertificates);
router.delete("/delete-certificate/:id", verifyToken, deleteCertificate);
router.get("/get-certificate/:id", getCertificate);
router.post("/update-certificate/:id", verifyToken, updateCertificate);
router.get('/is-empty', isCertificateTableEmpty);

export default router;
