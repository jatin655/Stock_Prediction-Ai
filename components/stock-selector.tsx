"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchMultipleStocks } from "@/lib/api"
import type { MarketData } from "@/types/stock"
import { Loader2, RefreshCw, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface StockSelectorProps {
  selectedSymbol: string
  onSymbolChange: (symbol: string) => void
  onRefresh: () => void
  isLoading: boolean
  currentPrice: number
  dailyChange: number
  dailyChangePercent: number
  lastUpdated: Date | null
  popularStocks: string[]
}

export default function StockSelector({
  selectedSymbol,
  onSymbolChange,
  onRefresh,
  isLoading,
  currentPrice,
  dailyChange,
  dailyChangePercent,
  lastUpdated,
  popularStocks,
}: StockSelectorProps) {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false)

  // Load market data for popular stocks (cached for 5 minutes)
  useEffect(() => {
    const loadMarketData = async () => {
      if (marketData.length > 0) return // Already loaded

      setIsLoadingMarketData(true)
      try {
        const data = await fetchMultipleStocks(popularStocks)
        setMarketData(data)
      } catch (error) {
        console.error("Failed to load market data:", error)
      } finally {
        setIsLoadingMarketData(false)
      }
    }

    loadMarketData()
  }, [popularStocks, marketData.length])

  return (
    <Card className="ethereal-card animate-ethereal-glow">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 glass-frost rounded-xl flex items-center justify-center">📊</div>
          Stock Selector
        </CardTitle>
        <CardDescription className="text-sky-100">
          Choose from popular stocks or enter a custom symbol
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 glass-frost">
        <div className="space-y-6">
          {/* Popular Stocks */}
          <div>
            <h3 className="text-lg font-semibold text-sky-800 mb-3">Popular Stocks</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {popularStocks.map((symbol) => {
                const marketItem = marketData.find((item) => item.symbol === symbol)
                const isSelected = selectedSymbol === symbol
                
                return (
                  <Button
                    key={symbol}
                    onClick={() => onSymbolChange(symbol)}
                    variant={isSelected ? "default" : "outline"}
                    className={`relative group transition-all duration-300 ${
                      isSelected
                        ? "bg-sky-600 text-white shadow-lg scale-105"
                        : "bg-transparent border-sky-300 text-sky-700 hover:bg-sky-50/50 hover:border-sky-500 hover:scale-105"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="font-bold text-sm">{symbol}</span>
                      {marketItem && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">
                            ${marketItem.price.toFixed(2)}
                          </span>
                          {marketItem.changePercent !== 0 && (
                            <div className="flex items-center gap-1">
                              {marketItem.changePercent > 0 ? (
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                              )}
                              <span
                                className={`text-xs ${
                                  marketItem.changePercent > 0 ? "text-emerald-500" : "text-red-500"
                                }`}
                              >
                                {marketItem.changePercent > 0 ? "+" : ""}
                                {marketItem.changePercent.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {isLoadingMarketData && !marketItem && (
                        <Loader2 className="h-3 w-3 animate-spin text-sky-500" />
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Current Selection Info */}
          <div className="p-4 glass-ethereal rounded-xl border border-sky-400/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sky-800">Current Selection: {selectedSymbol}</h4>
              <Badge variant="outline" className="text-sky-700 border-sky-300">
                {isLoading ? "Loading..." : "Active"}
              </Badge>
            </div>
            
            {currentPrice > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-sky-600">Current Price</p>
                  <p className="text-lg font-bold text-sky-800">${currentPrice.toFixed(2)}</p>
                </div>
                
                {!isNaN(dailyChange) && !isNaN(dailyChangePercent) && (
                  <div className="text-center">
                    <p className="text-sm text-sky-600">Daily Change</p>
                    <div className="flex items-center justify-center gap-1">
                      {dailyChange >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-lg font-bold ${dailyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        ${Math.abs(dailyChange).toFixed(2)}
                      </span>
                    </div>
                    <p className={`text-sm ${dailyChangePercent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      ({dailyChangePercent >= 0 ? "+" : ""}{dailyChangePercent.toFixed(2)}%)
                    </p>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-sm text-sky-600">Status</p>
                  <p className="text-lg font-bold text-sky-800">
                    {isLoading ? "Loading..." : "Ready"}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-sky-600">Last Updated</p>
                  <p className="text-sm font-medium text-sky-700">
                    {lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Manual Refresh */}
          <div className="flex justify-center">
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              className="crystalline-button px-6 py-2 text-sm font-semibold mystical-glow"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
