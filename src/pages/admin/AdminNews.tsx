import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  RefreshCw, 
  Eye, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  Globe, 
  Tag, 
  AlertCircle, 
  Loader2,
  FileText,
  Star,
  Hash,
  Download,
  Activity
} from 'lucide-react';
import { Article } from '@/types/article';
import { articleService } from '@/services/articles';
import { newsAnalyticsService, MarketSentiment } from '@/services/newsAnalytics';
import { AdminUser } from '@/types/admin';

interface AdminNewsProps {
  currentAdmin: AdminUser;
  onNavigate: (path: string) => void;
}

interface NewsFilters {
  search: string;
  category: string;
  dateRange: string;
  source: string;
  limit: number;
  offset: number;
}

const AdminNews: React.FC<AdminNewsProps> = ({  }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [sourcesStats, setSourcesStats] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState<NewsFilters>({
    search: '',
    category: '',
    dateRange: '7days',
    source: '',
    limit: 20,
    offset: 0
  });

  // Load articles
  useEffect(() => {
    loadArticles();
  }, [filters]);

  // Load analytics when articles change
  useEffect(() => {
    if (articles.length > 0) {
      loadMarketSentiment();
      calculateTrendingTopics();
      calculateSourcesStats();
    }
  }, [articles]);

  const loadArticles = async () => {
    try {
      setError(null);
      if (filters.offset === 0) setLoading(true);
      
      const response = await articleService.getArticles({
        search: filters.search || undefined,
        category: filters.category || undefined,
        limit: filters.limit,
        offset: filters.offset
      });

      console.log('NEWS REsPONSE : ',response)
      
      if (filters.offset === 0) {
        setArticles(response.data);
      } else {
        setArticles(prev => [...prev, ...response.data]);
      }
      
      setTotalArticles(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMarketSentiment = async () => {
    try {
      const sentiment = await newsAnalyticsService.getMarketSentiment(articles.slice(0, 10));
      setMarketSentiment(sentiment);
    } catch (err) {
      console.warn('Failed to load market sentiment:', err);
    }
  };

  const calculateTrendingTopics = () => {
    const topicCounts: Record<string, number> = {};
    
    articles.forEach(article => {
      if (article.keywords) {
        const topics = article.keywords.split(',').map(k => k.trim().toLowerCase());
        topics.forEach(topic => {
          if (topic.length > 2) {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
          }
        });
      }
    });

    const sorted = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic]) => topic);
    
    setTrendingTopics(sorted);
  };

  const calculateSourcesStats = () => {
    const sourcesCounts: Record<string, number> = {};
    
    articles.forEach(article => {
      const source = getSourceDomain(article.url || '');
      if (source !== 'Unknown Source') {
        sourcesCounts[source] = (sourcesCounts[source] || 0) + 1;
      }
    });

    setSourcesStats(sourcesCounts);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setFilters(prev => ({ ...prev, offset: 0 }));
    await loadArticles();
    await loadMarketSentiment();
  };

  const handleLoadMore = () => {
    setFilters(prev => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm, offset: 0 }));
  };

  const handleExportData = () => {
    const csvContent = [
      ['ID', 'Title', 'Description', 'Source', 'Date', 'Keywords', 'URL'],
      ...articles.map(article => [
        article.id,
        `"${article.title?.replace(/"/g, '""') || ''}"`,
        `"${article.description?.replace(/"/g, '""') || ''}"`,
        getSourceDomain(article.url || ''),
        formatDate(article.date_post || article.created_at),
        `"${article.keywords?.replace(/"/g, '""') || ''}"`,
        article.url || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `news-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Unknown Source';
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'saham': 'bg-blue-100 text-blue-800',
      'ekonomi': 'bg-green-100 text-green-800',
      'pasar': 'bg-purple-100 text-purple-800',
      'investasi': 'bg-yellow-100 text-yellow-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  const categories = Array.from(new Set(articles.map(a => {
    const tags = a.keywords ? a.keywords.split(',').map(k => k.trim()) : [];
    return tags[0] || 'Uncategorized';
  }))).filter(Boolean);

  const sources = Array.from(new Set(articles.map(a => getSourceDomain(a.url || ''))))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Monitor</h1>
          <p className="text-gray-600">
            {totalArticles} articles monitored • Last updated: {new Date().toLocaleTimeString('id-ID')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportData}
            disabled={articles.length === 0}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Sentiment Card */}
        {marketSentiment && (
          <div className="lg:col-span-2 bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Market Sentiment Analysis
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{marketSentiment.bullish}%</div>
                <div className="text-sm text-gray-600">Bullish</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">{marketSentiment.bearish}%</div>
                <div className="text-sm text-gray-600">Bearish</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-2xl font-bold text-gray-600">{marketSentiment.neutral}%</div>
                <div className="text-sm text-gray-600">Neutral</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {marketSentiment.summary}
            </p>
          </div>
        )}

        {/* Trending Topics */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Hash className="w-5 h-5 mr-2" />
            Trending Topics
          </h3>
          <div className="space-y-2">
            {trendingTopics.slice(0, 8).map((topic, index) => (
              <div key={topic} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded transition-colors">
                <span className="text-sm text-gray-700 capitalize">{topic}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                  <button
                    onClick={() => handleSearch(topic)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:bg-blue-100 rounded transition-all"
                    title="Search this topic"
                  >
                    <Search className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {trendingTopics.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No trending topics available</p>
            )}
          </div>
        </div>
      </div>

      {/* Source Statistics & Monitoring Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Source Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(sourcesStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([source, count]) => (
                <div key={source} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                     onClick={() => setFilters(prev => ({ ...prev, source, offset: 0 }))}>
                  <div className="text-sm font-medium text-gray-900 truncate">{source}</div>
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-xs text-gray-500">articles</div>
                </div>
              ))}
            {Object.keys(sourcesStats).length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-sm text-gray-500">No source data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Monitoring Status */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Scraping Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Update</span>
              <span className="text-sm font-medium text-gray-900">
                {articles.length > 0 ? formatDate(articles[0].date_post || articles[0].created_at) : 'No data'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Sources</span>
              <span className="text-sm font-medium text-gray-900">{Object.keys(sourcesStats).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Articles Today</span>
              <span className="text-sm font-medium text-gray-900">
                {articles.filter(a => {
                  const articleDate = new Date(a.date_post || a.created_at);
                  const today = new Date();
                  return articleDate.toDateString() === today.toDateString();
                }).length}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Data Quality</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min(100, (articles.filter(a => a.description && a.keywords).length / Math.max(1, articles.length)) * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((articles.filter(a => a.description && a.keywords).length / Math.max(1, articles.length)) * 100)}% Complete Data
              </div>
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
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, offset: 0 }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value, offset: 0 }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>

          {/* Date Range */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value, offset: 0 }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1day">Last 24 hours</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading && articles.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 mx-auto animate-spin mb-4" />
            <p className="text-gray-600">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or refresh the data.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {articles.map((article) => {
              const tags = article.keywords ? article.keywords.split(',').map(k => k.trim()) : [];
              const category = tags[0] || 'Uncategorized';
              const source = getSourceDomain(article.url || '');

              return (
                <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          {source}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(article.date_post || article.created_at)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      {article.description && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                          {article.description}
                        </p>
                      )}
                      
                      {tags.length > 1 && (
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(1, 4).map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              <Hash className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {tags.length > 4 && (
                            <span className="text-xs text-gray-500">+{tags.length - 4} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Preview article"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {article.url && (
                        <button
                          onClick={() => window.open(article.url || '', '_blank')}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Open source"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {!loading && articles.length < totalArticles && (
          <div className="p-6 border-t border-gray-200 text-center">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More Articles
            </button>
          </div>
        )}
      </div>

      {/* Article Preview Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Article Preview</h3>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-500">
                  {getSourceDomain(selectedArticle.url || '')} • {formatDate(selectedArticle.date_post || selectedArticle.created_at)}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedArticle.title}
              </h1>
              
              {selectedArticle.description && (
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {selectedArticle.description}
                </p>
              )}
              
              {selectedArticle.content && (
                <div className="prose max-w-none">
                  <div 
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  ID: {selectedArticle.id} • Keywords: {selectedArticle.keywords || 'None'}
                </div>
                {selectedArticle.url && (
                  <button
                    onClick={() => window.open(selectedArticle.url || '', '_blank')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Source
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNews;