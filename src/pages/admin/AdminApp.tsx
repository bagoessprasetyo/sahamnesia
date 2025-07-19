import React, { useState, useEffect } from 'react';
import { AdminUser, AdminPermissions } from '@/types/admin';
import { adminService } from '@/services/admin';
import AdminLayout from '@/components/admin/AdminLayout';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import BlogPostsList from './BlogPostsList';
import BlogPostForm from './BlogPostForm';
import MediaLibrary from './MediaLibrary';
import AdminNews from './AdminNews';
import AdminCategories from './AdminCategories';
import AdminAuthors from './AdminAuthors';
import AdminAnalytics from './AdminAnalytics';
import AdminUsers from './AdminUsers';
import AdminNotifications from './AdminNotifications';
import AdminSettings from './AdminSettings';
import AdminProfile from './AdminProfile';

interface AdminAppProps {
  onNavigateToMain?: (page: string) => void;
}

const AdminApp: React.FC<AdminAppProps> = ({ onNavigateToMain }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<AdminPermissions | null>(null);
  const [currentPath, setCurrentPath] = useState('/admin/dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const admin = await adminService.verifySession();
        if (admin) {
          setCurrentAdmin(admin);
          setPermissions(adminService.getCurrentPermissions());
        }
      } catch (err) {
        console.error('Session verification failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Handle URL-based routing for admin panel
  useEffect(() => {
    const updateCurrentPath = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setCurrentPath(path === '/admin' ? '/admin/dashboard' : path);
      }
    };

    // Set initial path
    updateCurrentPath();

    // Listen for browser navigation
    const handlePopState = () => {
      updateCurrentPath();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await adminService.login({ email, password });
      
      setCurrentAdmin(response.user);
      setPermissions(response.permissions);
      setCurrentPath('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await adminService.logout();
      setCurrentAdmin(null);
      setPermissions(null);
      setCurrentPath('/admin/dashboard');
      
      // Navigate back to main site
      if (onNavigateToMain) {
        onNavigateToMain('home');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleNavigate = (path: string) => {
    // Handle external navigation (back to main site)
    if (!path.startsWith('/admin')) {
      if (onNavigateToMain) {
        onNavigateToMain(path);
      }
      return;
    }

    // Update URL and state for admin navigation
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleRefresh = async () => {
    // Refresh data - can be implemented later if needed
  };

  const renderCurrentPage = () => {
    if (!currentAdmin || !permissions) return null;

    // Handle dynamic routes
    if (currentPath.startsWith('/admin/blog/edit/')) {
      const postId = parseInt(currentPath.split('/').pop() || '0');
      return <BlogPostForm currentAdmin={currentAdmin} postId={postId} onNavigate={handleNavigate} />;
    }

    switch (currentPath) {
      case '/admin/dashboard':
        return <AdminDashboard currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/blog':
      case '/admin/blog/posts':
        return <BlogPostsList currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/blog/create':
        return <BlogPostForm currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/categories':
        return <AdminCategories currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/authors':
        return <AdminAuthors currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/media':
        return <MediaLibrary onNavigate={handleNavigate} />;
      case '/admin/news':
        return <AdminNews currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/analytics':
        return <AdminAnalytics currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/users':
        return <AdminUsers currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/notifications':
        return <AdminNotifications currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/settings':
        return <AdminSettings currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
      case '/admin/profile':
        return <AdminProfile currentAdmin={currentAdmin} permissions={permissions} onNavigate={handleNavigate} />;
      default:
        return <AdminDashboard currentAdmin={currentAdmin} onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!currentAdmin || !permissions) {
    return (
      <AdminLogin 
        onLogin={handleLogin}
        error={error}
        onBackToMain={() => onNavigateToMain?.('home')}
      />
    );
  }

  return (
    <ThemeProvider>
      <NotificationProvider adminId={currentAdmin.id}>
        <AdminLayout
          currentAdmin={currentAdmin}
          permissions={permissions}
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onRefresh={handleRefresh}
        >
          {renderCurrentPage()}
        </AdminLayout>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default AdminApp;