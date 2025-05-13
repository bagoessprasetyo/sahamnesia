import React, { useState, useEffect } from 'react';
import { Menu, X, Sprout } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-lg bg-white/60 border-b border-white/30 shadow-lg ${
        isScrolled ? 'backdrop-saturate-150 bg-white/70 shadow-xl py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Sprout className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Sahamnesia</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Fitur
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Cara Kerja
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Testimoni
            </a>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Mulai Belajar
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg absolute top-full left-4 right-4">
            <div className="flex flex-col space-y-4 px-4">
              <a 
                href="#features" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Fitur
              </a>
              <a 
                href="#how-it-works" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Cara Kerja
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Testimoni
              </a>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Mulai Belajar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;