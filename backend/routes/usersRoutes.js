import express from 'express'
import {
        authUser,
        registerUser,
        logoutUser,
        getUserProfile,
        updateUserProfile,
        followUser,
        acceptFollow,
        rejectFollow,
        getFollowers,
        getFollowing,
        getPendingRequests,
        getPendingSentRequests,
        unfollowUser
} from '../controllers/usersController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth', authUser);
router.post('/', registerUser);
router.post('/logout', logoutUser);
router.get('/profile/:userId',protect, getUserProfile);
router.put('/profile/:userId',protect, updateUserProfile);
router.post('/follow/:targetUserId',protect, followUser);
router.put('/accept-follow/:followerUserId',protect, acceptFollow);
router.put('/reject-follow/:followerUserId',protect, rejectFollow);
router.get('/followers/:userId',protect, getFollowers);
router.get('/following/:userId',protect, getFollowing);
router.get('/pending-requests/:userId',protect, getPendingRequests);
router.get('/pending-sent-requests/:userId',protect, getPendingSentRequests);
router.delete('/unfollow/:targetUserId',protect, unfollowUser);

export default router;