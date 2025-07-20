import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  ArrowUpRight, 
  ChevronRight, 
  TrendingDown, 
  TrendingUp, 
  Bell,
  Filter,
  Search,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { articleService } from "@/services/articles";
import { Article } from "@/types/article";
import { newsAnalyticsService, MarketSentiment, TrendingArticle } from "@/services/newsAnalytics";
import { newsletterService, NewsletterResponse } from "@/services/newsletter";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  author: string;
  imageUrl?: string;
  isBreaking?: boolean;
  trending?: "up" | "down";
  change?: string;
  readTime: string;
  source: string;
}

interface MarketNewsProps {
  onNavigate?: (page: string, newsId?: string) => void;
}

const News: React.FC<MarketNewsProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>([]);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  
  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Filter and date state
  const [showFilters, setShowFilters] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'trending'>('newest');

  // Category mapping for better consistency
  const getCategoryFromKeywords = useCallback((keywords: string | null): string => {
    if (!keywords) return 'Market Update';
    
    const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
    
    // Priority mapping to ensure consistent categories
    const categoryMap: { [key: string]: string } = {
      'saham': 'Analisis Saham',
      'ihsg': 'Market Update', 
      'ekonomi': 'Ekonomi',
      'regulasi': 'Regulasi',
      'ipo': 'IPO',
      'dividen': 'Dividen',
      'merger': 'Korporasi',
      'akuisisi': 'Korporasi',
      'trading': 'Trading Strategy',
      'investasi': 'Edukasi',
      'fundamental': 'Analisis Saham',
      'teknikal': 'Trading Strategy'
    };
    
    // Find first matching category
    for (const keyword of keywordList) {
      if (categoryMap[keyword]) {
        return categoryMap[keyword];
      }
    }
    
    // If no match found, use first keyword (capitalized) or default
    return keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Market Update';
  }, []);

  // Helper function to convert Article to NewsArticle
  const convertArticleToNews = useCallback((article: Article): NewsArticle => {
    return {
      id: article.id.toString(),
      title: article.title || 'Untitled News',
      excerpt: article.description || 'No description available',
      category: getCategoryFromKeywords(article.keywords),
      publishedAt: article.date_post ? new Date(article.date_post).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ' • ' + new Date(article.date_post).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }) : new Date(article.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      }) + ' • ' + new Date(article.created_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      author: article.author || 'Tim Redaksi Sahamnesia',
      imageUrl: article.image_url || 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg',
      isBreaking: Math.random() > 0.7, // Random breaking news flag
      trending: Math.random() > 0.5 ? (Math.random() > 0.5 ? 'up' : 'down') : undefined,
      change: Math.random() > 0.5 ? `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5 + 0.1).toFixed(1)}%` : undefined,
      readTime: Math.ceil((article.content?.length || 0) / 200) + ' menit',
      source: article.source || 'Sahamnesia'
    };
  }, [getCategoryFromKeywords]);

  // Load articles and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [articlesResponse, categoriesData] = await Promise.all([
          articleService.getArticles({ limit: 50 }),
          articleService.getCategories()
        ]);
        
        setArticles(articlesResponse.data);
        setCategories(['Semua', ...categoriesData.slice(0, 10)]);
        
        // Debug logging
        console.log('News page loaded:', {
          articlesCount: articlesResponse.data.length,
          categoriesCount: categoriesData.length,
          categories: ['Semua', ...categoriesData.slice(0, 10)]
        });
        
        // Load analytics data
        loadAnalyticsData(articlesResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Load analytics data
  const loadAnalyticsData = async (articlesData: Article[]) => {
    // Load market sentiment
    try {
      setSentimentLoading(true);
      const sentiment = await newsAnalyticsService.analyzeMarketSentiment(articlesData);
      setMarketSentiment(sentiment);
    } catch (err) {
      console.error('Failed to load market sentiment:', err);
    } finally {
      setSentimentLoading(false);
    }
    
    // Load trending articles
    try {
      setTrendingLoading(true);
      const trending = await newsAnalyticsService.generateTrendingArticles(articlesData);
      setTrendingArticles(trending);
    } catch (err) {
      console.error('Failed to load trending articles:', err);
    } finally {
      setTrendingLoading(false);
    }
  };
  
  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      try {
        setIsSearching(true);
        const results = await articleService.searchArticles(searchQuery, 20);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  
  // Memoize expensive computations
  const newsArticles = useMemo(() => {
    console.log('Converting articles to news articles');
    return articles.map(convertArticleToNews);
  }, [articles, convertArticleToNews]);
  
  // Get breaking news (first 3 articles with breaking flag)
  const breakingNews = useMemo(() => {
    return newsArticles.filter(article => article.isBreaking).slice(0, 3);
  }, [newsArticles]);

  // Get latest news (all articles)
  const latestNews = useMemo(() => newsArticles, [newsArticles]);

  // Calculate categories with counts only when articles are loaded
  const categoriesWithCount = useMemo(() => {
    console.log('Calculating categories with count');
    return categories.map(cat => {
      if (cat === 'Semua') {
        return { name: cat, count: articles.length };
      }
      
      const count = articles.filter(article => {
        const articleCategory = getCategoryFromKeywords(article.keywords);
        return articleCategory === cat || 
               (article.keywords && article.keywords.toLowerCase().includes(cat.toLowerCase()));
      }).length;
      
      return { name: cat, count };
    });
  }, [categories, articles, getCategoryFromKeywords]);

  // Filter by date range
  const filterByDate = useCallback((article: NewsArticle): boolean => {
    if (dateFilter === 'all') return true;
    
    const articleDate = new Date(article.publishedAt.split(' • ')[0]);
    const now = new Date();
    const diffTime = now.getTime() - articleDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (dateFilter) {
      case 'today':
        return diffDays <= 1;
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      default:
        return true;
    }
  }, [dateFilter]);
  
  // Sort articles
  const sortArticles = useCallback((articles: NewsArticle[]): NewsArticle[] => {
    const sorted = [...articles];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.publishedAt.split(' • ')[0]);
          const dateB = new Date(b.publishedAt.split(' • ')[0]);
          return dateB.getTime() - dateA.getTime();
        });
      case 'oldest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.publishedAt.split(' • ')[0]);
          const dateB = new Date(b.publishedAt.split(' • ')[0]);
          return dateA.getTime() - dateB.getTime();
        });
      case 'trending':
        return sorted.sort((a, b) => {
          // Sort by trending articles first, then by date
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          const dateA = new Date(a.publishedAt.split(' • ')[0]);
          const dateB = new Date(b.publishedAt.split(' • ')[0]);
          return dateB.getTime() - dateA.getTime();
        });
      default:
        return sorted;
    }
  }, [sortBy]);

  // Get filtered news based on search and category
  const filteredNews = useMemo(() => {
    console.log('Filtering news:', { 
      selectedCategory, 
      searchQuery: searchQuery.trim(), 
      articlesCount: articles.length,
      newsArticlesCount: newsArticles.length,
      dateFilter,
      sortBy
    });
    
    let filtered: NewsArticle[] = [];
    
    if (searchQuery.trim()) {
      filtered = searchResults.map(convertArticleToNews);
      console.log('Search results:', filtered.length);
    } else if (selectedCategory === "Semua") {
      filtered = latestNews;
      console.log('Showing all news:', filtered.length);
    } else {
      filtered = latestNews.filter(article => {
        // Direct category match
        if (article.category === selectedCategory) {
          return true;
        }
        
        // Partial category match (case-insensitive)
        if (article.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            selectedCategory.toLowerCase().includes(article.category.toLowerCase())) {
          return true;
        }
        
        return false;
      });
      
      console.log(`Filtered news for "${selectedCategory}":`, {
        totalNews: latestNews.length,
        filteredCount: filtered.length,
        sampleCategories: latestNews.slice(0, 5).map(a => ({ title: a.title, category: a.category }))
      });
    }
    
    // Apply date filter
    filtered = filtered.filter(filterByDate);
    console.log('After date filter:', filtered.length);
    
    // Apply sorting
    filtered = sortArticles(filtered);
    console.log('After sorting:', filtered.length);
    
    return filtered;
  }, [searchQuery, searchResults, selectedCategory, latestNews, convertArticleToNews, dateFilter, sortBy, filterByDate, sortArticles]);
  
  // Newsletter subscription handler
  const handleNewsletterSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      setNewsletterMessage({ type: 'error', text: 'Silakan masukkan email Anda' });
      return;
    }
    
    setNewsletterLoading(true);
    setNewsletterMessage(null);
    
    try {
      const response: NewsletterResponse = await newsletterService.subscribe(newsletterEmail, 'news-page');
      
      if (response.success) {
        setNewsletterMessage({ type: 'success', text: response.message });
        setNewsletterEmail(''); // Clear form on success
      } else {
        setNewsletterMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setNewsletterMessage({ 
        type: 'error', 
        text: 'Terjadi kesalahan. Silakan coba lagi.' 
      });
    } finally {
      setNewsletterLoading(false);
    }
  }, [newsletterEmail]);

  // Newsletter email change handler
  const handleNewsletterEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletterEmail(e.target.value);
  }, []);
  
  // Clear newsletter message after 5 seconds
  useEffect(() => {
    if (newsletterMessage) {
      const timer = setTimeout(() => {
        setNewsletterMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newsletterMessage]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown')) {
        setShowFilters(false);
        setShowDateFilter(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNavigate={onNavigate} />
        <div className="container mx-auto px-4 py-16 text-center mt-16">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
            <span className="text-lg text-gray-600">Memuat berita...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNavigate={onNavigate} />
        <div className="container mx-auto px-4 py-16 text-center mt-16">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="w-8 h-8 mr-2" />
            <span className="text-lg">Error: {error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={onNavigate} />
      
      {/* Breaking News Banner */}
      <section className="bg-red-600 text-white py-2 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
              BREAKING
            </span>
            <div className="flex space-x-8 animate-scroll">
              {breakingNews.map((news) => (
                <span key={news.id} className="text-sm whitespace-nowrap">
                  {news.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Berita Pasar Modal Indonesia
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Update terkini seputar saham, ekonomi, dan regulasi pasar modal Indonesia
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Cari berita..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex space-x-2 relative">
              {/* Filter Button */}
              <div className="relative filter-dropdown">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                    showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                
                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="absolute top-12 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
                    <h3 className="font-semibold text-gray-900 mb-3">Urutkan Berdasarkan</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'newest', label: 'Terbaru' },
                        { value: 'oldest', label: 'Terlama' },
                        { value: 'trending', label: 'Trending' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'trending')}
                            className="mr-2"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Tutup
                    </button>
                  </div>
                )}
              </div>
              
              {/* Date Filter Button */}
              <div className="relative filter-dropdown">
                <button 
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  className={`flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                    showDateFilter ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Tanggal
                </button>
                
                {/* Date Filter Dropdown */}
                {showDateFilter && (
                  <div className="absolute top-12 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-48">
                    <h3 className="font-semibold text-gray-900 mb-3">Filter Tanggal</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'today', label: 'Hari ini' },
                        { value: 'week', label: '7 hari terakhir' },
                        { value: 'month', label: '30 hari terakhir' },
                        { value: 'all', label: 'Semua waktu' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="dateFilter"
                            value={option.value}
                            checked={dateFilter === option.value}
                            onChange={(e) => setDateFilter(e.target.value as 'today' | 'week' | 'month' | 'all')}
                            className="mr-2"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowDateFilter(false)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Tutup
                    </button>
                  </div>
                )}
              </div>
              
              {/* <button className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Bell className="h-4 w-4 mr-2" />
                Notifikasi
              </button> */}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breaking News Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Breaking News</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  Lihat Semua
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {breakingNews.map((article) => (
                  <article key={article.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    {article.imageUrl && (
                      <div className="relative">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                            BREAKING
                          </span>
                          {article.trending && (
                            <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center ${
                              article.trending === "up" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                            }`}>
                              {article.trending === "up" ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              {article.change}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
                          {article.category}
                        </span>
                        <span className="text-sm text-gray-500">{article.publishedAt}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3 text-gray-500">
                          <span>By {article.author}</span>
                          <span>•</span>
                          <span>{article.readTime} baca</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) {
                              onNavigate('news-detail', article.id);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                          Baca
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categoriesWithCount.length > 0 ? categoriesWithCount.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              )) : (
                <div className="text-gray-500">Loading categories...</div>
              )}
            </div>

            {/* Latest News */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terbaru</h2>
              
              <div className="space-y-6">
                {filteredNews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {searchQuery ? 'Tidak ada berita yang sesuai dengan pencarian.' : 'Tidak ada berita tersedia.'}
                    </p>
                  </div>
                ) : (
                  filteredNews.map((article) => (
                  <article key={article.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {article.imageUrl && (
                        <div className="md:w-64 flex-shrink-0">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-48 md:h-40 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                              {article.category}
                            </span>
                            {article.trending && (
                              <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center ${
                                article.trending === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {article.trending === "up" ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {article.change}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{article.publishedAt}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span>By {article.author}</span>
                            <span>•</span>
                            <span>{article.readTime} baca</span>
                            <span>•</span>
                            <span>Sumber: {article.source}</span>
                          </div>
                          <button 
                            onClick={() => {
                              if (onNavigate) {
                                onNavigate('news-detail', article.id);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                          >
                            Baca Selengkapnya
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                  ))
                )}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                  Muat Berita Lainnya
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Live Updates */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Update Live</h3>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full animate-pulse">
                    ● LIVE
                  </span>
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {latestNews.slice(0, 5).map((news) => (
                    <div key={news.id} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-500">{news.publishedAt}</span>
                        {news.trending && (
                          <span className={`text-xs flex items-center ${
                            news.trending === "up" ? "text-green-600" : "text-red-600"
                          }`}>
                            {news.trending === "up" ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {news.change}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {news.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Sentiment */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Sentimen Pasar</h3>
                  {sentimentLoading && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                
                {marketSentiment ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bullish</span>
                      <span className="text-lg font-bold text-green-600">{marketSentiment.bullish}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${marketSentiment.bullish}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bearish</span>
                      <span className="text-lg font-bold text-red-600">{marketSentiment.bearish}%</span>
                    </div>
                    {marketSentiment.neutral > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Neutral</span>
                          <span className="text-lg font-bold text-gray-600">{marketSentiment.neutral}%</span>
                        </div>
                      </>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        Dianalisis menggunakan AI • {new Date(marketSentiment.lastUpdated).toLocaleTimeString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {marketSentiment.summary}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bullish</span>
                      <span className="text-lg font-bold text-green-600">--%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-300 h-2 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bearish</span>
                      <span className="text-lg font-bold text-red-600">--%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Memuat analisis sentimen...
                    </p>
                  </div>
                )}
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Dapatkan Update Berita</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Subscribe untuk mendapatkan update berita pasar modal terbaru langsung di email Anda.
                </p>
                
                {newsletterMessage && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${
                    newsletterMessage.type === 'success' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {newsletterMessage.text}
                  </div>
                )}
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={newsletterEmail}
                    onChange={handleNewsletterEmailChange}
                    disabled={newsletterLoading}
                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={newsletterLoading || !newsletterEmail.trim()}
                    className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {newsletterLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Mendaftar...
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
              </div>

              {/* Most Read */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Paling Banyak Dibaca</h3>
                  {trendingLoading && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {trendingArticles.length > 0 ? (
                    trendingArticles.map((article, index) => (
                      <div 
                        key={article.id} 
                        className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('news-detail', article.id);
                          }
                        }}
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            {article.enhancedTitle}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                            {article.summary}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{article.views.toLocaleString()} views</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                            <span>•</span>
                            <span className="bg-gray-100 text-gray-600 px-1 rounded">
                              {article.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback loading state
                    [1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full animate-pulse"></span>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {trendingArticles.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      Diurutkan berdasarkan algoritma AI • Diperbarui setiap 30 menit
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default News;