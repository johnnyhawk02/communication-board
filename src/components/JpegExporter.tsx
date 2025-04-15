import React, { useRef } from 'react';
import { SymbolData } from '../data/symbols';
import html2canvas from 'html2canvas';
import styles from './ExportButton.module.css';

interface JpegExporterProps {
  placedSymbols: (SymbolData | null)[];
  rows: number;
  cols: number;
  onExportComplete?: (dataUrl: string) => void;
}

// A4 dimensions in pixels at 96 DPI (standard screen resolution)
// A4 is 210mm × 297mm or 8.27in × 11.69in
const A4_WIDTH_PX = 794; // ~8.27in at 96 DPI
const A4_HEIGHT_PX = 1123; // ~11.69in at 96 DPI

// Match A4Preview styling - Removed CELL_WIDTH_PX and CELL_HEIGHT_PX as they are calculated dynamically now
const CELL_GAP_PX = 15; // Match the gap in A4Preview

const JpegExporter: React.FC<JpegExporterProps> = ({ 
  placedSymbols, 
  rows, 
  cols, 
  onExportComplete 
}) => {
  const exportRef = useRef<HTMLDivElement>(null);
  
  // Calculate cell size based on columns to ensure they fit properly
  const calculatedCellWidth = Math.min(
    110, // Maximum size (reduced from 130)
    Math.floor((A4_WIDTH_PX * 0.85 - (cols-1) * CELL_GAP_PX) / cols) // Dynamic size based on columns
  );
  
  // Apply 7:8 ratio (width:height)
  const calculatedCellHeight = Math.floor(calculatedCellWidth * (8/7));
  
  const handleExport = async () => {
    if (!exportRef.current) return;
    
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2, // Higher quality
        backgroundColor: 'white',
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      if (onExportComplete) {
        onExportComplete(dataUrl);
      } else {
        // Default behavior: download the image
        const link = document.createElement('a');
        link.download = 'communication-board.jpg';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Error exporting JPEG:', err);
    }
  };
  
  return (
    <div>
      <button 
        onClick={handleExport} 
        style={{ 
          marginBottom: '10px',
          padding: '8px 16px',
          fontFamily: 'ABeeZee, sans-serif',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Export Board as PNG
      </button>
      
      <div 
        ref={exportRef} 
        style={{ 
          width: `${A4_WIDTH_PX}px`, 
          height: `${A4_HEIGHT_PX}px`,
          backgroundColor: 'white',
          padding: '50px',
          position: 'relative',
          boxSizing: 'border-box',
          border: '1px solid #ccc',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          aspectRatio: '210/297',
          fontFamily: 'ABeeZee, sans-serif'
        }}
      >
        {/* Recreate the grid container from A4Preview */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${calculatedCellWidth}px)`,
          gridTemplateRows: `repeat(${rows}, ${calculatedCellHeight}px)`,
          gap: `${CELL_GAP_PX}px`,
          width: '85%',
          height: '85%',
          justifyContent: 'center',
          alignContent: 'center',
          margin: '0 auto',
          padding: '15px',
          boxSizing: 'border-box'
        }}>
          {/* Map each cell exactly like A4Preview */}
          {placedSymbols.map((symbol, index) => (
            <div 
              key={`cell-${index}`} 
              style={{
                width: `${calculatedCellWidth}px`,
                height: `${calculatedCellHeight}px`,
                border: '1px dashed #ddd',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                padding: '5px',
                overflow: 'hidden',
                backgroundColor: symbol ? 'white' : '#fafafa',
                fontFamily: 'ABeeZee, sans-serif'
              }}
            >
              {symbol && (
                <>
                  <img 
                    src={symbol.imagePath}
                    alt={symbol.name}
                    style={{
                      maxWidth: '75%',
                      maxHeight: '65%',
                      objectFit: 'contain',
                      marginBottom: '5px'
                    }}
                  />
                  <div style={{
                    fontSize: '12px', 
                    textAlign: 'center',
                    fontFamily: 'ABeeZee, sans-serif',
                    marginTop: '2px',
                    width: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {symbol.name}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JpegExporter; 