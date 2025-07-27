"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Crown, LogOut, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import GooeyNav from "./GooeyNav"

export default function UnifiedNavbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)

  // Navigation items
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Admin", href: "/admin" },
  ]

  // Get current active index based on pathname
  const getActiveIndex = () => {
    switch (pathname) {
      case "/":
        return 0
      case "/dashboard":
        return 1
      case "/admin":
        return 2
      default:
        return 0
    }
  }

  // Handle navigation with smooth animation
  const handleNavigation = (index: number, href: string) => {
    if (pathname === href) return // Already on this page
    
    setIsNavigating(true)
    
    // Small delay to show animation
    setTimeout(() => {
      router.push(href)
      setCurrentPath(href)
      
      // Reset navigation state after animation completes
      setTimeout(() => {
        setIsNavigating(false)
      }, 300)
    }, 150)
  }

  // Update current path when pathname changes
  useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <span className="text-white font-semibold text-lg">CrystalStock</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            {/* GooeyNav Navigation */}
            <GooeyNav
              items={navItems}
              initialActiveIndex={getActiveIndex()}
              onItemClick={handleNavigation}
              animationTime={600}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin"></div>
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                          {session.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-black/90 border-white/20" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user?.name && (
                          <p className="font-medium text-white">{session.user.name}</p>
                        )}
                        {session.user?.email && (
                          <p className="w-[200px] truncate text-sm text-gray-300">
                            {session.user.email}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {session.user?.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              <Crown className="h-3 w-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                              <User className="h-3 w-3" />
                              User
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenuItem
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={() => router.push("/login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700"
                    onClick={() => router.push("/register")}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Navigating...</p>
          </div>
        </div>
      )}
    </header>
  )
} 