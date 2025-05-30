import { create } from 'zustand';
import { SymbolData, loadSymbols, fallbackSymbols } from '../data/symbols';

interface BoardState {
  availableSymbols: SymbolData[];
  placedSymbols: (SymbolData | null)[]; // Array representing the grid slots
  rows: number; // Add rows state
  cols: number; // Add cols state
  fontSize: number; // Font size state (in em units)
  addSymbolToBoard: (symbol: SymbolData) => void;
  placeSymbolAt: (symbol: SymbolData, index: number) => void;
  moveSymbol: (fromIndex: number, toIndex: number) => void; // Action for moving/swapping
  removeSymbol: (index: number) => void; // Action to remove a symbol
  setGridSize: (rows: number, cols: number) => void; // Action to change grid size
  setFontSize: (fontSize: number) => void; // Action to change font size
  loadSymbolsFromAssets: () => Promise<void>; // Action to load symbols
  // TODO: Add removeSymbolFromBoard if needed
}

const INITIAL_ROWS = 4;
const INITIAL_COLS = 3;
const INITIAL_FONT_SIZE = 0.9; // Default font size in em units

export const useBoardStore = create<BoardState>((set, get) => ({
  // Initialize with fallback symbols for immediate rendering
  availableSymbols: fallbackSymbols,
  rows: INITIAL_ROWS,
  cols: INITIAL_COLS,
  fontSize: INITIAL_FONT_SIZE,
  placedSymbols: Array(INITIAL_ROWS * INITIAL_COLS).fill(null),

  // Add a new symbol to the board
  addSymbolToBoard: (symbol) => {
    const currentPlacedSymbols = get().placedSymbols;
    const nextEmptyIndex = currentPlacedSymbols.findIndex(slot => slot === null);
    const boardSize = get().rows * get().cols;

    if (nextEmptyIndex !== -1) {
      const newPlacedSymbols = [...currentPlacedSymbols];
      newPlacedSymbols[nextEmptyIndex] = symbol;
      set({ placedSymbols: newPlacedSymbols });
    } else {
      console.warn(`Board is full (${boardSize} slots). Cannot add more symbols.`);
    }
  },

  // Place a symbol at a specific index
  placeSymbolAt: (symbol, index) => {
    const currentPlacedSymbols = get().placedSymbols;
    if (index >= 0 && index < currentPlacedSymbols.length) {
      const newPlacedSymbols = [...currentPlacedSymbols];
      newPlacedSymbols[index] = symbol; // Place symbol at the specific index
      set({ placedSymbols: newPlacedSymbols });
    } else {
      console.warn(`Invalid index (${index}) for placing symbol.`);
    }
  },

  // Move/swap symbols between two grid positions
  moveSymbol: (fromIndex, toIndex) => {
    const currentPlacedSymbols = get().placedSymbols;
    if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= currentPlacedSymbols.length ||
        toIndex < 0 || toIndex >= currentPlacedSymbols.length) {
      console.warn(`Invalid indices (${fromIndex}, ${toIndex}) for moving symbol.`);
      return;
    }
    const newPlacedSymbols = [...currentPlacedSymbols];
    const symbolToMove = newPlacedSymbols[fromIndex];
    newPlacedSymbols[fromIndex] = newPlacedSymbols[toIndex];
    newPlacedSymbols[toIndex] = symbolToMove;
    set({ placedSymbols: newPlacedSymbols });
  },

  // Remove a symbol from a specific index
  removeSymbol: (index) => {
    const currentPlacedSymbols = get().placedSymbols;
    if (index >= 0 && index < currentPlacedSymbols.length) {
      const newPlacedSymbols = [...currentPlacedSymbols];
      newPlacedSymbols[index] = null; // Set the slot back to null
      set({ placedSymbols: newPlacedSymbols });
    } else {
      console.warn(`Invalid index (${index}) for removing symbol.`);
    }
  },

  // Set grid size
  setGridSize: (rows, cols) => {
    const currentRows = get().rows;
    const currentCols = get().cols;

    // Check if state actually changed
    if (currentRows === rows && currentCols === cols) {
      return;
    }

    const currentPlacedSymbols = get().placedSymbols;
    const newSize = rows * cols;
    const oldSize = currentPlacedSymbols.length;
    const newPlacedSymbols = Array(newSize).fill(null);

    // Determine how many symbols to copy
    const copyLength = Math.min(oldSize, newSize);

    // Copy existing symbols up to the copyLength
    for (let i = 0; i < copyLength; i++) {
      newPlacedSymbols[i] = currentPlacedSymbols[i];
    }

    set({
      rows,
      cols,
      placedSymbols: newPlacedSymbols // Set the new array with preserved symbols
    });
  },

  // Set font size for symbol labels
  setFontSize: (fontSize) => {
    set({ fontSize });
  },

  // Load symbols dynamically from assets
  loadSymbolsFromAssets: async () => {
    try {
      const symbols = await loadSymbols();
      if (symbols.length > 0) {
        set({ availableSymbols: symbols });
      } else {
        console.warn('No symbols found, using fallback list');
        set({ availableSymbols: fallbackSymbols });
      }
    } catch (error) {
      console.error('Failed to load symbols:', error);
      set({ availableSymbols: fallbackSymbols });
    }
  }
})); 