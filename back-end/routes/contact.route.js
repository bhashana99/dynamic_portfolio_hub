import express from 'express'
import { createContactInfo ,getContactInfo,updateContactInfo} from '../controllers/contact.controller.js'
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/create-contactInfo', verifyToken, createContactInfo);
router.get('/get-contactInfo', getContactInfo);
router.post('/update-contactInfo/:id', verifyToken, updateContactInfo);

export default router;