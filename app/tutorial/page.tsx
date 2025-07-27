"use client"

// Force dynamic rendering and disable static generation
export const dynamic = 'force-dynamic'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function TutorialPage() {
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Tutorial Complete!</h2>
              <p className="text-gray-300 mb-6">
                You're now ready to explore CrystalStock AI. Start your journey with ethereal market intelligence!
              </p>
              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 