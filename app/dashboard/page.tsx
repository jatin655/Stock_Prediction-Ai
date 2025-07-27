"use client"

import AnimatedCard from "@/components/AnimatedCard"
import Aurora from "@/components/Aurora"
import Footer from "@/components/footer"
import StockChart from "@/components/StockChart"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import UnifiedNavbar from "@/components/UnifiedNavbar"
import { fetchStockData, searchStocks } from "@/lib/api"
import { predictNextPrice, trainStockModel } from "@/lib/brain-model"
import type { StockData } from "@/types/stock"
import { Activity, BarChart3, Brain, Calendar, Download, Loader2, Search, TrendingUp, Upload } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"



export default function DashboardPage() {
  const [selectedStock, setSelectedStock] = useState("MSFT")
  const [stockData, setStockData] = useState<StockData[]>([])
  const [predictions, setPredictions] = useState<Array<{predictedPrice: number, confidence: number}>>([])
  const [isTraining, setIsTraining] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [daysToPredict, setDaysToPredict] = useState("5")
  const [model, setModel] = useState<any>(null)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [predictionResults, setPredictionResults] = useState<any>(null)
  const [error, setError] = useState("")
  const [uploadedData, setUploadedData] = useState<StockData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const popularStocks = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "NFLX", "SPY", "QQQ"]
  const [availableStocks, setAvailableStocks] = useState<string[]>(popularStocks)



  // Add searched stock to available stocks
  const addStockToAvailable = (symbol: string) => {
    if (!availableStocks.includes(symbol)) {
      setAvailableStocks(prev => [...prev, symbol])
      console.log(`Added ${symbol} to available stocks list`)
    }
  }

  // Load real stock data from API
  const loadStockData = async (symbol: string) => {
    setIsLoadingData(true)
      setError("")

      try {
      console.log(`Loading 50 real data points for ${symbol} from API...`)
      // Use 15min interval for more data points per day
      const data = await fetchStockData(symbol, "15min", 50)
      
      if (data.length === 0) {
        throw new Error("No data received from API")
      }
      
      console.log(`Successfully loaded ${data.length} real data points for ${symbol}`)
      console.log("Sample data:", data.slice(0, 3))
      
      // Ensure we have enough data points
      if (data.length < 20) {
        throw new Error(`Only received ${data.length} data points, need at least 20 for training`)
      }
      
      setStockData(data)
      setCurrentPrice(data[data.length - 1].price)
      setPredictions([])
      setPredictionResults(null)
      setModel(null) // Reset model when new data is loaded
    } catch (error) {
      console.error("Error loading stock data:", error)
      setError(`Failed to load data for ${symbol}. ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleStockChange = async (stock: string) => {
    console.log("Changing stock to:", stock)
    setSelectedStock(stock)
    await loadStockData(stock)
  }

  const handleDaysToPredictChange = (value: string) => {
    setDaysToPredict(value)
  }

  // Handle stock search
  const handleSearchStocks = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchStocks(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching stocks:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearchStocks(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    try {
      const text = await file.text()
      let data: StockData[] = []

      if (file.name.endsWith('.json')) {
        const jsonData = JSON.parse(text)
        data = Array.isArray(jsonData) ? jsonData : jsonData.data || jsonData.values || []
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(text)
      } else {
        throw new Error("Unsupported file format. Please upload JSON or CSV files.")
      }

      // Validate data format
      if (data.length === 0) {
        throw new Error("No valid data found in file")
      }

      // Ensure data has required fields
      const validatedData = data.map((item, index) => ({
        date: item.date || new Date(Date.now() - (data.length - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: Number(item.price) || Number(item.close) || 0,
        open: Number(item.open) || Number(item.price) || 0,
        high: Number(item.high) || Number(item.price) || 0,
        low: Number(item.low) || Number(item.price) || 0,
        volume: Number(item.volume) || 0,
      })).filter(item => item.price > 0)

      if (validatedData.length < 20) {
        throw new Error("Need at least 20 valid data points. Found " + validatedData.length)
      }

      console.log(`Successfully uploaded ${validatedData.length} data points`)
      setUploadedData(validatedData)
      setStockData(validatedData)
      setCurrentPrice(validatedData[validatedData.length - 1].price)
      setPredictions([])
      setPredictionResults(null)
      setModel(null)
      setSelectedStock("UPLOADED")
      console.log("Using uploaded data with", validatedData.length, "data points")
      setError("") // Clear any previous errors
      setError("") // Clear any previous errors
    } catch (error) {
      console.error("Error uploading file:", error)
      setError(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Download sample data
  const handleDownloadSample = () => {
    const sampleData = [
      { date: "2024-01-01", price: 185.64, open: 184.50, high: 186.20, low: 183.80, volume: 45678900 },
      { date: "2024-01-02", price: 187.15, open: 185.64, high: 188.10, low: 185.20, volume: 52345600 },
      { date: "2024-01-03", price: 186.20, open: 187.15, high: 187.80, low: 185.90, volume: 49876500 },
      { date: "2024-01-04", price: 188.50, open: 186.20, high: 189.30, low: 186.00, volume: 51234500 },
      { date: "2024-01-05", price: 189.80, open: 188.50, high: 190.20, low: 188.10, volume: 48765400 },
      { date: "2024-01-06", price: 191.20, open: 189.80, high: 192.10, low: 189.50, volume: 53456700 },
      { date: "2024-01-07", price: 190.50, open: 191.20, high: 191.80, low: 189.90, volume: 45678900 },
      { date: "2024-01-08", price: 192.30, open: 190.50, high: 193.20, low: 190.20, volume: 56789000 },
      { date: "2024-01-09", price: 193.80, open: 192.30, high: 194.50, low: 192.00, volume: 59876500 },
      { date: "2024-01-10", price: 194.20, open: 193.80, high: 195.10, low: 193.50, volume: 52345600 },
      { date: "2024-01-11", price: 195.50, open: 194.20, high: 196.30, low: 194.00, volume: 54567800 },
      { date: "2024-01-12", price: 196.80, open: 195.50, high: 197.40, low: 195.20, volume: 56789000 },
      { date: "2024-01-13", price: 197.20, open: 196.80, high: 198.10, low: 196.50, volume: 52345600 },
      { date: "2024-01-14", price: 198.50, open: 197.20, high: 199.20, low: 197.00, volume: 58901200 },
      { date: "2024-01-15", price: 199.80, open: 198.50, high: 200.30, low: 198.30, volume: 61234500 },
      { date: "2024-01-16", price: 200.20, open: 199.80, high: 201.10, low: 199.60, volume: 53456700 },
      { date: "2024-01-17", price: 201.50, open: 200.20, high: 202.40, low: 200.00, volume: 57890100 },
      { date: "2024-01-18", price: 202.80, open: 201.50, high: 203.50, low: 201.30, volume: 60123400 },
      { date: "2024-01-19", price: 203.20, open: 202.80, high: 204.20, low: 202.60, volume: 54567800 },
      { date: "2024-01-20", price: 204.50, open: 203.20, high: 205.30, low: 203.00, volume: 62345600 }
    ]
    
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-stock-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Parse CSV data
  const parseCSV = (csvText: string): StockData[] => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const row: any = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      
      return {
        date: row.date || row.datetime || new Date().toISOString().split('T')[0],
        price: Number(row.price) || Number(row.close) || 0,
        open: Number(row.open) || Number(row.price) || 0,
        high: Number(row.high) || Number(row.price) || 0,
        low: Number(row.low) || Number(row.price) || 0,
        volume: Number(row.volume) || 0,
      }
    }).filter(item => item.price > 0)
  }

  const handleTrainModel = useCallback(async () => {
    console.log("=== TRAIN MODEL BUTTON CLICKED ===")
    console.log("Stock data length:", stockData.length)
    console.log("Is training:", isTraining)
    console.log("Current stock:", selectedStock)
    console.log("Data points:", 50) // Fixed at 50
    
    if (stockData.length === 0) {
      console.log("ERROR: No stock data available")
      setError("Please load stock data first")
      return
    }

    if (stockData.length < 20) {
      console.log("ERROR: Not enough data points:", stockData.length)
      setError(`Need at least 20 data points to train the model. Currently have ${stockData.length} data points.`)
      return
    }

    console.log("Starting training process...")
    setIsTraining(true)
    setTrainingProgress(0)
    setError("")

    let progressInterval: NodeJS.Timeout | null = null
    
    try {
      // Simulate training progress - exactly 10 seconds total duration
      progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 90) {
            if (progressInterval) clearInterval(progressInterval)
            return 90
          }
          return prev + 1 // Very slow progress increments for exactly 10 second duration
        })
      }, 100) // 100ms interval for smooth progress over exactly 10 seconds

      console.log("Starting model training...")
      // Train the actual model
      const trainedModel = await trainStockModel(stockData)
      setModel(trainedModel)
      
      // Ensure progress reaches 100% before completing
      setTrainingProgress(100)
      
      // Add a small delay to show the completion
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log("Model training completed:", {
        trainingError: trainedModel.trainingError,
        iterations: trainedModel.iterations,
        dataPoints: stockData.length
      })
    } catch (error) {
      console.error("Training failed:", error)
      setError(`Model training failed: ${error instanceof Error ? error.message : 'Unknown error'}. Try with more data points or different stock.`)
    } finally {
      // Clear any remaining progress interval
      if (progressInterval) clearInterval(progressInterval)
      setIsTraining(false)
    }
  }, [stockData, isTraining, selectedStock])

  const handlePredict = useCallback(async () => {
    const days = parseInt(daysToPredict) || 5
    console.log("=== PREDICT BUTTON CLICKED ===")
    console.log("Model exists:", !!model)
    console.log("Stock data length:", stockData.length)
    console.log("Days to predict:", days)
    console.log("Is predicting:", isPredicting)
    
    if (!model) {
      console.log("ERROR: No model available")
      setError("Please train the model first")
      return
    }

    if (stockData.length === 0) {
      console.log("ERROR: No stock data available")
      setError("No stock data available")
      return
    }

    console.log("Starting prediction process...")
    setIsPredicting(true)
    setError("")
    
    try {
      console.log("Starting prediction...")
      const results = predictNextPrice(model, stockData, days)
      setPredictionResults(results)
      
      // Format predictions for display
      const formattedPredictions = results.futurePrices.map((price: number, index: number) => ({
        predictedPrice: price,
        confidence: Math.max(30, results.confidence * 100 - (index * 5)) // Decreasing confidence over time
      }))
      setPredictions(formattedPredictions)
      
      console.log("Prediction completed:", {
        currentPrice: results.currentPrice,
        predictedPrice: results.predictedPrice,
        confidence: results.confidence,
        futurePrices: results.futurePrices
      })
    } catch (error) {
      console.error("Prediction failed:", error)
      setError("Prediction failed. Please try training the model again.")
    } finally {
      setIsPredicting(false)
    }
  }, [model, stockData, daysToPredict, isPredicting])

  // Load initial data when component mounts
  useEffect(() => {
    console.log("Component mounted, loading initial data...")
    loadStockData(selectedStock)
  }, [])

  return (
    <div className="min-h-screen relative bg-black">

      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#0ea5e9", "#3b82f6", "#8b5cf6"]}
          amplitude={1.0}
          blend={0.5}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <UnifiedNavbar />
        
        {/* Main Content Section */}
        <section className="relative pt-32 pb-16 overflow-hidden mt-32">
          <div className="container mx-auto px-4">
            {/* Large Central Card - STATIC */}
            <Card className="main-card-dark animate-ethereal-glow-dark max-w-7xl mx-auto">
              <CardContent className="p-16">
                {/* Header */}
                <div className="text-center mb-12 relative">

                  
                  <h1 className="text-heading mb-6">
                    Market Intelligence
                  </h1>
                  <p className="text-subheading">
                    AI-powered market analysis and predictions
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                {/* Dashboard Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Stock Selection & Controls */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Data Upload Card */}
                    <AnimatedCard
                      className="ethereal-card-dark animate-ethereal-glow-dark"
                      enableStars={false}
                      enableTilt={false}
                      enableMagnetism={false}
                      clickEffect={false}
                      particleCount={0}
                    >
                      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 glass-frost-dark rounded-xl flex items-center justify-center">
                            <Upload className="h-5 w-5" />
                          </div>
                          Upload Data
                        </CardTitle>
                        <CardDescription className="text-purple-100">
                          Upload your own stock data (JSON/CSV)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 glass-frost-dark">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="file-upload" className="text-white">Upload File</Label>
                            <Input
                              id="file-upload"
                              type="file"
                              accept=".json,.csv"
                              onChange={handleFileUpload}
                              ref={fileInputRef}
                              className="mt-2 bg-black/40 border-white/20 text-white file:bg-sky-500 file:border-0 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer"
                            />
                          </div>
                          
                          <Button
                            onClick={handleDownloadSample}
                            variant="outline"
                            className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-500/20"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Sample Data
                          </Button>
                          
                          {isUploading && (
                            <div className="flex items-center gap-2 text-sky-400">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Processing file...</span>
                            </div>
                          )}
                          
                          {uploadedData.length > 0 && (
                            <div className="p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-lg">
                              <p className="text-emerald-300 text-sm">
                                ✓ Loaded {uploadedData.length} data points from file
                              </p>
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-400 space-y-1">
                            <p>• Supported formats: JSON, CSV</p>
                            <p>• Required fields: date, price (or close)</p>
                            <p>• Optional fields: open, high, low, volume</p>
                            <p>• Minimum 50 data points recommended</p>
                            <p>• Or use real API data from dropdown</p>
                          </div>
                        </div>
                      </CardContent>
                    </AnimatedCard>

                    <AnimatedCard
                      className="ethereal-card-dark animate-ethereal-glow-dark"
                      enableStars={false}
                      enableTilt={false}
                      enableMagnetism={false}
                      clickEffect={false}
                      particleCount={0}
                    >
                      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 glass-frost-dark rounded-xl flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                          </div>
                          Stock Selection
                        </CardTitle>
                        <CardDescription className="text-sky-100">
                          Choose a stock to analyze
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 glass-frost-dark">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="stock-search" className="text-white">Search US Stocks</Label>
                            <p className="text-xs text-gray-400 mt-1 mb-2">
                              Search for any US stock by company name or symbol. Results will be added to your stock list.
                            </p>
                            <div className="relative mt-2">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="stock-search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for stocks (e.g., Apple, Tesla, Google)"
                                className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-sky-400 pl-10"
                              />
                              {isSearching && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            {/* Search Results */}
                            {searchResults.length > 0 && (
                              <div className="mt-2 max-h-40 overflow-y-auto bg-black/60 border border-white/20 rounded-lg">
                                {searchResults.map((symbol) => (
                                  <button
                                    key={symbol}
                                    onClick={() => {
                                      addStockToAvailable(symbol)
                                      setSelectedStock(symbol)
                                      setSearchQuery("")
                                      setSearchResults([])
                                      loadStockData(symbol)
                                    }}
                                    className="w-full px-3 py-2 text-left text-white hover:bg-white/10 border-b border-white/10 last:border-b-0 flex items-center justify-between"
                                  >
                                    <span>{symbol}</span>
                                    {!availableStocks.includes(symbol) && (
                                      <span className="text-xs text-sky-400">+ Add to list</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* No Results */}
                            {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                              <div className="mt-2 p-3 bg-black/60 border border-white/20 rounded-lg">
                                <p className="text-gray-400 text-sm">No US stocks found for "{searchQuery}"</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="stock-select" className="text-white">Select Stock</Label>
                            <Select value={selectedStock} onValueChange={handleStockChange}>
                              <SelectTrigger className="mt-2 bg-black/40 border-white/20 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 border-white/20">
                                {availableStocks.map((stock) => (
                                  <SelectItem key={stock} value={stock} className="text-white hover:bg-white/10">
                                    {stock}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="days-to-predict" className="text-white">Days to Predict</Label>
                            <Input
                              id="days-to-predict"
                              type="number"
                              value={daysToPredict}
                              onChange={(e) => handleDaysToPredictChange(e.target.value)}
                              min="1"
                              max="30"
                              className="mt-2 bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-sky-400"
                              placeholder="Enter days to predict (1-30)"
              />
            </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                console.log("Train Model button clicked!")
                                handleTrainModel()
                              }}
                              disabled={isTraining || stockData.length < 20}
                              className="relative px-6 py-4 bg-gradient-to-b from-gray-900 to-black text-white rounded-lg border border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                              style={{
                                background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)',
                                boxShadow: '0 6px 0 #000000, 0 12px 0 #111111, inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.8)',
                                borderRadius: '8px',
                              }}
                              title={stockData.length < 20 ? `Need at least 20 data points. Currently have ${stockData.length}` : "Train the neural network model"}
                            >
                              <div className="relative z-10 font-semibold text-gray-200">
                                {isTraining ? "Training..." : stockData.length < 20 ? `Need ${20 - stockData.length} more data points` : "Train Model"}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 rounded-lg"></div>
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                console.log("Predict button clicked!")
                                handlePredict()
                              }}
                              disabled={isPredicting || !model}
                              className="relative px-6 py-4 bg-gradient-to-b from-green-700 to-green-800 text-white rounded-lg border border-green-600 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                              style={{
                                background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
                                boxShadow: '0 6px 0 #065f46, 0 12px 0 #064e3b, inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.8)',
                                borderRadius: '8px',
                              }}
                              title={!model ? "Train the model first" : "Make predictions"}
                            >
                              <div className="relative z-10 font-semibold text-white">
                                {isPredicting ? "Predicting..." : !model ? "Train model first" : "Predict"}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 rounded-lg"></div>
                            </button>
                          </div>
                          
                          {/* Button Status Messages */}
                          {stockData.length < 20 && (
                            <div className="p-3 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
                              <p className="text-yellow-300 text-sm">
                                ⚠️ Need at least 20 data points to train. Currently have {stockData.length} data points.
                              </p>
                            </div>
                          )}
                          
                          {stockData.length >= 20 && !model && (
                            <div className="p-3 bg-blue-500/20 border border-blue-400/50 rounded-lg">
                              <p className="text-blue-300 text-sm">
                                ✅ Ready to train! Using {stockData.length} real data points from API.
                              </p>
          </div>
                          )}
                          
                          {model && (
                            <div className="p-3 bg-green-500/20 border border-green-400/50 rounded-lg">
                              <p className="text-green-300 text-sm">
                                ✅ Model trained! Click "Predict" to make forecasts.
                              </p>
                            </div>
                          )}
                          

                        </div>
                      </CardContent>
                    </AnimatedCard>

                    {/* Market Overview */}
                    <AnimatedCard
                      className="ethereal-card-dark animate-ethereal-glow-dark"
                      enableStars={true}
                      enableTilt={false}
                      enableMagnetism={true}
                      clickEffect={true}
                      particleCount={6}
                    >
                      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 glass-frost-dark rounded-xl flex items-center justify-center">
                            <Activity className="h-5 w-5" />
                          </div>
                          Market Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 glass-frost-dark">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white">Current Price</span>
                            <span className="text-white font-semibold">${currentPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white">Data Source</span>
                            <span className="text-white">Real API Data</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white">Data Points</span>
                            <span className="text-white">{stockData.length} (50 requested)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white">Date Range</span>
                            <span className="text-white text-sm">
                              {stockData.length > 0 ? 
                                `${stockData[0]?.date} - ${stockData[stockData.length - 1]?.date}` : 
                                "N/A"
                              }
                            </span>
                          </div>
                          {model && (
                            <div className="flex justify-between items-center">
                              <span className="text-white">Model Status</span>
                              <span className="text-emerald-400 font-semibold">Trained</span>
                            </div>
                          )}
                          {isLoadingData && (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                              <span className="text-sky-400 text-sm">Loading data...</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  </div>

                  {/* Charts and Predictions */}
                  <div className="lg:col-span-2 space-y-8">
                {/* Stock Chart */}
                    <Card className="ethereal-card-dark">
                  <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 glass-frost-dark rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                          Stock Chart
                    </CardTitle>
                    <CardDescription className="text-sky-100">
                          Real historical data and AI predictions for {selectedStock} (50 data points from API)
                    </CardDescription>
                  </CardHeader>
                      <CardContent className="p-6 glass-frost-dark">
                        {stockData.length > 0 ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="p-3 bg-black/40 rounded-lg">
                                <p className="text-gray-400">Latest Price</p>
                                <p className="text-white font-semibold">${stockData[stockData.length - 1].price.toFixed(2)}</p>
                              </div>
                              <div className="p-3 bg-black/40 rounded-lg">
                                <p className="text-gray-400">Price Range</p>
                                <p className="text-white font-semibold">
                                  ${Math.min(...stockData.map(d => d.price)).toFixed(2)} - ${Math.max(...stockData.map(d => d.price)).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="h-80 bg-black/20 rounded-lg p-4">
                              <StockChart
                                stockData={stockData}
                                predictions={predictions}
                                currentPrice={currentPrice}
                                selectedStock={selectedStock}
                              />
                            </div>
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                                <span>Historical Data</span>
                              </div>
                              {predictions.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                  <span>Predictions</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400">No data to display.</div>
                        )}
                   </CardContent>
                </Card>

                    {/* AI Predictions */}
                    <AnimatedCard
                      className="ethereal-card-dark animate-ethereal-glow-dark"
                      enableStars={true}
                      enableTilt={false}
                      enableMagnetism={true}
                      clickEffect={true}
                      particleCount={8}
                    >
                  <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 glass-frost-dark rounded-xl flex items-center justify-center">
                        <Brain className="h-5 w-5" />
                      </div>
                      AI Predictions
                    </CardTitle>
                    <CardDescription className="text-sky-100">
                          Neural network predictions for {selectedStock}
                    </CardDescription>
                  </CardHeader>
                      <CardContent className="p-6 glass-frost-dark">
                        {predictions.length > 0 ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="p-4 bg-black/40 rounded-lg">
                                <p className="text-white text-sm">Current Price</p>
                                <p className="text-white font-bold text-xl">${currentPrice.toFixed(2)}</p>
                              </div>
                              <div className="p-4 bg-black/40 rounded-lg">
                                <p className="text-white text-sm">Next Day Prediction</p>
                                <p className="text-emerald-400 font-bold text-xl">${predictions[0]?.predictedPrice.toFixed(2)}</p>
                        </div>
                      </div>

                            <div className="space-y-3">
                              {predictions.map((prediction, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/20">
                                  <div className="flex items-center gap-4">
                                    <Calendar className="h-5 w-5 text-sky-400" />
                                    <div>
                                      <div className="text-white text-sm">Day {index + 1}</div>
                                      <div className="text-white font-semibold">${prediction.predictedPrice.toFixed(2)}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-white text-sm">Confidence</div>
                                    <div className="text-white font-semibold">{prediction.confidence.toFixed(1)}%</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {predictionResults && (
                              <div className="mt-6 p-4 bg-black/40 rounded-lg">
                                <h4 className="text-white font-semibold mb-2">Model Performance</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-400">Training Error: </span>
                                    <span className="text-white">{(predictionResults.trainingError * 100).toFixed(4)}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Iterations: </span>
                                    <span className="text-white">{predictionResults.iterations}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Confidence: </span>
                                    <span className="text-white">{(predictionResults.confidence * 100).toFixed(1)}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Prediction Range: </span>
                                    <span className="text-white">{daysToPredict} days</span>
                                  </div>
                                </div>
                        </div>
                      )}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Brain className="h-12 w-12 text-sky-400 mx-auto mb-4" />
                            <p className="text-white mb-4">No predictions available</p>
                            <p className="text-gray-400 text-sm">Train the model and run predictions to see AI forecasts</p>
                          </div>
                        )}
                      </CardContent>
                    </AnimatedCard>
                      </div>
                    </div>
                  </CardContent>
                </Card>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
} 