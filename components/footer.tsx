"use client"

import { ArrowUp, Snowflake } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Scroll to top handler
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900 text-white relative overflow-hidden">
      {/* Ethereal background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute inset-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative z-10 text-center flex flex-col items-center justify-center min-h-[220px]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative mystical-glow">
            <div className="w-12 h-12 glass-frost rounded-2xl flex items-center justify-center shadow-2xl animate-frost-breath">
              <Snowflake className="h-7 w-7 text-sky-400 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-crystalline">CrystalStock AI</h3>
            <p className="text-sky-200 text-sm">Ethereal Market Intelligence</p>
          </div>
        </div>
        <p className="text-sky-100 leading-relaxed max-w-xl mx-auto mb-2">
          Experience the serenity of advanced stock market analysis. Our ethereal AI platform brings tranquil precision to investment decisions through crystalline neural network predictions.
        </p>
        <p className="text-sky-300 text-xs mt-4">© {currentYear} CrystalStock AI. All rights reserved.</p>
      </div>
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-sky-500 to-blue-700 text-white rounded-full shadow-lg p-4 hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-white/20 backdrop-blur-lg"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </footer>
  )
}
