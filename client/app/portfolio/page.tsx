"use client"

import { DynamicNavbar } from "@/components/dynamic-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, ExternalLink, TrendingUp, Code } from "lucide-react"
import { useState } from "react"
import "@/app/dashboard/dashboard.css"

interface Project {
  id: string
  title: string
  description: string
  problem: string
  approach: string
  outcome: string
  skills: string[]
  link?: string
  impact: string
}

export default function PortfolioPage() {
  const [projects] = useState<Project[]>([
    {
      id: "proj1",
      title: "AI Career Recommendation Engine",
      description: "Built a machine learning system to match careers with user profiles",
      problem: "Users struggled to find career paths aligned with their skills and interests",
      approach: "Trained ML model on 10,000+ career profiles using Python and TensorFlow",
      outcome: "Achieved 87% accuracy, helped 500+ users identify ideal career paths",
      skills: ["Python", "TensorFlow", "Data Analysis", "System Design"],
      link: "#",
      impact: "500+ users helped",
    },
    {
      id: "proj2",
      title: "Resume Optimization Platform",
      description: "Created AI-powered platform analyzing resumes for recruiters",
      problem: "Recruiters spent hours screening similar resumes with poor signals",
      approach: "Built NLP pipeline to extract and score key competencies and achievements",
      outcome: "Reduced screening time by 60%, improved hiring quality by 40%",
      skills: ["NLP", "React", "Node.js", "PostgreSQL"],
      link: "#",
      impact: "60% time reduction",
    },
    {
      id: "proj3",
      title: "Interactive Learning Dashboard",
      description: "Designed and built personalized learning progress tracking system",
      problem: "Learners lost motivation without clear progress visualization",
      approach: "Created real-time dashboard with gamification and milestone tracking",
      outcome: "Increased course completion rates from 35% to 72%",
      skills: ["React", "D3.js", "UX Design", "Analytics"],
      link: "#",
      impact: "72% completion rate",
    },
  ])

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
                    <Briefcase className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Portfolio Builder</h1>
                  </div>
                  <p className="text-muted-foreground">
                    Showcase your best work with impact metrics and compelling narratives
                  </p>
                </div>
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Add Project
                </Button>
              </div>
            </section>

            {/* Projects Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="p-6 border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Code className="w-6 h-6 text-primary" />
                    {project.link && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

                  <div className="space-y-3 mb-4 flex-1">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                        Problem
                      </p>
                      <p className="text-sm text-foreground">{project.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                        Approach
                      </p>
                      <p className="text-sm text-foreground">{project.approach}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                        Outcome
                      </p>
                      <p className="text-sm text-foreground">{project.outcome}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-600">{project.impact}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1">
                      View
                    </Button>
                  </div>
                </Card>
              ))}

              {/* Add New Project Card */}
              <Card className="p-6 border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 border-dashed flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Add New Project</p>
                </div>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
