import React, { useState, useEffect } from 'react';
import { AdminUser, AdminPermissions } from '@/types/admin';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  currentAdmin: AdminUser;
  permissions: AdminPermissions;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onRefresh?: () => void;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdmin,
  permissions,
  currentPath,
  onNavigate,
  onLogout,
  onRefresh,
  children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar on smaller screens
      if (mobile) {
        setIsSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [currentPath]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isMobile 
          ? (isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full')
          : 'translate-x-0'
      }`}>
        <AdminSidebar
          currentAdmin={currentAdmin}
          permissions={permissions}
          currentPath={currentPath}
          isCollapsed={isMobile ? false : isSidebarCollapsed}
          onNavigate={onNavigate}
          onToggleCollapse={handleToggleSidebar}
          onLogout={onLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          currentAdmin={currentAdmin}
          currentPath={currentPath}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onToggleSidebar={handleToggleSidebar}
          onRefresh={onRefresh}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <p>
              © 2024 Sahamnesia. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span>Version 1.0.0</span>
              <span>•</span>
              <button 
                onClick={() => window.open('https://docs.sahamnesia.com', '_blank')}
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Documentation
              </button>
              <span>•</span>
              <button 
                onClick={() => window.open('mailto:support@sahamnesia.com')}
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;