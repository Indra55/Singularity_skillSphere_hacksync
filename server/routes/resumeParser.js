const { GoogleGenerativeAI } = require('@google/generative-ai');

class EnhancedResumeService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      }
    });

    // Track last request time to prevent rate limiting
    this.lastRequestTime = 0;
    this.minRequestInterval = 4000; // 4 seconds between requests (15 rpm limit)
  }

  /**
   * Wait to avoid rate limiting
   */
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limit: waiting ${waitTime}ms before next request...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Make API call with retry logic
   */
  async callWithRetry(prompt, maxRetries = 2) {
    await this.waitForRateLimit();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        if (error.status === 429 && attempt < maxRetries) {
          // Rate limited - wait and retry
          const waitTime = 35000; // Wait 35 seconds
          console.log(`Rate limited. Waiting ${waitTime / 1000}s before retry ${attempt + 1}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          this.lastRequestTime = Date.now();
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * Safely parse JSON with fallback
   */
  safeJsonParse(text, fallback = {}) {
    try {
      // Step 1: Remove markdown code blocks
      let cleaned = text.replace(/```json\n?|\n?```/g, '').trim();

      // Step 2: Remove any text before the first { or after the last }
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }

      // Step 3: Fix common JSON issues
      // Fix trailing commas
      cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

      // Fix unescaped newlines inside strings (common AI error)
      cleaned = cleaned.replace(/:\s*"([^"]*)\n([^"]*)"/g, (match, p1, p2) => {
        return `: "${p1}\\n${p2}"`;
      });

      // Fix incomplete arrays (missing closing bracket)
      const openBrackets = (cleaned.match(/\[/g) || []).length;
      const closeBrackets = (cleaned.match(/\]/g) || []).length;
      if (openBrackets > closeBrackets) {
        // Add missing closing brackets
        cleaned = cleaned + ']'.repeat(openBrackets - closeBrackets);
      }

      // Fix incomplete objects (missing closing brace)  
      const openBraces = (cleaned.match(/\{/g) || []).length;
      const closeBraces = (cleaned.match(/\}/g) || []).length;
      if (openBraces > closeBraces) {
        cleaned = cleaned + '}'.repeat(openBraces - closeBraces);
      }

      // Step 4: Try to parse
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('JSON parse error:', error.message);
      console.error('Problematic text (first 500 chars):', text.substring(0, 500));
      return fallback;
    }
  }

  /**
   * FAST extraction - essential resume data (ONLY API CALL DURING UPLOAD)
   */
  async parseResumeBasic(resumeText) {
    const prompt = `Extract resume data as JSON:

Resume:
${resumeText.substring(0, 10000)}

Return this exact JSON structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "location": "City, Country",
  "linkedin_url": "linkedin.com/in/...",
  "portfolio_url": "website.com",
  "title": "Current Job Title",
  "years_of_experience": 0,
  "summary": "Brief professional summary",
  "technical_skills": ["skill1", "skill2"],
  "soft_skills": ["communication", "leadership"],
  "education": [{"degree": "Degree Name", "institution": "University", "field_of_study": "Field", "graduation_year": "2024"}],
  "experience": [{"title": "Job Title", "company": "Company Name", "start_date": "2020-01", "end_date": "2024-01", "description": "Brief description"}],
  "projects": [{"name": "Project Name", "description": "What it does", "technologies": ["tech1", "tech2"], "url": "github.com/..."}],
  "certifications": ["Cert 1", "Cert 2"]
}`;

    try {
      const text = await this.callWithRetry(prompt);

      return this.safeJsonParse(text, {
        name: null, email: null, phone: null, location: null,
        linkedin_url: null, portfolio_url: null, title: null,
        years_of_experience: 0, summary: null,
        technical_skills: [], soft_skills: [],
        education: [], experience: [], projects: [], certifications: []
      });
    } catch (error) {
      console.error('Error parsing resume with Gemini:', error.message);
      throw new Error('Failed to parse resume. Please try again in a minute.');
    }
  }

  /**
   * ON-DEMAND: Generate career recommendations
   */
  async generateCareerRecommendations(userProfile) {
    const skillsStr = (userProfile.skills || []).slice(0, 10).join(', ') || 'Not specified';
    const rolesStr = (userProfile.experience || []).slice(0, 2).map(e => e.title || 'Unknown').join(', ') || 'Not specified';

    const prompt = `Suggest 5 career paths for:
Title: ${userProfile.title || 'Not specified'}
Experience: ${userProfile.years_of_experience || 0} years
Skills: ${skillsStr}
Recent roles: ${rolesStr}

Return JSON:
{
  "recommended_roles": [
    {"title": "Role 1", "match_score": 95, "reasoning": "Short reason", "skill_gaps": ["gap1"], "estimated_transition_time": "3 months"},
    {"title": "Role 2", "match_score": 85, "reasoning": "Short reason", "skill_gaps": ["gap1"], "estimated_transition_time": "6 months"},
    {"title": "Role 3", "match_score": 75, "reasoning": "Short reason", "skill_gaps": ["gap1"], "estimated_transition_time": "6 months"},
    {"title": "Role 4", "match_score": 65, "reasoning": "Short reason", "skill_gaps": ["gap1"], "estimated_transition_time": "1 year"},
    {"title": "Role 5", "match_score": 55, "reasoning": "Short reason", "skill_gaps": ["gap1"], "estimated_transition_time": "1-2 years"}
  ],
  "skill_development_plan": [
    {"skill": "Skill to learn", "priority": "high", "estimated_learning_time": "2 months"}
  ]
}`;

    try {
      const text = await this.callWithRetry(prompt);

      return this.safeJsonParse(text, {
        recommended_roles: [],
        skill_development_plan: []
      });
    } catch (error) {
      console.error('Error generating recommendations:', error.message);
      return {
        recommended_roles: [],
        skill_development_plan: [],
        error: 'Rate limited. Please try again in a minute.'
      };
    }
  }

  /**
   * ON-DEMAND: Analyze resume for ATS compatibility
   */
  async analyzeResume(resumeText) {
    const prompt = `Rate this resume (0-100). Return JSON only.

Resume excerpt:
${resumeText.substring(0, 4000)}

Return JSON:
{
  "completeness_score": 75,
  "ats_compatibility_score": 80,
  "strengths": ["strength1", "strength2"],
  "improvement_areas": ["area1", "area2"],
  "missing_elements": ["element1"]
}`;

    try {
      const text = await this.callWithRetry(prompt);

      return this.safeJsonParse(text, {
        completeness_score: 50,
        ats_compatibility_score: 50,
        strengths: [],
        improvement_areas: [],
        missing_elements: []
      });
    } catch (error) {
      console.error('Error analyzing resume:', error.message);
      return {
        completeness_score: 0,
        ats_compatibility_score: 0,
        strengths: [],
        improvement_areas: [],
        missing_elements: [],
        error: 'Rate limited. Please try again in a minute.'
      };
    }
  }

  /**
   * ON-DEMAND: Get career insights
   */
  async getCareerInsights(userProfile) {
    const skillsStr = (userProfile.skills || []).slice(0, 8).join(', ') || 'Not specified';
    const rolesStr = (userProfile.experience || []).map(e => e.title || 'Unknown').join(' -> ') || 'Not specified';

    const prompt = `Analyze this career trajectory. Return JSON only.

Title: ${userProfile.title || 'Not specified'}
Experience: ${userProfile.years_of_experience || 0} years  
Skills: ${skillsStr}
Career path: ${rolesStr}

Return JSON:
{
  "current_role_level": "junior/mid/senior/lead",
  "industries_worked": ["industry1"],
  "career_interests": ["interest1"],
  "growth_trajectory": "ascending/stable/transitioning",
  "recommended_paths": ["path1", "path2"]
}`;

    try {
      const text = await this.callWithRetry(prompt);

      return this.safeJsonParse(text, {
        current_role_level: 'mid',
        industries_worked: [],
        career_interests: [],
        growth_trajectory: 'stable',
        recommended_paths: []
      });
    } catch (error) {
      console.error('Error getting career insights:', error.message);
      return {
        current_role_level: 'unknown',
        industries_worked: [],
        career_interests: [],
        growth_trajectory: 'unknown',
        recommended_paths: [],
        error: 'Rate limited. Please try again in a minute.'
      };
    }
  }
}

module.exports = new EnhancedResumeService();