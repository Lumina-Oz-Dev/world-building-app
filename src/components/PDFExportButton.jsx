import React, { useState } from 'react';

/**
 * PDFExportButton Component
 * Provides PDF export functionality for generated world data
 * @param {Object} worldData - Complete world data object to export
 * @param {string} className - Additional CSS classes for styling
 */
const PDFExportButton = ({ worldData, className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  /**
   * Handle PDF export process with fallback
   */
  const handleExportPDF = async () => {
    if (!worldData) {
      setExportStatus({ type: 'error', message: 'No world data to export' });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      // Try to use the full PDF exporter first
      try {
        const { default: WorldPDFExporter } = await import('../utils/pdfExporter');
        const exporter = new WorldPDFExporter();
        const filename = await exporter.exportWorldToPDF(worldData);
        
        setExportStatus({ 
          type: 'success', 
          message: `PDF exported successfully as "${filename}"` 
        });
      } catch (pdfError) {
        console.warn('PDF export failed, using text fallback:', pdfError);
        
        // Fallback to simple text export
        const { default: SimplePDFExporter } = await import('../utils/simplePdfExporter');
        const exporter = new SimplePDFExporter();
        const filename = await exporter.exportWorldAsText(worldData);
        
        setExportStatus({ 
          type: 'success', 
          message: `World exported as text file: "${filename}"` 
        });
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setExportStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus({ 
        type: 'error', 
        message: 'Failed to export. Please try again.' 
      });
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setExportStatus(null);
      }, 5000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Export Button */}
      <button
        onClick={handleExportPDF}
        disabled={isExporting || !worldData}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm font-mono
          transition-all duration-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isExporting || !worldData
            ? 'cursor-not-allowed opacity-50 bg-white/10 text-white/50'
            : 'text-white bg-white/10 hover:bg-white/20 focus:ring-white/50 backdrop-blur-sm'
          }
        `}
      >
        {/* PDF Icon */}
        <svg 
          className={`w-5 h-5 ${isExporting ? 'animate-spin' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isExporting ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          )}
        </svg>
        
        {/* Button Text */}
        <span>
          {isExporting ? 'Generating PDF...' : 'Export as PDF'}
        </span>
      </button>

      {/* Status Messages */}
      {exportStatus && (
        <div className={`
          max-w-md p-2 rounded-lg text-xs font-mono text-center
          ${exportStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
          }
        `}>
          <div className="flex items-center justify-center space-x-1">
            {exportStatus.type === 'success' ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{exportStatus.message}</span>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!exportStatus && (
        <p className="text-xs text-white/70 font-mono text-center max-w-sm">
          Export as PDF
        </p>
      )}
    </div>
  );
};

export default PDFExportButton;