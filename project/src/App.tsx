import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysisStore } from './store/analysisStore';
import BackgroundEffects from './components/BackgroundEffects';
import PDFUploader from './components/PDFUploader';
import ProgressIndicator from './components/ProgressIndicator';
import ResumeSummary from './components/ResumeSummary';
import JobDescriptionInput from './components/JobDescriptionInput';
import SkillsVisualization from './components/SkillsVisualization';
import MatchAnalysis from './components/MatchAnalysis';
import JobRecommendations from './components/JobRecommendations';
import ExportResults from './components/ExportResults';
import { FileText, BarChart3, Target, Briefcase, Download, RotateCcw } from 'lucide-react';

function App() {
  const { 
    resume, 
    jobDescription, 
    matchAnalysis, 
    jobRecommendations, 
    isAnalyzing, 
    reset 
  } = useAnalysisStore();

  const [currentView, setCurrentView] = React.useState<'upload' | 'summary' | 'skills' | 'job-input' | 'analysis' | 'jobs'>('upload');

  // Auto-navigate based on analysis state
  React.useEffect(() => {
    if (resume && !isAnalyzing) {
      if (currentView === 'upload') {
        setCurrentView('summary');
      }
    }
  }, [resume, isAnalyzing, currentView]);

  const navigationItems = [
    { id: 'upload', label: 'Upload', icon: FileText, available: true },
    { id: 'summary', label: 'Summary', icon: FileText, available: !!resume },
    { id: 'skills', label: 'Skills', icon: BarChart3, available: !!resume },
    { id: 'job-input', label: 'Job Match', icon: Target, available: !!resume },
    { id: 'analysis', label: 'Analysis', icon: Target, available: !!matchAnalysis },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, available: !!resume },
  ];

  const handleReset = () => {
    reset();
    setCurrentView('upload');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'upload':
        return <PDFUploader />;
      case 'summary':
        return resume ? <ResumeSummary resume={resume} /> : <PDFUploader />;
      case 'skills':
        return resume ? <SkillsVisualization skills={resume.skills} /> : <PDFUploader />;
      case 'job-input':
        return <JobDescriptionInput />;
      case 'analysis':
        return matchAnalysis && jobDescription ? (
          <MatchAnalysis analysis={matchAnalysis} jobDescription={jobDescription} />
        ) : <JobDescriptionInput />;
      case 'jobs':
        return jobRecommendations.length > 0 ? (
          <JobRecommendations recommendations={jobRecommendations} />
        ) : <JobDescriptionInput />;
      default:
        return <PDFUploader />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundEffects />
      <ProgressIndicator />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Resume Analyzer</h1>
          </motion.div>
          
          {resume && (
            <motion.button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-4 h-4" />
              New Analysis
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* Navigation */}
      {resume && (
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 px-6 mb-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => item.available && setCurrentView(item.id as any)}
                  disabled={!item.available}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                    ${currentView === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : item.available
                      ? 'text-blue-200 hover:text-white hover:bg-white/10'
                      : 'text-gray-500 cursor-not-allowed opacity-50'
                    }
                  `}
                  whileHover={item.available ? { scale: 1.05 } : {}}
                  whileTap={item.available ? { scale: 0.95 } : {}}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.nav>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div id="analysis-results">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {renderCurrentView()}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Export Section */}
          {(matchAnalysis || resume) && currentView !== 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <ExportResults />
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 text-center py-8 px-6 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-200 text-sm">
            © 2025 Resume Analyzer. Powered by AI for professional resume analysis and job matching.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;