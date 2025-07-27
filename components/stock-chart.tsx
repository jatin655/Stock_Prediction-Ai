"use client"

import { useEffect, useRef } from "react"
import type { StockData, PredictionResult } from "@/types/stock"

interface StockChartProps {
  data: StockData[]
  prediction: PredictionResult | null
  symbol?: string
}

export default function StockChart({ data, prediction, symbol }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    let chartInstance: any = null
    let isMounted = true

    async function initChart() {
      if (!canvasRef.current || !isMounted) return

      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      try {
        // Dynamically import Chart.js
        const { default: Chart } = await import("chart.js/auto")
        if (!isMounted) return

        // Destroy existing chart
        if (chartRef.current) {
          chartRef.current.destroy()
        }

        // Prepare historical data
        const historicalLabels = data.map((d) => {
          const date = new Date(d.date)
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        })
        const historicalPrices = data.map((d) => d.price)

        // Prepare datasets
        const datasets: any[] = [
          {
            label: `${symbol || "Stock"} Historical Prices`,
            data: historicalPrices,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.1,
            pointRadius: 1,
            pointHoverRadius: 4,
          },
        ]

        let allLabels = [...historicalLabels]

        // Add prediction data if available
        if (prediction && prediction.futurePrices.length > 0) {
          const predictionLabels = prediction.futureDates.map((date) => {
            const d = new Date(date)
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          })

          // Extend labels to include prediction dates
          allLabels = [...historicalLabels, ...predictionLabels]

          // Create prediction dataset
          const predictionData = [
            ...Array(historicalPrices.length - 1).fill(null),
            historicalPrices[historicalPrices.length - 1], // Connect to last historical point
            ...prediction.futurePrices,
          ]

          datasets.push({
            label: `${symbol || "Stock"} AI Predictions`,
            data: predictionData,
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderWidth: 3,
            borderDash: [8, 4],
            fill: false,
            tension: 0.2,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: "rgb(239, 68, 68)",
            pointBorderColor: "white",
            pointBorderWidth: 2,
          })

          // Add confidence band
          const confidenceUpper = [
            ...Array(historicalPrices.length).fill(null),
            ...prediction.futurePrices.map((price) => price * (1 + (1 - prediction.confidence) * 0.1)),
          ]
          const confidenceLower = [
            ...Array(historicalPrices.length).fill(null),
            ...prediction.futurePrices.map((price) => price * (1 - (1 - prediction.confidence) * 0.1)),
          ]

          datasets.push({
            label: "Confidence Band (Upper)",
            data: confidenceUpper,
            borderColor: "rgba(239, 68, 68, 0.3)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderWidth: 1,
            borderDash: [2, 2],
            fill: "+1",
            pointRadius: 0,
            tension: 0.2,
          })

          datasets.push({
            label: "Confidence Band (Lower)",
            data: confidenceLower,
            borderColor: "rgba(239, 68, 68, 0.3)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderWidth: 1,
            borderDash: [2, 2],
            fill: false,
            pointRadius: 0,
            tension: 0.2,
          })
        }

        // Create the chart
        chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: allLabels,
            datasets: datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: "index",
            },
            plugins: {
              title: {
                display: true,
                text: `${symbol || "Stock"} Price Analysis & AI Predictions`,
                font: {
                  size: 16,
                  weight: "bold",
                },
                color: "#374151",
              },
              legend: {
                display: true,
                position: "top",
                labels: {
                  filter: (legendItem) => {
                    // Hide confidence band labels from legend
                    return !legendItem.text?.includes("Confidence Band")
                  },
                },
              },
              tooltip: {
                callbacks: {
                  title: (context) => {
                    const label = context[0].label
                    const dataIndex = context[0].dataIndex
                    const isHistorical = dataIndex < data.length
                    return `${symbol || "Stock"} - ${label} ${isHistorical ? "(Historical)" : "(Predicted)"}`
                  },
                  label: (context) => {
                    const value = context.parsed.y
                    if (value === null || value === undefined) return ""

                    const datasetLabel = context.dataset.label || ""
                    if (datasetLabel.includes("Confidence")) return ""

                    return `${datasetLabel}: $${value.toFixed(2)}`
                  },
                  afterBody: (context) => {
                    if (prediction && context[0].dataIndex >= data.length) {
                      return [`Confidence: ${(prediction.confidence * 100).toFixed(1)}%`]
                    }
                    return []
                  },
                },
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "white",
                bodyColor: "white",
                borderColor: "rgba(59, 130, 246, 0.5)",
                borderWidth: 1,
              },
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Date",
                  color: "#6B7280",
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
                grid: {
                  display: true,
                  color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: "#6B7280",
                  maxTicksLimit: 10,
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Price ($)",
                  color: "#6B7280",
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
                grid: {
                  display: true,
                  color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: "#6B7280",
                  callback: (value) => `$${Number(value).toFixed(2)}`,
                },
              },
            },
            elements: {
              point: {
                hoverRadius: 8,
              },
              line: {
                borderCapStyle: "round",
                borderJoinStyle: "round",
              },
            },
          },
        })

        chartRef.current = chartInstance
        console.log("Chart created successfully with prediction data")
      } catch (error) {
        console.error("Error creating chart:", error)
      }
    }

    initChart()

    return () => {
      isMounted = false
      if (chartInstance) {
        chartInstance.destroy()
      }
    }
  }, [data, prediction, symbol])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div>No data available to display</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-96 w-full bg-white rounded-lg p-2">
      <canvas ref={canvasRef} />
      {prediction && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="text-xs text-gray-600">
            AI Confidence: <span className="font-bold text-blue-600">{(prediction.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
