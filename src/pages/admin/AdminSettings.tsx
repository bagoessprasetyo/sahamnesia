import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw,
  Globe,
  Mail,
  Shield,
  Database,
  Palette,
  Code,
  Search,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  X,
  Eye,
  EyeOff,
  Key,
  Server,
  Zap,
  Image,
  FileText,
  Users,
  Clock,
  BarChart3,
  HardDrive,
  Wifi
} from 'lucide-react';
import { AdminUser } from '@/types/admin';

interface AdminSettingsProps {
  currentAdmin: AdminUser;
  onNavigate: (path: string) => void;
}

interface SiteSettings {
  site_name: string;
  site_description: string;
  site_url: string;
  logo_url: string;
  favicon_url: string;
  footer_text: string;
  contact_email: string;
  social_links: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

interface SEOSettings {
  default_title: string;
  title_separator: string;
  default_description: string;
  default_keywords: string;
  google_analytics_id: string;
  google_search_console: string;
  facebook_pixel_id: string;
  robots_txt: string;
  sitemap_enabled: boolean;
  structured_data_enabled: boolean;
}

interface EmailSettings {
  smtp_host: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: 'none' | 'tls' | 'ssl';
  from_email: string;
  from_name: string;
  reply_to_email: string;
  test_email: string;
}

interface SecuritySettings {
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  password_require_symbols: boolean;
  session_timeout: number;
  max_login_attempts: number;
  lockout_duration: number;
  two_factor_enabled: boolean;
  allowed_file_types: string[];
  max_file_size: number;
}

interface SystemSettings {
  timezone: string;
  date_format: string;
  time_format: string;
  language: string;
  auto_backup_enabled: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  backup_retention_days: number;
  maintenance_mode: boolean;
  debug_mode: boolean;
  cache_enabled: boolean;
  cache_duration: number;
}

interface ContentSettings {
  posts_per_page: number;
  allow_comments: boolean;
  moderate_comments: boolean;
  auto_publish_enabled: boolean;
  featured_posts_limit: number;
  excerpt_length: number;
  image_compression_quality: number;
  thumbnail_sizes: {
    small: { width: number; height: number };
    medium: { width: number; height: number };
    large: { width: number; height: number };
  };
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'Sahamnesia',
  site_description: 'Platform edukasi saham dan trading untuk investor Indonesia',
  site_url: 'https://sahamnesia.com',
  logo_url: '',
  favicon_url: '',
  footer_text: '© 2024 Sahamnesia. All rights reserved.',
  contact_email: 'info@sahamnesia.com',
  social_links: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  }
};

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)' },
  { value: 'Asia/Makassar', label: 'Makassar (WITA)' },
  { value: 'Asia/Jayapura', label: 'Jayapura (WIT)' },
  { value: 'UTC', label: 'UTC' }
];

const LANGUAGE_OPTIONS = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' }
];

const AdminSettings: React.FC<AdminSettingsProps> = ({ currentAdmin, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('site');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  
  // Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [seoSettings, setSEOSettings] = useState<SEOSettings>({
    default_title: 'Sahamnesia - Edukasi Saham Indonesia',
    title_separator: ' | ',
    default_description: 'Platform terdepan untuk edukasi saham dan trading di Indonesia',
    default_keywords: 'saham, trading, investasi, indonesia, edukasi, pasar modal',
    google_analytics_id: '',
    google_search_console: '',
    facebook_pixel_id: '',
    robots_txt: '',
    sitemap_enabled: true,
    structured_data_enabled: true
  });
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: '',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: 'noreply@sahamnesia.com',
    from_name: 'Sahamnesia',
    reply_to_email: 'support@sahamnesia.com',
    test_email: ''
  });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    password_min_length: 8,
    password_require_uppercase: true,
    password_require_lowercase: true,
    password_require_numbers: true,
    password_require_symbols: false,
    session_timeout: 720, // 12 hours
    max_login_attempts: 5,
    lockout_duration: 30, // minutes
    two_factor_enabled: false,
    allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    max_file_size: 10 // MB
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    timezone: 'Asia/Jakarta',
    date_format: 'DD/MM/YYYY',
    time_format: '24h',
    language: 'id',
    auto_backup_enabled: true,
    backup_frequency: 'daily',
    backup_retention_days: 30,
    maintenance_mode: false,
    debug_mode: false,
    cache_enabled: true,
    cache_duration: 3600 // seconds
  });
  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    posts_per_page: 10,
    allow_comments: true,
    moderate_comments: true,
    auto_publish_enabled: false,
    featured_posts_limit: 5,
    excerpt_length: 150,
    image_compression_quality: 85,
    thumbnail_sizes: {
      small: { width: 150, height: 150 },
      medium: { width: 300, height: 200 },
      large: { width: 800, height: 600 }
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setError(null);
      // Mock API call - In real implementation, load settings from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Settings would be loaded here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Settings saved successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!emailSettings.test_email) {
      setError('Please enter a test email address');
      return;
    }

    try {
      setTesting(true);
      setError(null);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSuccess(`Test email sent to ${emailSettings.test_email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send test email');
    } finally {
      setTesting(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const tabs = [
    { id: 'site', label: 'Site Settings', icon: Globe },
    { id: 'seo', label: 'SEO & Analytics', icon: BarChart3 },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Server },
    { id: 'content', label: 'Content', icon: FileText }
  ];

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 mx-auto animate-spin mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">
            Configure global system settings and preferences
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
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

      {/* Settings Content */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Site Settings */}
          {activeTab === 'site' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Site Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={siteSettings.site_name}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, site_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={siteSettings.site_url}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, site_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={siteSettings.site_description}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, site_description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={siteSettings.logo_url}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="url"
                      value={siteSettings.favicon_url}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, favicon_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contact & Social</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={siteSettings.contact_email}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Footer Text
                    </label>
                    <input
                      type="text"
                      value={siteSettings.footer_text}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, footer_text: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(siteSettings.social_links).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {platform} URL
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setSiteSettings(prev => ({
                          ...prev,
                          social_links: { ...prev.social_links, [platform]: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`https://${platform}.com/sahamnesia`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Default SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Title
                    </label>
                    <input
                      type="text"
                      value={seoSettings.default_title}
                      onChange={(e) => setSEOSettings(prev => ({ ...prev, default_title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Description
                    </label>
                    <textarea
                      value={seoSettings.default_description}
                      onChange={(e) => setSEOSettings(prev => ({ ...prev, default_description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Keywords
                    </label>
                    <input
                      type="text"
                      value={seoSettings.default_keywords}
                      onChange={(e) => setSEOSettings(prev => ({ ...prev, default_keywords: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Analytics & Tracking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={seoSettings.google_analytics_id}
                      onChange={(e) => setSEOSettings(prev => ({ ...prev, google_analytics_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="GA4-XXXXXXXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      value={seoSettings.facebook_pixel_id}
                      onChange={(e) => setSEOSettings(prev => ({ ...prev, facebook_pixel_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234567890123456"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">SEO Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sitemap_enabled"
                      checked={seoSettings.sitemap_enabled}
                      onChange={(e) => setSEOSettings(prev => ({ ...prev, sitemap_enabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="sitemap_enabled" className="ml-2 text-sm text-gray-700">
                      Enable XML Sitemap Generation
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="structured_data_enabled"
                      checked={seoSettings.structured_data_enabled}
                      onChange={(e) => setSEOSettings(prev => ({ ...prev, structured_data_enabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="structured_data_enabled" className="ml-2 text-sm text-gray-700">
                      Enable Structured Data (Schema.org)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">SMTP Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtp_host}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtp_port}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="587"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtp_username}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_username: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.smtp_password ? 'text' : 'password'}
                        value={emailSettings.smtp_password}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('smtp_password')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.smtp_password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Encryption
                    </label>
                    <select
                      value={emailSettings.smtp_encryption}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_encryption: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Email Addresses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Email
                    </label>
                    <input
                      type="email"
                      value={emailSettings.from_email}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, from_email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      value={emailSettings.from_name}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, from_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reply To Email
                    </label>
                    <input
                      type="email"
                      value={emailSettings.reply_to_email}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, reply_to_email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Test Email</h3>
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Email Address
                    </label>
                    <input
                      type="email"
                      value={emailSettings.test_email}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, test_email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="test@example.com"
                    />
                  </div>
                  <button
                    onClick={handleTestEmail}
                    disabled={testing || !emailSettings.test_email}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {testing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    {testing ? 'Sending...' : 'Send Test'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Password Requirements</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="50"
                      value={securitySettings.password_min_length}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_min_length: parseInt(e.target.value) }))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { key: 'password_require_uppercase', label: 'Require uppercase letters' },
                      { key: 'password_require_lowercase', label: 'Require lowercase letters' },
                      { key: 'password_require_numbers', label: 'Require numbers' },
                      { key: 'password_require_symbols', label: 'Require symbols' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={key}
                          checked={securitySettings[key as keyof SecuritySettings] as boolean}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Session & Authentication</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="1440"
                      value={securitySettings.session_timeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={securitySettings.max_login_attempts}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lockout Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={securitySettings.lockout_duration}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, lockout_duration: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">File Upload Security</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={securitySettings.max_file_size}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, max_file_size: parseInt(e.target.value) }))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowed File Types
                    </label>
                    <input
                      type="text"
                      value={securitySettings.allowed_file_types.join(', ')}
                      onChange={(e) => setSecuritySettings(prev => ({ 
                        ...prev, 
                        allowed_file_types: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="jpg, png, gif, pdf, doc"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Localization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={systemSettings.timezone}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TIMEZONE_OPTIONS.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={systemSettings.language}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {LANGUAGE_OPTIONS.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenance_mode"
                        checked={systemSettings.maintenance_mode}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenance_mode: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="maintenance_mode" className="ml-3 text-sm font-medium text-gray-700">
                        Maintenance Mode
                      </label>
                    </div>
                    {systemSettings.maintenance_mode && (
                      <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                        Site is in maintenance mode
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="debug_mode"
                      checked={systemSettings.debug_mode}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, debug_mode: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="debug_mode" className="ml-3 text-sm text-gray-700">
                      Debug Mode (Enable detailed error logging)
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="cache_enabled"
                        checked={systemSettings.cache_enabled}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, cache_enabled: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="cache_enabled" className="ml-3 text-sm font-medium text-gray-700">
                        Enable Caching
                      </label>
                    </div>
                    {systemSettings.cache_enabled && (
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Duration:</label>
                        <input
                          type="number"
                          min="300"
                          max="86400"
                          value={systemSettings.cache_duration}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, cache_duration: parseInt(e.target.value) }))}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">seconds</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Backup Configuration</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto_backup_enabled"
                      checked={systemSettings.auto_backup_enabled}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, auto_backup_enabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="auto_backup_enabled" className="ml-3 text-sm font-medium text-gray-700">
                      Enable Automatic Backups
                    </label>
                  </div>
                  
                  {systemSettings.auto_backup_enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Backup Frequency
                        </label>
                        <select
                          value={systemSettings.backup_frequency}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, backup_frequency: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Retention (days)
                        </label>
                        <input
                          type="number"
                          min="7"
                          max="365"
                          value={systemSettings.backup_retention_days}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, backup_retention_days: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content Settings */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Content Display</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posts Per Page
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={contentSettings.posts_per_page}
                      onChange={(e) => setContentSettings(prev => ({ ...prev, posts_per_page: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt Length (words)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="500"
                      value={contentSettings.excerpt_length}
                      onChange={(e) => setContentSettings(prev => ({ ...prev, excerpt_length: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Posts Limit
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="20"
                      value={contentSettings.featured_posts_limit}
                      onChange={(e) => setContentSettings(prev => ({ ...prev, featured_posts_limit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Image Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Compression Quality (%)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={contentSettings.image_compression_quality}
                      onChange={(e) => setContentSettings(prev => ({ ...prev, image_compression_quality: parseInt(e.target.value) }))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Thumbnail Sizes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(contentSettings.thumbnail_sizes).map(([size, dimensions]) => (
                        <div key={size} className="border rounded-lg p-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">{size}</h5>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Width</label>
                              <input
                                type="number"
                                min="50"
                                max="2000"
                                value={dimensions.width}
                                onChange={(e) => setContentSettings(prev => ({
                                  ...prev,
                                  thumbnail_sizes: {
                                    ...prev.thumbnail_sizes,
                                    [size]: { ...dimensions, width: parseInt(e.target.value) }
                                  }
                                }))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Height</label>
                              <input
                                type="number"
                                min="50"
                                max="2000"
                                value={dimensions.height}
                                onChange={(e) => setContentSettings(prev => ({
                                  ...prev,
                                  thumbnail_sizes: {
                                    ...prev.thumbnail_sizes,
                                    [size]: { ...dimensions, height: parseInt(e.target.value) }
                                  }
                                }))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Content Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allow_comments"
                      checked={contentSettings.allow_comments}
                      onChange={(e) => setContentSettings(prev => ({ ...prev, allow_comments: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="allow_comments" className="ml-3 text-sm text-gray-700">
                      Allow Comments on Blog Posts
                    </label>
                  </div>
                  
                  {contentSettings.allow_comments && (
                    <div className="flex items-center pl-7">
                      <input
                        type="checkbox"
                        id="moderate_comments"
                        checked={contentSettings.moderate_comments}
                        onChange={(e) => setContentSettings(prev => ({ ...prev, moderate_comments: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="moderate_comments" className="ml-3 text-sm text-gray-700">
                        Moderate Comments Before Publishing
                      </label>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto_publish_enabled"
                      checked={contentSettings.auto_publish_enabled}
                      onChange={(e) => setContentSettings(prev => ({ ...prev, auto_publish_enabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="auto_publish_enabled" className="ml-3 text-sm text-gray-700">
                      Enable Scheduled Publishing
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;