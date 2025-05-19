import React from 'react';
import { Clock, Lock, TrendingUp, Users } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  isPremium: boolean;
  imageUrl: string;
  date: string;
  profit?: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "Strategi Trading Miss Ellen May: BBCA (+27%) dan TLKM (+18%)",
    excerpt: "Pelajari bagaimana analis senior kami mengidentifikasi entry point sempurna untuk saham-saham unggulan dan teknik profit taking yang efektif.",
    category: "Trading Strategy",
    readTime: "12 min",
    isPremium: true,
    imageUrl: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg",
    date: "23 Nov 2024",
    profit: "+27%"
  },
  {
    id: 2,
    title: "5 Saham Pilihan Januari 2025: Banking Sector Outlook",
    excerpt: "Analisis mendalam sektor perbankan Indonesia dan proyeksi performa 5 saham banking pilihan untuk portfolio jangka panjang.",
    category: "Stock Analysis", 
    readTime: "8 min",
    isPremium: true,
    imageUrl: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg",
    date: "21 Nov 2024",
    profit: "+15%"
  },
  {
    id: 3,
    title: "Technical Analysis 101: Support & Resistance untuk Pemula",
    excerpt: "Panduan lengkap memahami konsep support & resistance dengan contoh nyata di saham-saham IDX untuk meningkatkan win rate trading.",
    category: "Education",
    readTime: "15 min",
    isPremium: false,
    imageUrl: "https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg",
    date: "20 Nov 2024"
  },
  {
    id: 4,
    title: "Member Success Story: Portfolio +85% dalam 6 Bulan",
    excerpt: "Kisah inspiratif member premium yang berhasil mengembangkan portfolio dari Rp 100 juta menjadi Rp 185 juta dengan konsistensi strategi.",
    category: "Success Story",
    readTime: "10 min",
    isPremium: false,
    imageUrl: "https://images.pexels.com/photos/7567531/pexels-photo-7567531.jpeg",
    date: "19 Nov 2024",
    profit: "+85%"
  }
];

const BlogSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Artikel & Analisis Premium
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Dapatkan insight trading terbaru, analisis saham mendalam, dan strategi profit dari para expert
          </p>
        </div>

        {/* Featured Article */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative">
                <img
                  src={articles[0].imageUrl}
                  alt={articles[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
                {articles[0].isPremium && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full flex items-center text-sm font-semibold">
                    <Lock className="w-4 h-4 mr-1" />
                    Premium
                  </div>
                )}
                {articles[0].profit && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center text-sm font-bold">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {articles[0].profit}
                  </div>
                )}
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="font-semibold text-blue-600">{articles[0].category}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {articles[0].readTime}
                  </div>
                  <span>•</span>
                  <span>{articles[0].date}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {articles[0].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {articles[0].excerpt}
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center w-fit">
                  Baca Selengkapnya
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {articles.slice(1).map((article) => (
            <article key={article.id} className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {article.isPremium && (
                    <div className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-md flex items-center text-xs font-semibold">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                  )}
                  {article.profit && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center text-xs font-bold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {article.profit}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="font-semibold text-blue-600">{article.category}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{article.date}</span>
                  <span className="text-blue-600 font-semibold text-sm">Baca →</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-blue-600 rounded-2xl p-8 md:p-12 text-white max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-8 w-8 mr-3" />
            <span className="text-lg font-semibold">15,000+ Member Premium</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Akses Semua Analisis Premium & Stock Picks
          </h3>
          <p className="text-lg opacity-90 mb-8">
            Bergabung dengan member premium dan dapatkan analisis mendalam, live trading session, dan rekomendasi saham harian
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade ke Premium
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Lihat Semua Artikel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default BlogSection;