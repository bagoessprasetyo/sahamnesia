import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  ChevronDown,
  RefreshCw,
  Upload,
  Download
} from 'lucide-react';
import { BlogPost, BlogFilters, BlogCategory, BlogAuthor } from '@/types/blog';
import { blogService } from '@/services/blog';
import { AdminUser } from '@/types/admin';

interface BlogPostsListProps {
  currentAdmin: AdminUser;
  onNavigate: (path: string) => void;
}

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

const BlogPostsList: React.FC<BlogPostsListProps> = ({ currentAdmin, onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<BlogFilters>({
    status: 'all',
    limit: 20,
    offset: 0
  });
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // UI states
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Table columns configuration
  const columns: TableColumn[] = [
    { key: 'title', label: 'Title', sortable: true, width: 'flex-1' },
    { key: 'author', label: 'Author', sortable: true, width: 'w-32' },
    { key: 'category', label: 'Category', sortable: true, width: 'w-32' },
    { key: 'status', label: 'Status', sortable: true, width: 'w-24' },
    { key: 'published_at', label: 'Published', sortable: true, width: 'w-32' },
    { key: 'view_count', label: 'Views', sortable: true, width: 'w-20' },
    { key: 'actions', label: 'Actions', width: 'w-24' }
  ];

  // Load data on component mount and when filters change
  useEffect(() => {
    loadData();
  }, [filters, sortBy, sortOrder, currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchQuery, offset: 0 }));
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const loadData = async () => {
    try {
      setError(null);
      if (currentPage === 1) setLoading(true);

      const currentFilters = {
        ...filters,
        sort_by: sortBy as any,
        sort_order: sortOrder,
        offset: (currentPage - 1) * (filters.limit || 20)
      };

      const [postsResponse, categoriesData, authorsData] = await Promise.all([
        blogService.getBlogPosts(currentFilters),
        categories.length === 0 ? blogService.getBlogCategories() : Promise.resolve(categories),
        authors.length === 0 ? blogService.getBlogAuthors() : Promise.resolve(authors)
      ]);

      setPosts(postsResponse.data);
      setTotalPosts(postsResponse.total);
      
      if (categories.length === 0) setCategories(categoriesData);
      if (authors.length === 0) setAuthors(authorsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleSelectPost = (postId: number) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id));
    }
  };

  const handleDeletePost = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const confirmed = confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setLoading(true);
      await blogService.deleteBlogPost(postId);
      
      // Remove from local state
      setPosts(prev => prev.filter(p => p.id !== postId));
      setSelectedPosts(prev => prev.filter(id => id !== postId));
      setTotalPosts(prev => prev - 1);
      
      // Show success message (optional)
      console.log('Post deleted successfully');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPost = (post: BlogPost) => {
    if (post.status === 'published') {
      // Open published post in new tab (you can customize this URL)
      window.open(`/blog/${post.slug}`, '_blank');
    } else {
      // For draft posts, show preview modal or navigate to preview mode
      alert(`Preview for "${post.title}" - Status: ${post.status}\n\nPreview functionality can be customized here.`);
    }
  };

  const handleBulkAction = async (action: 'publish' | 'archive' | 'delete') => {
    if (selectedPosts.length === 0) return;

    const actionText = action === 'delete' ? 'delete' : action;
    const confirmed = confirm(`Are you sure you want to ${actionText} ${selectedPosts.length} post(s)?`);
    if (!confirmed) return;

    try {
      setLoading(true);
      
      if (action === 'delete') {
        // Delete posts
        await Promise.all(selectedPosts.map(id => blogService.deleteBlogPost(id)));
        setPosts(prev => prev.filter(post => !selectedPosts.includes(post.id)));
        setTotalPosts(prev => prev - selectedPosts.length);
      } else {
        // Update status for publish/archive
        const newStatus = action === 'publish' ? 'published' : 'archived';
        await Promise.all(
          selectedPosts.map(id => 
            blogService.updateBlogPost({ 
              id, 
              status: newStatus,
              published_at: action === 'publish' ? new Date().toISOString() : undefined
            })
          )
        );
        
        // Update local state
        setPosts(prev => prev.map(post => 
          selectedPosts.includes(post.id) 
            ? { ...post, status: newStatus as any, published_at: action === 'publish' ? new Date().toISOString() : post.published_at }
            : post
        ));
      }
      
      setSelectedPosts([]);
      console.log(`Bulk ${action} completed successfully`);
    } catch (err) {
      console.error(`Failed to ${action} posts:`, err);
      alert(`Failed to ${action} posts. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalPages = Math.ceil(totalPosts / (filters.limit || 20));

  if (loading && currentPage === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600">Manage your blog content</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
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
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">
            {totalPosts} total posts • {posts.filter(p => p.status === 'published').length} published
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => onNavigate('/admin/blog/create')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status || 'all'}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any, offset: 0 }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, offset: 0 }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </select>

          {/* Author Filter */}
          <select
            value={filters.author || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value, offset: 0 }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author.id} value={author.slug}>{author.name}</option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <span className="text-sm text-blue-700">
              {selectedPosts.length} post(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleBulkAction('publish')}
                disabled={loading}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Publish
              </button>
              <button 
                onClick={() => handleBulkAction('archive')}
                disabled={loading}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Archive
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                disabled={loading}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === posts.length && posts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width || ''} ${
                      column.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && sortBy === column.key && (
                        <ChevronDown className={`w-3 h-3 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleSelectPost(post.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start space-x-3">
                      {post.featured_image_url && (
                        <img
                          src={post.featured_image_url}
                          alt=""
                          className="w-12 h-8 object-cover rounded border flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p className="text-sm text-gray-500 truncate">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          {post.is_featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                          {post.is_premium && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {post.author?.name || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {post.category && (
                      <span 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${post.category.color}20`, 
                          color: post.category.color 
                        }}
                      >
                        {post.category.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {formatDate(post.published_at || post.created_at)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {post.view_count.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onNavigate(`/admin/blog/edit/${post.id}`)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePreviewPost(post)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Preview post"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Upload className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filters.status !== 'all' ? 'Try adjusting your filters' : 'Get started by creating your first blog post'}
            </p>
            {(!searchQuery && filters.status === 'all') && (
              <button
                onClick={() => onNavigate('/admin/blog/create')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * (filters.limit || 20)) + 1} to{' '}
              {Math.min(currentPage * (filters.limit || 20), totalPosts)} of{' '}
              {totalPosts} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostsList;