import { Resume, JobRecommendation } from '../types';

export class JobRecommendationEngine {
  private static jobDatabase: JobRecommendation[] = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc",
      location: "San Francisco, CA",
      matchScore: 0,
      salaryRange: "$120,000 - $180,000",
      type: "Full-time",
      description: "Join our team building next-generation web applications using React, TypeScript, and modern tools.",
      requiredSkills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
      url: "https://example.com/jobs/1"
    },
    {
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "New York, NY",
      matchScore: 0,
      salaryRange: "$100,000 - $150,000",
      type: "Full-time",
      description: "Build scalable web applications from frontend to backend using modern technologies.",
      requiredSkills: ["React", "Node.js", "Python", "MongoDB", "AWS"],
      url: "https://example.com/jobs/2"
    },
    {
      title: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Austin, TX",
      matchScore: 0,
      salaryRange: "$110,000 - $160,000",
      type: "Full-time",
      description: "Manage cloud infrastructure and implement CI/CD pipelines for enterprise applications.",
      requiredSkills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Python"],
      url: "https://example.com/jobs/3"
    },
    {
      title: "Data Scientist",
      company: "DataDriven Corp",
      location: "Remote",
      matchScore: 0,
      salaryRange: "$115,000 - $170,000",
      type: "Remote",
      description: "Analyze large datasets and build machine learning models to drive business insights.",
      requiredSkills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Pandas"],
      url: "https://example.com/jobs/4"
    },
    {
      title: "Mobile App Developer",
      company: "AppStudio LLC",
      location: "Seattle, WA",
      matchScore: 0,
      salaryRange: "$95,000 - $140,000",
      type: "Full-time",
      description: "Develop cross-platform mobile applications using React Native and native technologies.",
      requiredSkills: ["React Native", "JavaScript", "iOS", "Android", "Firebase"],
      url: "https://example.com/jobs/5"
    },
    {
      title: "Backend Developer",
      company: "ServerTech Inc",
      location: "Chicago, IL",
      matchScore: 0,
      salaryRange: "$90,000 - $135,000",
      type: "Full-time",
      description: "Design and implement robust backend services and APIs for web and mobile applications.",
      requiredSkills: ["Node.js", "Python", "PostgreSQL", "REST API", "Microservices"],
      url: "https://example.com/jobs/6"
    },
    {
      title: "UI/UX Designer",
      company: "DesignStudio Pro",
      location: "Los Angeles, CA",
      matchScore: 0,
      salaryRange: "$80,000 - $120,000",
      type: "Full-time",
      description: "Create beautiful and intuitive user interfaces for web and mobile applications.",
      requiredSkills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research", "CSS"],
      url: "https://example.com/jobs/7"
    },
    {
      title: "Product Manager",
      company: "ProductFlow Inc",
      location: "Boston, MA",
      matchScore: 0,
      salaryRange: "$130,000 - $180,000",
      type: "Full-time",
      description: "Lead product strategy and development for our suite of enterprise software solutions.",
      requiredSkills: ["Product Management", "Agile", "Analytics", "Leadership", "Communication"],
      url: "https://example.com/jobs/8"
    },
    {
      title: "Machine Learning Engineer",
      company: "AI Innovations",
      location: "Palo Alto, CA",
      matchScore: 0,
      salaryRange: "$140,000 - $200,000",
      type: "Full-time",
      description: "Build and deploy machine learning models at scale for computer vision and NLP applications.",
      requiredSkills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"],
      url: "https://example.com/jobs/9"
    },
    {
      title: "Cybersecurity Analyst",
      company: "SecureNet Systems",
      location: "Washington, DC",
      matchScore: 0,
      salaryRange: "$85,000 - $125,000",
      type: "Full-time",
      description: "Monitor and protect organizational systems from security threats and vulnerabilities.",
      requiredSkills: ["Network Security", "SIEM", "Incident Response", "Penetration Testing", "Python"],
      url: "https://example.com/jobs/10"
    }
  ];

  static getRecommendations(resume: Resume): JobRecommendation[] {
    const recommendations = this.jobDatabase.map(job => ({
      ...job,
      matchScore: this.calculateJobMatch(resume, job)
    }));

    // Sort by match score and return top matches
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  }

  private static calculateJobMatch(resume: Resume, job: JobRecommendation): number {
    const resumeSkills = resume.skills.map(skill => skill.name.toLowerCase());
    const jobSkills = job.requiredSkills.map(skill => skill.toLowerCase());
    
    // Calculate skill match
    const matchedSkills = jobSkills.filter(skill => 
      resumeSkills.includes(skill)
    ).length;
    
    const skillMatch = jobSkills.length > 0 ? (matchedSkills / jobSkills.length) * 100 : 0;
    
    // Factor in experience level
    const totalExperience = resume.experience.reduce((sum, exp) => sum + exp.duration, 0);
    const experienceBonus = Math.min(20, totalExperience * 2);
    
    // Factor in education
    const hasRelevantEducation = resume.education.some(edu => 
      edu.degree.toLowerCase().includes('bachelor') || 
      edu.degree.toLowerCase().includes('master')
    );
    const educationBonus = hasRelevantEducation ? 10 : 0;
    
    return Math.round(Math.min(100, skillMatch + experienceBonus + educationBonus));
  }
}