import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Award, Target } from "lucide-react";

interface StockPerformance {
  symbol: string;
  name: string;
  profit: string;
  member: string;
  date: string;
}

interface MemberStats {
  totalMembers: string;
  avgProfit: string;
  successRate: string;
  totalTrades: string;
}

const PerformanceSection: React.FC = () => {
  const latestProfits: StockPerformance[] = [
    {
      symbol: "BBCA",
      name: "Bank Central Asia",
      profit: "+27%",
      member: "Budi S.",
      date: "3 hari lalu"
    },
    {
      symbol: "TLKM", 
      name: "Telkom Indonesia",
      profit: "+18%",
      member: "Siti R.",
      date: "1 minggu lalu"
    },
    {
      symbol: "ASII",
      name: "Astra International", 
      profit: "+32%",
      member: "Arief W.",
      date: "2 minggu lalu"
    },
    {
      symbol: "BBRI",
      name: "Bank Rakyat Indonesia",
      profit: "+15%",
      member: "Maya K.",
      date: "3 minggu lalu"
    },
    {
      symbol: "BMRI",
      name: "Bank Mandiri",
      profit: "+22%",
      member: "Joko P.",
      date: "1 bulan lalu"
    },
    {
      symbol: "ANTM",
      name: "Aneka Tambang",
      profit: "+35%",
      member: "Linda S.",
      date: "1 bulan lalu"
    }
  ];

  const memberStats: MemberStats = {
    totalMembers: "15,847",
    avgProfit: "24.3%",
    successRate: "87%",
    totalTrades: "125k+"
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Performa Member Sahamnesia
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Lihat bagaimana member kami meraih profit konsisten dengan strategi teruji dan stock picks berkualitas
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{memberStats.totalMembers}</div>
            <div className="text-sm text-gray-500 font-medium">Total Member</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{memberStats.avgProfit}</div>
            <div className="text-sm text-gray-500 font-medium">Rata-rata Profit</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-4">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{memberStats.successRate}</div>
            <div className="text-sm text-gray-500 font-medium">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-xl mb-4">
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{memberStats.totalTrades}</div>
            <div className="text-sm text-gray-500 font-medium">Total Trades</div>
          </div>
        </div>

        {/* Latest Profits */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Profit Terbaru Member
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {latestProfits.map((stock, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">{stock.symbol}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{stock.symbol}</h4>
                        <p className="text-sm text-gray-500">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stock.profit}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        <span className="font-medium text-gray-700">{stock.member}</span> • {stock.date}
                      </span>
                      <span className="text-blue-600 font-medium">Lihat Detail →</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Bergabunglah dengan Member yang Profitable
            </h3>
            <p className="text-lg opacity-90 mb-8">
              Dapatkan akses ke stock picks premium, analisis mendalam, dan komunitas trader sukses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Daftar Sekarang
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Lihat Semua Performa
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;