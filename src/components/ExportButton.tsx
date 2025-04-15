import React, { useState, RefObject } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import html2canvas from 'html2canvas';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ previewRef }) => {
  // Use the hook selector to subscribe to changes
  const placedSymbols = useBoardStore((state) => state.placedSymbols);
  // Calculate hasPlacedSymbols based on the subscribed state
  const hasPlacedSymbols = placedSymbols.some(symbol => symbol !== null);

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  // Direct screenshot of the A4Preview in the DOM using ref
  const capturePreview = async () => {
    if (isExporting) return; // Prevent multiple clicks
    
    setIsExporting(true);
    setExportStatus('Starting export...');
    
    try {
      // Check if ref exists and is connected to DOM
      if (!previewRef.current) {
        setExportStatus('Error: Preview ref is not connected');
        console.error('Preview ref is not connected');
        alert('Could not find preview element to export. Please try again.');
        setIsExporting(false);
        return;
      }
      
      // Get the right element - either ref directly or find A4Preview child
      const targetElement = previewRef.current.querySelector('[class*="a4Preview"]') || previewRef.current;
      setExportStatus('Found preview element');
      
      // Pre-load all images before capturing
      const images = Array.from(targetElement.querySelectorAll('img'));
      setExportStatus(`Loading ${images.length} images...`);
      
      // Wait a bit to ensure CSS is fully applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create a high-quality screenshot
      setExportStatus('Creating very high-resolution canvas...');
      const canvas = await html2canvas(targetElement as HTMLElement, {
        scale: 16, // Ultra high quality
        backgroundColor: 'white',
        logging: true,
        allowTaint: true,
        useCORS: true,
        onclone: (clonedDoc) => {
          // We can manipulate the cloned document before rendering
          const clonedTarget = clonedDoc.querySelector('#a4-preview-container') as HTMLElement;
          if (clonedTarget) {
            clonedTarget.style.margin = '0';
            clonedTarget.style.padding = '0';
          }
        }
      });
      
      // Convert to PNG and download
      setExportStatus('Generating ultra high-resolution PNG...');
      const dataUrl = canvas.toDataURL('image/png');
      
      // Get canvas dimensions for filename
      const width = canvas.width;
      const height = canvas.height;
      
      setExportStatus(`Creating download link (${width}x${height})...`);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `communication-board-${width}x${height}.png`;
      document.body.appendChild(link);
      
      setExportStatus('Downloading high-res PNG...');
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setExportStatus('Download complete!');
      
      // Reset state
      setTimeout(() => {
        setIsExporting(false);
        setExportStatus('');
      }, 1000);
    } catch (error) {
      console.error("Error capturing PNG:", error);
      setExportStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
      alert('Error exporting: ' + (error instanceof Error ? error.message : String(error)));
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.exportButtonContainer}>
      <button
        className={styles.exportButton}
        onClick={capturePreview}
        disabled={!hasPlacedSymbols || isExporting}
        title={!hasPlacedSymbols ? "Add symbols to the board first" : undefined}
      >
        {isExporting ? 'Exporting...' : 'Export PNG'}
      </button>
      {exportStatus && <div className={styles.exportStatus}>{exportStatus}</div>}
    </div>
  );
};

export default ExportButton; 