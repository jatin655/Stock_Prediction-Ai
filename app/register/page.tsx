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
import { Chrome, Eye, EyeOff, Loader2, UserPlus } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  // Redirect if already logged in
  if (session) {
    router.push("/dashboard")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...")
        // Clear form data
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(data.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    setError("")

    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      })

      if (result?.error) {
        setError("Google sign-up failed. Please try again.")
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      setError("An error occurred during Google sign-up.")
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
                    Create Account
                  </h1>
                  <p className="text-subheading">
                    Join CrystalStock AI today
                  </p>
                </div>

                {/* Register Form */}
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

                      {/* Google Sign Up Button */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleSignUp}
                        disabled={isGoogleLoading}
                        className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                      >
                        {isGoogleLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Signing up with Google...
                          </>
                        ) : (
                          <>
                            <Chrome className="h-4 w-4 mr-2" />
                            Sign up with Google
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
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-sky-400"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
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
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
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

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-sky-400 pr-10"
                            placeholder="Confirm your password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-white/10"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full crystalline-button-dark mystical-glow-dark"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Create Account
                          </>
                        )}
                      </Button>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">
                          Already have an account?{" "}
                          <Link
                            href="/login"
                            className="text-sky-400 hover:text-sky-300 transition-colors"
                          >
                            Sign in
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