import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Get initial letters of user's name for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="navbar glass">
      <div className="nav-brand">
        <div className="nav-logo flex-center">TM</div>
        <h1 className="nav-title">TaskFlow</h1>
      </div>

      <div className="nav-actions">
        <button
          onClick={toggleTheme}
          className="btn-icon flex-center"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user && (
          <>
            <div className="user-profile">
              <div className="user-avatar flex-center" title={user.name}>
                {getInitials(user.name)}
              </div>
              <span className="user-name">{user.name}</span>
            </div>

            <button
              onClick={logout}
              className="btn-logout flex-center"
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
