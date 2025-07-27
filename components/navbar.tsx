"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    BarChart3,
    Home,
    Info,
    LogIn,
    LogOut,
    Menu,
    Settings,
    Shield,
    Snowflake,
    UserPlus,
    X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface NavbarProps {
  isLoggedIn?: boolean
  userName?: string
  userRole?: string
}

export default function Navbar({ isLoggedIn = false, userName = "User", userRole = "user" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "About", href: "/about", icon: Info },
    { name: "Admin", href: "/admin", icon: Settings },
  ]

  const isAuthPage = pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/reset-password')

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-sky-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 glass-frost rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Snowflake className="h-6 w-6 text-sky-500 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
                CrystalStock AI
              </h1>
              <p className="text-xs text-sky-600">Ethereal Market Intelligence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`relative group px-4 py-2 rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300 ${
                      isActive ? "bg-sky-100/50 text-sky-900" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">{item.name}</span>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn && !isAuthPage ? (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-sky-700 hover:text-sky-900 hover:bg-sky-100/30 transition-all duration-300"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
                
                <Link href="/register">
                  <Button className="crystalline-button px-4 py-2 text-sm font-semibold mystical-glow hover:scale-105 transition-transform duration-300">
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </>
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                      <AvatarFallback className="bg-sky-100 text-sky-700">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userRole === "admin" ? "Administrator" : "User"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-8 h-8 rounded-full glass-frost hover:scale-110 transition-transform duration-300"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-sky-200/50">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300 ${
                      isActive ? "bg-sky-100/50 text-sky-900" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
            
            {/* Mobile Auth Buttons */}
            {!isLoggedIn && !isAuthPage && (
              <>
                <div className="border-t border-sky-200/50 my-2"></div>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-3" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="w-full crystalline-button text-sm font-semibold mystical-glow"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4 mr-3" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile User Menu */}
            {isLoggedIn && (
              <>
                <div className="border-t border-sky-200/50 my-2"></div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                    <AvatarFallback className="bg-sky-100 text-sky-700">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sky-900">{userName}</p>
                    <p className="text-xs text-sky-600">
                      {userRole === "admin" ? "Administrator" : "User"}
                    </p>
                  </div>
                  {userRole === "admin" && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                      Admin
                    </Badge>
                  )}
                </div>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-xl hover:bg-red-100/30 text-red-700 hover:text-red-900 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
