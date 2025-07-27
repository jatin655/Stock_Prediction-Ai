"use client"

import { ReactNode } from "react"
import { ParticleCard } from "./MagicBento"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  enableStars?: boolean
  enableTilt?: boolean
  enableMagnetism?: boolean
  clickEffect?: boolean
  particleCount?: number
  glowColor?: string
}

export default function AnimatedCard({
  children,
  className = "",
  style,
  enableStars = true,
  enableTilt = false, // Disabled by default
  enableMagnetism = true,
  clickEffect = true,
  particleCount = 8,
  glowColor = "14, 165, 233", // Sky blue to match your theme
}: AnimatedCardProps) {
  if (enableStars) {
    return (
      <ParticleCard
        className={className}
        style={style}
        particleCount={particleCount}
        glowColor={glowColor}
        enableTilt={enableTilt}
        clickEffect={clickEffect}
        enableMagnetism={enableMagnetism}
      >
        {children}
      </ParticleCard>
    )
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
} 