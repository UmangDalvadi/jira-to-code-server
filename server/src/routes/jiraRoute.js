import express from 'express';
import { ticketDetails, generateCode } from '../controllers/jiraController.js';
import { jiraAuthMiddleware } from '../middlewares/jiraAuthMiddleware.js';

const router = express.Router();

router.post('/ticket-details', ticketDetails);
router.post('/generate-code', generateCode);

export default router;
