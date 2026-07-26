export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  next();
};

export const validateTask = (req, res, next) => {
  const { title, priority, dueDate } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Task title is required' });
  }

  if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({ success: false, message: 'Priority must be Low, Medium, or High' });
  }

  if (dueDate) {
    const parsedDate = Date.parse(dueDate);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ success: false, message: 'Due date must be a valid date' });
    }
  }

  next();
};

export const validateUpdateTask = (req, res, next) => {
  const { title, priority, dueDate } = req.body;

  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Task title cannot be empty' });
  }

  if (priority !== undefined && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({ success: false, message: 'Priority must be Low, Medium, or High' });
  }

  if (dueDate) {
    const parsedDate = Date.parse(dueDate);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ success: false, message: 'Due date must be a valid date' });
    }
  }

  next();
};
