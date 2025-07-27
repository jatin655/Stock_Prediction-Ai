"use client"

import DotGrid from "@/components/DotGrid"
import TutorialStepper, { Step } from "@/components/TutorialStepper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Brain, Check, Crown, Eye, Globe, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function TutorialPage() {
  const [showTutorial, setShowTutorial] = useState(true)

  const handleTutorialComplete = () => {
    setShowTutorial(false)
  }

  if (!showTutorial) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 z-0">
          <DotGrid
            dotSize={8}
            gap={20}
            baseColor="#0ea5e9"
            activeColor="#0284c7"
            proximity={120}
            shockRadius={200}
            shockStrength={3}
            resistance={800}
            returnDuration={1.2}
          />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="ethereal-card animate-ethereal-glow max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-sky-700 mb-4">Tutorial Complete!</h2>
              <p className="text-sky-600 mb-6">
                You're now ready to explore CrystalStock AI. Start your journey with ethereal market intelligence!
              </p>
              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full crystalline-button mystical-glow hover:scale-105 transition-transform duration-300">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-sky-400/50 text-sky-700 hover:bg-sky-50/50 hover:border-sky-500 transition-all duration-300">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <DotGrid
          dotSize={8}
          gap={20}
          baseColor="#0ea5e9"
          activeColor="#0284c7"
          proximity={120}
          shockRadius={200}
          shockStrength={3}
          resistance={800}
          returnDuration={1.2}
        />
      </div>
      <div className="relative z-10">
        <TutorialStepper
          initialStep={1}
          onStepChange={(step) => {
            console.log(`Step ${step} completed`);
          }}
          onFinalStepCompleted={handleTutorialComplete}
          backButtonText="Previous"
          nextButtonText="Next"
        >
          <Step>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-4">
                  Welcome to CrystalStock AI
                </h2>
                <p className="text-lg text-sky-700 leading-relaxed">
                  Experience the future of market intelligence with our ethereal AI platform. 
                  Let's take a quick tour to show you how to make the most of our features.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-sky-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                  AI-Powered Predictions
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Real-Time Data
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Secure Platform
                </div>
              </div>
            </div>
          </Step>

          <Step>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-4">
                  Dashboard Overview
                </h2>
                <p className="text-lg text-sky-700 leading-relaxed mb-6">
                  Your main workspace for market analysis and predictions. Here you can:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-sky-500" />
                      <h3 className="font-semibold text-sky-700">Stock Selection</h3>
                    </div>
                    <p className="text-sm text-sky-600">Choose from popular stocks or search for any ticker symbol</p>
                  </div>
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="h-5 w-5 text-sky-500" />
                      <h3 className="font-semibold text-sky-700">AI Predictions</h3>
                    </div>
                    <p className="text-sm text-sky-600">Train neural networks and get price predictions</p>
                  </div>
                </div>
              </div>
            </div>
          </Step>

          <Step>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-4">
                  AI-Powered Predictions
                </h2>
                <p className="text-lg text-sky-700 leading-relaxed mb-6">
                  Our advanced neural networks analyze market patterns with crystalline precision:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 font-bold">1</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sky-700">Train Model</h3>
                      <p className="text-sm text-sky-600">Click "Train Neural Network" to analyze historical data</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 font-bold">2</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sky-700">Generate Predictions</h3>
                      <p className="text-sm text-sky-600">Get AI-powered price forecasts for 1-14 days ahead</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 font-bold">3</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sky-700">Analyze Results</h3>
                      <p className="text-sm text-sky-600">View confidence levels and trend analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Step>

          <Step>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-4">
                  Market Overview
                </h2>
                <p className="text-lg text-sky-700 leading-relaxed mb-6">
                  Stay informed with comprehensive market insights and real-time data:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="h-5 w-5 text-sky-500" />
                      <h3 className="font-semibold text-sky-700">Global Markets</h3>
                    </div>
                    <p className="text-sm text-sky-600">Access data from major exchanges worldwide</p>
                  </div>
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="h-5 w-5 text-sky-500" />
                      <h3 className="font-semibold text-sky-700">Real-Time Updates</h3>
                    </div>
                    <p className="text-sm text-sky-600">Live market data with instant refresh</p>
                  </div>
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-5 w-5 text-sky-500" />
                      <h3 className="font-semibold text-sky-700">Secure Platform</h3>
                    </div>
                    <p className="text-sm text-sky-600">Enterprise-grade security for your data</p>
                  </div>
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-5 w-5 text-sky-500" />
                      <h3 className="font-semibold text-sky-700">User-Friendly</h3>
                    </div>
                    <p className="text-sm text-sky-600">Intuitive interface for all experience levels</p>
                  </div>
                </div>
              </div>
            </div>
          </Step>

          <Step>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-4">
                  Advanced Features
                </h2>
                <p className="text-lg text-sky-700 leading-relaxed mb-6">
                  Discover the ethereal capabilities that set CrystalStock AI apart:
                </p>
                <div className="space-y-4">
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="h-5 w-5 text-sky-500" />
                      <h3 className="font-semibold text-sky-700">Interactive Charts</h3>
                    </div>
                    <p className="text-sm text-sky-600">Visualize price movements and predictions with beautiful charts</p>
                  </div>
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="h-5 w-5 text-sky-500" />
                      <h3 className="font-semibold text-sky-700">Neural Networks</h3>
                    </div>
                    <p className="text-sm text-sky-600">Advanced AI models trained on vast market datasets</p>
                  </div>
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="h-5 w-5 text-sky-500" />
                      <h3 className="font-semibold text-sky-700">Crystalline Precision</h3>
                    </div>
                    <p className="text-sm text-sky-600">Ethereal accuracy in market predictions and analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </Step>

          <Step>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent mb-4">
                  You're All Set!
                </h2>
                <p className="text-lg text-sky-700 leading-relaxed mb-6">
                  You now have all the knowledge to explore CrystalStock AI's ethereal market intelligence. 
                  Start your journey with confidence and discover the future of stock prediction.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 glass-ethereal rounded-lg border border-emerald-400/30">
                    <h3 className="font-semibold text-emerald-700 mb-2">Ready to Start?</h3>
                    <p className="text-sm text-emerald-600">Access your dashboard and begin analyzing stocks</p>
                  </div>
                  <div className="p-4 glass-ethereal rounded-lg border border-sky-400/30">
                    <h3 className="font-semibold text-sky-700 mb-2">Need Help?</h3>
                    <p className="text-sm text-sky-600">Visit our about page to learn more about our technology</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                  <p className="text-sm text-sky-700">
                    <strong>Pro Tip:</strong> Start with popular stocks like AAPL, GOOGL, or MSFT to see our AI in action!
                  </p>
                </div>
              </div>
            </div>
          </Step>
        </TutorialStepper>
      </div>
    </div>
  )
} 