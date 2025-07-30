import { Router } from 'express';
import {
  getLeads,
  submitLead,
  updateLeadStatus,
} from '../controllers/leadController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateLeadSubmission } from '../middleware/validation';

const router = Router();

// Public route for lead submission
router.post('/submit', validateLeadSubmission, submitLead);

// Protected routes for admin
router.get('/', authenticateToken, requireRole('admin'), getLeads);
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole('admin'),
  updateLeadStatus
);

export default router;
