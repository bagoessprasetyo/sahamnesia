import React from 'react';
import { ArrowRight, Shield } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-primary-600">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Mulai Perjalanan Investasi Saham Anda
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Belajar investasi saham Indonesia tidak pernah semudah ini. Daftar sekarang dan nikmati 7 hari uji coba gratis.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-10">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg w-full sm:w-auto">
              Mulai Belajar Gratis
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg w-full sm:w-auto">
              Jadwalkan Demo
            </button>
          </div>
          
          <div className="flex items-center justify-center text-primary-100">
            <Shield className="h-5 w-5 mr-2" />
            <span>Tidak perlu kartu kredit. Batalkan kapan saja.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;