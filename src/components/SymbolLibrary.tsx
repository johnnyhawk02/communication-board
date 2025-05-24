import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { SymbolData, getAllTags } from '../data/symbols';
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
      title={`${symbol.name}\nTags: ${symbol.tags.join(', ')}`}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);

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

  // Get available tags from current symbols
  const availableTags = getAllTags(availableSymbols);

  // Filter symbols based on search term and selected tags
  const filteredSymbols = availableSymbols.filter(symbol => {
    // Check search term
    const matchesSearch = symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         symbol.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Check selected tags (if any tags are selected, symbol must have at least one of them)
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(selectedTag => symbol.tags.includes(selectedTag));
    
    return matchesSearch && matchesTags;
  });

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Toggle tag filter
  const toggleTagFilter = () => {
    setShowTagFilter(!showTagFilter);
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all selected tags
  const clearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className={styles.libraryContainer}>
      <h2>Symbol Library</h2>
      
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search symbols or tags..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className={styles.clearButton}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Tag Filter Section */}
      <div className={styles.tagSection}>
        <div className={styles.tagHeader}>
          <button 
            onClick={toggleTagFilter}
            className={styles.tagToggleButton}
          >
            🏷️ Filter by Tags {showTagFilter ? '▼' : '▶'}
          </button>
          {selectedTags.length > 0 && (
            <button 
              onClick={clearTags}
              className={styles.clearTagsButton}
              title="Clear all tags"
            >
              Clear ({selectedTags.length})
            </button>
          )}
        </div>
        
        {showTagFilter && (
          <div className={styles.tagContainer}>
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`${styles.tagButton} ${
                  selectedTags.includes(tag) ? styles.tagButtonSelected : ''
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
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
          {filteredSymbols.length > 0 ? (
            filteredSymbols.map((symbol) => (
              <DraggableSymbol key={symbol.id} symbol={symbol} />
            ))
          ) : (
            <p>
              {searchTerm || selectedTags.length > 0
                ? `No symbols found${searchTerm ? ` for "${searchTerm}"` : ''}${
                    selectedTags.length > 0 ? ` with tags: ${selectedTags.join(', ')}` : ''
                  }`
                : "No symbols found. Try refreshing the page."
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SymbolLibrary; 