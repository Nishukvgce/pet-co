
import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ user, onToggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-3 sm:px-6 lg:pl-70">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-muted rounded-lg"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-sm sm:text-lg font-heading font-semibold text-foreground truncate">
          PET&CO - Admin
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
          <User size={16} />
          <span className="truncate max-w-32">{user.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
