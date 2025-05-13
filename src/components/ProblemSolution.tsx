import React from 'react';
import { HelpCircle, CheckCircle } from 'lucide-react';

const problems = [
  'Kesulitan memahami pasar saham Indonesia',
  'Kecemasan akan kehilangan uang',
  'Bingung harus mulai dari mana',
  'Kurangnya panduan personal',
  'Informasi yang terlalu teknis dan kompleks',
];

const solutions = [
  'Pembelajaran terstruktur khusus pasar Indonesia',
  'Praktik trading tanpa risiko dengan portofolio virtual',
  'Jalur belajar bertahap yang jelas',
  'Asisten AI personal 24/7 untuk menjawab pertanyaan',
  'Bahasa yang sederhana dan contoh nyata',
];

const ProblemSolution: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#e94340]/10 via-[#009a83]/10 to-[#199177]/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#009a83]/10 text-[#009a83] text-sm font-semibold mb-4 shadow-md backdrop-blur-md border border-[#009a83]/20">
            Apa itu Saham Cerdas AI?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight drop-shadow-[0_2px_8px_rgba(25,145,119,0.10)]">
            Platform Saham Berbasis AI untuk Investor Indonesia
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Saham Cerdas AI membantu investor pemula memahami pasar modal Indonesia (IDX/BEI) dengan cara yang mudah, aman, dan personal.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-8 border border-[#e94340]/30 group transition-transform hover:-translate-y-1 bg-white/60 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(233,67,64,0.10)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-[#e94340]/20 before:to-transparent before:blur-xl before:opacity-60 before:-z-10">
            <div className="flex items-center mb-5">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#e94340]/20 text-[#e94340] mr-4 shadow-[0_0_16px_2px_rgba(233,67,64,0.20)]">
                <HelpCircle className="h-7 w-7" />
              </span>
              <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Masalah Investor Pemula</h3>
            </div>
            <ul className="space-y-4 mt-2">
              {problems.map((item, idx) => (
                <li key={idx} className="flex items-start text-base text-gray-700">
                  <span className="mt-1 mr-3 text-[#e94340] animate-pulse">•</span>
                  <span className="font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-3xl p-8 border border-[#009a83]/30 group transition-transform hover:-translate-y-1 bg-white/60 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,154,131,0.10)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-[#009a83]/20 before:to-transparent before:blur-xl before:opacity-60 before:-z-10">
            <div className="flex items-center mb-5">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#009a83]/20 text-[#009a83] mr-4 shadow-[0_0_16px_2px_rgba(0,154,131,0.20)]">
                <CheckCircle className="h-7 w-7" />
              </span>
              <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Solusi Saham Cerdas AI</h3>
            </div>
            <ul className="space-y-4 mt-2">
              {solutions.map((item, idx) => (
                <li key={idx} className="flex items-start text-base text-gray-700">
                  <span className="mt-1 mr-3 text-[#009a83] animate-pulse">•</span>
                  <span className="font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;