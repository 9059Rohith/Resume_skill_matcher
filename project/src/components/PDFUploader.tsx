import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { extractTextFromPDF, validatePDFFile } from '../utils/pdfTextExtractor';
import { NLPProcessor } from '../utils/nlpProcessor';
import { useAnalysisStore } from '../store/analysisStore';

const PDFUploader: React.FC = () => {
  const { setResume, setAnalyzing, setProgress, setCurrentStep } = useAnalysisStore();
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validation = validatePDFFile(file);

    if (!validation.valid) {
      setUploadStatus('error');
      setErrorMessage(validation.error || 'Invalid file');
      return;
    }

    setUploadStatus('uploading');
    setAnalyzing(true);
    setProgress(0);
    setCurrentStep('Extracting text from PDF...');

    try {
      // Extract text from PDF
      const extractionResult = await extractTextFromPDF(file, (progress) => {
        setProgress(progress);
      });

      if (!extractionResult.success) {
        throw new Error(extractionResult.error || 'Failed to extract text from PDF');
      }

      setCurrentStep('Analyzing resume content...');
      setProgress(70);

      // Process extracted text
      const contactInfo = NLPProcessor.extractContactInfo(extractionResult.text);
      const experience = NLPProcessor.extractExperience(extractionResult.text);
      const education = NLPProcessor.extractEducation(extractionResult.text);
      const skills = NLPProcessor.extractSkills(extractionResult.text);
      const summary = NLPProcessor.generateSummary(extractionResult.text, skills, experience);
      const experienceLevel = NLPProcessor.determineExperienceLevel(experience);

      setCurrentStep('Finalizing analysis...');
      setProgress(90);

      const resume = {
        id: Date.now().toString(),
        fileName: file.name,
        extractedText: extractionResult.text,
        contactInfo,
        experience,
        education,
        skills,
        summary,
        experienceLevel,
        overallScore: Math.round((skills.length * 2 + experience.length * 10 + education.length * 5) / 2)
      };

      setResume(resume);
      setProgress(100);
      setUploadStatus('success');
      setCurrentStep('Analysis complete!');

      setTimeout(() => {
        setAnalyzing(false);
      }, 1000);

    } catch (error) {
      console.error('PDF processing error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process PDF');
      setAnalyzing(false);
    }
  }, [setResume, setAnalyzing, setProgress, setCurrentStep]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Resume Analyzer
        </motion.h1>
        <motion.p 
          className="text-xl text-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Upload your PDF resume for AI-powered analysis and job matching
        </motion.p>
      </div>

      <motion.div
        {...getRootProps()}
        className={`
          relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 backdrop-blur-sm
          ${isDragActive 
            ? 'border-blue-400 bg-blue-500/20 scale-105' 
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-500/20'
            : uploadStatus === 'error'
            ? 'border-red-400 bg-red-500/20'
            : 'border-blue-300 bg-white/10 hover:bg-white/20 hover:border-blue-400'
          }
        `}
        whileHover={{ scale: uploadStatus === 'uploading' ? 1 : 1.02 }}
        whileTap={{ scale: uploadStatus === 'uploading' ? 1 : 0.98 }}
      >
        <input {...getInputProps()} />
        
        {/* Upload Icon */}
        <motion.div 
          className="mb-6"
          animate={uploadStatus === 'uploading' ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: uploadStatus === 'uploading' ? Infinity : 0 }}
        >
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          ) : uploadStatus === 'uploading' ? (
            <FileText className="w-16 h-16 text-blue-400 mx-auto" />
          ) : (
            <Upload className="w-16 h-16 text-blue-300 mx-auto" />
          )}
        </motion.div>

        {/* Status Text */}
        <div className="space-y-2">
          {uploadStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-2xl font-semibold text-green-400">Upload Successful!</h3>
              <p className="text-green-200">Your resume has been analyzed successfully</p>
            </motion.div>
          ) : uploadStatus === 'error' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-2xl font-semibold text-red-400">Upload Failed</h3>
              <p className="text-red-200">{errorMessage}</p>
            </motion.div>
          ) : uploadStatus === 'uploading' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-2xl font-semibold text-blue-400">Processing...</h3>
              <p className="text-blue-200">Analyzing your resume content</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-2xl font-semibold text-white">
                {isDragActive ? 'Drop your PDF here' : 'Upload your PDF resume'}
              </h3>
              <p className="text-blue-200 mt-2">
                Drag and drop your resume, or click to browse
              </p>
              <p className="text-sm text-blue-300 mt-4">
                Supports PDF files up to 10MB
              </p>
            </motion.div>
          )}
        </div>

        {/* Sparkle Effects */}
        {isDragActive && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Features List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { icon: '🔍', title: 'Smart Analysis', desc: 'AI-powered text extraction and skill detection' },
          { icon: '📊', title: 'Visual Insights', desc: 'Interactive charts and skill visualizations' },
          { icon: '💼', title: 'Job Matching', desc: 'Find perfect job opportunities based on your skills' }
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
            <p className="text-sm text-blue-200">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PDFUploader;