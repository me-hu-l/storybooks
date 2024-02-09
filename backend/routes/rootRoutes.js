import express from 'express'
import {
        getLandingPage,
        getDashboard
} from '../controllers/rootController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getLandingPage);
router.get('/dashboard',protect, getDashboard);

export default router;