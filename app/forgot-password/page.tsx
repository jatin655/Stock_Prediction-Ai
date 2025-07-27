"use client"

import AnimatedCard from "@/components/AnimatedCard"
import Aurora from "@/components/Aurora"
import Footer from "@/components/footer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UnifiedNavbar from "@/components/UnifiedNavbar"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Basic validation
    if (!email) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to send reset email. Please try again.')
      } else {
        setSuccess("If an account with that email exists, a password reset link has been sent to your email.")
      }
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative bg-black">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#0ea5e9", "#3b82f6", "#8b5cf6"]}
          amplitude={1.0}
          blend={0.5}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <UnifiedNavbar />
        
        {/* Main Content Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Large Central Card - STATIC */}
            <Card className="main-card-dark animate-ethereal-glow-dark max-w-md mx-auto">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-heading mb-4">
                    Forgot Password
                  </h1>
                  <p className="text-subheading">
                    Enter your email to receive a reset link
                  </p>
                </div>

                {/* Forgot Password Form */}
                <AnimatedCard
                  className="ethereal-card-dark animate-ethereal-glow-dark"
                  enableStars={true}
                  enableTilt={false}
                  enableMagnetism={true}
                  clickEffect={true}
                  particleCount={6}
                >
                  <CardContent className="p-6 glass-frost-dark">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <Alert variant="destructive" className="animate-shake glass-ethereal-dark border-red-400/50 text-red-300">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {success && (
                        <Alert className="glass-ethereal-dark border-emerald-400/50 text-emerald-300">
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-sky-400"
                          placeholder="Enter your email address"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full crystalline-button-dark mystical-glow-dark"
                      >
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending reset link...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reset Link
                          </>
                        )}
                      </Button>

                      <div className="text-center space-y-4">
                        <p className="text-gray-400 text-sm">
                          Remember your password?{" "}
                          <Link
                            href="/login"
                            className="text-sky-400 hover:text-sky-300 transition-colors"
                          >
                            Sign in
                          </Link>
                        </p>
                        
                        <Link
                          href="/"
                          className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Home
                        </Link>
                      </div>
                    </form>
                  </CardContent>
                </AnimatedCard>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
} 