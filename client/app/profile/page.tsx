"use client"

import { DynamicNavbar } from "@/components/dynamic-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Edit,
  Save,
  X,
  Upload,
  FileText,
  Linkedin,
  Globe,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap,
} from "lucide-react"
import { useState, useEffect } from "react"
import "@/app/dashboard/dashboard.css"
import { getResumeInfo, ResumeInfo } from "@/lib/api"

export default function ProfilePage() {
  const { user } = useAuth()
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getResumeInfo()
        if (response.data) {
          setResumeInfo(response.data)
        } else if (response.error) {
          // If no resume found, that's okay, we'll show empty state
          if (!response.error.includes("No resume found")) {
            setError(response.error)
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  return (
    <ProtectedRoute>
      <div className="dashboard-theme min-h-screen bg-background text-foreground selection:bg-primary/20">
        <DynamicNavbar />

        {/* Hero Section with Glassmorphism */}
        <div className="relative pt-32 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                <Avatar className="w-32 h-32 border-4 border-background relative">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-white text-4xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                      {resumeInfo?.extracted_name || user?.name || "Welcome, User"}
                    </h1>
                    <p className="text-xl text-muted-foreground flex items-center gap-2 mt-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      {resumeInfo?.professional_title || "Career Explorer"}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {resumeInfo?.linkedin_url && (
                      <Button variant="outline" size="icon" className="rounded-full hover:bg-[#0077b5] hover:text-white transition-colors" asChild>
                        <a href={resumeInfo.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </Button>
                    )}
                    {resumeInfo?.portfolio_url && (
                      <Button variant="outline" size="icon" className="rounded-full hover:bg-emerald-500 hover:text-white transition-colors" asChild>
                        <a href={resumeInfo.portfolio_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-5 h-5" />
                        </a>
                      </Button>
                    )}
                    <Button className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                      <Edit className="w-4 h-4" /> Edit Profile
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  {resumeInfo?.extracted_location && (
                    <div className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full border border-secondary/50">
                      <MapPin className="w-4 h-4 text-primary" />
                      {resumeInfo.extracted_location}
                    </div>
                  )}
                  {resumeInfo?.extracted_email && (
                    <div className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full border border-secondary/50">
                      <Mail className="w-4 h-4 text-primary" />
                      {resumeInfo.extracted_email}
                    </div>
                  )}
                  {resumeInfo?.extracted_phone && (
                    <div className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full border border-secondary/50">
                      <Phone className="w-4 h-4 text-primary" />
                      {resumeInfo.extracted_phone}
                    </div>
                  )}
                  {resumeInfo?.years_of_experience !== undefined && (
                    <div className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full border border-secondary/50">
                      <Calendar className="w-4 h-4 text-primary" />
                      {resumeInfo.years_of_experience} Years Exp.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!resumeInfo ? (
            <div className="text-center py-20 bg-card/30 rounded-3xl border border-border/50 backdrop-blur-sm">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No Profile Data Found</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Upload your resume to automatically generate your professional profile and get personalized career insights.
              </p>
              <Button size="lg" className="rounded-full gap-2">
                <Upload className="w-5 h-5" /> Upload Resume
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - Stats & Skills */}
              <div className="lg:col-span-4 space-y-8">
                {/* Scores Card */}
                <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" /> Profile Strength
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/50 p-4 rounded-2xl border border-border/50 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">{resumeInfo.completeness_score}%</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Completeness</div>
                      <Progress value={resumeInfo.completeness_score} className="h-1.5 mt-3" />
                    </div>
                    <div className="bg-background/50 p-4 rounded-2xl border border-border/50 text-center">
                      <div className="text-3xl font-bold text-emerald-500 mb-1">{resumeInfo.ats_score}%</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">ATS Score</div>
                      <Progress value={resumeInfo.ats_score} className="h-1.5 mt-3 bg-emerald-950 [&>div]:bg-emerald-500" />
                    </div>
                  </div>
                </Card>

                {/* Skills Card */}
                <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-xl">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" /> Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeInfo.technical_skills?.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 px-3 py-1 transition-colors">
                        {skill}
                      </Badge>
                    ))}
                    {(!resumeInfo.technical_skills || resumeInfo.technical_skills.length === 0) && (
                      <p className="text-muted-foreground text-sm italic">No technical skills found</p>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mt-8 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" /> Soft Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeInfo.soft_skills?.map((skill, i) => (
                      <Badge key={i} variant="outline" className="border-border/60 hover:bg-secondary/50 px-3 py-1 transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* AI Insights */}
                <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-md shadow-xl">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" /> AI Insights
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-emerald-500 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Key Strengths
                      </h4>
                      <ul className="space-y-2">
                        {resumeInfo.strengths?.slice(0, 3).map((strength, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-4 border-l-2 border-emerald-500/30">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-amber-500 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {resumeInfo.improvement_areas?.slice(0, 3).map((area, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-4 border-l-2 border-amber-500/30">
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Detailed Info */}
              <div className="lg:col-span-8 space-y-8">
                {/* Summary */}
                {resumeInfo.professional_summary && (
                  <Card className="p-8 border-border/50 bg-card/40 backdrop-blur-md shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-600"></div>
                    <h3 className="text-xl font-semibold mb-4">Professional Summary</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {resumeInfo.professional_summary}
                    </p>
                  </Card>
                )}

                {/* Experience */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 px-2">
                    <Briefcase className="w-5 h-5 text-primary" /> Experience
                  </h3>
                  {resumeInfo.experience?.map((exp, i) => (
                    <Card key={i} className="p-6 border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-colors group">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{exp.title}</h4>
                          <p className="text-primary/80 font-medium">{exp.company}</p>
                        </div>
                        <Badge variant="outline" className="w-fit whitespace-nowrap bg-background/50">
                          {exp.start} - {exp.end}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </Card>
                  ))}
                  {(!resumeInfo.experience || resumeInfo.experience.length === 0) && (
                    <Card className="p-8 border-dashed border-2 border-border/50 bg-transparent text-center">
                      <p className="text-muted-foreground">No experience records found</p>
                    </Card>
                  )}
                </div>

                {/* Projects */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 px-2">
                    <Globe className="w-5 h-5 text-primary" /> Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeInfo.projects?.map((project, i) => (
                      <Card key={i} className="p-6 border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-colors flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold">{project.name}</h4>
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.technologies?.map((tech, j) => (
                            <span key={j} className="text-xs bg-secondary/50 px-2 py-1 rounded text-secondary-foreground">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                  {(!resumeInfo.projects || resumeInfo.projects.length === 0) && (
                    <Card className="p-8 border-dashed border-2 border-border/50 bg-transparent text-center">
                      <p className="text-muted-foreground">No projects found</p>
                    </Card>
                  )}
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 px-2">
                    <GraduationCap className="w-5 h-5 text-primary" /> Education
                  </h3>
                  {resumeInfo.education?.map((edu, i) => (
                    <Card key={i} className="p-6 border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {edu.institution[0]}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold">{edu.institution}</h4>
                            <p className="text-muted-foreground">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="w-fit">
                          {edu.year}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                  {(!resumeInfo.education || resumeInfo.education.length === 0) && (
                    <Card className="p-8 border-dashed border-2 border-border/50 bg-transparent text-center">
                      <p className="text-muted-foreground">No education records found</p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
