"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Brain, Target, Activity, Zap } from "lucide-react"
import type { PredictionResult } from "@/types/stock"

interface PredictionResultsProps {
  prediction: PredictionResult | null
  isModelTrained: boolean
  symbol?: string
}

export default function PredictionResults({ prediction, isModelTrained, symbol }: PredictionResultsProps) {
  if (!isModelTrained) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-gray-400" />
            Neural Network Status
          </CardTitle>
          <CardDescription>Train the AI model to see predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="relative mb-6">
              <Brain className="h-16 w-16 mx-auto text-gray-300 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Train</h3>
            <p className="text-gray-500 mb-4">
              Our advanced neural network is ready to analyze {symbol || "stock"} patterns and make predictions.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
              <strong>Neural Network Features:</strong>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Multi-layer perceptron architecture</li>
                <li>• Technical indicator integration</li>
                <li>• Advanced backpropagation training</li>
                <li>• Confidence scoring system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!prediction) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Model Trained Successfully
          </CardTitle>
          <CardDescription>Neural network is ready for predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="relative mb-6">
              <Target className="h-16 w-16 mx-auto text-green-500 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Activity className="h-3 w-3 text-white animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Training Complete!</h3>
            <p className="text-gray-500 mb-4">
              The neural network has been trained and is ready to generate {symbol || "stock"} price predictions.
            </p>
            <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700">
              Click <strong>"Make New Prediction"</strong> to generate AI-powered forecasts
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const trend = prediction.predictedPrice > prediction.currentPrice ? "up" : "down"
  const changePercent = ((prediction.predictedPrice - prediction.currentPrice) / prediction.currentPrice) * 100
  const confidencePercent = prediction.confidence * 100

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Prediction Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 animate-pulse" />
            {symbol} AI Prediction Results
          </CardTitle>
          <CardDescription className="text-blue-100">
            Advanced neural network analysis with technical indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Price Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 mb-2 font-medium">Current Price</div>
              <div className="text-3xl font-bold text-blue-700">${prediction.currentPrice.toFixed(2)}</div>
              <div className="text-xs text-blue-500 mt-1">Live Market Data</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="text-sm text-purple-600 mb-2 font-medium">Next Day Prediction</div>
              <div className="text-3xl font-bold text-purple-700">${prediction.predictedPrice.toFixed(2)}</div>
              <div className="text-xs text-purple-500 mt-1">AI Neural Network</div>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                {trend === "up" ? (
                  <TrendingUp className="h-8 w-8 text-green-600 animate-bounce" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600 animate-bounce" />
                )}
                <span className="text-xl font-semibold text-gray-700">
                  Expected {trend === "up" ? "Increase" : "Decrease"}
                </span>
              </div>
              <Badge variant={trend === "up" ? "default" : "destructive"} className="text-xl px-4 py-2 font-bold">
                {changePercent > 0 ? "+" : ""}
                {changePercent.toFixed(2)}%
              </Badge>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              Predicted change:{" "}
              <strong>${Math.abs(prediction.predictedPrice - prediction.currentPrice).toFixed(2)}</strong>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-700">AI Confidence Score</span>
              <Badge variant="outline" className="text-green-700 border-green-300">
                {confidencePercent >= 80 ? "High" : confidencePercent >= 60 ? "Medium" : "Low"}
              </Badge>
            </div>
            <Progress value={confidencePercent} className="h-3 mb-2" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Model Certainty</span>
              <span className="font-bold text-green-600">{confidencePercent.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Neural Network Performance
          </CardTitle>
          <CardDescription>Training statistics and model metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Training Error</div>
              <div className="text-2xl font-bold text-blue-600">{prediction.trainingError.toFixed(6)}</div>
              <div className="text-xs text-blue-500">Lower is better</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Training Iterations</div>
              <div className="text-2xl font-bold text-green-600">{prediction.iterations.toLocaleString()}</div>
              <div className="text-xs text-green-500">Epochs completed</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Model Architecture</div>
            <div className="text-xs text-purple-600 space-y-1">
              <div>• Input Layer: 16 neurons (10 prices + 6 technical indicators)</div>
              <div>• Hidden Layers: 32 → 16 → 8 neurons with ReLU/Tanh activation</div>
              <div>• Output Layer: 1 neuron with Sigmoid activation</div>
              <div>• Training: Backpropagation with adaptive learning rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extended Forecast */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Extended Price Forecast
          </CardTitle>
          <CardDescription>Multi-day predictions from the neural network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prediction.futureDates.map((date, index) => {
              const price = prediction.futurePrices[index]
              const dayChange =
                index === 0 ? price - prediction.currentPrice : price - prediction.futurePrices[index - 1]
              const dayChangePercent =
                index === 0
                  ? ((price - prediction.currentPrice) / prediction.currentPrice) * 100
                  : ((price - prediction.futurePrices[index - 1]) / prediction.futurePrices[index - 1]) * 100

              return (
                <div
                  key={date}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="font-semibold text-gray-700">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-gray-500">Day {index + 1}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-800">${price.toFixed(2)}</div>
                    <div
                      className={`text-sm font-medium flex items-center gap-1 ${
                        dayChange >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {dayChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)} ({dayChangePercent >= 0 ? "+" : ""}
                      {dayChangePercent.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
