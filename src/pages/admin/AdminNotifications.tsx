import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Send,
  Eye,
  EyeOff,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  Save,
  Loader2,
  Calendar,
  Users,
  Mail,
  Settings,
  MessageSquare,
  Zap,
  Target,
  Globe,
  Archive,
  Download
} from 'lucide-react';
import { AdminUser, AdminNotification } from '@/types/admin';

interface AdminNotificationsProps {
  currentAdmin: AdminUser;
  onNavigate: (path: string) => void;
}

interface NotificationFormData {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action_url: string;
  action_text: string;
  target_audience: 'all' | 'admins' | 'editors' | 'specific';
  target_users: string[];
  schedule_at?: string;
  expires_at?: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  category: string;
}

const DEFAULT_FORM_DATA: NotificationFormData = {
  type: 'info',
  title: '',
  message: '',
  action_url: '',
  action_text: '',
  target_audience: 'all',
  target_users: [],
};

const NOTIFICATION_TYPES = [
  { 
    value: 'info', 
    label: 'Information', 
    icon: Info, 
    color: 'text-blue-600 bg-blue-100',
    borderColor: 'border-blue-200'
  },
  { 
    value: 'success', 
    label: 'Success', 
    icon: CheckCircle, 
    color: 'text-green-600 bg-green-100',
    borderColor: 'border-green-200'
  },
  { 
    value: 'warning', 
    label: 'Warning', 
    icon: AlertTriangle, 
    color: 'text-yellow-600 bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  { 
    value: 'error', 
    label: 'Error', 
    icon: AlertCircle, 
    color: 'text-red-600 bg-red-100',
    borderColor: 'border-red-200'
  }
];

const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    name: 'System Maintenance',
    type: 'warning',
    title: 'Scheduled System Maintenance',
    message: 'The system will be undergoing maintenance on {date} from {start_time} to {end_time}. Please save your work.',
    category: 'System'
  },
  {
    id: '2',
    name: 'New Feature Release',
    type: 'info',
    title: 'New Feature Available',
    message: 'We\'ve released a new feature: {feature_name}. Check it out and let us know what you think!',
    category: 'Product'
  },
  {
    id: '3',
    name: 'Security Alert',
    type: 'error',
    title: 'Security Alert',
    message: 'Unusual activity detected on your account. Please review your recent actions and update your password if necessary.',
    category: 'Security'
  },
  {
    id: '4',
    name: 'Content Published',
    type: 'success',
    title: 'Content Successfully Published',
    message: 'Your blog post "{post_title}" has been published and is now live on the website.',
    category: 'Content'
  }
];

const AdminNotifications: React.FC<AdminNotificationsProps> = ({ currentAdmin, onNavigate }) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState<AdminNotification | null>(null);
  const [formData, setFormData] = useState<NotificationFormData>(DEFAULT_FORM_DATA);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<AdminNotification | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setError(null);
      // Mock data - In real implementation, this would be an API call
      const mockNotifications: AdminNotification[] = [
        {
          id: '1',
          type: 'info',
          title: 'Welcome to the new CMS',
          message: 'We\'ve updated our content management system with new features. Explore the enhanced blog editor and improved analytics dashboard.',
          action_url: '/admin/analytics',
          action_text: 'View Analytics',
          is_read: false,
          created_at: '2024-01-19T10:30:00Z'
        },
        {
          id: '2',
          type: 'success',
          title: 'Blog post published',
          message: 'Your blog post "Trading Strategy for Beginners" has been successfully published and is now live.',
          action_url: '/admin/blog/posts',
          action_text: 'View Post',
          is_read: true,
          created_at: '2024-01-18T14:20:00Z'
        },
        {
          id: '3',
          type: 'warning',
          title: 'Scheduled maintenance',
          message: 'System maintenance scheduled for tonight 11 PM - 2 AM. Please save your work before then.',
          is_read: false,
          created_at: '2024-01-17T09:15:00Z'
        },
        {
          id: '4',
          type: 'error',
          title: 'Failed media upload',
          message: 'There was an issue uploading your media file. Please check the file format and try again.',
          action_url: '/admin/media',
          action_text: 'Try Again',
          is_read: true,
          created_at: '2024-01-16T16:45:00Z'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = () => {
    setEditingNotification(null);
    setFormData(DEFAULT_FORM_DATA);
    setShowForm(true);
  };

  const handleEditNotification = (notification: AdminNotification) => {
    setEditingNotification(notification);
    setFormData({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      action_url: notification.action_url || '',
      action_text: notification.action_text || '',
      target_audience: 'all',
      target_users: []
    });
    setShowForm(true);
  };

  const handleUseTemplate = (template: NotificationTemplate) => {
    setFormData(prev => ({
      ...prev,
      type: template.type,
      title: template.title,
      message: template.message
    }));
    setShowTemplates(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;

    try {
      setSaving(true);
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingNotification) {
        // Update notification
        setNotifications(prev => prev.map(notif => 
          notif.id === editingNotification.id 
            ? { 
                ...notif, 
                type: formData.type,
                title: formData.title,
                message: formData.message,
                action_url: formData.action_url || undefined,
                action_text: formData.action_text || undefined
              }
            : notif
        ));
        setSuccess('Notification updated successfully');
      } else {
        // Create notification
        const newNotification: AdminNotification = {
          id: Date.now().toString(),
          type: formData.type,
          title: formData.title,
          message: formData.message,
          action_url: formData.action_url || undefined,
          action_text: formData.action_text || undefined,
          is_read: false,
          created_at: new Date().toISOString()
        };
        setNotifications(prev => [newNotification, ...prev]);
        setSuccess('Notification created and sent successfully');
      }

      setShowForm(false);
      setEditingNotification(null);
      setFormData(DEFAULT_FORM_DATA);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notification');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNotification = async (notification: AdminNotification) => {
    try {
      setDeleting(notification.id);
      setError(null);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      setSuccess('Notification deleted successfully');
      setShowDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    } finally {
      setDeleting(null);
    }
  };

  const handleMarkAsRead = async (notification: AdminNotification) => {
    setNotifications(prev => prev.map(n => 
      n.id === notification.id 
        ? { ...n, is_read: !n.is_read }
        : n
    ));
  };

  const handleBulkMarkAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setSuccess('All notifications marked as read');
  };

  const getTypeConfig = (type: string) => {
    return NOTIFICATION_TYPES.find(t => t.value === type) || NOTIFICATION_TYPES[0];
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'read' && notification.is_read) ||
                         (selectedStatus === 'unread' && !notification.is_read);
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Management</h1>
          <p className="text-gray-600">
            Create and manage system notifications for admin users
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBulkMarkAsRead}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </button>
          <button
            onClick={handleCreateNotification}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Notification
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800">{success}</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total Notifications</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.is_read).length}
              </div>
              <div className="text-sm text-gray-600">Read</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => !n.is_read).length}
              </div>
              <div className="text-sm text-gray-600">Unread</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => {
                  const today = new Date();
                  const notifDate = new Date(n.created_at);
                  return notifDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <div className="text-sm text-gray-600">Sent Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {NOTIFICATION_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 mx-auto animate-spin mb-4" />
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedType !== 'all' || selectedStatus !== 'all' 
                ? 'Try adjusting your search criteria.' 
                : 'Create your first notification to get started.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => {
              const typeConfig = getTypeConfig(notification.type);
              const TypeIcon = typeConfig.icon;
              
              return (
                <div key={notification.id} className={`p-6 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(notification.created_at)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color} ${typeConfig.borderColor} border`}>
                            {typeConfig.label}
                          </span>
                        </div>
                        
                        {notification.action_url && notification.action_text && (
                          <div className="mt-3">
                            <button
                              onClick={() => onNavigate(notification.action_url!)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              {notification.action_text} →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMarkAsRead(notification)}
                        className={`p-1 transition-colors ${
                          notification.is_read 
                            ? 'text-gray-400 hover:text-gray-600' 
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                        title={notification.is_read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {notification.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleEditNotification(notification)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit notification"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => setShowDeleteConfirm(notification)}
                        disabled={deleting === notification.id}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete notification"
                      >
                        {deleting === notification.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingNotification ? 'Edit Notification' : 'Create Notification'}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Templates
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Type *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {NOTIFICATION_TYPES.map((type) => {
                        const TypeIcon = type.icon;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                            className={`p-3 border rounded-lg transition-colors ${
                              formData.type === type.value
                                ? `${type.color} ${type.borderColor} border-2`
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <TypeIcon className={`w-5 h-5 mx-auto mb-1 ${
                              formData.type === type.value ? '' : 'text-gray-400'
                            }`} />
                            <div className={`text-sm font-medium ${
                              formData.type === type.value ? '' : 'text-gray-600'
                            }`}>
                              {type.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter notification title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter notification message"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Action URL
                      </label>
                      <input
                        type="text"
                        value={formData.action_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, action_url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="/admin/analytics"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Action Text
                      </label>
                      <input
                        type="text"
                        value={formData.action_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, action_text: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="View Analytics"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={formData.target_audience}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Users</option>
                      <option value="admins">Admins Only</option>
                      <option value="editors">Editors Only</option>
                      <option value="specific">Specific Users</option>
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
                  <div className={`border rounded-lg p-4 bg-white ${getTypeConfig(formData.type).borderColor}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeConfig(formData.type).color}`}>
                        {(() => {
                          const TypeIcon = getTypeConfig(formData.type).icon;
                          return <TypeIcon className="w-5 h-5" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">
                          {formData.title || 'Notification Title'}
                        </h5>
                        <p className="text-gray-600 text-sm mb-2">
                          {formData.message || 'Notification message will appear here...'}
                        </p>
                        {formData.action_text && (
                          <button className="text-blue-600 text-sm font-medium">
                            {formData.action_text} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.title.trim() || !formData.message.trim()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {editingNotification ? 'Update' : 'Send'} Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notification Templates</h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {NOTIFICATION_TEMPLATES.map((template) => {
                  const typeConfig = getTypeConfig(template.type);
                  const TypeIcon = typeConfig.icon;
                  
                  return (
                    <div key={template.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${typeConfig.borderColor}`}
                         onClick={() => handleUseTemplate(template)}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                              {template.category}
                            </span>
                          </div>
                          <h5 className="font-medium text-gray-800 mb-1">{template.title}</h5>
                          <p className="text-gray-600 text-sm">{template.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Notification</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{showDeleteConfirm.title}"? This action cannot be undone.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteNotification(showDeleteConfirm)}
                  disabled={deleting === showDeleteConfirm.id}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting === showDeleteConfirm.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;