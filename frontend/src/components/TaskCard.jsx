import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  // Smart date formatter helper
  const getDueDateInfo = (dateStr) => {
    if (!dateStr) return { label: 'No due date', statusClass: '' };
    
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatted = due.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (due < today) {
      return { label: `Overdue • ${formatted}`, statusClass: 'overdue' };
    } else if (due.getTime() === today.getTime()) {
      return { label: 'Due Today', statusClass: 'due-today' };
    } else if (due.getTime() === tomorrow.getTime()) {
      return { label: 'Due Tomorrow', statusClass: 'due-tomorrow' };
    } else {
      return { label: `Due ${formatted}`, statusClass: 'due-future' };
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
      default:
        return 'priority-low';
    }
  };

  const { label, statusClass } = getDueDateInfo(task.dueDate);

  return (
    <div
      className={`task-card glass ${getPriorityClass(task.priority)} ${
        task.completed ? 'completed-task' : ''
      }`}
    >
      <div>
        <div className="task-header">
          <div className="task-title-group">
            <div className="task-checkbox-wrapper">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task._id, !task.completed)}
                className="task-checkbox"
                aria-label={`Mark task "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
              />
            </div>
            <h3 className="task-title">{task.title}</h3>
          </div>
          <span className={`priority-badge ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>

        <div className="task-body">
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
      </div>

      <div className="task-footer">
        <div className={`task-due-date ${task.completed ? '' : statusClass}`}>
          <Calendar size={13} />
          <span>{label}</span>
        </div>

        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="btn-task-action edit flex-center"
            title="Edit task"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="btn-task-action delete flex-center"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
