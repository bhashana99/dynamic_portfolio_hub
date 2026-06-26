import express from 'express';
import { createSocialMedia,getSocialMedia,updateSocialMedia } from '../controllers/socialMedia.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();

router.post('/create-socialMedia',verifyToken,createSocialMedia);
router.get('/get-socialMedia',getSocialMedia);
router.post('/update-socialMedia/:id',verifyToken,updateSocialMedia);

export default router;