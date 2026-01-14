"use client"

import { DynamicNavbar } from "@/components/dynamic-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Download, Sparkles, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"
import { useState } from "react"
import "@/app/dashboard/dashboard.css"

interface ResumeFeedback {
  category: string
  score: number
  feedback: string
  suggestion: string
  status: "strength" | "improvement"
}

export default function ResumeBuilderPage() {
  const [resumeScore] = useState(85)
  const [activeTab, setActiveTab] = useState<"improvements" | "strengths">("improvements")

  const improvements: ResumeFeedback[] = [
    {
      category: "Technical Skills Section",
      score: 65,
      feedback: "Your technical skills are listed but lack quantifiable results",
      suggestion:
        "Add specific projects or metrics next to each skill (e.g., 'Python - Built ML model with 94% accuracy')",
      status: "improvement",
    },
    {
      category: "Achievement Metrics",
      score: 58,
      feedback: "Most bullet points describe tasks, not impact",
      suggestion: "Transform 'Managed project deadline' to 'Delivered project 2 weeks early, saving $50K in costs'",
      status: "improvement",
    },
    {
      category: "Keywords for ATS",
      score: 70,
      feedback: "Missing industry-specific keywords that recruiters search for",
      suggestion: "Add keywords from job descriptions you're targeting (e.g., 'Agile', 'CI/CD', 'Cloud Architecture')",
      status: "improvement",
    },
  ]

  const strengths: ResumeFeedback[] = [
    {
      category: "Career Narrative",
      score: 88,
      feedback: "Your career progression is clear and compelling",
      suggestion: "Keep showcasing your growth trajectory—it tells a strong story",
      status: "strength",
    },
    {
      category: "Formatting & Design",
      score: 85,
      feedback: "Clean, professional layout that's ATS-friendly",
      suggestion: "Continue using this template as a proven format",
      status: "strength",
    },
    {
      category: "Experience Relevance",
      score: 82,
      feedback: "Your background aligns well with modern tech roles",
      suggestion: "Highlight the bridge between your past and target roles",
      status: "strength",
    },
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
                    <FileText className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Resume Builder</h1>
                  </div>
                  <p className="text-muted-foreground">
                    AI-powered resume analysis and optimization recommendations
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Resume
                  </Button>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Resume Strength Score */}
              <Card className="p-8 border-border/40 bg-card/50 backdrop-blur-sm mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-foreground">Resume Strength</h2>
                    <p className="text-muted-foreground mb-4">
                      Your resume scores {resumeScore}% - Strong foundation with room for optimization
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm text-muted-foreground">+5% this week</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-600">
                        Top 15% of candidates
                      </Badge>
                    </div>
                  </div>
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-border"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-primary"
                        strokeDasharray={`${(resumeScore / 100) * 282.7} 282.7`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{resumeScore}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Tabs */}
            <section className="mb-8">
              <div className="flex gap-4 border-b border-border mb-6">
                <button
                  onClick={() => setActiveTab("improvements")}
                  className={`pb-4 font-semibold transition-colors ${
                    activeTab === "improvements"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Improvements ({improvements.length})
                </button>
                <button
                  onClick={() => setActiveTab("strengths")}
                  className={`pb-4 font-semibold transition-colors ${
                    activeTab === "strengths"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Strengths ({strengths.length})
                </button>
              </div>

              <div className="space-y-4">
                {(activeTab === "improvements" ? improvements : strengths).map((item, idx) => (
                  <Card
                    key={idx}
                    className="p-6 border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{item.category}</h3>
                          <Badge
                            className={
                              item.status === "strength"
                                ? "bg-emerald-500/20 text-emerald-600"
                                : "bg-amber-500/20 text-amber-600"
                            }
                          >
                            {item.score}%
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{item.feedback}</p>
                      </div>
                      {item.status === "improvement" ? (
                        <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        item.status === "strength"
                          ? "bg-emerald-500/10 border border-emerald-500/20"
                          : "bg-amber-500/10 border border-amber-500/20"
                      }`}
                    >
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {item.status === "strength" ? "✨ Keep doing this" : "💡 Suggestion"}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.suggestion}</p>
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
