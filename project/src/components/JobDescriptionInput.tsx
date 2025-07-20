import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Building, MapPin } from 'lucide-react';
import { useAnalysisStore } from '../store/analysisStore';
import { SimilarityCalculator } from '../utils/similarityCalculator';
import { JobRecommendationEngine } from '../utils/jobRecommendations';

const JobDescriptionInput: React.FC = () => {
  const { resume, setJobDescription, setMatchAnalysis, setJobRecommendations } = useAnalysisStore();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!resume || !description.trim()) return;

    setIsAnalyzing(true);

    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Extract skills from job description
    const requiredSkills = extractSkills(description);
    const preferredSkills = extractPreferredSkills(description);

    const jobDesc = {
      title: jobTitle || 'Position',
      company: company || 'Company',
      description,
      requiredSkills,
      preferredSkills,
      experience: extractExperienceRequirement(description),
      education: extractEducationRequirement(description)
    };

    setJobDescription(jobDesc);

    // Calculate match analysis
    const matchAnalysis = SimilarityCalculator.calculateMatch(resume, jobDesc);
    setMatchAnalysis(matchAnalysis);

    // Get job recommendations
    const recommendations = JobRecommendationEngine.getRecommendations(resume);
    setJobRecommendations(recommendations);

    setIsAnalyzing(false);
  };

  const extractSkills = (text: string): string[] => {
    const skillKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python',
      'Java', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Git', 'Agile'
    ];
    
    return skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
  };

  const extractPreferredSkills = (text: string): string[] => {
    const preferredSection = text.toLowerCase().match(/(?:preferred|nice.to.have|bonus)[\s\S]*?(?:\n\n|$)/);
    if (!preferredSection) return [];
    
    return extractSkills(preferredSection[0]);
  };

  const extractExperienceRequirement = (text: string): string => {
    const match = text.match(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/i);
    return match ? `${match[1]} years` : '';
  };

  const extractEducationRequirement = (text: string): string => {
    if (text.toLowerCase().includes('bachelor')) return 'Bachelor\'s degree';
    if (text.toLowerCase().includes('master')) return 'Master\'s degree';
    if (text.toLowerCase().includes('phd')) return 'PhD';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.h2 
          className="text-3xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Job Description Analysis
        </motion.h2>
        <motion.p 
          className="text-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Paste a job description to see how well your resume matches
        </motion.p>
      </div>

      <motion.div
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              Job Title (Optional)
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              Company (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., TechCorp Inc"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </motion.div>
        </div>

        {/* Job Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-white text-sm font-medium mb-2">
            Job Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            rows={12}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
          />
        </motion.div>

        {/* Character Count */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-blue-300">
            {description.length} characters
          </span>
          <span className="text-blue-300">
            {description.split(/\s+/).filter(word => word.length > 0).length} words
          </span>
        </div>

        {/* Analyze Button */}
        <motion.button
          onClick={handleAnalyze}
          disabled={!description.trim() || !resume || isAnalyzing}
          className={`
            w-full mt-6 px-8 py-4 rounded-xl font-semibold text-white
            transition-all duration-300 flex items-center justify-center gap-3
            ${description.trim() && resume && !isAnalyzing
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
            }
          `}
          whileHover={description.trim() && resume && !isAnalyzing ? { scale: 1.02 } : {}}
          whileTap={description.trim() && resume && !isAnalyzing ? { scale: 0.98 } : {}}
        >
          {isAnalyzing ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Analyzing Match...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Analyze Job Match
            </>
          )}
        </motion.button>

        {!resume && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-yellow-300 text-sm text-center mt-4"
          >
            Please upload your resume first to enable job matching
          </motion.p>
        )}
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h4 className="text-white font-semibold mb-3">💡 Tips for Better Analysis</h4>
        <ul className="text-blue-200 text-sm space-y-2">
          <li>• Include the complete job description for more accurate matching</li>
          <li>• Look for required vs preferred skills sections</li>
          <li>• Include experience requirements and education preferences</li>
          <li>• Company culture and soft skills requirements help too</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default JobDescriptionInput;