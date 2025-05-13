import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoveUpRight, MoveDownLeft, TrendingUp, Users } from "lucide-react";

// Data dummy untuk ilustrasi
const IDX_INDEX = {
  name: "IHSG",
  value: "7.250,12",
  change: "+0,85%",
  status: "up"
};

const TOP_10 = [
  { code: "BBCA", name: "Bank BCA", price: "9.150", change: "+1,2%" },
  { code: "BBRI", name: "Bank BRI", price: "5.200", change: "+0,8%" },
  { code: "BMRI", name: "Bank Mandiri", price: "6.800", change: "+0,5%" },
  { code: "TLKM", name: "Telkom", price: "4.100", change: "-0,3%" },
  { code: "ASII", name: "Astra", price: "5.900", change: "+0,7%" },
  { code: "ARTO", name: "Bank Jago", price: "2.800", change: "+2,1%" },
  { code: "UNVR", name: "Unilever", price: "3.900", change: "-0,2%" },
  { code: "BBNI", name: "Bank BNI", price: "4.900", change: "+0,4%" },
  { code: "MDKA", name: "Merdeka Copper", price: "2.700", change: "+1,0%" },
  { code: "ICBP", name: "Indofood CBP", price: "10.200", change: "+0,6%" }
];

const INVESTOR_ASING = {
  buy: "Rp 1,2T",
  sell: "Rp 950M",
  net: "+Rp 250M"
};

export default function StockWidgets() {
  return (
    <section className="w-full py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Widget Indeks Saham */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-6 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" />
            <span className="font-semibold text-lg">Indeks Saham Hari Ini</span>
          </div>
          <div className="text-3xl font-bold text-green-800">{IDX_INDEX.value}</div>
          <div className="flex items-center gap-2 mt-1">
            {IDX_INDEX.status === "up" ? (
              <MoveUpRight className="text-green-500 w-4 h-4" />
            ) : (
              <MoveDownLeft className="text-red-500 w-4 h-4" />
            )}
            <span className={IDX_INDEX.status === "up" ? "text-green-600" : "text-red-600"}>{IDX_INDEX.change}</span>
            <span className="ml-2 text-gray-500">{IDX_INDEX.name}</span>
          </div>
        </CardContent>
      </Card>
      {/* Widget Top 10 Saham */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-600" />
            <span className="font-semibold text-lg">Top 10 Saham</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500">
                  <th className="pr-2 text-left">Kode</th>
                  <th className="pr-2 text-left">Nama</th>
                  <th className="pr-2 text-right">Harga</th>
                  <th className="text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {TOP_10.map((s, i) => (
                  <tr key={s.code} className="border-b last:border-b-0">
                    <td className="pr-2 font-semibold text-blue-800">{s.code}</td>
                    <td className="pr-2">{s.name}</td>
                    <td className="pr-2 text-right">{s.price}</td>
                    <td className={s.change.startsWith("+") ? "text-green-600 text-right" : "text-red-600 text-right"}>{s.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Widget Investor Asing */}
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
        <CardContent className="p-6 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-yellow-600" />
            <span className="font-semibold text-lg">Investor Asing</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-700">Beli: <span className="font-bold text-green-700">{INVESTOR_ASING.buy}</span></span>
            <span className="text-gray-700">Jual: <span className="font-bold text-red-700">{INVESTOR_ASING.sell}</span></span>
            <span className="text-gray-700">Net: <span className="font-bold text-blue-700">{INVESTOR_ASING.net}</span></span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}