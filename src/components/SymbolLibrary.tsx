import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { SymbolData } from '../data/symbols';
import { useBoardStore } from '../store/useBoardStore';
import styles from './SymbolLibrary.module.css';

// Define the item type for drag and drop
export const ItemTypes = {
  SYMBOL: 'symbol',
  PLACED_SYMBOL: 'placed_symbol', // New type for symbols dragged from the grid
};

interface DraggableSymbolProps {
  symbol: SymbolData;
}

// Draggable symbol component
const DraggableSymbol: React.FC<DraggableSymbolProps> = ({ symbol }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.SYMBOL,
    item: symbol,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Use empty preview for custom drag layer
  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  // Preview while dragging
  const dragRef = drag as unknown as React.Ref<HTMLDivElement>;

  return (
    <div
      ref={dragRef}
      className={styles.symbolItem}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img 
        src={symbol.imagePath} 
        alt={symbol.name} 
        className={styles.symbolImage}
      />
      <span className={styles.symbolName}>{symbol.name}</span>
    </div>
  );
};

// Updated SymbolLibrary component
const SymbolLibrary: React.FC = () => {
  const availableSymbols = useBoardStore((state) => state.availableSymbols);
  const loadSymbolsFromAssets = useBoardStore((state) => state.loadSymbolsFromAssets);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load symbols when component mounts
  useEffect(() => {
    const loadSymbols = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadSymbolsFromAssets();
      } catch (err) {
        setError('Failed to load symbols. Using fallback list.');
        console.error('Error loading symbols:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSymbols();
  }, [loadSymbolsFromAssets]);

  return (
    <div className={styles.libraryContainer}>
      <h2>Symbol Library</h2>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>Loading symbols...</p>
        </div>
      ) : (
        <div className={styles.symbolGrid}>
          {availableSymbols.length > 0 ? (
            availableSymbols.map((symbol) => (
              <DraggableSymbol key={symbol.id} symbol={symbol} />
            ))
          ) : (
            <p>No symbols found. Try refreshing the page.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SymbolLibrary; 