import { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StockTickerDemo from './components/StockTicker';
import PerformanceSection from './components/PerformanceSection';
import ProblemSolution from './components/ProblemSolution';
import HowItWorks from './components/HowItWorks';
import BlogSection from './components/BlogSection';
import SocialProof from './components/SocialProof';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Import AdminApp normally to debug
import AdminApp from './pages/admin/AdminApp';

// Lazy load other components
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Contact = lazy(() => import('./pages/Contact'));
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

  // Loading component for Suspense
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  // Render admin panel if in admin mode
  if (isAdminMode) {
    return <AdminApp onNavigateToMain={handleAdminNavigateToMain} />;
  }

  // Render current page for main app
  if (currentPage === 'blog') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Blog onNavigate={handleNavigate} />
      </Suspense>
    );
  }
  
  if (currentPage === 'blog-detail' && currentArticleId) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <BlogDetail articleId={currentArticleId} onNavigate={handleNavigate} />
      </Suspense>
    );
  }

  if (currentPage === 'news') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <News onNavigate={handleNavigate} />
      </Suspense>
    );
  }
  
  if (currentPage === 'news-detail' && currentArticleId) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <NewsDetail articleId={currentArticleId} onNavigate={handleNavigate} />
      </Suspense>
    );
  }

  if (currentPage === 'contact') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Contact onNavigate={handleNavigate} />
      </Suspense>
    );
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