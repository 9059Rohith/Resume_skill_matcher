import { Resume, JobDescription, MatchAnalysis, Recommendation } from '../types';
import { getAllSkills, getRelatedSkills } from './skillsDatabase';

export class SimilarityCalculator {
  
  static calculateMatch(resume: Resume, jobDescription: JobDescription): MatchAnalysis {
    const skillsMatch = this.calculateSkillsMatch(resume, jobDescription);
    const experienceMatch = this.calculateExperienceMatch(resume, jobDescription);
    const educationMatch = this.calculateEducationMatch(resume, jobDescription);
    
    // Weighted average
    const overallMatch = Math.round(
      skillsMatch * 0.4 + 
      experienceMatch * 0.3 + 
      educationMatch * 0.2 + 
      this.calculateSoftSkillsMatch(resume, jobDescription) * 0.1
    );
    
    const missingSkills = this.findMissingSkills(resume, jobDescription);
    const recommendations = this.generateRecommendations(resume, jobDescription, {
      overallMatch,
      skillsMatch,
      experienceMatch,
      educationMatch,
      missingSkills,
      recommendations: [],
      atsScore: 0
    });
    
    const atsScore = this.calculateATSScore(resume, jobDescription);
    
    return {
      overallMatch,
      skillsMatch,
      experienceMatch,
      educationMatch,
      missingSkills,
      recommendations,
      atsScore
    };
  }
  
  private static calculateSkillsMatch(resume: Resume, jobDescription: JobDescription): number {
    const resumeSkills = resume.skills.map(skill => skill.name.toLowerCase());
    const requiredSkills = jobDescription.requiredSkills.map(skill => skill.toLowerCase());
    const preferredSkills = jobDescription.preferredSkills.map(skill => skill.toLowerCase());
    
    let matchedRequired = 0;
    let matchedPreferred = 0;
    
    // Check required skills
    for (const requiredSkill of requiredSkills) {
      if (resumeSkills.includes(requiredSkill)) {
        matchedRequired++;
      } else {
        // Check for related skills
        const relatedSkills = getRelatedSkills(requiredSkill).map(s => s.toLowerCase());
        if (relatedSkills.some(related => resumeSkills.includes(related))) {
          matchedRequired += 0.5; // Partial credit for related skills
        }
      }
    }
    
    // Check preferred skills
    for (const preferredSkill of preferredSkills) {
      if (resumeSkills.includes(preferredSkill)) {
        matchedPreferred++;
      }
    }
    
    const requiredScore = requiredSkills.length > 0 ? (matchedRequired / requiredSkills.length) * 80 : 80;
    const preferredScore = preferredSkills.length > 0 ? (matchedPreferred / preferredSkills.length) * 20 : 20;
    
    return Math.min(100, Math.round(requiredScore + preferredScore));
  }
  
  private static calculateExperienceMatch(resume: Resume, jobDescription: JobDescription): number {
    const totalExperience = resume.experience.reduce((sum, exp) => sum + exp.duration, 0);
    
    // Extract experience requirements from job description
    const experienceRequirement = this.extractExperienceRequirement(jobDescription.description);
    
    if (experienceRequirement === 0) return 85; // No specific requirement
    
    const ratio = totalExperience / experienceRequirement;
    
    if (ratio >= 1.2) return 100;
    if (ratio >= 1.0) return 95;
    if (ratio >= 0.8) return 85;
    if (ratio >= 0.6) return 70;
    if (ratio >= 0.4) return 55;
    return 30;
  }
  
  private static extractExperienceRequirement(description: string): number {
    const patterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      /(\d+)\+?\s*years?\s*(?:of\s*)?professional/i,
      /minimum\s*(?:of\s*)?(\d+)\s*years?/i,
      /at\s*least\s*(\d+)\s*years?/i
    ];
    
    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }
    
    return 0;
  }
  
  private static calculateEducationMatch(resume: Resume, jobDescription: JobDescription): number {
    if (!jobDescription.education || jobDescription.education.toLowerCase() === 'none') {
      return 100;
    }
    
    const jobEducation = jobDescription.education.toLowerCase();
    const hasRelevantEducation = resume.education.some(edu => {
      const degree = edu.degree.toLowerCase();
      
      if (jobEducation.includes('bachelor') && degree.includes('bachelor')) return true;
      if (jobEducation.includes('master') && (degree.includes('master') || degree.includes('mba'))) return true;
      if (jobEducation.includes('phd') && degree.includes('phd')) return true;
      if (jobEducation.includes('associate') && degree.includes('associate')) return true;
      
      return false;
    });
    
    return hasRelevantEducation ? 100 : 60;
  }
  
  private static calculateSoftSkillsMatch(resume: Resume, jobDescription: JobDescription): number {
    const softSkillKeywords = [
      'leadership', 'communication', 'teamwork', 'problem solving',
      'analytical', 'creative', 'adaptable', 'detail oriented'
    ];
    
    const jobDescriptionText = jobDescription.description.toLowerCase();
    const resumeText = resume.extractedText.toLowerCase();
    
    let matchedSkills = 0;
    let totalSkills = 0;
    
    for (const skill of softSkillKeywords) {
      if (jobDescriptionText.includes(skill)) {
        totalSkills++;
        if (resumeText.includes(skill)) {
          matchedSkills++;
        }
      }
    }
    
    return totalSkills > 0 ? Math.round((matchedSkills / totalSkills) * 100) : 80;
  }
  
  private static findMissingSkills(resume: Resume, jobDescription: JobDescription): string[] {
    const resumeSkills = resume.skills.map(skill => skill.name.toLowerCase());
    const requiredSkills = jobDescription.requiredSkills.map(skill => skill.toLowerCase());
    
    return jobDescription.requiredSkills.filter(skill => 
      !resumeSkills.includes(skill.toLowerCase()) &&
      !getRelatedSkills(skill).some(related => 
        resumeSkills.includes(related.toLowerCase())
      )
    );
  }
  
  private static generateRecommendations(
    resume: Resume,
    jobDescription: JobDescription,
    analysis: Partial<MatchAnalysis>
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Skill gap recommendations
    if (analysis.missingSkills && analysis.missingSkills.length > 0) {
      recommendations.push({
        type: 'skill',
        priority: 'high',
        title: 'Address Key Skill Gaps',
        description: `You're missing ${analysis.missingSkills.length} required skills for this position.`,
        actionItems: analysis.missingSkills.slice(0, 3).map(skill => 
          `Learn ${skill} through online courses or practical projects`
        )
      });
    }
    
    // Experience recommendations
    if (analysis.experienceMatch && analysis.experienceMatch < 70) {
      recommendations.push({
        type: 'experience',
        priority: 'medium',
        title: 'Enhance Experience Section',
        description: 'Your experience could be better highlighted to match job requirements.',
        actionItems: [
          'Add more specific achievements with quantifiable results',
          'Include relevant projects that demonstrate required skills',
          'Highlight leadership and responsibility progression'
        ]
      });
    }
    
    // ATS optimization
    recommendations.push({
      type: 'format',
      priority: 'medium',
      title: 'Optimize for ATS Systems',
      description: 'Improve your resume\'s compatibility with applicant tracking systems.',
      actionItems: [
        'Use standard section headings (Experience, Education, Skills)',
        'Include more keywords from the job description',
        'Use a clean, simple format without complex graphics'
      ]
    });
    
    return recommendations;
  }
  
  private static calculateATSScore(resume: Resume, jobDescription: JobDescription): number {
    let score = 0;
    const maxScore = 100;
    
    // Keyword density (40 points)
    const keywordScore = this.calculateKeywordDensity(resume, jobDescription);
    score += keywordScore * 0.4;
    
    // Section structure (30 points)
    const structureScore = this.calculateStructureScore(resume);
    score += structureScore * 0.3;
    
    // Contact information completeness (20 points)
    const contactScore = this.calculateContactScore(resume);
    score += contactScore * 0.2;
    
    // File format and readability (10 points)
    score += 10; // PDF format is good for ATS
    
    return Math.round(Math.min(maxScore, score));
  }
  
  private static calculateKeywordDensity(resume: Resume, jobDescription: JobDescription): number {
    const jobKeywords = this.extractKeywords(jobDescription.description);
    const resumeText = resume.extractedText.toLowerCase();
    
    let matchedKeywords = 0;
    
    for (const keyword of jobKeywords) {
      if (resumeText.includes(keyword.toLowerCase())) {
        matchedKeywords++;
      }
    }
    
    return jobKeywords.length > 0 ? (matchedKeywords / jobKeywords.length) * 100 : 100;
  }
  
  private static extractKeywords(text: string): string[] {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Get most frequent words
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }
  
  private static calculateStructureScore(resume: Resume): number {
    let score = 0;
    
    if (resume.contactInfo.name) score += 20;
    if (resume.contactInfo.email) score += 20;
    if (resume.experience.length > 0) score += 30;
    if (resume.education.length > 0) score += 15;
    if (resume.skills.length > 0) score += 15;
    
    return score;
  }
  
  private static calculateContactScore(resume: Resume): number {
    let score = 0;
    const contact = resume.contactInfo;
    
    if (contact.name) score += 30;
    if (contact.email) score += 30;
    if (contact.phone) score += 20;
    if (contact.location) score += 10;
    if (contact.linkedin) score += 10;
    
    return score;
  }
}