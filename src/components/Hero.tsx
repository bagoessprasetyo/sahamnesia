import React from "react";
import { ArrowRight, Star, TrendingUp, BookOpen, DollarSign, Users, Award, Target } from "lucide-react";

interface TestimonialProps {
  name: string;
  image: string;
  stock: string;
  profit: string;
  date: string;
  comment: string;
}

const Hero: React.FC = () => {
  const testimonials: TestimonialProps[] = [
    {
      name: "Budi Santoso",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
      stock: "BBCA",
      profit: "+27%",
      date: "Jan 2024",
      comment: "Sahamnesia helped me understand technical analysis. Entry point for BBCA was perfect and the mentoring was excellent!"
    },
    {
      name: "Siti Rahma",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
      stock: "TLKM",
      profit: "+18%",
      date: "Feb 2024",
      comment: "Platform edukasi saham terbaik! Strategy yang diajarkan benar-benar praktikal dan mudah diikuti."
    },
    {
      name: "Arief Wijaya",
      image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
      stock: "ASII",
      profit: "+32%",
      date: "Mar 2024",
      comment: "Thanks to Sahamnesia's course, I learned when to enter and exit. Portfolio saya bertumbuh konsisten!"
    }
  ];

  return (
    <section className="relative bg-background text-foreground py-20 px-4 md:py-28 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMGY4ZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzRoLTJ2LTJoMnYyem0tNCA0aC0ydi0yaDJ2MnptLTQtNGgtMnYtMmgybTB2elkzMmgtMnYtMmgybTJ2elkzNmgtMnYtMmgybTJ2elkzNmgtMnYtMmgybTJ2eqltNCA0aC0ydi0yaDJ2MnptLTQtNGgtMnYtMmgybTJ2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Hero Content */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium w-fit">
              <Award className="h-4 w-4 mr-2" />
              Platform Edukasi Saham #1 Indonesia
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Belajar Saham Indonesia dengan{" "}
              <span className="text-blue-600 relative">
                Bantuan AI
                <div className="absolute -inset-1 bg-blue-100 rounded-lg -z-10 transform rotate-1"></div>
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Bergabunglah dengan ribuan investor sukses yang telah menguasai pasar saham Indonesia melalui kursus berkualitas, strategi teruji, dan komunitas yang supportif.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                Mulai Belajar Gratis
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              
              <button className="inline-flex items-center px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors">
                Lihat Kisah Sukses
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center text-3xl font-bold text-blue-600 mb-1">
                  <Users className="h-8 w-8 mr-2" />
                  15.000+
                </div>
                <span className="text-sm text-gray-500 font-medium">Investor Sukses</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center text-3xl font-bold text-blue-600 mb-1">
                  <BookOpen className="h-8 w-8 mr-2" />
                  30+
                </div>
                <span className="text-sm text-gray-500 font-medium">Kursus Premium</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center text-3xl font-bold text-blue-600 mb-1">
                  <Target className="h-8 w-8 mr-2" />
                  99%
                </div>
                <span className="text-sm text-gray-500 font-medium">Tingkat Kepuasan</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Live Testimonials */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Profit Terbaru Member</h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-500 ml-2">4.9/5</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.date}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                          <TrendingUp className="h-3 w-3" />
                          {testimonial.profit}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {testimonial.stock}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-md">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Alumni Kursus
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">"{testimonial.comment}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 font-medium rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors">
              Lihat Semua Testimoni →
            </button>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 font-medium">Dipercaya oleh:</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="h-12 bg-gray-200 rounded-md flex items-center justify-center px-6">
                  <span className="text-gray-400 text-xs font-semibold">Partner {i+1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;