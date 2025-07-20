import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink, Star } from 'lucide-react';
import { JobRecommendation } from '../types';

interface JobRecommendationsProps {
  recommendations: JobRecommendation[];
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ recommendations }) => {
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMatchBg = (score: number) => {
    if (score >= 80) return 'from-green-600/20 to-green-700/20 border-green-400/30';
    if (score >= 60) return 'from-yellow-600/20 to-yellow-700/20 border-yellow-400/30';
    return 'from-red-600/20 to-red-700/20 border-red-400/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          className="text-3xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Recommended Jobs
        </motion.h2>
        <motion.p 
          className="text-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Based on your skills and experience, here are the best job matches
        </motion.p>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          >
            {/* Job Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <motion.h3 
                  className="text-xl font-bold text-white mb-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {job.title}
                </motion.h3>
                <motion.p 
                  className="text-blue-200 mb-2 flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Briefcase className="w-4 h-4" />
                  {job.company}
                </motion.p>
              </div>
              
              {/* Match Score Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`bg-gradient-to-br ${getMatchBg(job.matchScore)} backdrop-blur-sm border rounded-xl p-3 text-center min-w-[80px]`}
              >
                <div className={`text-2xl font-bold ${getMatchColor(job.matchScore)} mb-1`}>
                  {job.matchScore}%
                </div>
                <div className="text-xs text-blue-200">Match</div>
              </motion.div>
            </div>

            {/* Job Details */}
            <div className="space-y-3 mb-4">
              <motion.div 
                className="flex items-center gap-2 text-blue-200"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{job.location}</span>
                <span className="text-xs bg-blue-600/20 px-2 py-1 rounded-full border border-blue-400/30">
                  {job.type}
                </span>
              </motion.div>

              <motion.div 
                className="flex items-center gap-2 text-green-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-semibold">{job.salaryRange}</span>
              </motion.div>
            </div>

            {/* Job Description */}
            <motion.p 
              className="text-blue-100 text-sm mb-4 line-clamp-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              {job.description}
            </motion.p>

            {/* Required Skills */}
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 + index * 0.1 }}
            >
              <h4 className="text-white font-medium mb-2 text-sm">Required Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.slice(0, 5).map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + index * 0.1 + skillIndex * 0.05 }}
                    className="text-xs bg-purple-600/20 text-purple-200 px-3 py-1 rounded-full border border-purple-400/30"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(124, 58, 237, 0.3)' }}
                  >
                    {skill}
                  </motion.span>
                ))}
                {job.requiredSkills.length > 5 && (
                  <span className="text-xs text-blue-300">
                    +{job.requiredSkills.length - 5} more
                  </span>
                )}
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(job.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              View Job Details
            </motion.button>

            {/* Sparkle Effect on Hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center bg-blue-600/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6"
      >
        <Star className="w-6 h-6 text-yellow-400 mx-auto mb-3" />
        <h4 className="text-white font-semibold mb-2">Pro Tip</h4>
        <p className="text-blue-200 text-sm">
          Jobs with 70%+ match scores are excellent opportunities. Consider applying even if you don't meet 100% of requirements!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default JobRecommendations;