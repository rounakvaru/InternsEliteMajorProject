import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
  getTaskStats,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateTask,
  validateUpdateTask,
} from '../middleware/validateMiddleware.js';

const router = express.Router();

// Apply protection middleware to all task routes
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router.route('/stats')
  .get(getTaskStats);

router.route('/completed')
  .delete(deleteCompletedTasks);

router.route('/:id')
  .get(getTaskById)
  .put(validateUpdateTask, updateTask)
  .delete(deleteTask);

export default router;
