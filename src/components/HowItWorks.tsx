import React from 'react';
import { BookOpen, TrendingUp, MessageSquare } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cara Kerja Saham Cerdas AI
          </h2>
          <p className="text-xl text-gray-600">
            Tiga langkah sederhana untuk memulai perjalanan investasi saham Anda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold">
              1
            </div>
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Belajar</h3>
            <p className="text-gray-600">
              Mulai dengan modul dasar untuk memahami konsep pasar saham Indonesia. Pelajari secara bertahap dengan bahasa yang mudah dimengerti.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold">
              2
            </div>
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Praktik</h3>
            <p className="text-gray-600">
              Gunakan portofolio virtual dengan Rp 100 juta untuk berlatih trading saham tanpa risiko. Analisis keputusan dan pelajari hasilnya.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold">
              3
            </div>
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tanya AI</h3>
            <p className="text-gray-600">
              Gunakan Asisten Cerdas untuk menjawab pertanyaan, menjelaskan konsep yang sulit, atau mendapatkan saran khusus tentang strategi investasi.
            </p>
          </div>
        </div>

        <div className="max-w-xl mx-auto text-center mt-16">
          <p className="text-gray-600 mb-6">
            Sudah siap untuk memulai perjalanan investasi saham Anda dengan percaya diri?
          </p>
          <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg">
            Mulai Belajar Sekarang
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;