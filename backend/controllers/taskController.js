import Task from '../models/Task.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy } = req.query;

    // Build query object
    const query = { owner: req.user._id };

    // Filter by status (completed / pending)
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'pending') {
      query.completed = false;
    }

    // Filter by priority
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    // Search by title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch tasks
    let tasks = await Task.find(query);

    // Sort tasks in JavaScript
    if (sortBy) {
      if (sortBy === 'newest') {
        tasks.sort((a, b) => b.createdAt - a.createdAt);
      } else if (sortBy === 'oldest') {
        tasks.sort((a, b) => a.createdAt - b.createdAt);
      } else if (sortBy === 'dueDate') {
        tasks.sort((a, b) => {
          // Put tasks with no due date (null) at the end
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      } else if (sortBy === 'priority') {
        const priorityWeights = { High: 3, Medium: 2, Low: 1 };
        tasks.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
      }
    } else {
      // Default: newest first
      tasks.sort((a, b) => b.createdAt - a.createdAt);
    }

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Validate ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this task' });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Validate ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this task' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a single task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Validate ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all completed tasks
// @route   DELETE /api/tasks/delete-completed
// @access  Private
export const deleteCompletedTasks = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({
      owner: req.user._id,
      completed: true,
    });

    res.json({
      success: true,
      message: `${result.deletedCount} completed tasks deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats for tasks
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const now = new Date();

    const totalTasks = await Task.countDocuments({ owner: ownerId });
    const completedTasks = await Task.countDocuments({ owner: ownerId, completed: true });
    const pendingTasks = await Task.countDocuments({ owner: ownerId, completed: false });
    
    // Overdue tasks are tasks not completed whose due dates are in the past
    const overdueTasks = await Task.countDocuments({
      owner: ownerId,
      completed: false,
      dueDate: { $ne: null, $lt: now },
    });

    res.json({
      success: true,
      data: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        overdue: overdueTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};
