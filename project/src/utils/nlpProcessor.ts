import { ContactInfo, Experience, Education, Skill, Resume } from '../types';
import { getSkillCategory, getAllSkills } from './skillsDatabase';

export class NLPProcessor {
  private static readonly EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  private static readonly PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  private static readonly LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/gi;
  private static readonly URL_REGEX = /https?:\/\/[^\s]+/g;
  
  static extractContactInfo(text: string): ContactInfo {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Extract name (usually first non-empty line)
    const name = this.extractName(lines);
    
    // Extract email
    const emailMatch = text.match(this.EMAIL_REGEX);
    const email = emailMatch ? emailMatch[0] : '';
    
    // Extract phone
    const phoneMatch = text.match(this.PHONE_REGEX);
    const phone = phoneMatch ? phoneMatch[0] : '';
    
    // Extract LinkedIn
    const linkedinMatch = text.match(this.LINKEDIN_REGEX);
    const linkedin = linkedinMatch ? linkedinMatch[0] : '';
    
    // Extract location
    const location = this.extractLocation(text);
    
    // Extract website
    const urls = text.match(this.URL_REGEX) || [];
    const website = urls.find(url => 
      !url.includes('linkedin.com') && 
      !url.includes('mailto:')
    ) || '';
    
    return { name, email, phone, location, linkedin, website };
  }
  
  private static extractName(lines: string[]): string {
    // Look for name in first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      // Skip lines that look like contact info
      if (this.EMAIL_REGEX.test(line) || this.PHONE_REGEX.test(line)) continue;
      
      // Look for a line with 2-4 words that could be a name
      const words = line.split(/\s+/).filter(word => word.length > 1);
      if (words.length >= 2 && words.length <= 4) {
        // Check if it looks like a name (proper case, no numbers)
        if (words.every(word => /^[A-Z][a-z]+$/.test(word))) {
          return words.join(' ');
        }
      }
    }
    return '';
  }
  
  private static extractLocation(text: string): string {
    // Common location patterns
    const locationPatterns = [
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})/g, // City, State
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+)/g, // City, Country
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    
    return '';
  }
  
  static extractExperience(text: string): Experience[] {
    const experiences: Experience[] = [];
    const sections = this.splitIntoSections(text);
    
    const experienceSection = sections.find(section => 
      /(?:experience|work|employment|career|professional)/i.test(section.title)
    );
    
    if (!experienceSection) return experiences;
    
    const experienceBlocks = this.parseExperienceBlocks(experienceSection.content);
    
    return experienceBlocks.map(block => this.parseExperienceBlock(block));
  }
  
  private static splitIntoSections(text: string): Array<{title: string, content: string}> {
    const sections: Array<{title: string, content: string}> = [];
    const lines = text.split('\n');
    let currentSection = { title: '', content: '' };
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Check if this line is a section header
      if (this.isSectionHeader(trimmedLine)) {
        if (currentSection.title) {
          sections.push(currentSection);
        }
        currentSection = { title: trimmedLine, content: '' };
      } else {
        currentSection.content += trimmedLine + '\n';
      }
    }
    
    if (currentSection.title) {
      sections.push(currentSection);
    }
    
    return sections;
  }
  
  private static isSectionHeader(line: string): boolean {
    const headers = [
      'experience', 'work experience', 'professional experience',
      'employment', 'career', 'education', 'skills', 'summary',
      'objective', 'profile', 'certifications', 'projects'
    ];
    
    return headers.some(header => 
      line.toLowerCase().includes(header) && line.length < 50
    );
  }
  
  private static parseExperienceBlocks(content: string): string[] {
    // Split by job entries (look for patterns like company/title combinations)
    const blocks = content.split(/\n\s*\n/).filter(block => block.trim());
    return blocks;
  }
  
  private static parseExperienceBlock(block: string): Experience {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line);
    
    let title = '';
    let company = '';
    let startDate = '';
    let endDate = '';
    let description = '';
    
    // Try to identify title and company from first few lines
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i];
      
      // Look for date ranges
      const dateMatch = line.match(/(\d{4})\s*[-–—]\s*(\d{4}|present|current)/i);
      if (dateMatch) {
        startDate = dateMatch[1];
        endDate = dateMatch[2].toLowerCase() === 'present' || dateMatch[2].toLowerCase() === 'current' 
          ? 'Present' : dateMatch[2];
        continue;
      }
      
      // First line without dates is likely title
      if (!title && !this.containsDate(line)) {
        title = line;
      } else if (!company && !this.containsDate(line) && line !== title) {
        company = line;
      }
    }
    
    // Remaining lines are description
    description = lines.slice(3).join(' ');
    
    const duration = this.calculateDuration(startDate, endDate);
    const achievements = this.extractAchievements(description);
    
    return {
      title,
      company,
      startDate,
      endDate,
      description,
      duration,
      achievements
    };
  }
  
  private static containsDate(text: string): boolean {
    return /\d{4}/.test(text) || /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(text);
  }
  
  private static calculateDuration(startDate: string, endDate: string): number {
    if (!startDate) return 0;
    
    const start = parseInt(startDate);
    const end = endDate.toLowerCase() === 'present' ? new Date().getFullYear() : parseInt(endDate);
    
    return Math.max(0, end - start);
  }
  
  private static extractAchievements(description: string): string[] {
    // Look for bullet points or numbered achievements
    const achievements: string[] = [];
    const lines = description.split(/[•·▪▫‣⁃]|\d+\./).map(line => line.trim()).filter(line => line);
    
    return lines.filter(line => 
      line.length > 20 && 
      (line.includes('increased') || line.includes('improved') || line.includes('achieved') || 
       line.includes('reduced') || line.includes('led') || line.includes('managed'))
    );
  }
  
  static extractEducation(text: string): Education[] {
    const education: Education[] = [];
    const sections = this.splitIntoSections(text);
    
    const educationSection = sections.find(section => 
      /(?:education|academic|degree|university|college|school)/i.test(section.title)
    );
    
    if (!educationSection) return education;
    
    const educationBlocks = educationSection.content.split(/\n\s*\n/).filter(block => block.trim());
    
    return educationBlocks.map(block => this.parseEducationBlock(block));
  }
  
  private static parseEducationBlock(block: string): Education {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line);
    
    let degree = '';
    let institution = '';
    let graduationDate = '';
    let gpa = '';
    
    for (const line of lines) {
      // Look for degree keywords
      if (/bachelor|master|phd|doctorate|associate|diploma|certificate/i.test(line)) {
        degree = line;
      }
      // Look for institution keywords
      else if (/university|college|institute|school/i.test(line)) {
        institution = line;
      }
      // Look for graduation date
      else if (/\d{4}/.test(line) && !gpa) {
        graduationDate = line;
      }
      // Look for GPA
      else if (/gpa|grade/i.test(line)) {
        const gpaMatch = line.match(/(\d+\.?\d*)/);
        if (gpaMatch) gpa = gpaMatch[1];
      }
    }
    
    return {
      degree,
      institution,
      graduationDate,
      gpa,
      honors: [],
      relevantCoursework: []
    };
  }
  
  static extractSkills(text: string): Skill[] {
    const allSkills = getAllSkills();
    const foundSkills: Skill[] = [];
    const textLower = text.toLowerCase();
    
    // Find skills in text
    for (const skill of allSkills) {
      const skillLower = skill.toLowerCase();
      const escapedSkill = this.escapeRegExp(skillLower);
      
      // Check for exact matches and variations
      const patterns = [
        new RegExp(`\\b${escapedSkill}\\b`, 'gi'),
        new RegExp(`\\b${escapedSkill.replace(/[.\s]/g, '[-\\s]?')}\\b`, 'gi')
      ];
      
      for (const pattern of patterns) {
        if (pattern.test(textLower)) {
          const category = getSkillCategory(skill);
          const proficiencyLevel = this.estimateProficiency(text, skill);
          
          foundSkills.push({
            name: skill,
            category: category as any,
            proficiencyLevel,
            isKeyword: true
          });
          break;
        }
      }
    }
    
    // Remove duplicates
    const uniqueSkills = foundSkills.filter((skill, index, self) => 
      index === self.findIndex(s => s.name.toLowerCase() === skill.name.toLowerCase())
    );
    
    return uniqueSkills;
  }
  
  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  private static estimateProficiency(text: string, skill: string): number {
    const skillMentions = (text.toLowerCase().match(new RegExp(skill.toLowerCase(), 'g')) || []).length;
    const experienceKeywords = ['expert', 'senior', 'advanced', 'proficient', 'experienced'];
    const hasExperienceKeywords = experienceKeywords.some(keyword => 
      text.toLowerCase().includes(`${keyword} ${skill.toLowerCase()}`) ||
      text.toLowerCase().includes(`${skill.toLowerCase()} ${keyword}`)
    );
    
    if (hasExperienceKeywords) return Math.min(90, 70 + skillMentions * 5);
    if (skillMentions > 3) return Math.min(80, 50 + skillMentions * 5);
    if (skillMentions > 1) return Math.min(70, 40 + skillMentions * 5);
    return Math.min(60, 30 + skillMentions * 10);
  }
  
  static generateSummary(text: string, skills: Skill[], experience: Experience[]): string {
    const totalExperience = experience.reduce((sum, exp) => sum + exp.duration, 0);
    const topSkills = skills
      .sort((a, b) => b.proficiencyLevel - a.proficiencyLevel)
      .slice(0, 5)
      .map(skill => skill.name);
    
    const experienceLevel = totalExperience >= 8 ? 'Senior' : 
                          totalExperience >= 4 ? 'Mid-level' : 
                          totalExperience >= 1 ? 'Junior' : 'Entry-level';
    
    return `${experienceLevel} professional with ${totalExperience} years of experience. ` +
           `Strong expertise in ${topSkills.slice(0, 3).join(', ')}${topSkills.length > 3 ? ` and ${topSkills.length - 3} other technologies` : ''}. ` +
           `Proven track record in ${experience.length} professional roles across various organizations.`;
  }
  
  static determineExperienceLevel(experience: Experience[]): 'Entry' | 'Mid' | 'Senior' | 'Executive' {
    const totalYears = experience.reduce((sum, exp) => sum + exp.duration, 0);
    const hasLeadershipRole = experience.some(exp => 
      /(?:manager|director|lead|senior|principal|architect|head|chief)/i.test(exp.title)
    );
    
    if (totalYears >= 10 && hasLeadershipRole) return 'Executive';
    if (totalYears >= 5) return 'Senior';
    if (totalYears >= 2) return 'Mid';
    return 'Entry';
  }
}