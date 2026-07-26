import React from 'react';
import { ListTodo, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const DashboardStats = ({ stats = { total: 0, completed: 0, pending: 0, overdue: 0 } }) => {
  const statItems = [
    {
      key: 'total',
      label: 'Total Tasks',
      value: stats.total,
      icon: <ListTodo size={24} />,
      class: 'total',
    },
    {
      key: 'completed',
      label: 'Completed Tasks',
      value: stats.completed,
      icon: <CheckCircle size={24} />,
      class: 'completed',
    },
    {
      key: 'pending',
      label: 'Pending Tasks',
      value: stats.pending,
      icon: <Clock size={24} />,
      class: 'pending',
    },
    {
      key: 'overdue',
      label: 'Overdue Tasks',
      value: stats.overdue,
      icon: <AlertTriangle size={24} />,
      class: 'overdue',
    },
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item) => (
        <div key={item.key} className={`stats-card glass ${item.class}`}>
          <div className="stats-icon-wrapper flex-center">
            {item.icon}
          </div>
          <div className="stats-info">
            <span className="stats-label">{item.label}</span>
            <span className="stats-value">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
