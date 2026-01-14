"use client"

import { DynamicNavbar } from "@/components/dynamic-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Linkedin, MapPin, Briefcase, DollarSign, Star, ExternalLink, Settings } from "lucide-react"
import { useState } from "react"
import "@/app/dashboard/dashboard.css"

interface JobNotification {
  id: string
  title: string
  company: string
  location: string
  salary: string
  match: number
  posted: string
  type: "new" | "updated" | "recommended"
  description: string
}

export default function LinkedInJobsPage() {
  const [notifications] = useState<JobNotification[]>([
    {
      id: "1",
      title: "Senior Software Engineer - AI/ML",
      company: "TechCorp",
      location: "San Francisco, CA / Remote",
      salary: "$180K - $220K",
      match: 94,
      posted: "2 hours ago",
      type: "new",
      description: "Looking for an experienced engineer to build AI-powered features...",
    },
    {
      id: "2",
      title: "Full-Stack Developer",
      company: "StartupXYZ",
      location: "New York, NY",
      salary: "$140K - $170K",
      match: 87,
      posted: "5 hours ago",
      type: "recommended",
      description: "Join our fast-growing team to build the next generation platform...",
    },
    {
      id: "3",
      title: "Tech Lead - Infrastructure",
      company: "CloudScale",
      location: "Remote",
      salary: "$200K - $250K",
      match: 91,
      posted: "1 day ago",
      type: "updated",
      description: "Lead infrastructure initiatives for our cloud-native platform...",
    },
    {
      id: "4",
      title: "Product Manager - Developer Tools",
      company: "DevTools Inc",
      location: "Seattle, WA",
      salary: "$150K - $190K",
      match: 82,
      posted: "2 days ago",
      type: "recommended",
      description: "Shape the future of developer experience with cutting-edge tools...",
    },
  ])

  const stats = {
    total: notifications.length,
    new: notifications.filter((n) => n.type === "new").length,
    highMatch: notifications.filter((n) => n.match >= 90).length,
  }

  const typeColors = {
    new: "bg-emerald-500/20 text-emerald-600",
    updated: "bg-blue-500/20 text-blue-600",
    recommended: "bg-primary/20 text-primary",
  }

  return (
    <ProtectedRoute>
      <div className="dashboard-theme">
        <DynamicNavbar />
        <main className="min-h-screen bg-background pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Linkedin className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">LinkedIn Job Notifications</h1>
                  </div>
                  <p className="text-muted-foreground">
                    Personalized job alerts based on your profile and preferences
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Bell className="w-4 h-4" />
                    Manage Alerts
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="p-4 border-border/40 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Notifications</p>
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    </div>
                    <Bell className="w-6 h-6 text-primary opacity-70" />
                  </div>
                </Card>
                <Card className="p-4 border-border/40 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">New Today</p>
                      <p className="text-2xl font-bold text-foreground">{stats.new}</p>
                    </div>
                    <Star className="w-6 h-6 text-emerald-500 opacity-70" />
                  </div>
                </Card>
                <Card className="p-4 border-border/40 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">High Match (90%+)</p>
                      <p className="text-2xl font-bold text-foreground">{stats.highMatch}</p>
                    </div>
                    <Star className="w-6 h-6 text-primary opacity-70" />
                  </div>
                </Card>
              </div>
            </section>

            {/* Job Notifications */}
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {notifications.map((job) => (
                <Card
                  key={job.id}
                  className="p-6 border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                        <Badge className={typeColors[job.type]}>{job.type}</Badge>
                        <Badge className="bg-primary/20 text-primary">{job.match}% match</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{job.description}</p>
                      <p className="text-xs text-muted-foreground">Posted {job.posted}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">
                      View on LinkedIn
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90">Apply Now</Button>
                  </div>
                </Card>
              ))}
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
