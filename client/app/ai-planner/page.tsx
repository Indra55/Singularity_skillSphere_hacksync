"use client"

import { DynamicNavbar } from "@/components/dynamic-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Calendar, Target, TrendingUp, CheckCircle2, Clock, Sparkles } from "lucide-react"
import { useState } from "react"
import "@/app/dashboard/dashboard.css"

interface PlanItem {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  deadline: string
  status: "pending" | "in-progress" | "completed"
  category: string
}

export default function AIPlannerPage() {
  const [plans] = useState<PlanItem[]>([
    {
      id: "1",
      title: "Complete System Design Mastery Course",
      description: "Finish all 5 modules covering distributed systems, scalability, and architecture patterns",
      priority: "high",
      deadline: "2024-02-15",
      status: "in-progress",
      category: "Learning",
    },
    {
      id: "2",
      title: "Build Portfolio Project: E-commerce Platform",
      description: "Create a full-stack e-commerce platform with microservices architecture",
      priority: "high",
      deadline: "2024-02-28",
      status: "pending",
      category: "Portfolio",
    },
    {
      id: "3",
      title: "Practice 10 Mock Interviews",
      description: "Complete behavioral and technical interview practice sessions",
      priority: "medium",
      deadline: "2024-03-01",
      status: "pending",
      category: "Interview Prep",
    },
    {
      id: "4",
      title: "Update Resume with Latest Projects",
      description: "Add 3 new projects and optimize for ATS systems",
      priority: "medium",
      deadline: "2024-02-20",
      status: "in-progress",
      category: "Resume",
    },
    {
      id: "5",
      title: "Complete AWS Certification",
      description: "Study and pass AWS Solutions Architect Associate exam",
      priority: "low",
      deadline: "2024-04-01",
      status: "pending",
      category: "Certification",
    },
  ])

  const stats = {
    totalPlans: plans.length,
    completed: plans.filter((p) => p.status === "completed").length,
    inProgress: plans.filter((p) => p.status === "in-progress").length,
    highPriority: plans.filter((p) => p.priority === "high").length,
  }

  const priorityColors = {
    high: "bg-red-500/20 text-red-600 border-red-500/30",
    medium: "bg-amber-500/20 text-amber-600 border-amber-500/30",
    low: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  }

  const statusColors = {
    pending: "bg-gray-500/20 text-gray-600",
    "in-progress": "bg-primary/20 text-primary",
    completed: "bg-emerald-500/20 text-emerald-600",
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
                    <Brain className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">AI Career Planner</h1>
                  </div>
                  <p className="text-muted-foreground">
                    Your personalized roadmap powered by AI recommendations
                  </p>
                </div>
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Sparkles className="w-4 h-4" />
                  Generate New Plan
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 border-border/40 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Plans</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalPlans}</p>
                    </div>
                    <Target className="w-6 h-6 text-primary opacity-70" />
                  </div>
                </Card>
                <Card className="p-4 border-border/40 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Completed</p>
                      <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 opacity-70" />
                  </div>
                </Card>
                <Card className="p-4 border-border/40 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                      <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                    </div>
                    <Clock className="w-6 h-6 text-primary opacity-70" />
                  </div>
                </Card>
                <Card className="p-4 border-border/40 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">High Priority</p>
                      <p className="text-2xl font-bold text-foreground">{stats.highPriority}</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-red-500 opacity-70" />
                  </div>
                </Card>
              </div>
            </section>

            {/* Plans List */}
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Career Plan</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Sort
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className="p-6 border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{plan.title}</h3>
                          <Badge className={priorityColors[plan.priority]}>{plan.priority}</Badge>
                          <Badge className={statusColors[plan.status]}>{plan.status}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{plan.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Due: {plan.deadline}</span>
                          </div>
                          <Badge variant="secondary">{plan.category}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">Start</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
