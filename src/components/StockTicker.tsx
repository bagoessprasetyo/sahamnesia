"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockData {
  name: string;
  value: string;
  change: number;
  symbol?: string;
}

interface StockTickerProps extends React.HTMLAttributes<HTMLDivElement> {
  stocks: StockData[];
  speed?: number;
}

export const StockTicker = React.forwardRef<HTMLDivElement, StockTickerProps>(
  ({ className, stocks, speed = 20, ...props }, ref) => {
    const repeat = Math.ceil(12 / stocks.length);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden border-b border-border bg-background/80 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[5%] bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-[5%] bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          className="flex whitespace-nowrap py-2"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            duration: speed,
          }}
        >
          {[...Array(repeat)].map((_, repeatIndex) => (
            <React.Fragment key={repeatIndex}>
              {stocks.map((stock, index) => (
                <div
                  key={`${repeatIndex}-${index}`}
                  className="flex items-center mx-4 px-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {stock.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">
                        {stock.symbol && stock.symbol}{" "}
                        {stock.value}
                      </span>
                      <div
                        className={cn(
                          "flex items-center text-xs font-medium",
                          stock.change > 0
                            ? "text-emerald-500"
                            : stock.change < 0
                            ? "text-red-500"
                            : "text-muted-foreground"
                        )}
                      >
                        {stock.change > 0 ? (
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                        ) : stock.change < 0 ? (
                          <ArrowDown className="h-3 w-3 mr-0.5" />
                        ) : null}
                        {stock.change > 0 ? "+" : ""}
                        {stock.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    );
  }
);

StockTicker.displayName = "StockTicker";

// Usage example
export default function StockTickerDemo() {
  const stockData: StockData[] = [
    { name: "S&P 500", value: "5,234.18", change: 0.32, symbol: "$" },
    { name: "Nasdaq", value: "16,428.82", change: -0.89, symbol: "$" },
    { name: "US 10Y", value: "4.21", change: 0.05, symbol: "%" },
    { name: "FTSE 100", value: "7,930.96", change: 0.41, symbol: "£" },
    { name: "Crude Oil", value: "78.42", change: -1.23, symbol: "$" },
    { name: "Gold", value: "2,345.60", change: 1.78, symbol: "$" },
    { name: "Bitcoin", value: "68,245.32", change: 2.45, symbol: "$" },
    { name: "EUR/USD", value: "1.0842", change: -0.12 },
  ];

  return (
    <div className="w-full">
      <StockTicker stocks={stockData} />
    </div>
  );
}