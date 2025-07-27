"use client"

import type { StockData } from "@/types/stock"
import { useEffect, useRef, useState } from "react"

interface StockChartProps {
  stockData: StockData[]
  predictions?: Array<{predictedPrice: number, confidence: number}>
  currentPrice: number
  selectedStock: string
}

export default function StockChart({ stockData, predictions, currentPrice, selectedStock }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    show: boolean
    x: number
    y: number
    data: any
    type: 'historical' | 'prediction'
  }>({ show: false, x: 0, y: 0, data: null, type: 'historical' })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || stockData.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get price range
    const prices = stockData.map(d => d.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width / window.devicePixelRatio - padding * 2
    const chartHeight = canvas.height / window.devicePixelRatio - padding * 2

    // Reserve 90% of chart width for historical, 10% for predictions
    const histWidth = chartWidth * 0.9
    const predWidth = chartWidth * 0.1

    // Draw grid (simple, plain lines)
    ctx.strokeStyle = '#e5e7eb'; // light gray
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }
    // Draw y-axis labels (simple)
    ctx.fillStyle = '#888';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (priceRange / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(`$${price.toFixed(2)}`, padding - 6, y + 4);
    }
    // Draw x-axis date/time labels (show only 5, evenly spaced, no overlap)
    ctx.textAlign = 'center';
    ctx.font = '11px Arial';
    const labelCount = 5;
    for (let i = 0; i < labelCount; i++) {
      const dataIdx = Math.round((stockData.length - 1) * i / (labelCount - 1));
      const x = padding + (chartWidth / (stockData.length - 1)) * dataIdx;
      const date = stockData[dataIdx].date;
      const label = date.length > 10 ? date.slice(0, 10) : date;
      ctx.fillStyle = '#888';
      ctx.fillText(label, x, padding + chartHeight + 16);
    }
    ctx.textAlign = 'left';
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(selectedStock, padding, 25);

    // Draw price line (historical)
    if (stockData.length > 1) {
      ctx.strokeStyle = '#0ea5e9'
      ctx.lineWidth = 2
      ctx.beginPath()

      stockData.forEach((data, index) => {
        const x = padding + (histWidth / (stockData.length - 1)) * index
        const y = padding + chartHeight - ((data.price - minPrice) / priceRange) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw data points
      ctx.fillStyle = '#0ea5e9'
      stockData.forEach((data, index) => {
        const x = padding + (histWidth / (stockData.length - 1)) * index
        const y = padding + chartHeight - ((data.price - minPrice) / priceRange) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })
    }

    // Draw predictions if available
    if (predictions && predictions.length > 0) {
      ctx.strokeStyle = '#8b5cf6'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()

      // Start predictions at the end of historical data
      const lastHistX = padding + histWidth
      const predCount = predictions.length
      const predAreaStart = lastHistX
      const predAreaEnd = padding + histWidth + predWidth
      const predDrawWidth = Math.max(predAreaEnd - predAreaStart, 1)
      const predStep = predCount > 1 ? predDrawWidth / (predCount - 1) : predDrawWidth

      predictions.forEach((prediction, index) => {
        let x = predAreaStart + predStep * index
        x = Math.min(x, padding + chartWidth - 4)
        const y = padding + chartHeight - ((prediction.predictedPrice - minPrice) / priceRange) * chartHeight

        if (index === 0) {
          ctx.moveTo(lastHistX, padding + chartHeight - ((currentPrice - minPrice) / priceRange) * chartHeight)
        }
        ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.setLineDash([])

      // Draw prediction points
      ctx.fillStyle = '#8b5cf6'
      predictions.forEach((prediction, index) => {
        let x = predAreaStart + predStep * index
        x = Math.min(x, padding + chartWidth - 4)
        const y = padding + chartHeight - ((prediction.predictedPrice - minPrice) / priceRange) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
    }

    // Mouse event handlers (update for new x logic)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      // Mouse position relative to canvas
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      // Mouse position relative to container (for tooltip)
      const relX = e.clientX - (containerRect?.left ?? 0);
      const relY = e.clientY - (containerRect?.top ?? 0);
      let found = false;
      // Check historical data points
      stockData.forEach((data, index) => {
        const x = padding + (histWidth / (stockData.length - 1)) * index;
        const y = padding + chartHeight - ((data.price - minPrice) / priceRange) * chartHeight;
        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        if (!found && distance < 10) {
          setTooltip({
            show: true,
            x: relX,
            y: relY,
            data: {
              date: data.date,
              price: data.price,
              open: data.open,
              high: data.high,
              low: data.low,
              volume: data.volume
            },
            type: 'historical'
          });
          found = true;
        }
      });
      // Check prediction points
      if (predictions && predictions.length > 0) {
        const lastHistX = padding + histWidth;
        const predCount = predictions.length;
        const predAreaStart = lastHistX;
        const predAreaEnd = padding + histWidth + predWidth;
        const predDrawWidth = Math.max(predAreaEnd - predAreaStart, 1);
        const predStep = predCount > 1 ? predDrawWidth / (predCount - 1) : predDrawWidth;
        predictions.forEach((prediction, index) => {
          let x = predAreaStart + predStep * index;
          x = Math.min(x, padding + chartWidth - 4);
          const y = padding + chartHeight - ((prediction.predictedPrice - minPrice) / priceRange) * chartHeight;
          const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
          if (!found && distance < 10) {
            setTooltip({
              show: true,
              x: relX,
              y: relY,
              data: {
                day: index + 1,
                predictedPrice: prediction.predictedPrice,
                confidence: prediction.confidence
              },
              type: 'prediction'
            });
            found = true;
          }
        });
      }
      if (!found) {
        setTooltip(prev => ({ ...prev, show: false }));
      }
    };

    const handleMouseLeave = () => {
      setTooltip(prev => ({ ...prev, show: false }))
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [stockData, predictions, currentPrice, selectedStock])

  // Tooltip clamping logic
  const [tooltipDims, setTooltipDims] = useState({ width: 220, height: 120 });
  useEffect(() => {
    if (tooltipRef.current) {
      setTooltipDims({
        width: tooltipRef.current.offsetWidth,
        height: tooltipRef.current.offsetHeight,
      });
    }
  }, [tooltip]);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          borderRadius: '8px',
          border: '2px solid red', // TEMP: debug border
        }}
      />
      
      {/* Tooltip */}
      {tooltip.show && (
        <div 
          ref={tooltipRef}
          className="absolute z-50 bg-black/90 border border-white/20 rounded-lg p-3 text-white text-sm shadow-lg"
          style={{
            left: Math.min(
              tooltip.x + 10,
              (containerRef.current?.offsetWidth || 600) - tooltipDims.width - 10
            ),
            top: Math.max(
              tooltip.y - tooltipDims.height - 10,
              0
            ),
            minWidth: '200px',
            pointerEvents: 'none',
          }}
        >
          {tooltip.type === 'historical' ? (
            <div>
              <div className="font-semibold text-sky-400 mb-2">Historical Data</div>
              <div className="space-y-1">
                <div><span className="text-gray-400">Date:</span> {tooltip.data.date}</div>
                <div><span className="text-gray-400">Price:</span> <span className="text-green-400">${tooltip.data.price.toFixed(2)}</span></div>
                <div><span className="text-gray-400">Open:</span> ${tooltip.data.open.toFixed(2)}</div>
                <div><span className="text-gray-400">High:</span> <span className="text-green-400">${tooltip.data.high.toFixed(2)}</span></div>
                <div><span className="text-gray-400">Low:</span> <span className="text-red-400">${tooltip.data.low.toFixed(2)}</span></div>
                <div><span className="text-gray-400">Volume:</span> {tooltip.data.volume.toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <div>
              <div className="font-semibold text-purple-400 mb-2">AI Prediction</div>
              <div className="space-y-1">
                <div><span className="text-gray-400">Day:</span> {tooltip.data.day}</div>
                <div><span className="text-gray-400">Predicted Price:</span> <span className="text-purple-400">${tooltip.data.predictedPrice.toFixed(2)}</span></div>
                <div><span className="text-gray-400">Confidence:</span> <span className="text-yellow-400">{tooltip.data.confidence.toFixed(1)}%</span></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 