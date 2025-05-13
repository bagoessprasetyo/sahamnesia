import React from 'react';
import { BookOpen, Bot, TrendingUp, BarChart4 } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fitur Unggulan Kami
          </h2>
          <p className="text-xl text-gray-600">
            Saham Cerdas AI menggabungkan teknologi AI dengan pengetahuan pasar modal Indonesia untuk pengalaman belajar terbaik.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {/* Feature 1 - Learning Modules */}
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex items-center justify-center h-16 w-16 bg-primary-100 rounded-lg mb-6 md:mb-0 md:mr-6">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Modul Pembelajaran Terstruktur</h3>
              <p className="text-gray-600 mb-4">
                Kurikulum belajar yang dirancang khusus mulai dari dasar hingga lanjutan, dengan fokus pada pasar modal Indonesia (IDX/BEI).
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Materi berkualitas dengan contoh nyata</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Quiz interaktif untuk uji pemahaman</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Sertifikat kemajuan untuk setiap level</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 - AI Chatbot */}
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex items-center justify-center h-16 w-16 bg-primary-100 rounded-lg mb-6 md:mb-0 md:mr-6">
              <Bot className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Asisten Cerdas (AI Tutor)</h3>
              <p className="text-gray-600 mb-4">
                Asisten AI personal yang tersedia 24/7 untuk menjawab pertanyaan, menjelaskan konsep, dan memberikan saran khusus.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Percakapan natural dalam Bahasa Indonesia</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Penjelasan yang disesuaikan dengan level Anda</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Kemampuan menjawab pertanyaan kompleks</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 - Virtual Portfolio */}
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex items-center justify-center h-16 w-16 bg-primary-100 rounded-lg mb-6 md:mb-0 md:mr-6">
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Portofolio Virtual</h3>
              <p className="text-gray-600 mb-4">
                Simulasi trading dengan data pasar Indonesia real-time, tanpa risiko kehilangan uang sungguhan.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Rp 100 juta modal virtual untuk latihan</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Data real-time saham IDX/BEI</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Analisis performa dan saran peningkatan</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 4 - IDX Data & Tools */}
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex items-center justify-center h-16 w-16 bg-primary-100 rounded-lg mb-6 md:mb-0 md:mr-6">
              <BarChart4 className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Data & Alat Khusus IDX</h3>
              <p className="text-gray-600 mb-4">
                Akses ke data dan alat analisis khusus untuk pasar modal Indonesia yang memudahkan pemahaman.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Screening saham berdasarkan kriteria keuangan</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Grafik dan indikator teknikal sederhana</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-gray-700">Ringkasan laporan keuangan yang mudah dipahami</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;