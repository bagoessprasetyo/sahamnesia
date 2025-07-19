import React, { useState, useEffect } from "react";
import { ArrowRight, Search, Clock, TrendingUp, Calendar, Eye, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { articleService } from "@/services/articles";
import { Article } from "@/types/article";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  isPremium: boolean;
  views: number;
  comments: number;
  profit?: string;
}

interface BlogProps {
  onNavigate?: (page: string, articleId?: string) => void;
}

// Helper function to convert Article to BlogPost
const convertArticleToBlogPost = (article: Article): BlogPost => {
  const tags = article.keywords ? article.keywords.split(',').map(k => k.trim()) : [];
  const defaultAuthor = {
    name: article.author || 'Tim Sahamnesia',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'Analyst'
  };
  
  return {
    id: article.id.toString(),
    title: article.title || 'Untitled Article',
    excerpt: article.description || 'No description available',
    content: article.content || '',
    category: tags[0] || 'Analisis Saham',
    author: defaultAuthor,
    publishedDate: article.date_post ? new Date(article.date_post).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : new Date(article.created_at).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readTime: Math.ceil((article.content?.length || 0) / 200) + ' menit',
    imageUrl: article.image_url || 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg',
    tags: tags.slice(0, 3),
    isPremium: false,
    views: Math.floor(Math.random() * 2000) + 100,
    comments: Math.floor(Math.random() * 50) + 1
  };
};

const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load articles and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load articles and featured article
        const [articlesResponse, featuredArticles, categoriesData] = await Promise.all([
          articleService.getArticles({ limit: 20 }),
          articleService.getFeaturedArticles(1),
          articleService.getCategories()
        ]);
        
        setArticles(articlesResponse.data);
        setFeaturedArticle(featuredArticles[0] || null);
        setCategories(['Semua', ...categoriesData.slice(0, 10)]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
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
        const results = await articleService.searchArticles(searchQuery, 10);
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
  
  const categoriesWithCount = categories.map(cat => ({
    name: cat,
    count: cat === 'Semua' ? articles.length : articles.filter(article => 
      article.keywords?.toLowerCase().includes(cat.toLowerCase())
    ).length
  }));

  // Get featured post
  const featuredPost: BlogPost | null = featuredArticle ? convertArticleToBlogPost(featuredArticle) : null;

  // Convert articles to blog posts
  const blogPosts: BlogPost[] = articles.map(convertArticleToBlogPost);
  
  // Get filtered posts for display
  const getFilteredPosts = () => {
    if (searchQuery.trim()) {
      return searchResults.map(convertArticleToBlogPost);
    }
    
    if (selectedCategory === "Semua") {
      return blogPosts;
    }
    
    return blogPosts.filter(post => 
      post.category === selectedCategory || 
      post.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()))
    );
  };
  
  const filteredPosts = getFilteredPosts();

  const popularTags = categories.slice(1, 11); // Skip 'Semua' and take first 10

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
            <span className="text-lg text-gray-600">Memuat artikel...</span>
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
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
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
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 text-center mt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog Sahamnesia
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Insight terbaru, analisis mendalam, dan strategi terbukti untuk membantu Anda menguasai pasar saham Indonesia
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 animate-spin" />
              )}
              <input
                type="search"
                placeholder="Cari artikel, saham, atau topik..."
                className="w-full pl-12 pr-12 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Article */}
            {featuredPost && (
              <section className="mb-16">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                      {featuredPost.isPremium && (
                        <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                          Premium
                        </span>
                      )}
                      {featuredPost.profit && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {featuredPost.profit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md font-medium">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {featuredPost.publishedDate}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {featuredPost.title}
                    </h2>
                    
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{featuredPost.author.name}</p>
                          <p className="text-sm text-gray-500">{featuredPost.author.role}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('blog-detail', featuredPost.id);
                          }
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categoriesWithCount.map((category) => (
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
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {filteredPosts.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchQuery ? 'Tidak ada artikel yang sesuai dengan pencarian.' : 'Tidak ada artikel tersedia.'}
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('blog-detail', post.id);
                    }
                  }}
                >
                  <div className="relative">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {post.isPremium && (
                        <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-md text-xs font-semibold">
                          Premium
                        </span>
                      )}
                      {post.profit && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {post.profit}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {post.publishedDate}
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigate) {
                            onNavigate('blog-detail', post.id);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center"
                      >
                        Baca
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </article>
                ))
              )}
            </div>

            {/* Load More */}
            <div className="text-center">
              <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                Lihat Artikel Lainnya
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Newsletter Subscription */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Newsletter Premium</h3>
                <p className="text-blue-100 mb-4">
                  Dapatkan analisis saham eksklusif dan stock picks mingguan langsung di inbox Anda.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                  />
                  <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe Gratis
                  </button>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tag Populer</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Comments */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Komentar Terbaru</h3>
                <div className="space-y-4">
                  {[
                    { author: "Budi S.", comment: "Analisis BBCA sangat membantu, terima kasih!", time: "2 jam lalu" },
                    { author: "Siti R.", comment: "Kapan ada analisis sektor consumer?", time: "5 jam lalu" },
                    { author: "Ahmad K.", comment: "Strategi dividend investing nya mantap!", time: "1 hari lalu" }
                  ].map((comment, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                      <p className="text-sm text-gray-700 mb-1">"{comment.comment}"</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span className="font-medium">{comment.author}</span>
                        <span>{comment.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Author */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tentang Tim Penulis</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Tim analis berpengalaman Sahamnesia yang terdiri dari para praktisi pasar modal dengan track record terbukti di industri investasi Indonesia.
                </p>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;