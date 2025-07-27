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
import { Chrome, Eye, EyeOff, Loader2, LogIn } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  // Redirect if already logged in
  if (session) {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")

    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      })

      if (result?.error) {
        setError("Google sign-in failed. Please try again.")
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      setError("An error occurred during Google sign-in.")
    } finally {
      setIsGoogleLoading(false)
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
                    Welcome Back
                  </h1>
                  <p className="text-subheading">
                    Sign in to your account
                  </p>
                </div>

                {/* Login Form */}
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

                      {/* Google Sign In Button */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                      >
                        {isGoogleLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Signing in with Google...
                          </>
                        ) : (
                          <>
                            <Chrome className="h-4 w-4 mr-2" />
                            Sign in with Google
                          </>
                        )}
                      </Button>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-white/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-black px-2 text-gray-400">Or continue with</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-sky-400"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-sky-400 pr-10"
                            placeholder="Enter your password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-white/10"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Link
                          href="/forgot-password"
                          className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full crystalline-button-dark mystical-glow-dark"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In
                          </>
                        )}
                      </Button>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">
                          Don't have an account?{" "}
                          <Link
                            href="/register"
                            className="text-sky-400 hover:text-sky-300 transition-colors"
                          >
                            Sign up
                          </Link>
                        </p>
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