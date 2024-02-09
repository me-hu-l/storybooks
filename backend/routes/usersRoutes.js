import express from 'express'
import {
        authUser,
        registerUser,
        logoutUser,
        getUserProfile,
        updateUserProfile
} from '../controllers/usersController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth', authUser);
router.post('/', registerUser);
router.post('/logout', logoutUser);
router.get('/profile/:userId',protect, getUserProfile);
router.put('/profile/:userId',protect, updateUserProfile);

export default router;