import express from 'express';
import { registerUser, signIn,signOut ,changePassword} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register', verifyToken, registerUser);
router.post('/sign-in', signIn);
router.get('/sign-out',signOut);
router.post('/change-password/:username',verifyToken,changePassword);

export default router;

