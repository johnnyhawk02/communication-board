import React from 'react';
import { useDrop } from 'react-dnd';
import { useBoardStore } from '../store/useBoardStore';
import PlacedSymbol from './PlacedSymbol';
import { ItemTypes } from './SymbolLibrary';
import { SymbolData } from '../data/symbols';
import styles from './A4Preview.module.css';

// Component for a single grid cell, making it a drop target
interface GridCellProps {
  symbol: SymbolData | null;
  index: number;
  style?: React.CSSProperties;
}

// Extend the dragged item type to include index for placed symbols
interface DraggedItem extends SymbolData {
  index?: number; // Original index if dragged from grid
}

const GridCell: React.FC<GridCellProps> = ({ symbol, index, style }) => {
  const placeSymbolAt = useBoardStore((state) => state.placeSymbolAt);
  const moveSymbol = useBoardStore((state) => state.moveSymbol); // Get move action

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    // Accept both types of symbols
    accept: [ItemTypes.SYMBOL, ItemTypes.PLACED_SYMBOL],
    drop: (item: DraggedItem, monitor) => {
      const didDrop = monitor.didDrop(); // Prevent multiple drops in nested targets
      if (didDrop) {
        return;
      }

      const itemType = monitor.getItemType();

      if (itemType === ItemTypes.SYMBOL) {
        // If dropped from library, place it
        placeSymbolAt(item, index);
      } else if (itemType === ItemTypes.PLACED_SYMBOL && item.index !== undefined) {
        // If dropped from grid, move/swap it
        moveSymbol(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [index, placeSymbolAt, moveSymbol]); // Add dependencies

  // Style the cell based on hover state
  const backgroundColor = canDrop ? (isOver ? 'lightblue' : 'lightgrey') : 'transparent'; // Use transparent default
  // Cast the drop ref
  const dropRef = drop as unknown as React.Ref<HTMLDivElement>;

  return (
    <div
      ref={dropRef}
      key={index}
      className={styles.gridCell}
      style={{ backgroundColor, ...style }}
    >
      {symbol ? (
        <PlacedSymbol symbol={symbol} index={index} />
      ) : (
        <div className={styles.emptySlot}></div> // Keep empty slot visible
      )}
    </div>
  );
};

// Main A4Preview component
const A4Preview: React.FC = () => {
  const placedSymbols = useBoardStore((state) => state.placedSymbols);
  const rows = useBoardStore((state) => state.rows);
  const cols = useBoardStore((state) => state.cols);

  console.log('A4Preview State:', { placedSymbols, rows, cols });

  // Calculate cell size based on columns to ensure they fit properly
  // Reduced maximum width from 130 to 110 to make symbols smaller
  const calculatedCellWidth = Math.min(
    110, // Maximum width (reduced from 130)
    Math.floor((100 / cols) * 6.0) // Dynamic size with reduced adjustment factor
  );
  
  // Apply 7:8 ratio (width:height)
  const calculatedCellHeight = Math.floor(calculatedCellWidth * (8/7));

  console.log('A4Preview Calc:', { calculatedCellWidth, calculatedCellHeight });

  // Dynamic grid styles based on store state and calculated size
  const gridStyles: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, ${calculatedCellWidth}px)`,
    gridTemplateRows: `repeat(${rows}, ${calculatedCellHeight}px)`, // Height is 8/7 of width
    // Scale the gap proportionally to cell size 
    gap: calculatedCellWidth < 110 ? '10px' : '15px'
    // Removed top margin to let container's align-content handle centering
  };

  return (
    <div className={styles.a4Container}>
      <div className={styles.a4Preview}>
        {/* Apply dynamic styles to gridContainer */}
        <div className={styles.gridContainer} style={gridStyles}>
          {/* Map symbols to GridCell components */}
          {placedSymbols.map((symbol, index) => {
            console.log(`Mapping symbol at index ${index}:`, symbol);
            return (
              <GridCell 
                key={index} 
                symbol={symbol} 
                index={index} 
                style={{ 
                  width: `${calculatedCellWidth}px`, 
                  height: `${calculatedCellHeight}px` 
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default A4Preview; 