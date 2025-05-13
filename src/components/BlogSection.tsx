import React from 'react';
import { Clock, Lock } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  isPremium: boolean;
  imageUrl: string;
  date: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "Analisis Mendalam: Potensi Sektor Teknologi di IDX 2024",
    excerpt: "Mengapa perusahaan teknologi Indonesia menjadi incaran investor dan bagaimana prospeknya ke depan.",
    category: "Analisis Sektor",
    readTime: "8 min",
    isPremium: true,
    imageUrl: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg",
    date: "Mar 15, 2024"
  },
  {
    id: 2,
    title: "5 Strategi Value Investing untuk Pasar Bearish",
    excerpt: "Teknik memilih saham undervalued dan membangun portofolio yang tahan krisis.",
    category: "Strategi Investasi",
    readTime: "6 min",
    isPremium: true,
    imageUrl: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg",
    date: "Mar 14, 2024"
  },
  {
    id: 3,
    title: "Panduan Lengkap Analisis Laporan Keuangan Emiten",
    excerpt: "Cara membaca dan menginterpretasi laporan keuangan untuk keputusan investasi yang lebih baik.",
    category: "Edukasi",
    readTime: "10 min",
    isPremium: false,
    imageUrl: "https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg",
    date: "Mar 13, 2024"
  }
];

const BlogSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Artikel Terbaru
          </h2>
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            Lihat Semua
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="group">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                {article.isPremium && (
                  <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full flex items-center text-sm">
                    <Lock className="w-4 h-4 mr-1" />
                    Premium
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="font-medium text-primary-600">{article.category}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="pt-2 text-sm text-gray-500">
                  {article.date}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-white border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium inline-flex items-center">
            Lihat Lebih Banyak Artikel
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;