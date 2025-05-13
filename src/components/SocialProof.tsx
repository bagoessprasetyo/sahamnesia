import React from 'react';
import { Star } from 'lucide-react';

const SocialProof: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Investor Pemula",
      content: "Saham Cerdas AI mengubah cara saya belajar investasi. Asisten AI-nya sangat membantu menjawab semua pertanyaan saya kapan saja.",
      avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      id: 2,
      name: "Siti Rahayu",
      role: "Mahasiswa Ekonomi",
      content: "Portofolio virtual membantu saya berlatih investasi tanpa takut kehilangan uang. Sekarang saya lebih percaya diri untuk mulai investasi sungguhan.",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      id: 3,
      name: "Hendro Wijaya",
      role: "Profesional IT",
      content: "Saya suka bagaimana platform ini menjelaskan konsep sulit dengan bahasa sederhana dan dengan contoh nyata di pasar Indonesia.",
      avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Apa Kata Pengguna Kami
          </h2>
          <p className="text-xl text-gray-600">
            Bergabunglah dengan ribuan investor pemula yang telah meningkatkan pengetahuan investasi saham mereka
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-xl p-8 md:p-12 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Partner & Penghargaan</h3>
              <p className="text-gray-600">Didukung oleh institusi keuangan dan teknologi terkemuka</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
              {/* Placeholder for partner logos */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Logo {i+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;