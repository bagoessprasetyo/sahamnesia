import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Newspaper,
  BookOpen,
  Image,
  User
} from 'lucide-react';
import { AdminStats, AdminActivity, AdminUser } from '@/types/admin';
import { adminService } from '@/services/admin';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
  onClick
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div 
      className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  activity: AdminActivity;
  adminUsers: AdminUser[];
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, adminUsers }) => {
  const admin = adminUsers.find(u => u.id === activity.admin_id);
  
  const getActivityIcon = () => {
    if (activity.action.includes('create')) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (activity.action.includes('update')) return <Clock className="w-4 h-4 text-blue-600" />;
    if (activity.action.includes('delete')) return <XCircle className="w-4 h-4 text-red-600" />;
    return <AlertCircle className="w-4 h-4 text-gray-600" />;
  };

  const getActivityMessage = () => {
    const resourceType = activity.resource_type.replace('_', ' ');
    const action = activity.action.replace('_', ' ');
    return `${action} ${resourceType}`;
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{admin?.name || 'Unknown Admin'}</span>
          {' '}
          <span className="text-gray-600">{getActivityMessage()}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(activity.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  onNavigate: (path: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  onNavigate
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setError(null);
      
      const [statsData, activitiesData, usersData] = await Promise.allSettled([
        adminService.getAdminStats(),
        adminService.getAdminActivities(10),
        currentAdmin.role === 'super_admin' ? adminService.getAdminUsers() : Promise.resolve([])
      ]);

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      } else {
        console.error('Failed to load stats:', statsData.reason);
      }

      if (activitiesData.status === 'fulfilled') {
        setActivities(activitiesData.value);
      } else {
        console.error('Failed to load activities:', activitiesData.reason);
      }

      if (usersData.status === 'fulfilled') {
        setAdminUsers(usersData.value);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentAdmin.role]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentAdmin.name}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentAdmin.name}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentAdmin.name}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Blog Posts"
            value={stats.blog_posts.total}
            subtitle={`${stats.blog_posts.published} published, ${stats.blog_posts.drafts} drafts`}
            icon={FileText}
            color="blue"
            onClick={() => onNavigate('/admin/blog/posts')}
          />
          
          <DashboardCard
            title="News Articles"
            value={stats.news_articles.total}
            subtitle={`${stats.news_articles.today} today`}
            icon={Newspaper}
            color="green"
            onClick={() => onNavigate('/admin/news')}
          />
          
          <DashboardCard
            title="Total Views"
            value={stats.analytics.total_views.toLocaleString()}
            subtitle={`${stats.analytics.today_views} today`}
            icon={Eye}
            color="purple"
            onClick={() => onNavigate('/admin/analytics')}
          />
          
          <DashboardCard
            title="Active Users"
            value={stats.system.active_users}
            subtitle="Admin users"
            icon={Users}
            color="yellow"
            onClick={() => currentAdmin.role === 'super_admin' && onNavigate('/admin/users')}
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button
                  onClick={() => onNavigate('/admin/activities')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {activities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      adminUsers={adminUsers}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="p-4 space-y-3">
              <button
                onClick={() => onNavigate('/admin/blog/create')}
                className="w-full flex items-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Create New Post
              </button>
              
              <button
                onClick={() => onNavigate('/admin/media')}
                className="w-full flex items-center px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
              >
                <Image className="w-5 h-5 mr-3" />
                Upload Media
              </button>
              
              <button
                onClick={() => onNavigate('/admin/analytics')}
                className="w-full flex items-center px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                View Analytics
              </button>
              
              {currentAdmin.role === 'super_admin' && (
                <button
                  onClick={() => onNavigate('/admin/users')}
                  className="w-full flex items-center px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 mr-3" />
                  Manage Users
                </button>
              )}
            </div>
          </div>

          {/* System Information */}
          {stats && (
            <div className="bg-white rounded-xl border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Info</h2>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="text-sm font-medium">{stats.system.storage_used}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium">
                    {new Date(stats.system.last_backup).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm font-medium">{stats.system.active_users}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    All systems operational
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Overview */}
      {stats && (
        <div className="bg-white rounded-xl border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Content Overview</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {stats.blog_posts.published}
                </div>
                <div className="text-sm text-gray-600">Published Posts</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {stats.blog_posts.drafts}
                </div>
                <div className="text-sm text-gray-600">Draft Posts</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.news_articles.this_week}
                </div>
                <div className="text-sm text-gray-600">News This Week</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;