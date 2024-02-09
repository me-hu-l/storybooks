import express from 'express'
import {
        getStoryAddPage,
        addStory,
        getPublicStories,
        getSpecificStory,
        getEditPage,
        updateStory,
        deleteStory,
        getUserStories
} from '../controllers/storiesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/add',protect, getStoryAddPage);
router.post('/',protect, addStory);
router.get('/',protect, getPublicStories);
router.get('/:id',protect, getSpecificStory);
router.get('/edit/:id',protect, getEditPage);
router.put('/:id',protect, updateStory);
router.delete('/:id',protect, deleteStory);
router.get('/user/:userId',protect, getUserStories);

export default router;