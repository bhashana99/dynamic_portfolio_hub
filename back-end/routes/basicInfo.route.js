import express from 'express';
import { createBasicInfo, updateBasicInfo ,getBasicInfo} from '../controllers/basicInfo.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();

router.post('/create-basicInfo',verifyToken,createBasicInfo);
router.post('/update-basicInfo/:id',verifyToken,updateBasicInfo);
router.get('/get-basicInfo',getBasicInfo);

export default router;