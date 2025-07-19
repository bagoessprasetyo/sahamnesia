import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  MessageSquare, 
  Users, 
  FileText,
  Star,
  Download,
  RefreshCw,
  Clock,
  Globe,
  Loader2,
  AlertCircle,
  Target,
  Zap,
  Award,
  Activity
} from 'lucide-react';
import { BlogStats } from '@/types/blog';
import { blogService } from '@/services/blog';
import { AdminUser } from '@/types/admin';

interface AdminAnalyticsProps {
  currentAdmin: AdminUser;
  onNavigate: (path: string) => void;
}

interface AnalyticsData {
  blogStats: BlogStats;
  topPosts: Array<{
    id: number;
    title: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    published_at: string;
    category?: { name: string; color: string };
    author?: { name: string };
  }>;
  categoryPerformance: Array<{
    category: { id: number; name: string; color: string };
    post_count: number;
    total_views: number;
    avg_engagement: number;
  }>;
  authorPerformance: Array<{
    author: { id: number; name: string; avatar_url?: string };
    post_count: number;
    total_views: number;
    avg_engagement: number;
  }>;
  contentTrends: Array<{
    period: string;
    published_posts: number;
    total_views: number;
    total_engagement: number;
  }>;
  seoInsights: {
    posts_with_seo: number;
    avg_title_length: number;
    avg_description_length: number;
    featured_posts_ratio: number;
  };
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

const TIME_RANGES: TimeRange[] = [
  { label: 'Last 7 days', value: '7d', days: 7 },
  { label: 'Last 30 days', value: '30d', days: 30 },
  { label: 'Last 90 days', value: '90d', days: 90 },
  { label: 'Last 6 months', value: '6m', days: 180 },
  { label: 'Last year', value: '1y', days: 365 },
  { label: 'All time', value: 'all', days: 0 }
];

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({  }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(TIME_RANGES[1]); // 30 days default

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange]); // loadAnalyticsData is stable so we don't need it in deps

  const loadAnalyticsData = async () => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);

      // Load blog stats
      const blogStats = await blogService.getBlogStats();

      // Simulate additional analytics data - In real implementation, these would be separate API calls
      const mockData: AnalyticsData = {
        blogStats,
        topPosts: [
          {
            id: 1,
            title: "Strategi Trading BBCA: Analisis Support & Resistance",
            view_count: 1250,
            like_count: 89,
            comment_count: 23,
            published_at: "2024-01-15T10:30:00Z",
            category: { name: "Trading Strategy", color: "#10B981" },
            author: { name: "Ellen May" }
          },
          {
            id: 2,
            title: "5 Kesalahan Umum Trader Pemula",
            view_count: 987,
            like_count: 67,
            comment_count: 34,
            published_at: "2024-01-18T14:20:00Z",
            category: { name: "Edukasi", color: "#8B5CF6" },
            author: { name: "Tim Sahamnesia" }
          },
          {
            id: 3,
            title: "Analisis Fundamental UNVR Q4 2023",
            view_count: 823,
            like_count: 45,
            comment_count: 18,
            published_at: "2024-01-20T09:15:00Z",
            category: { name: "Analisis Saham", color: "#3B82F6" },
            author: { name: "Rudi Hartono" }
          }
        ],
        categoryPerformance: [
          {
            category: { id: 1, name: "Trading Strategy", color: "#10B981" },
            post_count: 15,
            total_views: 8420,
            avg_engagement: 4.2
          },
          {
            category: { id: 2, name: "Analisis Saham", color: "#3B82F6" },
            post_count: 22,
            total_views: 12350,
            avg_engagement: 3.8
          },
          {
            category: { id: 3, name: "Edukasi", color: "#8B5CF6" },
            post_count: 18,
            total_views: 9870,
            avg_engagement: 4.5
          }
        ],
        authorPerformance: [
          {
            author: { id: 1, name: "Ellen May", avatar_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" },
            post_count: 12,
            total_views: 15420,
            avg_engagement: 4.8
          },
          {
            author: { id: 2, name: "Tim Sahamnesia", avatar_url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" },
            post_count: 18,
            total_views: 22340,
            avg_engagement: 4.2
          },
          {
            author: { id: 3, name: "Rudi Hartono", avatar_url: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg" },
            post_count: 8,
            total_views: 9850,
            avg_engagement: 3.9
          }
        ],
        contentTrends: [
          { period: "Week 1", published_posts: 5, total_views: 2500, total_engagement: 180 },
          { period: "Week 2", published_posts: 7, total_views: 3200, total_engagement: 240 },
          { period: "Week 3", published_posts: 6, total_views: 2800, total_engagement: 210 },
          { period: "Week 4", published_posts: 8, total_views: 4100, total_engagement: 320 }
        ],
        seoInsights: {
          posts_with_seo: Math.round((blogStats.publishedPosts * 0.75)),
          avg_title_length: 58,
          avg_description_length: 145,
          featured_posts_ratio: Math.round((blogStats.featuredPosts / Math.max(1, blogStats.publishedPosts)) * 100)
        }
      };

      setAnalyticsData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
  };

  const handleExportData = () => {
    if (!analyticsData) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Total Posts', analyticsData.blogStats.totalPosts],
      ['Published Posts', analyticsData.blogStats.publishedPosts],
      ['Draft Posts', analyticsData.blogStats.draftPosts],
      ['Featured Posts', analyticsData.blogStats.featuredPosts],
      ['Premium Posts', analyticsData.blogStats.premiumPosts],
      ['Total Views', analyticsData.blogStats.totalViews],
      ['Total Likes', analyticsData.blogStats.totalLikes],
      ['Total Comments', analyticsData.blogStats.totalComments]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `blog-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const calculateEngagementRate = (likes: number, comments: number, views: number): number => {
    if (views === 0) return 0;
    return ((likes + comments * 2) / views) * 100;
  };

  if (loading && !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 mx-auto animate-spin mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Failed to Load Analytics</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => loadAnalyticsData()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Analytics</h1>
          <p className="text-gray-600">
            Comprehensive insights into your blog performance
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange.value}
            onChange={(e) => {
              const range = TIME_RANGES.find(r => r.value === e.target.value);
              if (range) setSelectedTimeRange(range);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TIME_RANGES.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleExportData}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.blogStats.totalViews)}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+12.5%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.blogStats.totalLikes)}
              </div>
              <div className="text-sm text-gray-600">Total Likes</div>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+8.3%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.blogStats.totalComments)}
              </div>
              <div className="text-sm text-gray-600">Total Comments</div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-sm text-red-600">-2.1%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {analyticsData.blogStats.publishedPosts}
              </div>
              <div className="text-sm text-gray-600">Published Posts</div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+5.7%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posts */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Top Performing Posts
          </h3>
          <div className="space-y-4">
            {analyticsData.topPosts.map((post, index) => (
              <div key={post.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {formatNumber(post.view_count)}
                    </span>
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {post.like_count}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {post.comment_count}
                    </span>
                  </div>
                  {post.category && (
                    <span 
                      className="inline-block mt-1 px-2 py-1 rounded-full text-xs text-white"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {calculateEngagementRate(post.like_count, post.comment_count, post.view_count).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Category Performance
          </h3>
          <div className="space-y-4">
            {analyticsData.categoryPerformance.map((item) => (
              <div key={item.category.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.category.color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.category.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.post_count} posts
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(item.total_views)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.avg_engagement.toFixed(1)}% engagement
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Author Performance & SEO Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Author Performance */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Author Performance
          </h3>
          <div className="space-y-4">
            {analyticsData.authorPerformance.map((item) => (
              <div key={item.author.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  {item.author.avatar_url ? (
                    <img
                      src={item.author.avatar_url}
                      alt={item.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.author.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.post_count} posts
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(item.total_views)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.avg_engagement.toFixed(1)}% engagement
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Insights */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            SEO Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Posts with SEO data</span>
              <span className="text-sm font-medium text-gray-900">
                {analyticsData.seoInsights.posts_with_seo} / {analyticsData.blogStats.publishedPosts}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Avg. title length</span>
              <span className={`text-sm font-medium ${
                analyticsData.seoInsights.avg_title_length >= 50 && analyticsData.seoInsights.avg_title_length <= 60 
                  ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {analyticsData.seoInsights.avg_title_length} chars
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Avg. description length</span>
              <span className={`text-sm font-medium ${
                analyticsData.seoInsights.avg_description_length >= 140 && analyticsData.seoInsights.avg_description_length <= 160 
                  ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {analyticsData.seoInsights.avg_description_length} chars
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Featured posts ratio</span>
              <span className="text-sm font-medium text-gray-900">
                {analyticsData.seoInsights.featured_posts_ratio}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Trends */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Content Publishing Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {analyticsData.contentTrends.map((trend, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {trend.published_posts}
              </div>
              <div className="text-sm text-gray-600 mb-2">{trend.period}</div>
              <div className="text-xs text-gray-500">
                {formatNumber(trend.total_views)} views
              </div>
              <div className="text-xs text-gray-500">
                {trend.total_engagement} engagements
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="p-3 bg-yellow-100 rounded-lg inline-block mb-3">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.blogStats.featuredPosts}
          </div>
          <div className="text-sm text-gray-600">Featured Posts</div>
          <div className="text-xs text-gray-500 mt-1">
            {((analyticsData.blogStats.featuredPosts / Math.max(1, analyticsData.blogStats.publishedPosts)) * 100).toFixed(1)}% of published
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="p-3 bg-purple-100 rounded-lg inline-block mb-3">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.blogStats.premiumPosts}
          </div>
          <div className="text-sm text-gray-600">Premium Posts</div>
          <div className="text-xs text-gray-500 mt-1">
            {((analyticsData.blogStats.premiumPosts / Math.max(1, analyticsData.blogStats.publishedPosts)) * 100).toFixed(1)}% of published
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="p-3 bg-gray-100 rounded-lg inline-block mb-3">
            <Clock className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.blogStats.draftPosts}
          </div>
          <div className="text-sm text-gray-600">Draft Posts</div>
          <div className="text-xs text-gray-500 mt-1">
            In progress content
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;