"use client"

import { useState } from "react"
import Link from "next/link"
import { MagneticButton } from "@/components/magnetic-button"
import { Upload, FileText, User, Phone, MapPin, Briefcase, GraduationCap, Calendar } from "lucide-react"

interface OnboardingData {
  name: string
  age: string
  phone: string
  gender: string
  location: string
  role: string
  currentStatus: string
  experience: string
  skills: string[]
  resumeUrl?: string
  resumeAutoFill: boolean
}

export default function JourneyOnboarding() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    age: "",
    phone: "",
    gender: "",
    location: "",
    role: "",
    currentStatus: "",
    experience: "",
    skills: [],
    resumeAutoFill: false,
  })
  const [isComplete, setIsComplete] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const genders = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "other", label: "Other" },
    { id: "prefer-not-to-say", label: "Prefer not to say" },
  ]

  const roles = [
    { id: "software-engineer", label: "Software Engineer", desc: "Building applications & systems" },
    { id: "data-scientist", label: "Data Scientist", desc: "Analyzing data & insights" },
    { id: "product-manager", label: "Product Manager", desc: "Leading product strategy" },
    { id: "designer", label: "Designer", desc: "Creating user experiences" },
    { id: "marketing", label: "Marketing Professional", desc: "Growth & brand building" },
    { id: "business-analyst", label: "Business Analyst", desc: "Strategy & operations" },
    { id: "devops", label: "DevOps Engineer", desc: "Infrastructure & deployment" },
    { id: "qa", label: "QA Engineer", desc: "Testing & quality assurance" },
    { id: "other", label: "Other", desc: "Different profession" },
  ]

  const currentStatuses = [
    { id: "student", label: "Student", desc: "Currently studying" },
    { id: "graduated", label: "Graduated", desc: "Recently completed studies" },
    { id: "working-professional", label: "Working Professional", desc: "Currently employed" },
  ]

  const experienceLevels = [
    { id: "beginner", label: "Beginner", desc: "Just starting out (0-1 years)" },
    { id: "junior", label: "Junior", desc: "Early career (1-3 years)" },
    { id: "mid", label: "Mid-Level", desc: "Experienced (3-5 years)" },
    { id: "senior", label: "Senior", desc: "Advanced (5-8 years)" },
    { id: "expert", label: "Expert", desc: "Industry leader (8+ years)" },
  ]

  const skillCategories = [
    { id: "programming", label: "Programming", desc: "Languages, frameworks, tools" },
    { id: "frontend", label: "Frontend Development", desc: "React, Vue, Angular, UI/UX" },
    { id: "backend", label: "Backend Development", desc: "APIs, databases, servers" },
    { id: "mobile", label: "Mobile Development", desc: "iOS, Android, React Native" },
    { id: "cloud", label: "Cloud & DevOps", desc: "AWS, Azure, Docker, Kubernetes" },
    { id: "data", label: "Data & Analytics", desc: "SQL, Python, ML, visualization" },
    { id: "design", label: "Design", desc: "UI/UX, Figma, prototyping" },
    { id: "product", label: "Product Management", desc: "Strategy, roadmaps, agile" },
    { id: "marketing", label: "Digital Marketing", desc: "SEO, content, social media" },
    { id: "soft-skills", label: "Soft Skills", desc: "Communication, leadership" },
  ]

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setFormData({ ...formData, resumeUrl: file.name, resumeAutoFill: true })
      // In a real app, you would parse the resume and auto-fill the form
      // For now, we'll simulate auto-fill
      setTimeout(() => {
        // Simulate auto-fill from resume
        setFormData((prev) => ({
          ...prev,
          name: prev.name || "John Doe", // Would come from resume parsing
          phone: prev.phone || "+1 (555) 123-4567",
          role: prev.role || "Software Engineer",
          experience: prev.experience || "mid",
          skills: prev.skills.length === 0 ? ["programming", "frontend", "backend"] : prev.skills,
        }))
      }, 1000)
    }
  }

  const handleManualComplete = () => {
    setFormData({ ...formData, resumeAutoFill: false })
    // Continue to manual profile completion
    handleComplete()
  }

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem("onboardingData", JSON.stringify(formData))
    // Also save as profile data
    localStorage.setItem("profileData", JSON.stringify(formData))
    setIsComplete(true)
  }

  const handleStart = () => {
    window.location.href = "/dashboard"
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.name && formData.age && formData.phone && formData.gender && formData.location
      case 1:
        return formData.role
      case 2:
        return formData.currentStatus && formData.experience
      case 3:
        return formData.resumeUrl || formData.skills.length > 0
      default:
        return false
    }
  }

  return (
    <div className="relative z-10 min-h-screen px-6 py-20 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Completion Screen */}
        {isComplete ? (
          <div className="flex min-h-[80vh] items-center justify-center">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="bg-foreground/5 border border-foreground/20 rounded-2xl p-8 md:p-12 backdrop-blur-sm text-center">
                <div className="inline-block mb-6 p-3 bg-accent/20 rounded-full">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-light text-foreground mb-3">
                  <span className="text-balance">Perfect! Your profile is ready.</span>
                </h3>
                <p className="text-foreground/70 mb-8 text-lg">
                  Based on your information, we've created a personalized dashboard just for you. Let's start your
                  career journey!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="w-full sm:w-auto">
                    <MagneticButton size="lg" variant="primary" onClick={handleStart} className="w-full sm:w-auto">
                      Go to Dashboard
                    </MagneticButton>
                  </div>
                  <Link href="/profile">
                    <MagneticButton size="lg" variant="secondary">Complete Profile</MagneticButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Step Indicator */}
            <div className="mb-12">
              <div className="flex gap-2 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i <= step ? "bg-accent" : "bg-foreground/20"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/60 font-mono">Step {step + 1} of 4</p>
            </div>

            {/* Page 1: Personal Information */}
            {step === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-light leading-tight text-foreground mb-3">
                    <span className="text-balance">Tell us about yourself</span>
                  </h2>
                  <p className="text-lg text-foreground/70">We'll use this to personalize your experience.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-foreground/5 backdrop-blur-sm text-foreground focus:outline-none focus:border-accent/50 focus:bg-foreground/10 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Age
                    </label>
                    <input
                      type="number"
                      min="13"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-foreground/5 backdrop-blur-sm text-foreground focus:outline-none focus:border-accent/50 focus:bg-foreground/10 transition-all"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-foreground/5 backdrop-blur-sm text-foreground focus:outline-none focus:border-accent/50 focus:bg-foreground/10 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-2 block">Gender</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {genders.map((gender) => (
                        <button
                          key={gender.id}
                          onClick={() => setFormData({ ...formData, gender: gender.id })}
                          className={`p-3 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                            formData.gender === gender.id
                              ? "bg-accent/20 border-accent/50 scale-[1.02]"
                              : "bg-foreground/10 border-foreground/20 hover:bg-foreground/15 hover:border-foreground/40"
                          }`}
                        >
                          <p className="font-semibold text-foreground">{gender.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-foreground/5 backdrop-blur-sm text-foreground focus:outline-none focus:border-accent/50 focus:bg-foreground/10 transition-all"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <MagneticButton size="lg" variant="primary" onClick={handleNext} disabled={!canProceed()}>
                      Continue
                    </MagneticButton>
                  </div>
                </div>
              </div>
            )}

            {/* Page 2: Role */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-light leading-tight text-foreground mb-3">
                    <span className="text-balance">What's your role?</span>
                  </h2>
                  <p className="text-lg text-foreground/70">Select the role that best describes your profession.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        setFormData({ ...formData, role: role.id })
                        setTimeout(() => handleNext(), 300)
                      }}
                      className={`group text-left p-5 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                        formData.role === role.id
                          ? "bg-accent/20 border-accent/50 scale-[1.02]"
                          : "bg-foreground/10 border-foreground/20 hover:bg-foreground/15 hover:border-foreground/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                            {role.label}
                          </p>
                          <p className="text-xs text-foreground/60">{role.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <MagneticButton size="lg" variant="secondary" onClick={handleBack}>
                    Back
                  </MagneticButton>
                </div>
              </div>
            )}

            {/* Page 3: Current Status & Experience */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-light leading-tight text-foreground mb-3">
                    <span className="text-balance">What's your current status?</span>
                  </h2>
                  <p className="text-lg text-foreground/70">Help us understand where you are in your career journey.</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-4 block">Current Status</label>
                    <div className="grid gap-4 md:grid-cols-3">
                      {currentStatuses.map((status) => (
                        <button
                          key={status.id}
                          onClick={() => setFormData({ ...formData, currentStatus: status.id })}
                          className={`group text-left p-5 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                            formData.currentStatus === status.id
                              ? "bg-accent/20 border-accent/50 scale-[1.02]"
                              : "bg-foreground/10 border-foreground/20 hover:bg-foreground/15 hover:border-foreground/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                                {status.label}
                              </p>
                              <p className="text-xs text-foreground/60">{status.desc}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-4 block">Experience Level</label>
                    <div className="grid gap-4 md:grid-cols-2">
                      {experienceLevels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setFormData({ ...formData, experience: level.id })}
                          className={`group text-left p-5 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                            formData.experience === level.id
                              ? "bg-accent/20 border-accent/50 scale-[1.02]"
                              : "bg-foreground/10 border-foreground/20 hover:bg-foreground/15 hover:border-foreground/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                                {level.label}
                              </p>
                              <p className="text-xs text-foreground/60">{level.desc}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <MagneticButton size="lg" variant="secondary" onClick={handleBack}>
                      Back
                    </MagneticButton>
                    <MagneticButton size="lg" variant="primary" onClick={handleNext} disabled={!canProceed()}>
                      Continue
                    </MagneticButton>
                  </div>
                </div>
              </div>
            )}

            {/* Page 4: Resume Upload or Manual Completion */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-light leading-tight text-foreground mb-3">
                    <span className="text-balance">Upload your resume or complete manually</span>
                  </h2>
                  <p className="text-lg text-foreground/70">
                    Upload your resume to auto-fill your profile, or complete it manually.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Resume Upload Option */}
                  <div className="bg-foreground/5 border border-foreground/20 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <Upload className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">Upload Resume</h3>
                        <p className="text-sm text-foreground/60">We'll extract your information automatically</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent/20 hover:bg-accent/30 rounded-lg cursor-pointer transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Choose File</span>
                    </label>
                    {resumeFile && (
                      <p className="text-sm text-foreground/80 mt-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {resumeFile.name}
                      </p>
                    )}
                    {formData.resumeAutoFill && (
                      <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                        <p className="text-sm text-emerald-600">
                          ✓ Resume parsed! Your profile has been auto-filled. Review and continue.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Manual Completion Option */}
                  {!formData.resumeAutoFill && (
                    <div className="bg-foreground/5 border border-foreground/20 rounded-2xl p-8 backdrop-blur-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/20 rounded-lg">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-1">Complete Manually</h3>
                          <p className="text-sm text-foreground/60">Fill in your skills and other details</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="text-sm font-medium text-foreground/80 mb-4 block">Select Your Skills</label>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {skillCategories.map((skill) => {
                            const isSelected = formData.skills.includes(skill.id)
                            return (
                              <button
                                key={skill.id}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    skills: isSelected
                                      ? formData.skills.filter((id) => id !== skill.id)
                                      : [...formData.skills, skill.id],
                                  })
                                }}
                                className={`group text-left p-4 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                                  isSelected
                                    ? "bg-accent/20 border-accent/50 scale-[1.02]"
                                    : "bg-foreground/10 border-foreground/20 hover:bg-foreground/15 hover:border-foreground/40"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="font-semibold text-foreground group-hover:text-accent transition-colors text-sm">
                                        {skill.label}
                                      </p>
                                      {isSelected && (
                                        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                    <p className="text-xs text-foreground/60">{skill.desc}</p>
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <MagneticButton size="lg" variant="secondary" onClick={handleBack}>
                      Back
                    </MagneticButton>
                    <MagneticButton
                      size="lg"
                      variant="primary"
                      onClick={formData.resumeAutoFill ? handleComplete : handleManualComplete}
                      disabled={!canProceed()}
                    >
                      {formData.resumeAutoFill ? "Complete" : "Finish"}
                    </MagneticButton>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
