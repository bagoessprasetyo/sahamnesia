import React, { useState, useEffect } from 'react';
import { Menu, X, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
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

  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-lg ${
        isScrolled 
          ? 'bg-white/95 backdrop-saturate-150 shadow-lg border-b border-gray-200' 
          : 'bg-white/80 backdrop-blur-md shadow-md'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center"
          >
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Sahamnesia</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick('home')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('blog')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Blog
            </button>
            <button 
              onClick={() => handleNavClick('news')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              News
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact Us
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
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
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg absolute top-full left-4 right-4 border border-gray-200">
            <div className="flex flex-col space-y-4 px-4">
              <button 
                onClick={() => handleNavClick('home')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('blog')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                Blog
              </button>
              <button 
                onClick={() => handleNavClick('news')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                News
              </button>
              <button 
                onClick={() => handleNavClick('contact')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-left"
              >
                Contact Us
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
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