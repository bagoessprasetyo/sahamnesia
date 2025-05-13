import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, MessageSquare } from 'lucide-react';

const steps = [
  {
    icon: <BookOpen className="h-8 w-8 text-[#009a83]" />,
    title: 'Belajar',
    description:
      'Mulai dengan modul dasar untuk memahami konsep pasar saham Indonesia. Pelajari secara bertahap dengan bahasa yang mudah dimengerti.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-[#e94340]" />,
    title: 'Praktik',
    description:
      'Gunakan portofolio virtual dengan Rp 100 juta untuk berlatih trading saham tanpa risiko. Analisis keputusan dan pelajari hasilnya.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-[#199177]" />,
    title: 'Tanya AI',
    description:
      'Gunakan Asisten Cerdas untuk menjawab pertanyaan, menjelaskan konsep yang sulit, atau mendapatkan saran khusus tentang strategi investasi.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Cara Kerja Saham Cerdas AI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600"
          >
            Tiga langkah sederhana untuk memulai perjalanan investasi saham Anda
          </motion.p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: idx * 0.15 }}
              className="group relative bg-white p-8 rounded-2xl shadow-md text-center overflow-hidden border border-gray-100/20 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              {/* <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#009a83] text-white h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                {idx + 1}
              </div> */}
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-[#009a83]/10 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="max-w-xl mx-auto text-center mt-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-600 mb-6"
          >
            Sudah siap untuk memulai perjalanan investasi saham Anda dengan percaya diri?
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#009a83] text-white px-8 py-3 rounded-lg hover:bg-[#199177] transition-colors font-medium text-lg shadow-md"
          >
            Mulai Belajar Sekarang
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;