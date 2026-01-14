"use client"

import { DynamicNavbar } from "@/components/dynamic-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Play, CheckCircle2, Clock, TrendingUp, Target } from "lucide-react"
import { useState } from "react"
import "@/app/dashboard/dashboard.css"

interface CodingQuestion {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  companies: string[]
  acceptance: number
  status: "not-started" | "in-progress" | "completed"
  timeEstimate: string
}

export default function CodingPracticePage() {
  const [questions] = useState<CodingQuestion[]>([
    {
      id: "1",
      title: "Two Sum",
      difficulty: "easy",
      category: "Arrays",
      companies: ["Google", "Amazon", "Microsoft"],
      acceptance: 48.5,
      status: "completed",
      timeEstimate: "15 min",
    },
    {
      id: "2",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      category: "Strings",
      companies: ["Facebook", "Apple", "Netflix"],
      acceptance: 33.2,
      status: "in-progress",
      timeEstimate: "30 min",
    },
    {
      id: "3",
      title: "Merge Intervals",
      difficulty: "medium",
      category: "Intervals",
      companies: ["Google", "Uber", "Airbnb"],
      acceptance: 42.1,
      status: "not-started",
      timeEstimate: "25 min",
    },
    {
      id: "4",
      title: "Design Twitter",
      difficulty: "hard",
      category: "System Design",
      companies: ["Twitter", "Meta", "LinkedIn"],
      acceptance: 28.7,
      status: "not-started",
      timeEstimate: "45 min",
    },
    {
      id: "5",
      title: "LRU Cache",
      difficulty: "hard",
      category: "Design",
      companies: ["Amazon", "Microsoft", "Google"],
      acceptance: 35.4,
      status: "not-started",
      timeEstimate: "40 min",
    },
  ])

  const stats = {
    total: questions.length,
    completed: questions.filter((q) => q.status === "completed").length,
    inProgress: questions.filter((q) => q.status === "in-progress").length,
    averageTime: "28 min",
  }

  const difficultyColors = {
    easy: "bg-emerald-500/20 text-emerald-600",
    medium: "bg-amber-500/20 text-amber-600",
    hard: "bg-red-500/20 text-red-600",
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
                    <Code className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Practice Coding Questions</h1>
                  </div>
                  <p className="text-muted-foreground">
                    Master technical interviews with curated coding challenges
                  </p>
                </div>
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Target className="w-4 h-4" />
                  Start Practice Session
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 border-border/40 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Questions</p>
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    </div>
                    <Code className="w-6 h-6 text-primary opacity-70" />
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
                      <p className="text-sm text-muted-foreground mb-1">Avg. Time</p>
                      <p className="text-2xl font-bold text-foreground">{stats.averageTime}</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-primary opacity-70" />
                  </div>
                </Card>
              </div>
            </section>

            {/* Questions List */}
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {questions.map((question) => (
                <Card
                  key={question.id}
                  className="p-6 border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{question.title}</h3>
                        <Badge className={difficultyColors[question.difficulty]}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="secondary">{question.category}</Badge>
                        {question.status === "completed" && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {question.timeEstimate}
                        </div>
                        <span>{question.acceptance}% acceptance</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs text-muted-foreground">Asked by:</span>
                        {question.companies.map((company) => (
                          <Badge key={company} variant="outline" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Play className="w-4 h-4" />
                        Solve
                      </Button>
                    </div>
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
