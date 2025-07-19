import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, User, Eye, MessageCircle, Share2, Tag, ChevronRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { articleService } from "@/services/articles";
import { Article } from "@/types/article";

interface BlogDetailProps {
  articleId: string;
  onNavigate: (page: string, articleId?: string) => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ articleId, onNavigate }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [articleData, relatedData] = await Promise.all([
          articleService.getArticleById(parseInt(articleId)),
          articleService.getRecentArticles(4)
        ]);
        
        if (!articleData) {
          throw new Error('Article not found');
        }
        
        setArticle(articleData);
        // Filter out current article from related articles
        setRelatedArticles(relatedData.filter(a => a.id !== articleData.id).slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [articleId]);

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Clean and prepare markdown content
  const prepareMarkdownContent = (content: string) => {
    // Replace \n with actual newlines
    let cleanContent = content.replace(/\\n/g, '\n');
    
    // Clean up any extra whitespace
    cleanContent = cleanContent.trim();
    
    return cleanContent;
  };

  // Get tags from keywords
  const getTags = (keywords: string | null) => {
    if (!keywords) return [];
    return keywords.split(',').map(tag => tag.trim()).filter(tag => tag);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNavigate={onNavigate} />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-lg text-gray-600">Memuat artikel...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNavigate={onNavigate} />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">{error || 'Artikel yang Anda cari tidak ditemukan.'}</p>
            <button 
              onClick={() => onNavigate('blog')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Blog
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const readingTime = calculateReadingTime(article.content || '');
  const publishDate = formatDate(article.date_post || article.created_at);
  const tags = getTags(article.keywords);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={onNavigate} />
      
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={() => onNavigate('home')}
              className="hover:text-blue-600"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <button 
              onClick={() => onNavigate('blog')}
              className="hover:text-blue-600"
            >
              Blog
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">{article.title}</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => onNavigate('blog')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Blog
          </button>

          {/* Article Header */}
          <header className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {article.image_url && (
              <div className="relative h-64 md:h-80">
                <img
                  src={article.image_url}
                  alt={article.title || 'Article image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}
            
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {publishDate}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {readingTime} menit baca
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {article.author || 'Tim Sahamnesia'}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {Math.floor(Math.random() * 1000) + 100} views
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>
              
              {article.description && (
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {article.description}
                </p>
              )}
              
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Share Button */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </button>
                <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Komentar
                </button>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="markdown-content prose prose-lg max-w-none">
              {article.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Custom components for better styling
                    h1: ({ children, ...props }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0" {...props}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 first:mt-0" {...props}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6 first:mt-0" {...props}>
                        {children}
                      </h3>
                    ),
                    h4: ({ children, ...props }) => (
                      <h4 className="text-lg font-bold text-gray-900 mb-3 mt-6 first:mt-0" {...props}>
                        {children}
                      </h4>
                    ),
                    h5: ({ children, ...props }) => (
                      <h5 className="text-base font-bold text-gray-900 mb-3 mt-4 first:mt-0" {...props}>
                        {children}
                      </h5>
                    ),
                    h6: ({ children, ...props }) => (
                      <h6 className="text-sm font-bold text-blue-600 mb-3 mt-4 first:mt-0 uppercase tracking-wide" {...props}>
                        {children}
                      </h6>
                    ),
                    p: ({ children, ...props }) => (
                      <p className="text-gray-700 leading-relaxed mb-4" {...props}>
                        {children}
                      </p>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong className="font-bold text-gray-900" {...props}>
                        {children}
                      </strong>
                    ),
                    em: ({ children, ...props }) => (
                      <em className="italic" {...props}>
                        {children}
                      </em>
                    ),
                    a: ({ children, href, ...props }) => (
                      <a 
                        href={href} 
                        className="text-blue-600 hover:text-blue-700 underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    img: ({ src, alt, ...props }) => (
                      <div className="my-6">
                        <img 
                          src={src} 
                          alt={alt} 
                          className="w-full rounded-lg shadow-md" 
                          {...props}
                        />
                        {alt && (
                          <p className="text-sm text-gray-600 italic mt-2 text-center">
                            {alt}
                          </p>
                        )}
                      </div>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-700" {...props}>
                        {children}
                      </blockquote>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="list-disc list-inside space-y-2 mb-4" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="list-decimal list-inside space-y-2 mb-4" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-gray-700" {...props}>
                        {children}
                      </li>
                    ),
                    code: ({ children, className, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className="block bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto" {...props}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children, ...props }) => (
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
                        {children}
                      </pre>
                    ),
                    hr: ({ ...props }) => (
                      <hr className="border-gray-300 my-8" {...props} />
                    ),
                    table: ({ children, ...props }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border border-gray-300" {...props}>
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children, ...props }) => (
                      <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left" {...props}>
                        {children}
                      </th>
                    ),
                    td: ({ children, ...props }) => (
                      <td className="border border-gray-300 px-4 py-2" {...props}>
                        {children}
                      </td>
                    ),
                  }}
                >
                  {prepareMarkdownContent(article.content)}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-600 italic">Konten artikel tidak tersedia.</p>
              )}
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <article
                    key={relatedArticle.id}
                    className="group cursor-pointer"
                    onClick={() => onNavigate('blog-detail', relatedArticle.id.toString())}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={relatedArticle.image_url || 'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg'}
                        alt={relatedArticle.title || 'Related article'}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {relatedArticle.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(relatedArticle.date_post || relatedArticle.created_at)}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;