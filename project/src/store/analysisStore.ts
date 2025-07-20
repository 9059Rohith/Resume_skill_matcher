import { create } from 'zustand';
import { AnalysisState } from '../types';

export const useAnalysisStore = create<AnalysisState>((set) => ({
  resume: null,
  jobDescription: null,
  matchAnalysis: null,
  jobRecommendations: [],
  isAnalyzing: false,
  progress: 0,
  currentStep: '',

  setResume: (resume) => set({ resume }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setMatchAnalysis: (matchAnalysis) => set({ matchAnalysis }),
  setJobRecommendations: (jobRecommendations) => set({ jobRecommendations }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setProgress: (progress) => set({ progress }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  
  reset: () => set({
    resume: null,
    jobDescription: null,
    matchAnalysis: null,
    jobRecommendations: [],
    isAnalyzing: false,
    progress: 0,
    currentStep: ''
  })
}));