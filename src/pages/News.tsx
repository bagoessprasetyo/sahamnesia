import React, { useState } from "react";
import { 
  ArrowUpRight, 
  BarChart3, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Globe,
  Bell,
  Filter,
  Search,
  Calendar,
  RefreshCw
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

interface MarketData {
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  trending: "up" | "down";
}

interface MarketNewsProps {
  onNavigate?: (page: string) => void;
}

const News: React.FC<MarketNewsProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Semua", count: 156 },
    { name: "Breaking News", count: 12 },
    { name: "Market Update", count: 28 },
    { name: "Saham", count: 45 },
    { name: "Ekonomi", count: 32 },
    { name: "Regulasi", count: 16 },
    { name: "Komoditas", count: 23 }
  ];

  const marketData: MarketData[] = [
    {
      name: "IHSG",
      symbol: "IDX Composite",
      price: "7,245.65",
      change: "+54.32",
      changePercent: "+0.75%",
      trending: "up"
    },
    {
      name: "USD/IDR",
      symbol: "USD/IDR",
      price: "15,675.50",
      change: "-18.25",
      changePercent: "-0.12%",
      trending: "down"
    },
    {
      name: "BBCA",
      symbol: "Bank BCA",
      price: "9,725",
      change: "+50",
      changePercent: "+0.52%",
      trending: "up"
    },
    {
      name: "TLKM",
      symbol: "Telkom",
      price: "3,950",
      change: "+50",
      changePercent: "+1.28%",
      trending: "up"
    },
    {
      name: "ASII",
      symbol: "Astra",
      price: "4,570",
      change: "-30",
      changePercent: "-0.65%",
      trending: "down"
    }
  ];

  const breakingNews: NewsArticle[] = [
    {
      id: "breaking-1",
      title: "Bank Indonesia Pertahankan BI Rate di 5.75%, Rupiah Menguat ke Rp 15.675/USD",
      excerpt: "Keputusan ini sejalan dengan ekspektasi pasar di tengah inflasi yang terkendali dan stabilitas makroekonomi yang terjaga.",
      category: "Ekonomi",
      publishedAt: "2 jam lalu",
      author: "Tim Redaksi Sahamnesia",
      imageUrl: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg",
      isBreaking: true,
      readTime: "5 menit",
      source: "Bank Indonesia"
    },
    {
      id: "breaking-2",
      title: "Pemerintah Luncurkan Insentif Pajak Baru untuk Startup Teknologi",
      excerpt: "Kebijakan ini bertujuan meningkatkan investasi di sektor teknologi dan mendorong ekosistem startup Indonesia.",
      category: "Regulasi",
      publishedAt: "3 jam lalu",
      author: "Maya Kusuma",
      imageUrl: "https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg",
      isBreaking: true,
      readTime: "7 menit",
      source: "Kemenkeu"
    },
    {
      id: "breaking-3",
      title: "TLKM Raih Kontrak 5G Senilai Rp 12 Triliun dari Pemerintah",
      excerpt: "Kontrak ini akan mempercepat implementasi jaringan 5G di Indonesia dan meningkatkan proyeksi revenue TLKM.",
      category: "Saham",
      publishedAt: "4 jam lalu",
      author: "Budi Santoso",
      imageUrl: "https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg",
      isBreaking: true,
      trending: "up",
      change: "+3.2%",
      readTime: "6 menit",
      source: "Telkom Indonesia"
    }
  ];

  const latestNews: NewsArticle[] = [
    {
      id: "news-1",
      title: "Pertamina Catat Laba Bersih Rp 45 Triliun di Q3 2024, Naik 18% YoY",
      excerpt: "Kinerja positif didorong oleh naiknya harga minyak dunia dan efisiensi operasional yang membaik.",
      category: "Saham",
      publishedAt: "1 jam lalu",
      author: "Arief Wijaya",
      imageUrl: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg",
      trending: "up",
      change: "+2.3%",
      readTime: "8 menit",
      source: "Pertamina"
    },
    {
      id: "news-2",
      title: "PMI Manufaktur Indonesia Naik ke 52.8 di November 2024",
      excerpt: "Indeks ini menunjukkan ekspansi sektor manufaktur untuk bulan ketujuh berturut-turut.",
      category: "Ekonomi",
      publishedAt: "2 jam lalu",
      author: "Siti Rahma",
      readTime: "5 menit",
      source: "BPS"
    },
    {
      id: "news-3",
      title: "BBRI Luncurkan Platform Digital Banking Terbaru dengan Fitur AI",
      excerpt: "Bank Rakyat Indonesia mengintegrasikan kecerdasan buatan untuk meningkatkan pengalaman nasabah.",
      category: "Saham",
      publishedAt: "3 jam lalu",
      author: "Joko Prasetyo",
      imageUrl: "https://images.pexels.com/photos/7567531/pexels-photo-7567531.jpeg",
      trending: "up",
      change: "+1.5%",
      readTime: "6 menit",
      source: "BRI"
    },
    {
      id: "news-4",
      title: "Harga Sawit Turun 4% Akibat Proyeksi Produksi Malaysia Meningkat",
      excerpt: "Analis memperkirakan produksi sawit Malaysia akan naik 8% di semester kedua 2024.",
      category: "Komoditas",
      publishedAt: "4 jam lalu",
      author: "Linda Sari",
      trending: "down",
      change: "-4.1%",
      readTime: "7 menit",
      source: "GAPKI"
    },
    {
      id: "news-5",
      title: "OJK Keluarkan Regulasi Baru untuk Trading Kripto di Indonesia",
      excerpt: "Aturan baru ini bertujuan melindungi investor retail dan meningkatkan transparansi pasar kripto.",
      category: "Regulasi",
      publishedAt: "5 jam lalu",
      author: "Ahmad Rahman",
      readTime: "9 menit",
      source: "OJK"
    },
    {
      id: "news-6",
      title: "BMRI Umumkan Dividen Interim Rp 150 per Saham",
      excerpt: "Bank Mandiri membagikan dividen interim sebagai apresiasi kepada pemegang saham.",
      category: "Saham",
      publishedAt: "6 jam lalu",
      author: "Dewi Lestari",
      imageUrl: "https://images.pexels.com/photos/7567440/pexels-photo-7567440.jpeg",
      trending: "up",
      change: "+1.2%",
      readTime: "4 menit",
      source: "Bank Mandiri"
    }
  ];

  const filteredNews = selectedCategory === "Semua" 
    ? latestNews 
    : latestNews.filter(article => article.category === selectedCategory);

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

          {/* Market Data Overview */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Data Pasar Real-time</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Last updated: {new Date().toLocaleTimeString('id-ID')}
                </span>
                <button className="text-blue-600 hover:text-blue-700">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {marketData.map((data, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">{data.symbol}</div>
                  <div className="text-lg font-bold text-gray-900">{data.price}</div>
                  <div className={`text-sm flex items-center ${
                    data.trending === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {data.trending === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    <span>{data.change} ({data.changePercent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Cari berita..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                Tanggal
              </button>
              <button className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Bell className="h-4 w-4 mr-2" />
                Notifikasi
              </button>
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
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
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

            {/* Latest News */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terbaru</h2>
              
              <div className="space-y-6">
                {filteredNews.map((article) => (
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
                          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                            Baca Selengkapnya
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sentimen Pasar</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bullish</span>
                    <span className="text-lg font-bold text-green-600">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bearish</span>
                    <span className="text-lg font-bold text-red-600">32%</span>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Dapatkan Update Berita</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Subscribe untuk mendapatkan update berita pasar modal terbaru langsung di email Anda.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                  />
                  <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Most Read */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Paling Banyak Dibaca</h3>
                <div className="space-y-4">
                  {[
                    "BBCA Target Price Rp 11.000 oleh Analis Asing",
                    "Dampak Kenaikan Suku Bunga Fed terhadap IHSG",
                    "10 Saham Pilihan Desember 2024",
                    "Analisis Teknikal: IHSG Menuju 7.500?",
                    "Strategi Investasi di Tengah Volatilitas Pasar"
                  ].map((title, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 line-clamp-2">
                        {title}
                      </span>
                    </div>
                  ))}
                </div>
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