export interface Resume {
  id: string;
  fileName: string;
  extractedText: string;
  contactInfo: ContactInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  summary: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  overallScore: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  duration: number;
  achievements: string[];
}

export interface Education {
  degree: string;
  institution: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
  relevantCoursework?: string[];
}

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiencyLevel: number;
  yearsOfExperience?: number;
  isKeyword: boolean;
}

export type SkillCategory = 
  | 'Programming Languages'
  | 'Frameworks & Libraries'
  | 'Databases'
  | 'Cloud Platforms'
  | 'DevOps & Tools'
  | 'Soft Skills'
  | 'Industry Specific'
  | 'Certifications';

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  education: string;
}

export interface MatchAnalysis {
  overallMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  missingSkills: string[];
  recommendations: Recommendation[];
  atsScore: number;
}

export interface Recommendation {
  type: 'skill' | 'experience' | 'education' | 'format';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
}

export interface JobRecommendation {
  title: string;
  company: string;
  location: string;
  matchScore: number;
  salaryRange: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  requiredSkills: string[];
  url: string;
}

export interface AnalysisState {
  resume: Resume | null;
  jobDescription: JobDescription | null;
  matchAnalysis: MatchAnalysis | null;
  jobRecommendations: JobRecommendation[];
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
  setResume: (resume: Resume) => void;
  setJobDescription: (jobDescription: JobDescription) => void;
  setMatchAnalysis: (analysis: MatchAnalysis) => void;
  setJobRecommendations: (jobs: JobRecommendation[]) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentStep: (step: string) => void;
  reset: () => void;
}