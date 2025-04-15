import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { SymbolData } from '../data/symbols';

// Register ABeeZee font for PDF generation
Font.register({
  family: 'ABeeZee',
  src: 'https://fonts.gstatic.com/s/abeezee/v22/esDR31xSG-6AGleN2tWkkJUEGpA.ttf',
  fontWeight: 'normal',
});

// Create styles
// NOTE: react-pdf uses Yoga layout engine (similar to Flexbox)
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    position: 'relative',
    fontFamily: 'ABeeZee',
  },
  // Complete redesign - no flexbox
  gridContainer: {
    position: 'relative',
    width: '90%',
    height: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  // No row style - we'll position cells absolutely
  gridCell: {
    position: 'absolute',
    height: 130,
    border: '1pt solid #eee',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  symbolImage: {
    maxWidth: '70%',
    maxHeight: '60%',
    objectFit: 'contain',
    marginBottom: 10,
  },
  symbolName: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'ABeeZee',
  },
  emptySlot: {
    position: 'absolute',
    height: 130,
    border: '1pt dashed #ddd',
    backgroundColor: '#fafafa',
  }
});

interface PdfDocumentProps {
  placedSymbols: (SymbolData | null)[];
  rows: number;
  cols: number;
}

const PAGE_WIDTH_PT = 595.28; // A4 width
const PAGE_PADDING_PT = 30;
const AVAILABLE_WIDTH_PT = PAGE_WIDTH_PT - (PAGE_PADDING_PT * 2); // ~535pt
const CELL_GAP_PT = 10; // Define the gap between cells in points

// Calculate width in points, accounting for gaps
const calculateCellWidth = (cols: number): number => {
  if (cols <= 0) return 0;
  const totalGapWidth = (cols - 1) * CELL_GAP_PT;
  const widthPerCell = (AVAILABLE_WIDTH_PT - totalGapWidth) / cols;
  return Math.max(widthPerCell, 0); // Ensure non-negative
};

const PdfDocument: React.FC<PdfDocumentProps> = ({ placedSymbols, rows, cols }) => {
  // FORCE 2 COLUMNS LAYOUT
  const forcedCols = 2;
  
  // Calculate exact cell dimensions with reduced available width
  const availableWidth = AVAILABLE_WIDTH_PT * 0.9; // Use 90% of available width
  const cellWidth = Math.floor(availableWidth / forcedCols);
  const cellHeight = 130;
  const cellGap = 10;
  const rowGap = 30; // Increased row gap to make separation clearer
  
  // Total width including gaps
  const totalWidth = forcedCols * cellWidth + (forcedCols - 1) * cellGap;
  
  // Calculate new row count based on forced 2-column layout
  const forcedRows = Math.ceil(placedSymbols.length / forcedCols);
  
  // Create a flattened data array with forced 2-column layout
  const cells: (SymbolData | null)[] = [];
  for (let r = 0; r < forcedRows; r++) {
    for (let c = 0; c < forcedCols; c++) {
      const index = r * forcedCols + c;
      cells.push(index < placedSymbols.length ? placedSymbols[index] : null);
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 8, marginBottom: 5 }}>
          FORCED 2-COLUMN LAYOUT: original cols={cols}, rows={rows} → forcedRows={forcedRows}
        </Text>
        
        <View style={styles.gridContainer}>
          {cells.map((symbol, index) => {
            const row = Math.floor(index / forcedCols);
            const col = index % forcedCols;
            
            // Calculate absolute position with larger row gap
            const left = col * (cellWidth + cellGap);
            const top = row * (cellHeight + rowGap) + 20; // Add 20pt for debug text
            
            const cellStyle = {
              ...styles[symbol ? 'gridCell' : 'emptySlot'],
              width: cellWidth,
              left,
              top,
            };
            
            return (
              <View key={`cell-${index}`} style={cellStyle}>
                {symbol && (
                  <>
                    <Image 
                      style={styles.symbolImage} 
                      src={window.location.origin + symbol.imagePath} 
                    />
                    <Text style={styles.symbolName}>{symbol.name}</Text>
                  </>
                )}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument; 