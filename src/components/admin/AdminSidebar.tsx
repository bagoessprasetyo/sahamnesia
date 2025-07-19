import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  Users, 
  Settings, 
  Image, 
  BarChart3, 
  Bell, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  BookOpen,
  User
} from 'lucide-react';
import { AdminUser, AdminPermissions } from '@/types/admin';

interface AdminSidebarProps {
  currentAdmin: AdminUser;
  permissions: AdminPermissions;
  currentPath: string;
  isCollapsed: boolean;
  onNavigate: (path: string) => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  permission?: {
    resource: keyof AdminPermissions;
    action: string;
  };
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
    permission: { resource: 'analytics', action: 'view_dashboard' }
  },
  {
    id: 'blog',
    label: 'Blog Posts',
    icon: FileText,
    path: '/admin/blog',
    permission: { resource: 'blog_posts', action: 'read' },
    children: [
      {
        id: 'blog-all',
        label: 'All Posts',
        icon: BookOpen,
        path: '/admin/blog/posts'
      },
      {
        id: 'blog-create',
        label: 'Create Post',
        icon: FileText,
        path: '/admin/blog/create',
        permission: { resource: 'blog_posts', action: 'create' }
      }
    ]
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: Folder,
    path: '/admin/categories',
    permission: { resource: 'blog_categories', action: 'read' }
  },
  {
    id: 'authors',
    label: 'Authors',
    icon: Users,
    path: '/admin/authors',
    permission: { resource: 'blog_authors', action: 'read' }
  },
  {
    id: 'media',
    label: 'Media Library',
    icon: Image,
    path: '/admin/media',
    permission: { resource: 'media', action: 'upload' }
  },
  {
    id: 'news',
    label: 'News Monitor',
    icon: Newspaper,
    path: '/admin/news',
    permission: { resource: 'news_articles', action: 'read' }
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/admin/analytics',
    permission: { resource: 'analytics', action: 'view_detailed' }
  },
  {
    id: 'admin-users',
    label: 'Admin Users',
    icon: User,
    path: '/admin/users',
    permission: { resource: 'admin_users', action: 'read' }
  }
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentAdmin,
  permissions,
  currentPath,
  isCollapsed,
  onNavigate,
  onToggleCollapse,
  onLogout
}) => {
  const hasPermission = (resource: keyof AdminPermissions, action: string): boolean => {
    const resourcePermissions = permissions[resource];
    if (!resourcePermissions) return false;
    return (resourcePermissions as any)[action] === true;
  };

  const isMenuItemVisible = (item: MenuItem): boolean => {
    if (!item.permission) return true;
    return hasPermission(item.permission.resource, item.permission.action);
  };

  const isPathActive = (path: string): boolean => {
    if (path === '/admin/dashboard') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!isMenuItemVisible(item)) return null;

    const isActive = isPathActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const IconComponent = item.icon;

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => onNavigate(item.path)}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            isActive
              ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          } ${level > 0 ? 'ml-4' : ''}`}
          title={isCollapsed ? item.label : undefined}
        >
          <IconComponent className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} flex-shrink-0`} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {hasChildren && (
                <ChevronRight className="w-4 h-4 ml-2" />
              )}
            </>
          )}
        </button>

        {/* Render children if not collapsed and has children */}
        {!isCollapsed && hasChildren && (
          <div className="mt-1 ml-2">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Sahamnesia</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="mb-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentAdmin.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentAdmin.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentAdmin.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <button
            onClick={() => onNavigate('/admin/notifications')}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              currentPath === '/admin/notifications'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={isCollapsed ? 'Notifications' : undefined}
          >
            <Bell className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} flex-shrink-0`} />
            {!isCollapsed && <span>Notifications</span>}
          </button>

          <button
            onClick={() => onNavigate('/admin/settings')}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              currentPath === '/admin/settings'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <Settings className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} flex-shrink-0`} />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} flex-shrink-0`} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;