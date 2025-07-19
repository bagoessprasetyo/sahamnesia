import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload, 
  X, 
  AlertCircle,
  Check,
  Clock,
  Globe,
  Lock,
  Star,
  Tag,
  User,
  Calendar
} from 'lucide-react';
import { BlogPost, BlogPostCreate, BlogPostUpdate, BlogCategory, BlogAuthor } from '@/types/blog';
import { blogService } from '@/services/blog';
import { AdminUser } from '@/types/admin';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface BlogPostFormProps {
  currentAdmin: AdminUser;
  postId?: number; // If editing existing post
  onNavigate: (path: string) => void;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author_id: number | null;
  category_id: number | null;
  tags: string[];
  is_featured: boolean;
  is_premium: boolean;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  seo_title: string;
  seo_description: string;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ currentAdmin, postId, onNavigate }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    author_id: null,
    category_id: null,
    tags: [],
    is_featured: false,
    is_premium: false,
    status: 'draft',
    published_at: '',
    seo_title: '',
    seo_description: ''
  });

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isEditing = !!postId;
  const pageTitle = isEditing ? 'Edit Blog Post' : 'Create Blog Post';

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesData, authorsData] = await Promise.all([
          blogService.getAllBlogCategories(),
          blogService.getAllBlogAuthors()
        ]);

        setCategories(categoriesData);
        setAuthors(authorsData);

        // Set default author to current admin if available, or first author
        const currentAuthor = authorsData.find(author => 
          author.email === currentAdmin.email
        );
        if (currentAuthor && !isEditing) {
          setFormData(prev => ({ ...prev, author_id: currentAuthor.id }));
        } else if (authorsData.length > 0 && !isEditing) {
          setFormData(prev => ({ ...prev, author_id: authorsData[0].id }));
        }

        // Load existing post data if editing
        if (isEditing) {
          const postData = await blogService.getBlogPostById(postId);
          if (postData) {
            setFormData({
              title: postData.title || '',
              slug: postData.slug || '',
              excerpt: postData.excerpt || '',
              content: postData.content || '',
              featured_image_url: postData.featured_image_url || '',
              author_id: postData.author_id || null,
              category_id: postData.category_id || null,
              tags: postData.tags || [],
              is_featured: postData.is_featured || false,
              is_premium: postData.is_premium || false,
              status: postData.status || 'draft',
              published_at: postData.published_at || '',
              seo_title: postData.seo_title || '',
              seo_description: postData.seo_description || ''
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId, isEditing, currentAdmin.email]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !isEditing) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  // Auto-save functionality (only for editing existing posts)
  useEffect(() => {
    if (!isEditing || !formData.title.trim() || saving) return;

    const autoSaveTimer = setInterval(async () => {
      if (formData.title.trim() && formData.content.trim()) {
        try {
          setAutoSaving(true);
          await blogService.updateBlogPost({ id: postId, ...formData });
          setLastSaved(new Date());
        } catch (err) {
          console.warn('Auto-save failed:', err);
        } finally {
          setAutoSaving(false);
        }
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [formData, saving, isEditing, postId]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    // Strip HTML tags for word count
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').length : 0;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleAutoSave = async (content: string) => {
    if (!isEditing || !formData.title.trim()) return;
    
    try {
      await blogService.updateBlogPost({ 
        id: postId, 
        ...formData, 
        content,
        reading_time: calculateReadingTime(content)
      });
    } catch (err) {
      console.warn('Auto-save failed:', err);
      throw err; // Let RichTextEditor handle the error display
    }
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.slug.trim()) return 'Slug is required';
    if (!formData.content.trim()) return 'Content is required';
    if (!formData.author_id) return 'Author is required';
    if (!formData.category_id) return 'Category is required';
    return null;
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      const saveData = {
        ...formData,
        status: status || formData.status,
        reading_time: calculateReadingTime(formData.content),
        published_at: status === 'published' ? new Date().toISOString() : formData.published_at
      };

      if (isEditing) {
        await blogService.updateBlogPost({ id: postId, ...saveData });
        setSuccess('Post updated successfully!');
      } else {
        const newPost = await blogService.createBlogPost(saveData);
        setSuccess('Post created successfully!');
        // Redirect to edit mode for the new post
        if (status === 'published') {
          setTimeout(() => onNavigate('/admin/blog/posts'), 1500);
        } else {
          setTimeout(() => onNavigate(`/admin/blog/edit/${newPost.id}`), 1500);
        }
      }

      setLastSaved(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('/admin/blog/posts')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {lastSaved && (
                <span className="flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {autoSaving && (
                <span className="flex items-center text-blue-600">
                  <Clock className="w-3 h-3 mr-1 animate-spin" />
                  Auto-saving...
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Globe className="w-4 h-4 mr-2" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter post title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  /blog/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="post-slug"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Brief description of the post..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={saving}
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl border p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Content *
            </label>
            
            {previewMode ? (
              <div className="prose max-w-none min-h-96 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div 
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content to preview...</p>' }}
                />
              </div>
            ) : (
              <RichTextEditor
                value={formData.content}
                onChange={(content) => handleInputChange('content', content)}
                placeholder="Start writing your blog post content..."
                readOnly={saving}
                onAutoSave={isEditing ? handleAutoSave : undefined}
                autoSaveInterval={30000}
              />
            )}
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                placeholder="SEO optimized title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              />
              <div className="mt-1 text-xs text-gray-500">
                {formData.seo_title.length}/60 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                placeholder="SEO meta description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={saving}
              />
              <div className="mt-1 text-xs text-gray-500">
                {formData.seo_description.length}/160 characters
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publish Settings */}
          <div className="bg-white rounded-xl border p-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Publish Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <select
                value={formData.author_id || ''}
                onChange={(e) => handleInputChange('author_id', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="">Select author...</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="">Select category...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  disabled={saving}
                />
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                <span className="text-sm text-gray-700">Featured Post</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_premium}
                  onChange={(e) => handleInputChange('is_premium', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  disabled={saving}
                />
                <Lock className="w-4 h-4 mr-1 text-purple-500" />
                <span className="text-sm text-gray-700">Premium Content</span>
              </label>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl border p-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Featured Image</h3>
            
            <ImageUpload
              value={formData.featured_image_url}
              onChange={(url) => handleInputChange('featured_image_url', url)}
              placeholder="Upload featured image"
              maxSize={5}
              showUrlInput={true}
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border p-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Tags</h3>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                placeholder="Add tag..."
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={saving}
              />
              <button
                onClick={handleTagAdd}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                disabled={saving}
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 text-gray-500 hover:text-red-600"
                    disabled={saving}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostForm;