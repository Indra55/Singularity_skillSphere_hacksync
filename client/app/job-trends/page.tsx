"use client"

import { DynamicNavbar } from "@/components/dynamic-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ArrowUp, Lightbulb, Target } from "lucide-react"
import { useState } from "react"
import "@/app/dashboard/dashboard.css"

interface Trend {
  id: string
  title: string
  description: string
  growth: string
  relevance: string
  skills: string[]
  insight: string
  match: number
}

export default function JobTrendsPage() {
  const [trends] = useState<Trend[]>([
    {
      id: "ai-roles",
      title: "AI & Machine Learning Roles Surging",
      description: "Roles combining AI expertise with domain knowledge are growing 3x faster than traditional roles",
      growth: "↑ 150% growth over 2 years",
      relevance: "💡 High match for your profile",
      skills: ["Python", "ML Frameworks", "Data Science", "System Design"],
      insight:
        "Companies are shifting from pure ML to applied AI roles. Your technical foundation positions you perfectly for hybrid roles that blend domain expertise with AI.",
      match: 92,
    },
    {
      id: "remote-first",
      title: "Remote-First Engineering Becomes Standard",
      description: "90% of tech companies now offer remote or flexible work arrangements",
      growth: "↑ Permanent shift",
      relevance: "✓ Relevant to all roles",
      skills: ["Async Communication", "Self-Direction", "Distributed Systems"],
      insight:
        "Geographic boundaries are disappearing. Your location is no longer a limiting factor. Focus on demonstrating strong async communication and self-motivation.",
      match: 88,
    },
    {
      id: "fullstack-demand",
      title: "Full-Stack Skills Premium Rising",
      description: "Startups increasingly value engineers who span frontend, backend, and DevOps",
      growth: "↑ 45% salary premium",
      relevance: "🔍 Emerging opportunity",
      skills: ["Frontend", "Backend", "DevOps", "Database Design"],
      insight:
        "Full-stack capabilities command higher salaries and faster promotion. Consider building end-to-end project examples in your portfolio.",
      match: 75,
    },
    {
      id: "security-skills",
      title: "Security-First Architecture Required",
      description: "Security expertise is becoming non-negotiable for all backend and DevOps roles",
      growth: "↑ 200% demand",
      relevance: "📈 Strong opportunity",
      skills: ["Authentication", "Encryption", "Compliance", "Security Audits"],
      insight:
        "Every engineer now needs security literacy. Adding security certifications or projects will significantly boost your marketability.",
      match: 68,
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
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Job Trend Tracker</h1>
                  </div>
                  <p className="text-muted-foreground">
                    Stay informed about emerging opportunities and evolving market demands
                  </p>
                </div>
                <Button variant="outline">View Full Report</Button>
              </div>
            </section>

            {/* Top Trends List */}
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {trends.map((trend, idx) => (
                <Card
                  key={trend.id}
                  className="p-6 border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-semibold text-foreground">{trend.title}</h3>
                        <Badge className="bg-primary/20 text-primary">
                          {trend.match}% match
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-lg mb-4">{trend.description}</p>
                    </div>
                    <ArrowUp className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                        Market Growth
                      </p>
                      <p className="text-primary font-semibold text-lg">{trend.growth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                        For You
                      </p>
                      <p className="text-foreground">{trend.relevance}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                        Key Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {trend.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <p className="text-sm font-semibold text-primary">AI Insight</p>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">{trend.insight}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trend.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
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
