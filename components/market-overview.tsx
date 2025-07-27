"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react"
import type { MarketData } from "@/types/stock"

interface MarketOverviewProps {
  data: MarketData[]
  onStockSelect: (symbol: string) => void
  selectedSymbol: string
}

export default function MarketOverview({ data, onStockSelect, selectedSymbol }: MarketOverviewProps) {
  if (data.length === 0) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading market data...</div>
        </CardContent>
      </Card>
    )
  }

  const gainers = data.filter((stock) => stock.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent)
  const losers = data.filter((stock) => stock.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Market Summary */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Activity className="h-6 w-6 animate-pulse" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 animate-bounce" />
              <p className="text-sm opacity-90">Tracked Stocks</p>
              <p className="text-2xl font-bold">{data.length}</p>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-300 animate-bounce" />
              <p className="text-sm opacity-90">Gainers</p>
              <p className="text-2xl font-bold text-green-300">{gainers.length}</p>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-300 animate-bounce" />
              <p className="text-sm opacity-90">Losers</p>
              <p className="text-2xl font-bold text-red-300">{losers.length}</p>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Activity className="h-8 w-8 mx-auto mb-2 text-yellow-300 animate-pulse" />
              <p className="text-sm opacity-90">Data Status</p>
              <p className="text-2xl font-bold text-yellow-300">CACHED</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((stock, index) => (
          <Card
            key={stock.symbol}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up ${
              selectedSymbol === stock.symbol
                ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                : "hover:bg-gray-50 bg-white/80 backdrop-blur-sm"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onStockSelect(stock.symbol)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg">{stock.symbol}</h3>
                  <p className="text-sm text-gray-600 truncate">{stock.name}</p>
                </div>
                <Badge variant={stock.changePercent >= 0 ? "default" : "destructive"} className="animate-pulse">
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    {stock.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${Math.abs(stock.change).toFixed(2)}
                    </span>
                  </div>
                </div>

                {stock.volume > 0 && (
                  <div className="text-xs text-gray-500">Volume: {stock.volume.toLocaleString()}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
