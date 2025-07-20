import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Mail, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAnalysisStore } from '../store/analysisStore';

const ExportResults: React.FC = () => {
  const { resume, matchAnalysis, jobDescription } = useAnalysisStore();
  const [isExporting, setIsExporting] = React.useState(false);

  const generatePDFReport = async () => {
    if (!resume || !matchAnalysis) return;

    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('Resume Analysis Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add candidate info
      pdf.setFontSize(12);
      let yPos = 40;
      pdf.text(`Candidate: ${resume.contactInfo.name || 'N/A'}`, 20, yPos);
      yPos += 10;
      pdf.text(`Email: ${resume.contactInfo.email || 'N/A'}`, 20, yPos);
      yPos += 10;
      pdf.text(`Experience Level: ${resume.experienceLevel}`, 20, yPos);
      yPos += 20;
      
      // Add job info if available
      if (jobDescription) {
        pdf.text(`Position: ${jobDescription.title} at ${jobDescription.company}`, 20, yPos);
        yPos += 20;
      }
      
      // Add match scores
      pdf.setFontSize(16);
      pdf.text('Match Analysis', 20, yPos);
      yPos += 15;
      
      pdf.setFontSize(12);
      pdf.text(`Overall Match: ${matchAnalysis.overallMatch}%`, 20, yPos);
      yPos += 10;
      pdf.text(`Skills Match: ${matchAnalysis.skillsMatch}%`, 20, yPos);
      yPos += 10;
      pdf.text(`Experience Match: ${matchAnalysis.experienceMatch}%`, 20, yPos);
      yPos += 10;
      pdf.text(`Education Match: ${matchAnalysis.educationMatch}%`, 20, yPos);
      yPos += 10;
      pdf.text(`ATS Score: ${matchAnalysis.atsScore}%`, 20, yPos);
      yPos += 20;
      
      // Add skills
      pdf.setFontSize(16);
      pdf.text('Identified Skills', 20, yPos);
      yPos += 15;
      
      pdf.setFontSize(10);
      const skillsText = resume.skills.map(skill => skill.name).join(', ');
      const splitSkills = pdf.splitTextToSize(skillsText, pageWidth - 40);
      pdf.text(splitSkills, 20, yPos);
      yPos += splitSkills.length * 5 + 20;
      
      // Add missing skills if any
      if (matchAnalysis.missingSkills.length > 0) {
        pdf.setFontSize(16);
        pdf.text('Missing Skills', 20, yPos);
        yPos += 15;
        
        pdf.setFontSize(10);
        const missingSkillsText = matchAnalysis.missingSkills.join(', ');
        const splitMissingSkills = pdf.splitTextToSize(missingSkillsText, pageWidth - 40);
        pdf.text(splitMissingSkills, 20, yPos);
      }
      
      pdf.save(`resume-analysis-${resume.contactInfo.name || 'report'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('analysis-results');
      if (element) {
        const canvas = await html2canvas(element);
        const link = document.createElement('a');
        link.download = `resume-analysis-${resume?.contactInfo.name || 'report'}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const shareResults = async () => {
    if (navigator.share && resume && matchAnalysis) {
      try {
        await navigator.share({
          title: 'Resume Analysis Results',
          text: `My resume analysis shows a ${matchAnalysis.overallMatch}% match with skills in ${resume.skills.slice(0, 3).map(s => s.name).join(', ')}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const sendByEmail = () => {
    if (resume && matchAnalysis) {
      const subject = `Resume Analysis Results - ${resume.contactInfo.name}`;
      const body = `Hi,

I've completed my resume analysis with the following results:

Overall Match: ${matchAnalysis.overallMatch}%
Skills Match: ${matchAnalysis.skillsMatch}%
Experience Match: ${matchAnalysis.experienceMatch}%
ATS Score: ${matchAnalysis.atsScore}%

Top Skills: ${resume.skills.slice(0, 5).map(s => s.name).join(', ')}

You can view the full analysis at: ${window.location.href}

Best regards,
${resume.contactInfo.name}`;

      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  if (!resume || !matchAnalysis) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
    >
      <motion.h3 
        className="text-xl font-semibold text-white mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Export & Share Results
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PDF Export */}
        <motion.button
          onClick={generatePDFReport}
          disabled={isExporting}
          className="flex flex-col items-center gap-3 p-4 bg-red-600/20 border border-red-400/30 rounded-xl text-white hover:bg-red-600/30 transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FileText className="w-8 h-8 text-red-400" />
          <span className="font-medium">PDF Report</span>
          <span className="text-sm text-red-200">Detailed analysis</span>
        </motion.button>

        {/* Image Export */}
        <motion.button
          onClick={exportAsImage}
          disabled={isExporting}
          className="flex flex-col items-center gap-3 p-4 bg-blue-600/20 border border-blue-400/30 rounded-xl text-white hover:bg-blue-600/30 transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Download className="w-8 h-8 text-blue-400" />
          <span className="font-medium">Save Image</span>
          <span className="text-sm text-blue-200">PNG format</span>
        </motion.button>

        {/* Email */}
        <motion.button
          onClick={sendByEmail}
          className="flex flex-col items-center gap-3 p-4 bg-green-600/20 border border-green-400/30 rounded-xl text-white hover:bg-green-600/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Mail className="w-8 h-8 text-green-400" />
          <span className="font-medium">Email Results</span>
          <span className="text-sm text-green-200">Share via email</span>
        </motion.button>

        {/* Share */}
        <motion.button
          onClick={shareResults}
          className="flex flex-col items-center gap-3 p-4 bg-purple-600/20 border border-purple-400/30 rounded-xl text-white hover:bg-purple-600/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Share2 className="w-8 h-8 text-purple-400" />
          <span className="font-medium">Share</span>
          <span className="text-sm text-purple-200">Native sharing</span>
        </motion.button>
      </div>

      {isExporting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center"
        >
          <div className="inline-flex items-center gap-2 text-blue-300">
            <motion.div
              className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Generating export...
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExportResults;