import React from 'react';
import { HelpCircle, CheckCircle } from 'lucide-react';

const ProblemSolution: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Apa itu Saham Cerdas AI?
          </h2>
          <p className="text-xl text-gray-600">
            Platform pembelajaran saham berbasis AI pertama di Indonesia yang dirancang khusus untuk pasar modal Indonesia (IDX/BEI).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <HelpCircle className="h-8 w-8 text-red-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Masalah Investor Pemula</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span className="text-gray-700">Kesulitan memahami pasar saham Indonesia</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span className="text-gray-700">Kecemasan akan kehilangan uang</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span className="text-gray-700">Bingung harus mulai dari mana</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span className="text-gray-700">Kurangnya panduan personal</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span className="text-gray-700">Informasi yang terlalu teknis dan kompleks</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Solusi Saham Cerdas AI</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className="text-gray-700">Pembelajaran terstruktur khusus pasar Indonesia</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className="text-gray-700">Praktik trading tanpa risiko dengan portofolio virtual</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className="text-gray-700">Jalur belajar bertahap yang jelas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className="text-gray-700">Asisten AI personal 24/7 untuk menjawab pertanyaan</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className="text-gray-700">Bahasa yang sederhana dan contoh nyata</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;