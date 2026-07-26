import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddEditTaskModal = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Reset fields or load existing task details when modal opens / changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      if (task.dueDate) {
        // Convert to YYYY-MM-DD for date input
        const dateObj = new Date(task.dueDate);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        setDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || title.trim() === '') {
      setError('Task title is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="btn-close flex-center"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            <div className="auth-form">
              <div className="form-group">
                <label htmlFor="modal-title" className="form-label">
                  Task Title *
                </label>
                <div className="form-input-wrapper">
                  <input
                    id="modal-title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (e.target.value.trim() !== '') setError('');
                    }}
                    placeholder="Enter task title"
                    className={`form-input modal-input ${
                      error ? 'form-input-error' : ''
                    }`}
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
                {error && <span className="error-text">{error}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="modal-desc" className="form-label">
                  Description
                </label>
                <textarea
                  id="modal-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details about this task..."
                  className="form-input modal-input modal-textarea"
                  style={{ paddingLeft: '16px', paddingTop: '12px' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-priority" className="form-label">
                    Priority
                  </label>
                  <select
                    id="modal-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="select-filter"
                    style={{ width: '100%' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="modal-duedate" className="form-label">
                    Due Date
                  </label>
                  <input
                    id="modal-duedate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="form-input modal-input"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel flex-center"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-center">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTaskModal;
