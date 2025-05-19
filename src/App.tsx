// import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import BlogSection from './components/BlogSection';
import SocialProof from './components/SocialProof';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import StockTickerDemo from './components/StockTicker';
import Chatbot from './components/Chatbot';
// import StockTickerDemo from "./components/StockWidgets";

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main>
        <Hero />
        <StockTickerDemo />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        {/* <StockWidgets /> */}
        <BlogSection />
        <SocialProof />
        <CallToAction />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;