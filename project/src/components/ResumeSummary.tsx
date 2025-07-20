import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Calendar, Award } from 'lucide-react';
import { Resume } from '../types';

interface ResumeSummaryProps {
  resume: Resume;
}

const ResumeSummary: React.FC<ResumeSummaryProps> = ({ resume }) => {
  const { contactInfo, summary, experience, education, skills, experienceLevel } = resume;

  const totalExperience = experience.reduce((sum, exp) => sum + exp.duration, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.25)' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <motion.h2 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {contactInfo.name || 'Resume Analysis'}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-blue-200">
              {contactInfo.email && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{contactInfo.email}</span>
                </motion.div>
              )}
              
              {contactInfo.phone && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{contactInfo.phone}</span>
                </motion.div>
              )}
              
              {contactInfo.location && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{contactInfo.location}</span>
                </motion.div>
              )}
              
              {contactInfo.linkedin && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn Profile</span>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end space-y-4">
            <motion.div 
              className="text-center lg:text-right"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-2xl font-bold text-white">{experienceLevel}</div>
              <div className="text-blue-200 text-sm">Experience Level</div>
            </motion.div>
            
            <motion.div 
              className="text-center lg:text-right"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-xl font-semibold text-blue-300">{totalExperience} Years</div>
              <div className="text-blue-200 text-sm">Total Experience</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div 
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" />
          Professional Summary
        </h3>
        <p className="text-blue-100 leading-relaxed">{summary}</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="text-3xl font-bold text-blue-300 mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            {skills.length}
          </motion.div>
          <div className="text-blue-200 text-sm">Skills Identified</div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="text-3xl font-bold text-purple-300 mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            {experience.length}
          </motion.div>
          <div className="text-purple-200 text-sm">Work Experiences</div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="text-3xl font-bold text-green-300 mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            {education.length}
          </motion.div>
          <div className="text-green-200 text-sm">Education Records</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResumeSummary;