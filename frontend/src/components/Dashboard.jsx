import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from './Navbar';
import DashboardStats from './DashboardStats';
import TaskCard from './TaskCard';
import AddEditTaskModal from './AddEditTaskModal';
import ConfirmModal from './ConfirmModal';
import { Search, Plus, Trash2, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  // Task & Stats State
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    title: '',
    message: '',
    action: null,
  });

  // Fetch Stats from API
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/tasks/stats');
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Fetch Tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query string
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (search.trim() !== '') params.append('search', search.trim());
      params.append('sortBy', sortBy);

      const res = await api.get(`/tasks?${params.toString()}`);
      if (res.data && res.data.success) {
        setTasks(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      showToast('Error loading tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, search, sortBy, showToast]);

  // Initial load and filter change trigger
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Create or Update task handler
  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Update task
        const res = await api.put(`/tasks/${editingTask._id}`, taskData);
        if (res.data && res.data.success) {
          showToast('Task updated successfully', 'success');
          setIsTaskModalOpen(false);
          setEditingTask(null);
          fetchTasks();
          fetchStats();
        }
      } else {
        // Create task
        const res = await api.post('/tasks', taskData);
        if (res.data && res.data.success) {
          showToast('Task created successfully', 'success');
          setIsTaskModalOpen(false);
          fetchTasks();
          fetchStats();
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save task';
      showToast(msg, 'error');
    }
  };

  // Toggle single completion status
  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { completed: isCompleted });
      if (res.data && res.data.success) {
        showToast(
          isCompleted ? 'Task marked completed!' : 'Task set to pending',
          'success'
        );
        
        // Optimistic UI updates
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, completed: isCompleted } : t))
        );
        fetchStats();
      }
    } catch (error) {
      showToast('Failed to update task status', 'error');
    }
  };

  // Trigger single deletion
  const handleDeleteTrigger = (taskId) => {
    setConfirmData({
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task? This action cannot be undone.',
      action: () => executeDeleteTask(taskId),
    });
    setIsConfirmOpen(true);
  };

  const executeDeleteTask = async (taskId) => {
    try {
      const res = await api.delete(`/tasks/${taskId}`);
      if (res.data && res.data.success) {
        showToast('Task deleted successfully', 'success');
        setIsConfirmOpen(false);
        fetchTasks();
        fetchStats();
      }
    } catch (error) {
      showToast('Failed to delete task', 'error');
    }
  };

  // Trigger clear all completed tasks
  const handleClearCompletedTrigger = () => {
    setConfirmData({
      title: 'Clear Completed Tasks',
      message: 'Are you sure you want to delete all completed tasks? This action cannot be undone.',
      action: executeClearCompleted,
    });
    setIsConfirmOpen(true);
  };

  const executeClearCompleted = async () => {
    try {
      const res = await api.delete('/tasks/completed');
      if (res.data && res.data.success) {
        showToast(res.data.message || 'Completed tasks cleared', 'success');
        setIsConfirmOpen(false);
        fetchTasks();
        fetchStats();
      }
    } catch (error) {
      showToast('Failed to clear completed tasks', 'error');
    }
  };

  const handleEditTrigger = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateTrigger = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content container">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <h2 className="welcome-title">Welcome back, {user?.name}!</h2>
          <p className="welcome-subtitle">Here is a summary of your workspace for today.</p>
        </div>

        {/* Real-time Stats Grid */}
        <DashboardStats stats={stats} />

        {/* Filters and Controls */}
        <div className="controls-bar">
          <div className="controls-left">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
                aria-label="Search tasks"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-filter"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="select-filter"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-filter"
              aria-label="Sort tasks by"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Priority</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>

          <div className="controls-right">
            <button onClick={handleCreateTrigger} className="btn-primary flex-center">
              <Plus size={16} />
              <span>Create Task</span>
            </button>
            
            {stats.completed > 0 && (
              <button
                onClick={handleClearCompletedTrigger}
                className="btn-danger-outline flex-center"
                title="Clear completed tasks"
              >
                <Trash2 size={16} />
                <span>Clear Completed</span>
              </button>
            )}
          </div>
        </div>

        {/* Tasks display */}
        {loading ? (
          <div className="loading-screen flex-center" style={{ minHeight: '300px' }}>
            <span className="spinner" style={{ borderTopColor: 'var(--primary-color)' }}></span>
            <span className="loading-text">Loading workspace tasks...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state glass">
            <ShieldAlert className="empty-icon" />
            <h3 className="empty-title">No tasks found</h3>
            <p className="empty-desc">
              {search || statusFilter !== 'all' || priorityFilter !== 'all'
                ? "Try adjusting your filters or search terms."
                : "Create your first task to get started."}
            </p>
            {!search && statusFilter === 'all' && priorityFilter === 'all' && (
              <button onClick={handleCreateTrigger} className="btn-primary flex-center">
                <Plus size={16} />
                <span>Create Task</span>
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTrigger}
                onDelete={handleDeleteTrigger}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Creation & Editing Modal */}
      <AddEditTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title={confirmData.title}
        message={confirmData.message}
        onConfirm={confirmData.action}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
