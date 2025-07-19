import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Menu,
  ChevronDown,
  Home,
  RefreshCw,
  Moon,
  Sun
} from 'lucide-react';
import { AdminUser, AdminNotification } from '@/types/admin';

interface AdminHeaderProps {
  currentAdmin: AdminUser;
  notifications: AdminNotification[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onRefresh?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentAdmin,
  notifications,
  currentPath,
  onNavigate,
  onLogout,
  onToggleSidebar,
  onRefresh
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get page title from current path
  const getPageTitle = () => {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    switch (lastSegment) {
      case 'dashboard':
        return 'Dashboard';
      case 'posts':
        return 'Blog Posts';
      case 'create':
        return 'Create Post';
      case 'categories':
        return 'Categories';
      case 'authors':
        return 'Authors';
      case 'media':
        return 'Media Library';
      case 'news':
        return 'News Monitor';
      case 'analytics':
        return 'Analytics';
      case 'users':
        return 'Admin Users';
      case 'notifications':
        return 'Notifications';
      case 'settings':
        return 'Settings';
      default:
        return 'Admin Panel';
    }
  };

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Admin', path: '/admin/dashboard' }];
    
    let buildPath = '';
    pathSegments.slice(1).forEach((segment, index) => {
      buildPath += `/${segment}`;
      const isLast = index === pathSegments.length - 2;
      
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (segment === 'posts') label = 'Blog Posts';
      if (segment === 'create') label = 'Create Post';
      
      breadcrumbs.push({
        label,
        path: `/admin${buildPath}`,
        isActive: isLast
      });
    });
    
    return breadcrumbs;
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const breadcrumbs = getBreadcrumbs();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Search:', searchQuery);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Implement dark mode toggle
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && (
                <span className="text-gray-400">/</span>
              )}
              <button
                onClick={() => onNavigate(crumb.path)}
                className={`hover:text-blue-600 transition-colors ${
                  crumb.isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* Page Title */}
        <div className="md:hidden">
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, categories, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={() => window.open('/', '_blank')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="View main site"
          >
            <Home className="w-5 h-5 text-gray-600" />
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Notifications */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  {unreadNotifications.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {unreadNotifications.length} new
                    </span>
                  )}
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (notification.action_url) {
                          onNavigate(notification.action_url);
                        }
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'error' ? 'bg-red-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'success' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 5 && (
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      onNavigate('/admin/notifications');
                      setShowNotifications(false);
                    }}
                    className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {currentAdmin.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {currentAdmin.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {currentAdmin.role.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {currentAdmin.name}
                </p>
                <p className="text-xs text-gray-500">
                  {currentAdmin.email}
                </p>
              </div>
              
              <div className="py-2">
                <button
                  onClick={() => {
                    onNavigate('/admin/profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                
                <button
                  onClick={() => {
                    onNavigate('/admin/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
              </div>
              
              <div className="border-t border-gray-200 py-2">
                <button
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;