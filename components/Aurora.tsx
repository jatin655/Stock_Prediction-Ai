"use client"

import { useEffect, useRef } from "react"

interface AuroraProps {
  colorStops?: string[]
  amplitude?: number
  blend?: number
  className?: string
  time?: number
  speed?: number
}

export default function Aurora(props: AuroraProps) {
  const {
    colorStops = ["#0ea5e9", "#3b82f6", "#8b5cf6"],
    amplitude = 1.0,
    blend = 0.5,
    className = ""
  } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation variables
    let time = 0
    const animate = () => {
      time += 0.01
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      colorStops.forEach((color, index) => {
        gradient.addColorStop(index / (colorStops.length - 1), color)
      })
      
      // Draw aurora effect
      ctx.fillStyle = gradient
      ctx.globalAlpha = 0.3
      
      for (let x = 0; x < canvas.width; x += 2) {
        const noise = Math.sin(x * 0.01 + time) * Math.cos(time * 0.5) * amplitude
        const height = Math.sin(x * 0.005 + time * 0.3) * 100 * amplitude + 200
        
        ctx.beginPath()
        ctx.moveTo(x, canvas.height)
        ctx.lineTo(x, canvas.height - height + noise)
        ctx.lineTo(x + 2, canvas.height - height + noise)
        ctx.lineTo(x + 2, canvas.height)
        ctx.closePath()
        ctx.fill()
      }
      
      requestAnimationFrame(animate)
    }
    
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [colorStops, amplitude, blend])

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full ${className}`}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    />
  )
} 