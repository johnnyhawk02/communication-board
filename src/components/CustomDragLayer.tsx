import React, { useEffect } from 'react';
import { useDragLayer } from 'react-dnd';
import { ItemTypes } from './SymbolLibrary';
import { SymbolData } from '../data/symbols';
import styles from './CustomDragLayer.module.css';

interface DraggedItem extends SymbolData {
  index?: number;
}

const CustomDragLayer: React.FC = () => {
  const {
    itemType,
    isDragging,
    item,
    clientOffset, // Use clientOffset for cursor position
  } = useDragLayer((monitor) => ({
    item: monitor.getItem() as DraggedItem | null,
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(), // Get the cursor position
  }));

  // Log the offset when dragging
  useEffect(() => {
    if (isDragging && clientOffset) {
      console.log('Drag Offset:', clientOffset);
    }
  }, [isDragging, clientOffset]);

  function renderPreview() {
    if (!item) {
      return null;
    }

    switch (itemType) {
      case ItemTypes.SYMBOL:
      case ItemTypes.PLACED_SYMBOL:
        return (
          <div className={styles.dragPreview}>
            <img src={item.imagePath} alt={item.name} />
          </div>
        );
      default:
        return null;
    }
  }

  // Use clientOffset
  if (!isDragging || !clientOffset) {
    return null;
  }

  const layerStyles: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  };

  // Calculate the adjusted X coordinate
  const adjustedX = clientOffset.x - (window.innerWidth / 2);
  // Adjust Y coordinate to center preview vertically on cursor
  const adjustedY = clientOffset.y - 35; // SUBTRACT half the preview height

  // Use adjusted coordinates for the transform
  const transform = `translate(${adjustedX}px, ${adjustedY}px)`;

  return (
    <div style={layerStyles}>
      <div style={{ transform, WebkitTransform: transform }}>
        {renderPreview()}
      </div>
    </div>
  );
};

export default CustomDragLayer; 