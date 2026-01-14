"use client"

import { DynamicNavbar } from "@/components/dynamic-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Clock, MessageCircle, TrendingUp } from "lucide-react"
import { useState } from "react"
import "@/app/dashboard/dashboard.css"

interface LearningRoom {
  id: string
  name: string
  description: string
  focus: string
  members: number
  nextSession: string
  frequency: string
  icon: string
  status: "active" | "upcoming"
}

export default function PeerLearningPage() {
  const [rooms] = useState<LearningRoom[]>([
    {
      id: "mock-int",
      name: "Mock Interview Room",
      description: "30-minute focused mock interview sessions with real feedback",
      focus: "Behavioral & Technical Interview Practice",
      members: 45,
      nextSession: "Today at 6:00 PM",
      frequency: "Daily",
      icon: "🤝",
      status: "active",
    },
    {
      id: "skill-share",
      name: "Skill Share Circle",
      description: "Learn new technical skills from peers working in your target roles",
      focus: "Hands-on Skill Development",
      members: 62,
      nextSession: "Tomorrow at 5:00 PM",
      frequency: "Tuesdays & Thursdays",
      icon: "🎓",
      status: "upcoming",
    },
    {
      id: "career-talk",
      name: "Career Conversations",
      description: "Discuss career transitions, industry insights, and growth strategies",
      focus: "Career Development & Mentorship",
      members: 38,
      nextSession: "Sunday at 2:00 PM",
      frequency: "Weekly",
      icon: "💼",
      status: "active",
    },
    {
      id: "project-collab",
      name: "Project Collaboration",
      description: "Build real projects with peers to strengthen your portfolio",
      focus: "Team Projects & Portfolio Building",
      members: 28,
      nextSession: "Saturday at 3:00 PM",
      frequency: "Weekends",
      icon: "🚀",
      status: "upcoming",
    },
  ])

  const stats = [
    { label: "Active Members", value: "1,200+", icon: Users },
    { label: "Job Offers Landed", value: "400+", icon: TrendingUp },
    { label: "Success Rate", value: "89%", icon: MessageCircle },
  ]

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
                    <Users className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Peer Learning Circle</h1>
                  </div>
                  <p className="text-muted-foreground">
                    Join focused learning groups with people on similar journeys
                  </p>
                </div>
                <Button className="gap-2 bg-primary hover:bg-primary/90">Create New Room</Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <Card
                      key={idx}
                      className="p-4 border-border/40 bg-card/50 backdrop-blur-sm text-center"
                    >
                      <Icon className="w-6 h-6 text-primary mx-auto mb-2 opacity-70" />
                      <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </Card>
                  )
                })}
              </div>
            </section>

            {/* Learning Rooms */}
            <section className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {rooms.map((room) => (
                <Card
                  key={room.id}
                  className="p-6 border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{room.icon}</span>
                    <Badge
                      className={
                        room.status === "active"
                          ? "bg-emerald-500/20 text-emerald-600"
                          : "bg-blue-500/20 text-blue-600"
                      }
                    >
                      {room.status === "active" ? "Active" : "Upcoming"}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">{room.name}</h3>
                  <p className="text-muted-foreground mb-4">{room.description}</p>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                        Focus Area
                      </p>
                      <p className="text-sm text-foreground">{room.focus}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                          Next Session
                        </p>
                        <p className="text-sm font-semibold text-primary">{room.nextSession}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                          Frequency
                        </p>
                        <p className="text-sm text-foreground">{room.frequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{room.members} members</span>
                    </div>
                  </div>

                  <Button className="w-full">Join Room</Button>
                </Card>
              ))}
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
