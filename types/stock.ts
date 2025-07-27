export interface StockData {
  date: string
  price: number
  open?: number
  high?: number
  low?: number
  volume?: number
  close?: number
}

export interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  lastUpdated: string
}

export interface PredictionResult {
  currentPrice: number
  predictedPrice: number
  futurePrices: number[]
  futureDates: string[]
  confidence: number
  trainingError: number
  iterations: number
}

export interface ApiResponse {
  meta: {
    symbol: string
    interval: string
    currency: string
    exchange_timezone: string
    exchange: string
    mic_code: string
    type: string
  }
  values: Array<{
    datetime: string
    open: string
    high: string
    low: string
    close: string
    volume: string
  }>
  status: string
}
