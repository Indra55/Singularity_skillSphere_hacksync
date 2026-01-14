"use client"

import { DynamicNavbar } from "@/components/dynamic-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import { useState, useEffect } from "react"
import "@/app/dashboard/dashboard.css"

interface ProfileData {
  name: string
  email: string
  phone: string
  gender: string
  location: string
  role: string
  currentStatus: string
  experience: string
  skills: string[]
  resumeUrl?: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    gender: "",
    location: "",
    role: "",
    currentStatus: "",
    experience: "",
    skills: [],
  })

  useEffect(() => {
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem("profileData")
    const onboardingData = localStorage.getItem("onboardingData")
    
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        setProfileData((prev) => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error("Error parsing profile data:", e)
      }
    }
    
    // Sync with onboarding data
    if (onboardingData) {
      try {
        const parsed = JSON.parse(onboardingData)
        setProfileData((prev) => ({
          ...prev,
          role: parsed.profession || prev.role,
          experience: parsed.experience || prev.experience,
          skills: parsed.skills || prev.skills,
        }))
      } catch (e) {
        console.error("Error parsing onboarding data:", e)
      }
    }
    
    // Load user data
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }))
    }
  }, [user])

  const handleSave = () => {
    localStorage.setItem("profileData", JSON.stringify(profileData))
    setIsEditing(false)
    // Update user context if needed
    if (user) {
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      window.location.reload()
    }
  }

  const handleCancel = () => {
    // Reload from localStorage
    const savedProfile = localStorage.getItem("profileData")
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        setProfileData(parsed)
      } catch (e) {
        console.error("Error parsing profile data:", e)
      }
    }
    setIsEditing(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file and get a URL
      // For now, we'll just store the filename
      setProfileData({ ...profileData, resumeUrl: file.name })
    }
  }

  const completionPercentage = () => {
    const fields = [
      profileData.name,
      profileData.email,
      profileData.phone,
      profileData.gender,
      profileData.location,
      profileData.role,
      profileData.currentStatus,
      profileData.experience,
      profileData.skills.length > 0,
    ]
    const filled = fields.filter(Boolean).length
    return Math.round((filled / fields.length) * 100)
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
                  <h1 className="text-4xl font-bold mb-2">Complete Your Profile</h1>
                  <p className="text-muted-foreground">
                    Fill in your details to get personalized career recommendations
                  </p>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {/* Profile Completion */}
              <Card className="p-6 border-border/40 bg-card/50 backdrop-blur-sm mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Profile Completion</p>
                    <div className="flex items-center gap-4">
                      <div className="h-3 bg-muted rounded-full w-64 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${completionPercentage()}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-foreground">{completionPercentage()}%</span>
                    </div>
                  </div>
                  <Badge className={completionPercentage() === 100 ? "bg-emerald-500/20 text-emerald-600" : "bg-primary/20 text-primary"}>
                    {completionPercentage() === 100 ? "Complete" : "In Progress"}
                  </Badge>
                </div>
              </Card>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Card */}
                <Card className="p-6 animate-in fade-in slide-in-from-left duration-500">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="w-24 h-24 border-4 border-primary/20">
                      <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                        {profileData.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing ? (
                      <div className="w-full space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h2 className="text-2xl font-bold mb-1">{profileData.name || "Guest User"}</h2>
                          <p className="text-muted-foreground flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4" />
                            {profileData.email || "No email"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card className="p-6 animate-in fade-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="+1 (555) 000-0000"
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {profileData.phone || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Gender</label>
                      {isEditing ? (
                        <select
                          value={profileData.gender}
                          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      ) : (
                        <p className="text-foreground">{profileData.gender || "Not provided"}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="City, Country"
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {profileData.location || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Professional Information */}
                <Card className="p-6 animate-in fade-in slide-in-from-right duration-500 delay-100">
                  <div className="flex items-center gap-2 mb-6">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Professional Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Role</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.role}
                          onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g., Software Engineer"
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {profileData.role || "Not specified"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Current Status</label>
                      {isEditing ? (
                        <select
                          value={profileData.currentStatus}
                          onChange={(e) => setProfileData({ ...profileData, currentStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select</option>
                          <option value="student">Student</option>
                          <option value="graduated">Graduated</option>
                          <option value="working-professional">Working Professional</option>
                        </select>
                      ) : (
                        <p className="text-foreground">{profileData.currentStatus || "Not specified"}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Experience</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.experience}
                          onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g., 3-5 years"
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          {profileData.experience || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Skills */}
                <Card className="p-6 animate-in fade-in slide-in-from-right duration-500 delay-200">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Skills</h3>
                  </div>
                  {profileData.skills && profileData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No skills added yet. Complete onboarding to add skills.</p>
                  )}
                </Card>

                {/* Resume Upload */}
                <Card className="p-6 animate-in fade-in slide-in-from-right duration-500 delay-300">
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Resume</h3>
                  </div>
                  {isEditing ? (
                    <div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors w-fit"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Resume</span>
                      </label>
                      {profileData.resumeUrl && (
                        <p className="text-sm text-muted-foreground mt-2">Current: {profileData.resumeUrl}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      {profileData.resumeUrl ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{profileData.resumeUrl}</span>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No resume uploaded</p>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
