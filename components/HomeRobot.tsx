"use client"

import { useEffect } from 'react'

// Declare the custom element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url: string
      }
    }
  }
}

export default function HomeRobot() {
  // Load Spline viewer script
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.37/build/spline-viewer.js'
    document.head.appendChild(script)
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="w-full h-full">
      <spline-viewer 
        url="https://prod.spline.design/pdp5LJXTn0F6wR36/scene.splinecode"
        style={{ width: '150%', height: '150%' }}
      ></spline-viewer>
    </div>
  )
} 