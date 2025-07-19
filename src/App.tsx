// import React from 'react';
import { useState } from 'react';
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
// import StockTickerDemo from "./components/StockWidgets";

function App() {
  // Simple routing state (you can replace this with React Router later)
  const [currentPage, setCurrentPage] = useState('home');
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);

  const handleNavigate = (page: string, articleId?: string) => {
    setCurrentPage(page);
    setCurrentArticleId(articleId || null);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current page
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