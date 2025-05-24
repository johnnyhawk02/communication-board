import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { SymbolData } from '../data/symbols';
import { ItemTypes } from './SymbolLibrary';
import styles from './PlacedSymbol.module.css';
import { useBoardStore } from '../store/useBoardStore';

interface PlacedSymbolProps {
  symbol: SymbolData;
  index: number;
}

const PlacedSymbol: React.FC<PlacedSymbolProps> = ({ symbol, index }) => {
  const removeSymbol = useBoardStore((state) => state.removeSymbol);
  const fontSize = useBoardStore((state) => state.fontSize);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.PLACED_SYMBOL,
    item: { ...symbol, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        // If dropped outside a valid target (like the grid), consider removing
        // You might want a trash can area instead of auto-remove
        // removeSymbol(item.index);
      }
    }
  }), [symbol, index]);

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  const handleDoubleClick = () => {
    removeSymbol(index);
  };

  const dragRef = drag as unknown as React.Ref<HTMLDivElement>;

  return (
    <div
      ref={dragRef}
      className={styles.placedSymbol}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={symbol.imagePath}
        alt={symbol.name}
        className={styles.symbolImage}
      />
      <div className={styles.symbolName} style={{ fontSize: `${fontSize}em` }}>
        {symbol.name.replace(/\s*\d+$/, '')}
      </div>
    </div>
  );
};

export default PlacedSymbol; 