"use client"

import AnimatedCard from "@/components/AnimatedCard"
import Aurora from "@/components/Aurora"
import Footer from "@/components/footer"
import HomeRobot from "@/components/HomeRobot"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import UnifiedNavbar from "@/components/UnifiedNavbar"
import { ArrowRight, BarChart3, Brain, Sparkles, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function HomePage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen relative bg-black">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#0ea5e9", "#3b82f6", "#8b5cf6"]}
          amplitude={1.2}
          blend={0.6}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <UnifiedNavbar />
        
        {/* Main Content Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Large Central Card - STATIC */}
            <Card className="main-card-dark animate-ethereal-glow-dark max-w-6xl mx-auto">
              <CardContent className="p-16 relative">
                {/* Hero Section with Robot */}
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  {/* Left Content */}
                  <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
                    <h1 className="text-hero mb-6 text-white" style={{ WebkitTextFillColor: 'white', color: 'white' }}>
                      CrystalStock AI
                    </h1>
                    
                    {/* Welcome message for logged in users */}
                    {session?.user && (
                      <div className="mb-6">
                        <p className="text-xl text-blue-400 font-semibold">
                          Welcome back, {session.user.name || session.user.email?.split('@')[0]}!
                        </p>
                      </div>
                    )}
                    
                    <p className="text-subheading mb-8 max-w-2xl text-gray-300">
                      Advanced market intelligence with AI-powered predictions
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mb-8">
                      <Link href="/dashboard">
                        <Button className="crystalline-button-dark px-10 py-6 text-xl font-semibold mystical-glow-dark hover:scale-105 transition-transform duration-300">
                          <BarChart3 className="h-7 w-7 mr-3" />
                          Launch Dashboard
                          <ArrowRight className="h-7 w-7 ml-3" />
                        </Button>
                      </Link>
                      
                      {!session?.user && (
                        <Link href="/register">
                          <Button variant="outline" className="px-10 py-6 text-xl font-semibold border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                            <Sparkles className="h-7 w-7 mr-3" />
                            Get Started
                          </Button>
                        </Link>
                      )}
                    </div>
                    
                    {/* Show Sign In only if not logged in */}
                    {!session?.user && (
                      <div className="text-center lg:text-left">
                        <Link href="/login">
                          <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 transition-all duration-300 text-lg">
                            Sign In
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Right Robot Animation */}
                  <div className="lg:w-1/2 h-96 lg:h-auto">
                    <HomeRobot />
                  </div>
                </div>

                {/* Feature Cards Inside Main Card - ANIMATED */}
                <div className="grid md:grid-cols-3 gap-8 mt-16">
                  <AnimatedCard
                    className="ethereal-card-dark animate-ethereal-glow-dark"
                    enableStars={true}
                    enableTilt={false}
                    enableMagnetism={true}
                    clickEffect={true}
                    particleCount={6}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-heading text-2xl font-bold mb-4 text-white">AI Predictions</h3>
                      <p className="text-body text-gray-300">
                        Neural networks analyze market patterns with precision
                      </p>
                    </CardContent>
                  </AnimatedCard>
                  
                  <AnimatedCard
                    className="ethereal-card-dark animate-ethereal-glow-dark"
                    enableStars={true}
                    enableTilt={false}
                    enableMagnetism={true}
                    clickEffect={true}
                    particleCount={6}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <TrendingUp className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-heading text-2xl font-bold mb-4 text-white">Real-Time Data</h3>
                      <p className="text-body text-gray-300">
                        Live market data from global exchanges
                      </p>
                    </CardContent>
                  </AnimatedCard>
                  
                  <AnimatedCard
                    className="ethereal-card-dark animate-ethereal-glow-dark"
                    enableStars={true}
                    enableTilt={false}
                    enableMagnetism={true}
                    clickEffect={true}
                    particleCount={6}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-heading text-2xl font-bold mb-4 text-white">Smart Interface</h3>
                      <p className="text-body text-gray-300">
                        Intuitive design for seamless analysis
                      </p>
                    </CardContent>
                  </AnimatedCard>
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
