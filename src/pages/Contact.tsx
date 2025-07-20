import React, { useState } from "react";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  MessageSquare, 
  Users, 
  BookOpen,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
}

interface ContactPageProps {
  onNavigate?: (page: string) => void;
}

const Contact: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "general"
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Kami",
      details: [
        "info@sahamnesia.com"
      ],
      action: "Kirim Email"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telepon Kami",
      details: [
        "+62 853 5230 5458",
        "Senin - Jumat: 09:00 - 18:00"
      ],
      action: "Hubungi Sekarang"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Kunjungi Kami",
      details: [
        "Jalan Gotong Royong, RT 04 RW 01",
        "Kelurahan Ragunan, Kecamatan Pasar Minggu",
        "Jakarta Selatan 10310"
      ],
      action: "Lihat Peta"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Jam Operasional",
      details: [
        "Senin - Jumat: 09:00 - 18:00",
        "Sabtu: 09:00 - 15:00",
        "Minggu: Tutup"
      ],
      action: "Jadwalkan Konsultasi"
    }
  ];

  const supportChannels = [
    {
      icon: <MessageSquare className="h-12 w-12 text-blue-600" />,
      title: "Live Chat",
      description: "Dapatkan bantuan instan dari tim customer service kami",
      feature: "Response time: < 5 menit",
      action: "Mulai Chat",
      availability: "Online 24/7"
    },
    {
      icon: <Users className="h-12 w-12 text-green-600" />,
      title: "Konsultasi Personal",
      description: "Jadwalkan sesi 1-on-1 dengan financial advisor kami",
      feature: "Gratis untuk member premium",
      action: "Book Appointment",
      availability: "Senin - Jumat"
    },
    {
      icon: <BookOpen className="h-12 w-12 text-purple-600" />,
      title: "Webinar & Workshop",
      description: "Ikuti sesi pembelajaran interaktif mingguan",
      feature: "Sertifikat tersedia",
      action: "Daftar Webinar",
      availability: "Setiap Rabu & Sabtu"
    }
  ];

  const faqItems = [
    {
      question: "Bagaimana cara mendaftar sebagai member premium?",
      answer: "Anda dapat mendaftar sebagai member premium melalui halaman pricing atau menghubungi tim sales kami. Member premium mendapatkan akses ke semua analisis saham, stock picks mingguan, dan konsultasi personal."
    },
    {
      question: "Apakah ada trial period untuk member premium?",
      answer: "Ya, kami menyediakan trial period 7 hari gratis untuk semua fitur premium. Anda dapat membatalkan kapan saja selama masa trial tanpa dikenakan biaya."
    },
    {
      question: "Bagaimana cara menggunakan fitur analisis saham?",
      answer: "Setelah login ke dashboard, Anda dapat mengakses fitur analisis di menu 'Stock Analysis'. Tersedia analisis teknikal, fundamental, dan rekomendasi dari tim analis kami."
    },
    {
      question: "Apakah rekomendasi saham dijamin profit?",
      answer: "Tidak ada jaminan profit dalam investasi saham. Semua rekomendasi kami merupakan hasil analisis mendalam yang dapat membantu Anda membuat keputusan investasi yang lebih baik. Selalu lakukan riset sendiri sebelum berinvestasi."
    },
    {
      question: "Bagaimana cara mengikuti webinar mingguan?",
      answer: "Member premium dapat mengakses jadwal webinar di dashboard. Untuk member reguler, beberapa webinar tersedia gratis dengan registrasi terlebih dahulu melalui halaman events."
    }
  ];

  const teamMembers = [
    {
      name: "Ellen May",
      position: "Chief Financial Analyst",
      email: "ellen@sahamnesia.id",
      specialization: "Technical Analysis, Market Strategy"
    },
    {
      name: "Budi Santoso",
      position: "Head of Education",
      email: "budi@sahamnesia.id",
      specialization: "Investment Education, Fundamental Analysis"
    },
    {
      name: "Siti Rahma",
      position: "Customer Success Manager",
      email: "siti@sahamnesia.id",
      specialization: "Customer Support, Community Management"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hubungi Sahamnesia
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Tim ahli kami siap membantu Anda memahami pasar saham Indonesia dan meningkatkan kemampuan investasi Anda
          </p>
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-2xl font-bold">15,000+</div>
              <div className="text-sm text-blue-100">Active Members</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-blue-100">Satisfaction Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-blue-100">Support Available</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-2xl font-bold"> 2H</div>
              <div className="text-sm text-blue-100">Average Response</div>
            </div>
          </div> */}
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Kirim Pesan kepada Kami
              </h2>
              <p className="text-gray-600 mb-8">
                Isi formulir di bawah ini dan tim kami akan merespon dalam waktu 24 jam
              </p>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-green-800">Pesan Anda berhasil dikirim! Kami akan merespon segera.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                  <span className="text-red-800">Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Pertanyaan *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">Pertanyaan Umum</option>
                      <option value="membership">Premium Membership</option>
                      <option value="technical">Technical Support</option>
                      <option value="education">Educational Content</option>
                      <option value="partnership">Partnership</option>
                      <option value="media">Media Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bagaimana cara menggunakan analisis teknikal?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="Jelaskan pertanyaan atau kebutuhan Anda secara detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-3" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                      <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        {info.action} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Follow Kami
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Ikuti media sosial kami untuk update terbaru, tips investasi, dan insight pasar modal
              </p>
            </div>
          </div>
        </div>

        {/* Support Channels */}
        {/* <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cara Lain Mendapatkan Bantuan
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kami menyediakan berbagai channel untuk memastikan Anda mendapatkan bantuan sesuai kebutuhan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="flex justify-center mb-6">
                  {channel.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {channel.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {channel.description}
                </p>
                <div className="bg-gray-50 rounded-lg p-3 mb-6">
                  <p className="text-sm font-medium text-gray-700">
                    {channel.feature}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {channel.availability}
                  </p>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  {channel.action}
                </button>
              </div>
            ))}
          </div>
        </section> */}

        {/* FAQ Section */}
        {/* <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Temukan jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Pertanyaan Lain?
              </h4>
              <p className="text-gray-600 mb-4">
                Tidak menemukan jawaban yang Anda cari? Jangan ragu untuk menghubungi tim support kami
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Contact Support
              </button>
            </div>
          </div>
        </section> */}

        {/* Team Section */}
        {/* <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tim Ahli Kami
            </h2>
            <p className="text-lg text-gray-600">
              Bertemu dengan tim expert yang siap membantu perjalanan investasi Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.position}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {member.specialization}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </section> */}
      </div>

      <Footer />
    </div>
  );
};

export default Contact;