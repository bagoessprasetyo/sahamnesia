import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  User, 
  FileText,
  Mail,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Camera,
  Link,
  Users,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { BlogAuthor, BlogAuthorCreate, BlogAuthorUpdate } from '@/types/blog';
import { blogService } from '@/services/blog';

interface AdminAuthorsProps {
  currentAdmin: any;
  onNavigate: (path: string) => void;
}

interface AuthorFormData {
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  role: string;
  email: string;
  social_links: Record<string, string>;
  is_active: boolean;
}

const DEFAULT_FORM_DATA: AuthorFormData = {
  name: '',
  slug: '',
  bio: '',
  avatar_url: '',
  role: 'Author',
  email: '',
  social_links: {
    twitter: '',
    linkedin: '',
    website: '',
    instagram: ''
  },
  is_active: true
};

const ROLE_OPTIONS = [
  'Author',
  'Editor', 
  'Senior Analyst',
  'Lead Analyst',
  'Trading Expert',
  'Guest Writer',
  'Contributor'
];

const SOCIAL_PLATFORMS = [
  { key: 'twitter', label: 'Twitter', icon: 'twitter' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { key: 'website', label: 'Website', icon: 'globe' },
  { key: 'instagram', label: 'Instagram', icon: 'instagram' }
];

const AdminAuthors: React.FC<AdminAuthorsProps> = ({ currentAdmin, onNavigate }) => {
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [authorStats, setAuthorStats] = useState<Array<{ author: BlogAuthor; post_count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<BlogAuthor | null>(null);
  const [formData, setFormData] = useState<AuthorFormData>(DEFAULT_FORM_DATA);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<BlogAuthor | null>(null);

  useEffect(() => {
    loadAuthors();
    loadAuthorStats();
  }, []);

  const loadAuthors = async () => {
    try {
      setError(null);
      const data = await blogService.getAllBlogAuthors();
      setAuthors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load authors');
    } finally {
      setLoading(false);
    }
  };

  const loadAuthorStats = async () => {
    try {
      const stats = await blogService.getAuthorStats();
      setAuthorStats(stats);
    } catch (err) {
      console.warn('Failed to load author stats:', err);
    }
  };

  const handleCreateAuthor = () => {
    setEditingAuthor(null);
    setFormData(DEFAULT_FORM_DATA);
    setShowForm(true);
  };

  const handleEditAuthor = (author: BlogAuthor) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      slug: author.slug,
      bio: author.bio || '',
      avatar_url: author.avatar_url || '',
      role: author.role,
      email: author.email || '',
      social_links: author.social_links || {
        twitter: '',
        linkedin: '',
        website: '',
        instagram: ''
      },
      is_active: author.is_active
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      setError(null);

      if (editingAuthor) {
        const updateData: BlogAuthorUpdate = {
          name: formData.name,
          slug: formData.slug || undefined,
          bio: formData.bio || undefined,
          avatar_url: formData.avatar_url || undefined,
          role: formData.role,
          email: formData.email || undefined,
          social_links: formData.social_links,
          is_active: formData.is_active
        };
        await blogService.updateBlogAuthor(editingAuthor.id, updateData);
        setSuccess('Author updated successfully');
      } else {
        const createData: BlogAuthorCreate = {
          name: formData.name,
          slug: formData.slug || undefined,
          bio: formData.bio || undefined,
          avatar_url: formData.avatar_url || undefined,
          role: formData.role,
          email: formData.email || undefined,
          social_links: formData.social_links,
          is_active: formData.is_active
        };
        await blogService.createBlogAuthor(createData);
        setSuccess('Author created successfully');
      }

      setShowForm(false);
      setEditingAuthor(null);
      setFormData(DEFAULT_FORM_DATA);
      await loadAuthors();
      await loadAuthorStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save author');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAuthor = async (author: BlogAuthor) => {
    try {
      setDeleting(author.id);
      setError(null);
      
      await blogService.deleteBlogAuthor(author.id);
      setSuccess('Author deleted successfully');
      setShowDeleteConfirm(null);
      await loadAuthors();
      await loadAuthorStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete author');
    } finally {
      setDeleting(null);
    }
  };

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData(prev => ({ ...prev, slug }));
  };

  const getPostCount = (authorId: number): number => {
    const stat = authorStats.find(s => s.author.id === authorId);
    return stat?.post_count || 0;
  };

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Authors Management</h1>
          <p className="text-gray-600">
            Manage blog authors and their profiles
          </p>
        </div>
        <button
          onClick={handleCreateAuthor}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Author
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{authors.length}</div>
              <div className="text-sm text-gray-600">Total Authors</div>
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
                {authors.filter(a => a.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Active Authors</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {authorStats.reduce((sum, stat) => sum + stat.post_count, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {authorStats.length > 0 
                  ? Math.round(authorStats.reduce((sum, stat) => sum + stat.post_count, 0) / authorStats.length)
                  : 0
                }
              </div>
              <div className="text-sm text-gray-600">Avg Posts/Author</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Authors Grid */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 mx-auto animate-spin mb-4" />
            <p className="text-gray-600">Loading authors...</p>
          </div>
        ) : filteredAuthors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No authors found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first author to get started.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredAuthors.map((author) => (
              <div key={author.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {author.avatar_url ? (
                      <img
                        src={author.avatar_url}
                        alt={author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{author.name}</h3>
                      <p className="text-sm text-blue-600">{author.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditAuthor(author)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit author"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(author)}
                      disabled={deleting === author.id}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete author"
                    >
                      {deleting === author.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {author.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {author.bio}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {author.email && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{author.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{getPostCount(author.id)} posts</span>
                  </div>
                </div>

                {/* Social Links */}
                {author.social_links && Object.values(author.social_links).some(Boolean) && (
                  <div className="flex items-center space-x-2 mb-4">
                    {Object.entries(author.social_links).map(([platform, url]) => {
                      if (!url) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title={`${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                        >
                          {platform === 'website' ? (
                            <Globe className="w-4 h-4" />
                          ) : (
                            <ExternalLink className="w-4 h-4" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Created {new Date(author.created_at).toLocaleDateString('id-ID')}
                  </span>
                  {author.is_active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Author Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingAuthor ? 'Edit Author' : 'Create Author'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (!formData.slug || formData.slug === generateSlug(formData.name)) {
                        generateSlug(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter author name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ROLE_OPTIONS.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Auto-generated from name"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Author's professional biography"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                    {formData.avatar_url && (
                      <img
                        src={formData.avatar_url}
                        alt="Preview"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="author@example.com"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Social Links
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <div key={platform.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {platform.label}
                      </label>
                      <input
                        type="url"
                        value={formData.social_links[platform.key] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          social_links: {
                            ...prev.social_links,
                            [platform.key]: e.target.value
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`${platform.label} URL`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active author
                </label>
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
                  disabled={saving || !formData.name.trim()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingAuthor ? 'Update' : 'Create'} Author
                </button>
              </div>
            </form>
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Author</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{showDeleteConfirm.name}"? 
                {getPostCount(showDeleteConfirm.id) > 0 && (
                  <span className="text-red-600 font-medium">
                    {' '}This author has {getPostCount(showDeleteConfirm.id)} post(s) written.
                  </span>
                )}
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteAuthor(showDeleteConfirm)}
                  disabled={deleting === showDeleteConfirm.id}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting === showDeleteConfirm.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Author
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuthors;