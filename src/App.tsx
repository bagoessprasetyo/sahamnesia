// import React from 'react';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StockTickerDemo from './components/StockTicker';
import PerformanceSection from './components/PerformanceSection';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import BlogSection from './components/BlogSection';
import SocialProof from './components/SocialProof';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import AdminApp from './pages/admin/AdminApp';
// import StockTickerDemo from "./components/StockWidgets";

function App() {
  // Check if we're in admin mode based on URL
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);

  // Check URL on mount and handle browser navigation
  useEffect(() => {
    const checkURL = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
        // Set the current page based on URL for main app
        if (path === '/blog') setCurrentPage('blog');
        else if (path === '/news') setCurrentPage('news'); 
        else if (path === '/contact') setCurrentPage('contact');
        else setCurrentPage('home');
      }
    };

    // Check URL on mount
    checkURL();

    // Listen for browser navigation (back/forward buttons)
    const handlePopState = () => {
      checkURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: string, articleId?: string) => {
    if (page.startsWith('/admin')) {
      // For admin navigation, update URL and set admin mode
      window.history.pushState({}, '', page);
      setIsAdminMode(true);
    } else {
      // For main app navigation, use existing logic
      setCurrentPage(page);
      setCurrentArticleId(articleId || null);
      
      // Update URL for main app pages
      const url = page === 'home' ? '/' : `/${page}`;
      window.history.pushState({}, '', url);
    }
    
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminNavigateToMain = (page: string) => {
    // When navigating from admin back to main site
    setIsAdminMode(false);
    setCurrentPage(page);
    setCurrentArticleId(null);
    
    const url = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render admin panel if in admin mode
  if (isAdminMode) {
    return <AdminApp onNavigateToMain={handleAdminNavigateToMain} />;
  }

  // Render current page for main app
  if (currentPage === 'blog') {
    return <Blog onNavigate={handleNavigate} />;
  }
  
  if (currentPage === 'blog-detail' && currentArticleId) {
    return <BlogDetail articleId={currentArticleId} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'news') {
    return <News onNavigate={handleNavigate} />;
  }
  
  if (currentPage === 'news-detail' && currentArticleId) {
    return <NewsDetail articleId={currentArticleId} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'contact') {
    return <Contact onNavigate={handleNavigate} />;
  }

  // Default home page
  return (
    <div className="min-h-screen font-sans">
      <Header onNavigate={handleNavigate} />
      <main>
        <Hero />
        <StockTickerDemo />
        <PerformanceSection />
        <ProblemSolution />
        {/* <Features /> */}
        <HowItWorks />
        {/* <StockWidgets /> */}
        <BlogSection onNavigate={handleNavigate} />
        <SocialProof />
        <CallToAction />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;