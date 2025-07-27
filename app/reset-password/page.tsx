"use client"

import DotGrid from "@/components/DotGrid"
import Footer from "@/components/footer"
import Header from "@/components/header"
import SplitText from "@/components/SplitText"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CheckCircle, Mail, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState<"email" | "code" | "new-password">("email")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if token is in URL (from email link)
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setResetToken(token)
      setStep("new-password")
    }
  }, [searchParams])

  const handleEmailSubmit = async (e: React.FormEvent) => {
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
        setStep("code")
      }
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!resetToken) {
      setError("Please enter the reset code")
      setIsLoading(false)
      return
    }

    if (resetToken.length !== 64) {
      setError("Please enter a valid reset code")
      setIsLoading(false)
      return
    }

    // For now, we'll assume the code is valid and move to password step
    // In a real implementation, you'd verify the code with the API
    setStep("new-password")
    setIsLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          password: newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to reset password. Please try again.')
      } else {
        setSuccess("Password reset successful! You can now sign in with your new password.")
        
        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sky-700 font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-500" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="pl-10 glass-ethereal border-sky-400/30 text-sky-800 focus:border-sky-500 transition-all duration-200 focus:scale-105"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full crystalline-button py-4 text-lg font-semibold mystical-glow hover:scale-105 transition-transform duration-300"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Sending Reset Email...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Send Reset Email
          </>
        )}
      </Button>
    </form>
  )

  const renderCodeStep = () => (
    <form onSubmit={handleCodeSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="code" className="text-sky-700 font-medium">
          Reset Code
        </Label>
        <Input
          id="code"
          type="text"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
          placeholder="Enter reset code from email"
          className="text-center text-lg tracking-widest glass-ethereal border-sky-400/30 text-sky-800 focus:border-sky-500 transition-all duration-200 focus:scale-105"
          disabled={isLoading}
        />
        <p className="text-sm text-sky-600 text-center">
          We've sent a reset code to {email}
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep("email")}
          className="flex-1 bg-transparent border-sky-400/50 text-sky-700 hover:bg-sky-50/50 hover:border-sky-500 transition-all duration-300"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 crystalline-button py-4 text-lg font-semibold mystical-glow hover:scale-105 transition-transform duration-300"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verifying...
            </>
          ) : (
            <>
              <ArrowRight className="h-5 w-5 mr-2" />
              Verify Code
            </>
          )}
        </Button>
      </div>
    </form>
  )

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-sky-700 font-medium">
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="glass-ethereal border-sky-400/30 text-sky-800 focus:border-sky-500 transition-all duration-200 focus:scale-105"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sky-700 font-medium">
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="glass-ethereal border-sky-400/30 text-sky-800 focus:border-sky-500 transition-all duration-200 focus:scale-105"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep("code")}
          className="flex-1 bg-transparent border-sky-400/50 text-sky-700 hover:bg-sky-50/50 hover:border-sky-500 transition-all duration-300"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 crystalline-button py-4 text-lg font-semibold mystical-glow hover:scale-105 transition-transform duration-300"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Resetting...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Reset Password
            </>
          )}
        </Button>
      </div>
    </form>
  )

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Reset Your Password"
      case "code":
        return "Enter Reset Code"
      case "new-password":
        return "Create New Password"
      default:
        return "Reset Your Password"
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Enter your email address and we'll send you a reset link"
      case "code":
        return "Enter the reset code sent to your email"
      case "new-password":
        return "Create a new password for your account"
      default:
        return "Enter your email address and we'll send you a reset link"
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* DotGrid Background */}
      <div className="fixed inset-0 z-0">
        <DotGrid
          dotSize={6}
          gap={15}
          baseColor="#0ea5e9"
          activeColor="#0284c7"
          proximity={100}
          shockRadius={150}
          shockStrength={2}
          resistance={900}
          returnDuration={1.5}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <SplitText
                text={getStepTitle()}
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6"
                delay={50}
                duration={0.8}
                splitType="chars"
                from={{ opacity: 0, y: 50, rotationX: -90 }}
                to={{ opacity: 1, y: 0, rotationX: 0 }}
              />
              
              <SplitText
                text={getStepDescription()}
                className="text-xl text-sky-700 mb-8 max-w-3xl mx-auto leading-relaxed"
                delay={100}
                duration={0.6}
                splitType="words"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
              />
            </div>
          </div>
        </section>

        {/* Reset Password Form */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="ethereal-card animate-ethereal-glow">
                <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 glass-frost rounded-xl flex items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    {step === "email" && "Reset Password"}
                    {step === "code" && "Verify Code"}
                    {step === "new-password" && "New Password"}
                  </CardTitle>
                  <CardDescription className="text-sky-100">
                    {step === "email" && "Enter your email to receive a reset link"}
                    {step === "code" && "Enter the reset code from your email"}
                    {step === "new-password" && "Create a new secure password"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 glass-frost">
                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive" className="animate-shake glass-ethereal border-red-400/50 text-red-700 mb-6">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Success Alert */}
                  {success && (
                    <Alert className="glass-ethereal border-emerald-400/50 text-emerald-700 mb-6">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  {/* Step Progress */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === "email" ? "bg-sky-500 text-white" : "bg-sky-200 text-sky-600"
                      }`}>
                        1
                      </div>
                      <div className={`w-12 h-1 ${
                        step === "code" || step === "new-password" ? "bg-sky-500" : "bg-sky-200"
                      }`}></div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === "code" ? "bg-sky-500 text-white" : step === "new-password" ? "bg-sky-200 text-sky-600" : "bg-gray-200 text-gray-400"
                      }`}>
                        2
                      </div>
                      <div className={`w-12 h-1 ${
                        step === "new-password" ? "bg-sky-500" : "bg-sky-200"
                      }`}></div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === "new-password" ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-400"
                      }`}>
                        3
                      </div>
                    </div>
                  </div>

                  {/* Form Content */}
                  {step === "email" && renderEmailStep()}
                  {step === "code" && renderCodeStep()}
                  {step === "new-password" && renderPasswordStep()}

                  {/* Back to Login */}
                  <div className="text-center mt-6">
                    <Link
                      href="/login"
                      className="inline-flex items-center text-sm text-sky-600 hover:text-sky-800 transition-colors duration-200"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Sign In
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Back to Home */}
              <div className="text-center mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-sky-600 hover:text-sky-800 transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
} 