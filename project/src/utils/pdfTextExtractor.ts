import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  metadata: any;
  success: boolean;
  error?: string;
}

export const extractTextFromPDF = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<PDFExtractionResult> => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('File must be a PDF');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB');
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    
    loadingTask.onProgress = (progress) => {
      if (onProgress) {
        onProgress(Math.floor((progress.loaded / progress.total) * 50)); // 50% for loading
      }
    };

    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    let fullText = '';

    // Extract text from each page
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
      
      if (onProgress) {
        const progressPercent = 50 + Math.floor((pageNumber / pageCount) * 50);
        onProgress(progressPercent);
      }
    }

    // Get metadata
    const metadata = await pdf.getMetadata();

    return {
      text: fullText.trim(),
      pageCount,
      metadata: metadata.info,
      success: true
    };

  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      text: '',
      pageCount: 0,
      metadata: {},
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const validatePDFFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'File must be a PDF' };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File appears to be empty' };
  }

  return { valid: true };
};