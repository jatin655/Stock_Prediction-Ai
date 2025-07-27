"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Info, LogIn, Menu, Settings, Snowflake, User, UserPlus, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import GooeyNav from "./gooey-nav"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "About", href: "/about", icon: Info },
    { name: "Admin", href: "/admin", icon: Settings },
  ]

  const gooeyNavItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ]

  const shouldUseGooeyNav = pathname === "/" || pathname === "/dashboard"

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? "glass-crystal shadow-2xl border-b border-sky-200/50" : "bg-transparent"
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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

          {/* Navigation - Choose between GooeyNav and regular nav */}
          {shouldUseGooeyNav ? (
            <div className="flex-1 flex justify-center">
              <GooeyNav 
                items={gooeyNavItems}
                initialActiveIndex={gooeyNavItems.findIndex(item => item.href === pathname)}
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`relative group px-4 py-2 rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300 animate-fade-in-down mystical-glow ${
                        isActive ? "bg-sky-100/50 text-sky-900" : ""
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">{item.name}</span>
                      <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                    </Button>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Auth Buttons - Show on non-auth pages */}
            {!pathname.includes('/login') && !pathname.includes('/register') && !pathname.includes('/reset-password') && (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="hidden sm:flex items-center gap-2 text-sky-700 hover:text-sky-900 hover:bg-sky-100/30 transition-all duration-300"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
                
                <Link href="/register">
                  <Button className="crystalline-button px-4 py-2 text-sm font-semibold mystical-glow hover:scale-105 transition-transform duration-300">
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                </Link>
              </>
            )}

            {/* User Menu - Show when logged in */}
            {pathname.includes('/admin') && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                  Admin
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 rounded-full glass-frost hover:scale-110 transition-transform duration-300"
                >
                  <User className="h-4 w-4 text-sky-600" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full glass-frost hover:scale-110 transition-transform duration-300"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-down">
            <div className="glass-crystal rounded-2xl shadow-2xl border border-sky-200/50 p-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300 animate-fade-in-up ${
                        isActive ? "bg-sky-100/50 text-sky-900" : ""
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
              
              {/* Mobile Auth Buttons */}
              {!pathname.includes('/login') && !pathname.includes('/register') && !pathname.includes('/reset-password') && (
                <>
                  <div className="border-t border-sky-200/50 my-2"></div>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300"
                    >
                      <LogIn className="h-4 w-4 mr-3" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full crystalline-button text-sm font-semibold mystical-glow">
                      <UserPlus className="h-4 w-4 mr-3" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Floating particles */}
      <div className="absolute top-4 left-1/4 w-2 h-2 bg-sky-400/30 rounded-full animate-float"></div>
      <div className="absolute top-8 right-1/3 w-1 h-1 bg-blue-400/30 rounded-full animate-float-delayed"></div>
      <div className="absolute top-12 left-1/2 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float"></div>
    </header>
  )
}
