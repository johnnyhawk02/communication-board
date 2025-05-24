# Communication Board App - Exploration Notes

## Overview
This is a React-based communication board application built with TypeScript and Vite. It's designed to help create visual communication boards by arranging symbol images in a grid layout, with the ability to export the final board as a high-quality image.

## Project Structure

### Technology Stack
- **Frontend Framework**: React 19.0.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **State Management**: Zustand 5.0.3
- **Drag & Drop**: react-dnd 16.0.1 with HTML5 backend
- **Export Functionality**: 
  - html2canvas 1.4.1 (for image export)
  - @react-pdf/renderer 4.3.0 (for PDF export capabilities)

### Directory Structure
```
src/
├── App.tsx                    # Main application component
├── App.css                    # Global styles
├── main.tsx                   # Application entry point
├── components/                # React components
│   ├── A4Preview.tsx         # Main board grid view
│   ├── SymbolLibrary.tsx     # Symbol selection panel
│   ├── PlacedSymbol.tsx      # Individual placed symbols
│   ├── ExportButton.tsx      # Export functionality
│   ├── CustomDragLayer.tsx   # Custom drag preview
│   ├── JpegExporter.tsx      # JPEG export utility
│   ├── PdfDocument.tsx       # PDF generation component
│   └── SymbolSelectorPopup.tsx # Symbol selection popup
├── store/
│   └── useBoardStore.ts      # Zustand state management
└── data/
    └── symbols.ts            # Symbol data and loading logic

public/
├── assets/                   # Symbol images (44 PNG files)
└── index.html               # Main HTML template
```

## Core Functionality

### 1. Symbol Management
- **Symbol Library**: Left sidebar displaying available symbols
- **Dynamic Loading**: Automatically loads symbols from `/public/assets/` folder using Vite's `import.meta.glob`
- **Fallback System**: Includes fallback symbols if dynamic loading fails
- **Symbol Format**: PNG images with automatic name formatting (filename → Title Case)

### 2. Board Creation
- **Grid-Based Layout**: Configurable grid system (default 4×3, options for 2×3 and 3×4)
- **Drag & Drop Interface**: 
  - Drag symbols from library to grid
  - Drag symbols within grid to rearrange
  - Double-click placed symbols to remove them
- **Real-time Preview**: A4-sized preview area showing the final board layout

### 3. State Management (Zustand Store)
The application uses a centralized store with the following features:
- **Available Symbols**: Array of all loaded symbols
- **Placed Symbols**: Grid array tracking symbol positions
- **Grid Configuration**: Rows and columns settings
- **Actions**:
  - `addSymbolToBoard()`: Add symbol to next available slot
  - `placeSymbolAt()`: Place symbol at specific grid position
  - `moveSymbol()`: Move/swap symbols between positions
  - `removeSymbol()`: Remove symbol from grid
  - `setGridSize()`: Change grid dimensions
  - `loadSymbolsFromAssets()`: Dynamically load symbols

### 4. Export Functionality
- **High-Quality Image Export**: Uses html2canvas with 16x scale for ultra-high resolution
- **JPEG Format**: Exports as JPEG with 95% quality
- **PDF Support**: Infrastructure for PDF export (via @react-pdf/renderer)
- **Status Feedback**: Real-time export progress updates

## Symbol Collection
The app includes 44 communication symbols covering various categories:
- **People**: Chloe, sisters, izzi
- **Emotions**: angry, happy, overjoyed, bored, confused, thinking
- **Activities**: bath, sleep, dinner, get dressed, brush teeth, brush hair
- **Places**: McDonalds, cinema, playground, cottage, blackpool, gullivers world
- **Objects**: bottle, car, train, ipad, pushchair, pyjamas
- **Food**: cheese on toast, ice lolly, easter egg
- **Actions**: stop, finished, entertainment

## Key Features

### Drag & Drop System
- **Two Item Types**: 
  - `SYMBOL`: From library to board
  - `PLACED_SYMBOL`: Between grid positions
- **Custom Drag Layer**: Provides visual feedback during dragging
- **Drop Validation**: Prevents invalid drops and handles edge cases

### Responsive Design
- **Full Viewport**: Uses 100vw/100vh layout
- **Three-Panel Layout**: 
  - Left: Symbol library
  - Center: A4 preview area
  - Right: Export controls and grid options

### User Experience
- **Visual Feedback**: Opacity changes during drag operations
- **Grid Size Options**: Quick buttons for common grid sizes
- **Error Handling**: Graceful fallbacks for symbol loading failures
- **Accessibility**: Alt text for images, semantic HTML structure

## Technical Considerations

### Performance
- **Lazy Loading**: Uses Vite's glob imports for efficient asset loading
- **Optimized Rendering**: React.memo potential for symbol components
- **Canvas Optimization**: High-quality export without affecting UI performance

### Scalability
- **Modular Architecture**: Clear separation of concerns
- **Type Safety**: Full TypeScript implementation
- **State Management**: Centralized store for easy feature expansion

### Browser Compatibility
- **Modern Features**: Uses ES modules and modern React features
- **HTML5 Drag & Drop**: Relies on modern browser APIs
- **Canvas Support**: Requires modern browser for export functionality

## Potential Enhancements
1. ~~**Symbol Categories**: Organize symbols into categories~~ ✅ **IMPLEMENTED - Tag System**
2. **Custom Symbols**: Allow users to upload their own images
3. **Board Templates**: Pre-made board layouts
4. **Text Labels**: Add text labels to symbols
5. **Multiple Boards**: Support for multiple board management
6. **Cloud Storage**: Save/load boards from cloud
7. **Print Optimization**: Better print styling
8. **Mobile Support**: Touch-friendly interface
9. **Accessibility**: Screen reader support, keyboard navigation
10. ~~**Symbol Search**: Search functionality for large symbol libraries~~ ✅ **IMPLEMENTED - Enhanced Search with Tags**
11. **Custom Tag Creation**: Allow users to create and assign custom tags
12. **Tag Import/Export**: Save and share tag configurations
13. **Advanced Filtering**: Date-based, usage-based, or custom criteria filtering
14. **Tag Analytics**: Track most used tags and symbols

## Tag System Features

### 1. Automatic Tag Generation
- **Smart Categorization**: Symbols are automatically tagged based on their names and content
- **Focused Categories**: Each symbol gets maximum 2 relevant tags to avoid clutter
- **Core Tag Categories** (7 total):
  - **emotions**: Feelings and emotional expressions
  - **people**: Family members and individuals  
  - **daily-activities**: Daily routines and activities
  - **food**: Food, drinks, and meals
  - **places**: Locations and venues
  - **objects**: Items, toys, and tools
  - **communication**: Actions and communication

### 2. Tag-Based Filtering
- **Collapsible Tag Panel**: Toggle-able filter section with 🏷️ icon
- **Multi-Tag Selection**: Select multiple tags for refined filtering
- **Tag Count Display**: Shows number of selected tags
- **Clear Function**: Quick clear all selected tags
- **Combined Filtering**: Works together with text search

### 3. Enhanced Search
- **Dual Search**: Search by symbol name OR tag name
- **Real-time Results**: Instant filtering as you type
- **Smart Feedback**: Shows specific filter criteria in "no results" message

### 4. Visual Tag Display
- **Hover Tags**: Symbol tags appear on hover with tooltip
- **Compact Display**: Shows up to 2 tags per symbol to reduce visual clutter
- **Tag Styling**: Consistent visual design with app theme

### 5. Improved User Experience
- **Contextual Results**: Better filtering combinations
- **Clear Visual Feedback**: Active tag buttons highlighted in blue
- **Responsive Design**: Tag panel scales appropriately
- **Accessibility**: Proper hover states and clear visual hierarchy

## Development Setup
```bash
npm install     # Install dependencies
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## Export Quality Settings
- **Scale**: 16x for ultra-high resolution
- **Format**: JPEG with 95% quality
- **Canvas**: html2canvas with optimized settings
- **Image Loading**: Pre-loads all images before capture

This communication board app provides a solid foundation for creating visual communication aids with a professional, user-friendly interface and robust export capabilities.
