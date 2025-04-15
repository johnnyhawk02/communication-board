import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { SymbolData } from '../data/symbols';
import { ItemTypes } from './SymbolLibrary';
import styles from './PlacedSymbol.module.css';

interface PlacedSymbolProps {
  symbol: SymbolData;
  index: number;
}

const PlacedSymbol: React.FC<PlacedSymbolProps> = ({ symbol, index }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.PLACED_SYMBOL,
    item: { ...symbol, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  const dragRef = drag as unknown as React.Ref<HTMLDivElement>;

  return (
    <div
      ref={dragRef}
      className={styles.placedSymbol}
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

export default PlacedSymbol; 