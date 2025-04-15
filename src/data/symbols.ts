export interface SymbolData {
  id: string;
  name: string;
  imagePath: string;
}

// Function to convert filename to readable name
const formatSymbolName = (filename: string): string => {
  // Remove file extension
  let name = filename.replace('.png', '');
  
  // Convert to title case and handle special formatting
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Function to generate a unique ID from the filename
const generateId = (filename: string): string => {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/\.png$/, '') // Remove .png extension
    .replace(/[^\w_]/g, ''); // Remove any non-alphanumeric or underscore chars
};

// Function to dynamically load symbols from assets folder
export const loadSymbols = async (): Promise<SymbolData[]> => {
  try {
    // In a real scenario, we would use the Fetch API or other methods to get the file list
    // Since direct file system access isn't available in the browser, we can either:
    // 1. Use a server endpoint that lists the files
    // 2. Import files using Vite's import.meta.glob (preferred for static sites)
    
    // Using Vite's import.meta.glob to get all PNG files
    const imageModules = import.meta.glob('/public/assets/*.png', { eager: true });
    
    const symbolsList: SymbolData[] = [];
    
    // Process each image file
    Object.entries(imageModules).forEach(([path, _]) => {
      // Extract filename from path
      const filename = path.split('/').pop() || '';
      
      if (filename) {
        // Create a symbol entry
        symbolsList.push({
          id: generateId(filename),
          name: formatSymbolName(filename),
          imagePath: `/assets/${filename}`
        });
      }
    });
    
    // Sort by name for consistent display
    return symbolsList.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error loading symbols:', error);
    // Fallback to empty array if loading fails
    return [];
  }
};

// Fallback symbols list in case dynamic loading fails
export const fallbackSymbols: SymbolData[] = [
  { id: 'bath', name: 'Bath', imagePath: '/assets/bath.png' },
  { id: 'bedtime_song', name: 'Bedtime Song', imagePath: '/assets/bedtime song.png' },
  { id: 'toilet', name: 'Toilet', imagePath: '/assets/toilet.png' },
  // Add a few more essential symbols as fallback
]; 