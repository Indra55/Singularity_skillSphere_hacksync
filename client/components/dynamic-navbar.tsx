"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, FileText, BookOpen, Mic, Users, LogOut, User, Menu, X, TrendingUp, Brain, Briefcase, Sparkles, TrendingUp as TrendIcon, Bell, Code, MoreHorizontal, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import "@/app/dashboard/dashboard.css"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Main navigation items (always visible)
const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: TrendingUp },
  { label: "AI Planner", href: "/ai-planner", icon: Brain },
  { label: "Resume Builder", href: "/resume-builder", icon: FileText },
  { label: "Learning", href: "/learning", icon: BookOpen },
  { label: "Interview", href: "/interview", icon: Mic },
  { label: "Opportunities", href: "/opportunities", icon: Users },
]

// Additional features in dropdown
const moreNavItems = [
  { label: "Peer Learning", href: "/peer-learning", icon: Users },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Persona", href: "/career-persona", icon: Sparkles },
  { label: "Trends", href: "/job-trends", icon: TrendIcon },
  { label: "Jobs", href: "/linkedin-jobs", icon: Bell },
  { label: "Code", href: "/coding-practice", icon: Code },
]

export function DynamicNavbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isCompressed, setIsCompressed] = useState(false)
  const [isMoreHovered, setIsMoreHovered] = useState(false)
  const lastScrollY = useRef(0)
  const scrollThreshold = useRef(0)

  // Keep "More" open if hovering over the expanded items
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollY.current

      // Show navbar when scrolling up
      if (scrollDelta < -5) {
        setIsVisible(true)
        setIsCompressed(false)
        scrollThreshold.current = currentScrollY
      }
      // Compress navbar when scrolling down past threshold
      else if (scrollDelta > 5 && currentScrollY > 100) {
        setIsCompressed(true)
      }
      // Hide navbar when scrolling down significantly
      else if (scrollDelta > 10 && currentScrollY > 200) {
        setIsVisible(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  const handleNavEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current)
  }

  const handleNavLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsMoreHovered(false)
    }, 300)
  }

  const handleMoreEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current)
    setIsMoreHovered(true)
  }

  const isDashboardRoute = pathname?.startsWith("/dashboard") || 
    pathname?.startsWith("/journey") || 
    pathname?.startsWith("/resume") || 
    pathname?.startsWith("/learning") || 
    pathname?.startsWith("/interview") || 
    pathname?.startsWith("/opportunities") ||
    pathname?.startsWith("/insights") ||
    pathname?.startsWith("/career-intelligence") ||
    pathname?.startsWith("/skill-gap") ||
    pathname?.startsWith("/peers") ||
    pathname?.startsWith("/ai-planner") ||
    pathname?.startsWith("/resume-builder") ||
    pathname?.startsWith("/peer-learning") ||
    pathname?.startsWith("/portfolio") ||
    pathname?.startsWith("/career-persona") ||
    pathname?.startsWith("/job-trends") ||
    pathname?.startsWith("/linkedin-jobs") ||
    pathname?.startsWith("/coding-practice") ||
    pathname?.startsWith("/profile")

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ease-out ${isDashboardRoute ? "dashboard-theme" : ""} ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isCompressed ? "py-2" : "py-4"}`}
    >
      {/* Glass morphism background */}
      <div className={`absolute inset-0 backdrop-blur-xl border-b transition-colors ${
        isDashboardRoute 
          ? "bg-background/80 border-border/30" 
          : "bg-background/40 border-border/20"
      }`} />

      <div className="relative max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={isDashboardRoute ? "/dashboard" : "/"}
            className={`flex items-center gap-2 font-bold transition-all duration-300 ${
              isCompressed ? "text-sm" : "text-lg"
            } ${isDashboardRoute ? "text-foreground" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 transition-colors duration-300 ${
              isMoreHovered ? "bg-white/20 text-white" : "bg-linear-to-br from-primary to-accent"
            }`}>
              S
            </div>
            <span
              className={`hidden sm:inline transition-all duration-300 ${isCompressed ? "opacity-70" : "opacity-100"} ${isDashboardRoute ? "text-foreground" : ""}`}
            >
              SKILLSPHERE
            </span>
          </Link>

          {/* Pill-shaped navbar - desktop */}
          <div
            onMouseLeave={handleNavLeave}
            onMouseEnter={handleNavEnter}
            className={`hidden xl:flex items-center relative overflow-hidden border rounded-full backdrop-blur-md transition-all duration-500 shadow-lg ${
              isCompressed ? "px-2 py-1.5" : "px-4 py-2"
            } ${
              !isMoreHovered 
                ? "bg-muted/30 border-primary/20 hover:bg-muted/40 hover:shadow-xl"
                : "border-orange-400/50 shadow-orange-500/20"
            }`}
          >
            {/* Orange Background Fill (Animated) */}
            <div 
                className={`absolute inset-0 bg-orange-500 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-right ${
                    isMoreHovered ? "scale-x-100" : "scale-x-0"
                }`}
            />

            {/* Main Navigation Items (Visible when NOT hovered) */}
            <div className={`flex items-center gap-1 transition-all duration-300 ${isMoreHovered ? "opacity-0 translate-x-4 pointer-events-none absolute" : "opacity-100 translate-x-0 relative"}`}>
                {mainNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                    <Link key={item.href} href={item.href}>
                    <div
                        className={`flex items-center gap-2 rounded-full font-medium transition-all duration-300 ${
                        isCompressed ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5"
                        } ${
                        isActive
                            ? "bg-linear-to-r from-primary to-accent text-white shadow-md scale-105"
                            : isDashboardRoute
                            ? "text-foreground/80 hover:text-foreground hover:bg-foreground/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/20"
                        }`}
                    >
                        <Icon className={`shrink-0 transition-all ${isCompressed ? "w-3 h-3" : "w-4 h-4"}`} />
                        <span className={`transition-all ${isCompressed ? "text-xs" : "text-sm"}`}>
                        {item.label}
                        </span>
                    </div>
                    </Link>
                )
                })}
            </div>

            {/* More Navigation Items (Visible when hovered) */}
             <div className={`flex items-center gap-1 transition-all duration-300 ${!isMoreHovered ? "opacity-0 -translate-x-4 pointer-events-none absolute" : "opacity-100 translate-x-0 relative"}`}>
                {moreNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={`flex items-center gap-2 rounded-full font-medium transition-all duration-300 z-10 relative ${
                          isCompressed ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5"
                        } ${
                           isActive
                              ? "bg-white text-orange-600 shadow-md"
                              : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Icon className={`shrink-0 transition-all ${isCompressed ? "w-3 h-3" : "w-4 h-4"}`} />
                        <span className={`transition-all ${isCompressed ? "text-xs" : "text-sm"}`}>
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  )
                })}
            </div>
            
            {/* Divider */}
            <div className={`h-4 w-px mx-1 transition-colors duration-300 z-10 relative ${isMoreHovered ? "bg-white/30" : "bg-foreground/20"}`} />

            {/* More Trigger Button */}
            <div 
              className="flex items-center z-10 relative"
              onMouseEnter={handleMoreEnter}
            >
              <div
                className={`flex items-center gap-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
                  isCompressed ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5"
                } ${
                  isMoreHovered
                    ? "text-white bg-white/10"
                    : isDashboardRoute
                      ? "text-foreground/80 hover:text-foreground hover:bg-foreground/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/20"
                }`}
              >
                {isMoreHovered ? <ArrowLeft className={`shrink-0 transition-all ${isCompressed ? "w-3 h-3" : "w-4 h-4"}`} /> : <MoreHorizontal className={`shrink-0 transition-all ${isCompressed ? "w-3 h-3" : "w-4 h-4"}`} />}
                <span className={`hidden lg:inline transition-all ${isCompressed ? "text-xs" : "text-sm"}`}>
                    {isMoreHovered ? "Back" : "More"}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Placeholder (Visible on md/lg, hidden on xl where new nav exists) */}
           <div
            className={`hidden md:flex xl:hidden items-center gap-1 bg-muted/30 border border-primary/20 rounded-full backdrop-blur-md shadow-lg ${
              isCompressed ? "px-2 py-1.5" : "px-5 py-2.5"
            }`}
          >
             
             {mainNavItems.slice(0, 4).map((item) => {
               const Icon = item.icon
               const isActive = pathname === item.href
               return (
                  <Link key={item.href} href={item.href}>
                    <Button variant={isActive ? "default" : "ghost"} size="sm" className="gap-2 rounded-full">
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  </Link>
               )
             })}
             
             {/* Dropdown for smaller desktops */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {moreNavItems.map((item) => (
                   <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex gap-2">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                   </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


          {/* User menu and mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${isDashboardRoute ? "text-foreground" : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* User dropdown */}
            {user && (
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className={`border border-primary/20 transition-all ${isCompressed ? "h-7 w-7" : "h-8 w-8"}`}>
                      <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-serif text-xs">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white" align="end" side="bottom">
                  <DropdownMenuLabel className="font-normal text-black">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-black">{user?.name || "Guest"}</p>
                      <p className="text-xs leading-none text-gray-600">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer text-black">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-2 rounded-lg ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isDashboardRoute
                          ? "text-foreground/80 hover:text-foreground hover:bg-foreground/10"
                          : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
            <div className="pt-2 border-t border-border/20 mt-2">
              <p className="text-xs text-muted-foreground px-3 mb-2 font-semibold">More Features</p>
              {moreNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-2 rounded-lg ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isDashboardRoute
                            ? "text-foreground/80 hover:text-foreground hover:bg-foreground/10"
                            : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}