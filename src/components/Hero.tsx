import React from 'react';
import { ArrowRight } from 'lucide-react';
import StockTickerDemo from './StockTicker';

const Hero: React.FC = () => {
  return (
    <section className="pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Belajar Saham Indonesia dengan <span className="text-primary-600">Bantuan AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Saham Cerdas AI membuat belajar investasi saham lebih mudah, personal, dan menyenangkan untuk investor pemula di Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center">
                Mulai Belajar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors font-medium">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-70"></div>
              <img 
                src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Saham Cerdas AI Platform" 
                className="rounded-xl shadow-2xl w-full object-cover max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl font-bold text-primary-600">500+</div>
            <div className="text-gray-600 text-center">Stok IDX/BEI</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl font-bold text-primary-600">24/7</div>
            <div className="text-gray-600 text-center">Asisten AI</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl font-bold text-primary-600">100%</div>
            <div className="text-gray-600 text-center">Fokus Indonesia</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl font-bold text-primary-600">0%</div>
            <div className="text-gray-600 text-center">Risiko Nyata</div>
          </div>
        </div>
      </div>
        {/* <StockTickerDemo /> */}
    </section>
  );
};

export default Hero;