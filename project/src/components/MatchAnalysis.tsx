import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Award, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { MatchAnalysis as MatchAnalysisType, JobDescription } from '../types';

interface MatchAnalysisProps {
  analysis: MatchAnalysisType;
  jobDescription: JobDescription;
}

const MatchAnalysis: React.FC<MatchAnalysisProps> = ({ analysis, jobDescription }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
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
          Job Match Analysis
        </motion.h2>
        <motion.p 
          className="text-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Analysis for <span className="font-semibold text-white">{jobDescription.title}</span> at <span className="font-semibold text-white">{jobDescription.company}</span>
        </motion.p>
      </div>

      {/* Overall Match Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`bg-gradient-to-br ${getScoreBg(analysis.overallMatch)} backdrop-blur-sm border rounded-2xl p-8 text-center`}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="relative inline-block"
        >
          <div className={`text-6xl font-bold ${getScoreColor(analysis.overallMatch)} mb-4`}>
            {analysis.overallMatch}%
          </div>
          <div className="absolute -inset-4">
            <motion.div
              className={`w-full h-full rounded-full border-4 ${getScoreColor(analysis.overallMatch).replace('text-', 'border-')}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: analysis.overallMatch / 100 }}
              transition={{ duration: 2, delay: 0.7 }}
              style={{
                background: `conic-gradient(${getScoreColor(analysis.overallMatch).replace('text-', '')} ${analysis.overallMatch * 3.6}deg, transparent 0deg)`
              }}
            />
          </div>
        </motion.div>
        <h3 className="text-2xl font-semibold text-white mb-2">Overall Match</h3>
        <p className="text-blue-200">
          {analysis.overallMatch >= 80 ? 'Excellent match! You\'re highly qualified for this position.' :
           analysis.overallMatch >= 60 ? 'Good match! Some areas could be improved.' :
           'Fair match. Consider developing missing skills.'}
        </p>
      </motion.div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Skills Match', score: analysis.skillsMatch, icon: Target, description: 'Technical and required skills' },
          { title: 'Experience', score: analysis.experienceMatch, icon: TrendingUp, description: 'Years and relevance' },
          { title: 'Education', score: analysis.educationMatch, icon: Award, description: 'Degree requirements' },
          { title: 'ATS Score', score: analysis.atsScore, icon: CheckCircle, description: 'Resume optimization' }
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`bg-gradient-to-br ${getScoreBg(item.score)} backdrop-blur-sm border rounded-xl p-6 text-center`}
            whileHover={{ scale: 1.05 }}
          >
            <item.icon className={`w-8 h-8 ${getScoreColor(item.score)} mx-auto mb-3`} />
            <div className={`text-3xl font-bold ${getScoreColor(item.score)} mb-2`}>
              {item.score}%
            </div>
            <h4 className="text-white font-semibold mb-1">{item.title}</h4>
            <p className="text-blue-200 text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Missing Skills */}
      {analysis.missingSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-red-600/10 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-400" />
            Missing Skills ({analysis.missingSkills.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {analysis.missingSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 text-center"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <XCircle className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <span className="text-red-200 text-sm font-medium">{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-blue-600/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          Recommendations for Improvement
        </h3>
        <div className="space-y-4">
          {analysis.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className={`p-4 rounded-xl border ${
                rec.priority === 'high' ? 'bg-red-600/10 border-red-400/30' :
                rec.priority === 'medium' ? 'bg-yellow-600/10 border-yellow-400/30' :
                'bg-green-600/10 border-green-400/30'
              }`}
              whileHover={{ backgroundColor: 
                rec.priority === 'high' ? 'rgba(239, 68, 68, 0.15)' :
                rec.priority === 'medium' ? 'rgba(245, 158, 11, 0.15)' :
                'rgba(16, 185, 129, 0.15)'
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  rec.priority === 'high' ? 'bg-red-400' :
                  rec.priority === 'medium' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`} />
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-2">{rec.title}</h4>
                  <p className="text-blue-200 text-sm mb-3">{rec.description}</p>
                  <ul className="space-y-1">
                    {rec.actionItems.map((item, i) => (
                      <li key={i} className="text-blue-300 text-sm flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-blue-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MatchAnalysis;