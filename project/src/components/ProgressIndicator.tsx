import React from 'react';
import { motion } from 'framer-motion';
import { useAnalysisStore } from '../store/analysisStore';

const ProgressIndicator: React.FC = () => {
  const { isAnalyzing, progress, currentStep } = useAnalysisStore();

  if (!isAnalyzing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 min-w-72"
    >
      <div className="text-white text-lg font-semibold mb-3">
        {currentStep}
      </div>
      
      <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: [-80, 300] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="text-blue-200 text-sm mt-2">
        {progress}% complete
      </div>
    </motion.div>
  );
};

export default ProgressIndicator;