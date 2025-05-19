import React, { useState } from "react";
import { ArrowRight, Search, Clock, User, TrendingUp, Calendar, Tag, Eye, MessageCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = [
    { name: "Semua", count: 45 },
    { name: "Analisis Saham", count: 12 },
    { name: "Strategi Trading", count: 8 },
    { name: "Edukasi Dasar", count: 10 },
    { name: "Success Story", count: 6 },
    { name: "Market Update", count: 9 }
  ];

  const featuredPost: BlogPost = {
    id: "featured-1",
    title: "Mengapa BBCA Naik 27% dalam 3 Bulan Terakhir?",
    excerpt: "Analisis mendalam performa Bank Central Asia Q4 2024 dan proyeksi untuk 2025. Faktor-faktor yang mendorong kenaikan harga saham dan outlook jangka panjang sektor perbankan.",
    content: "",
    category: "Analisis Saham",
    author: {
      name: "Ellen May",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
      role: "Senior Analyst"
    },
    publishedDate: "20 November 2024",
    readTime: "12 menit",
    imageUrl: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg",
    tags: ["BBCA", "Banking", "Fundamental Analysis"],
    isPremium: true,
    views: 1250,
    comments: 23,
    profit: "+27%"
  };

  const blogPosts: BlogPost[] = [
    {
      id: "post-1",
      title: "5 Saham Pilihan Januari 2025: Sektor Consumer Goods Memimpin",
      excerpt: "Tim analis Sahamnesia mengungkap 5 saham unggulan untuk portofolio Januari 2025. Fokus pada sektor consumer goods yang menunjukkan recovery kuat.",
      content: "",
      category: "Analisis Saham",
      author: {
        name: "Budi Santoso",
        avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
        role: "Portfolio Manager"
      },
      publishedDate: "18 November 2024",
      readTime: "8 menit",
      imageUrl: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg",
      tags: ["Stock Picks", "Consumer Goods", "2025 Outlook"],
      isPremium: true,
      views: 892,
      comments: 15,
      profit: "+15%"
    },
    {
      id: "post-2",
      title: "Technical Analysis: Support & Resistance untuk Trader Pemula",
      excerpt: "Panduan lengkap memahami konsep support dan resistance dalam trading. Termasuk cara mengidentifikasi level dan strategi entry/exit.",
      content: "",
      category: "Edukasi Dasar",
      author: {
        name: "Siti Rahma",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
        role: "Trading Coach"
      },
      publishedDate: "16 November 2024",
      readTime: "15 menit",
      imageUrl: "https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg",
      tags: ["Technical Analysis", "Support Resistance", "Tutorial"],
      isPremium: false,
      views: 1456,
      comments: 32
    },
    {
      id: "post-3",
      title: "Success Story: Dari Rp 50 Juta Menjadi Rp 125 Juta dalam 8 Bulan",
      excerpt: "Kisah inspiratif member premium Sahamnesia yang berhasil mengembangkan portfolio dengan strategi value investing dan diversifikasi sektor.",
      content: "",
      category: "Success Story",
      author: {
        name: "Arief Wijaya",
        avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
        role: "Community Manager"
      },
      publishedDate: "15 November 2024",
      readTime: "10 menit",
      imageUrl: "https://images.pexels.com/photos/7567531/pexels-photo-7567531.jpeg",
      tags: ["Success Story", "Value Investing", "Portfolio"],
      isPremium: false,
      views: 2103,
      comments: 45,
      profit: "+150%"
    },
    {
      id: "post-4",
      title: "IHSG Outlook 2025: Proyeksi dan Skenario Pergerakan",
      excerpt: "Analisis komprehensif prospek IHSG tahun 2025. Meliputi faktor makro ekonomi, sentiment global, dan rekomendasi alokasi aset.",
      content: "",
      category: "Market Update",
      author: {
        name: "Joko Prasetyo",
        avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
        role: "Market Strategist"
      },
      publishedDate: "13 November 2024",
      readTime: "20 menit",
      imageUrl: "https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg",
      tags: ["IHSG", "Market Outlook", "2025"],
      isPremium: true,
      views: 678,
      comments: 12
    },
    {
      id: "post-5",
      title: "Dividend Investing: Strategi Passive Income dari Saham",
      excerpt: "Cara membangun portofolio dividend stock yang memberikan passive income konsisten. Analisis 10 saham dividend terbaik IDX.",
      content: "",
      category: "Strategi Trading",
      author: {
        name: "Maya Kusuma",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
        role: "Investment Advisor"
      },
      publishedDate: "11 November 2024",
      readTime: "14 menit",
      imageUrl: "https://images.pexels.com/photos/7567440/pexels-photo-7567440.jpeg",
      tags: ["Dividend", "Passive Income", "Long Term"],
      isPremium: true,
      views: 934,
      comments: 18
    }
  ];

  const popularTags = [
    "BBCA", "Technical Analysis", "Value Investing", "Dividend", "IHSG", 
    "Banking", "Consumer Goods", "Mining", "Property", "Energy"
  ];

  const filteredPosts = selectedCategory === "Semua" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 text-center">
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
              <input
                type="search"
                placeholder="Cari artikel, saham, atau topik..."
                className="w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center">
                      Baca Selengkapnya
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
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
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
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
                      
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center">
                        Baca
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
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