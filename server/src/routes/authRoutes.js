import { Router } from 'express';
import { redirectToAtlassian } from '../controllers/authController.js';

const router = Router();

router.get('/jira', redirectToAtlassian);
// router.get('/jira/callback', handleAtlassianCallback);

export default router;
