export interface SymbolData {
  id: string;
  name: string;
  imagePath: string;
  tags: string[];
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

// Function to generate tags based on symbol name and known patterns
const generateTags = (name: string, filename: string): string[] => {
  const tags: string[] = [];
  const lowerName = name.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  // Emotion tags
  if (['angry', 'happy', 'sad', 'excited', 'bored', 'confused', 'thinking', 'overjoyed'].some(emotion => 
    lowerName.includes(emotion) || lowerFilename.includes(emotion))) {
    tags.push('emotions');
  }
  
  // People tags
  if (['chloe', 'izzi', 'sisters', 'person', 'people'].some(person => 
    lowerName.includes(person) || lowerFilename.includes(person))) {
    tags.push('people');
  }
  
  // Activities/routines tags
  if (['bath', 'sleep', 'bedtime', 'brush', 'get dressed', 'toilet', 'dinner', 'entertainment'].some(activity => 
    lowerName.includes(activity) || lowerFilename.includes(activity))) {
    tags.push('daily-activities');
  }
  
  // Food/drink tags
  if (['dinner', 'bottle', 'cheese', 'toast', 'ice lolly', 'easter egg', 'mcdonalds'].some(food => 
    lowerName.includes(food) || lowerFilename.includes(food))) {
    tags.push('food');
  }
  
  // Places/locations tags
  if (['cinema', 'playground', 'cottage', 'blackpool', 'gullivers world', 'mcdonalds'].some(place => 
    lowerName.includes(place) || lowerFilename.includes(place))) {
    tags.push('places');
  }
  
  // Objects/items tags
  if (['bottle', 'ipad', 'pyjamas', 'bunk beds', 'dream machine', 'car', 'train', 'pushchair'].some(object => 
    lowerName.includes(object) || lowerFilename.includes(object))) {
    tags.push('objects');
  }
  
  // Communication/actions tags
  if (['stop', 'finished', 'thinking'].some(comm => 
    lowerName.includes(comm) || lowerFilename.includes(comm))) {
    tags.push('communication');
  }
  
  // Remove duplicates and return (limit to max 2 tags per symbol)
  const uniqueTags = [...new Set(tags)];
  return uniqueTags.slice(0, 2);
};

// Function to get all unique tags from a list of symbols
export const getAllTags = (symbols: SymbolData[]): string[] => {
  const tagSet = new Set<string>();
  symbols.forEach(symbol => {
    symbol.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

// Predefined tag categories for better organization
export const tagCategories = {
  emotions: 'Feelings and emotional expressions',
  people: 'Family members and individuals',
  'daily-activities': 'Daily routines and activities',
  food: 'Food, drinks, and meals',
  places: 'Locations and venues',
  objects: 'Items, toys, and tools',
  communication: 'Actions and communication'
};

// Function to dynamically load symbols from assets folder
export const loadSymbols = async (): Promise<SymbolData[]> => {
  try {
    // Since direct file system access isn't available in the browser, we'll use a static list
    // based on the files we know are in the public/assets directory
    const knownSymbols = [
      'Chloe.png', 'McDonalds.png', 'angry.png', 'angry002.png', 'bath.png',
      'bedtime song 001.png', 'bedtime song.png', 'bedtime001.png', 'blackpool.png',
      'bored.png', 'bottle.png', 'brush hair.png', 'brush teeth.png', 'bunk beds.png',
      'car.png', 'cheese on toast.png', 'cinema.png', 'cinema001.png', 'confused.png',
      'cottage.png', 'dinner time.png', 'dinner.png', 'dream machine.png',
      'easter egg.png', 'entertainment.png', 'finished.png', 'get dressed 002.png',
      'get dressed.png', 'gullivers world.png', 'happy.png', 'ice lolly.png',
      'ipad.png', 'izzi.png', 'overjoyed.png', 'playground.png', 'pushchair.png',
      'pyjamas.png', 'sisters.png', 'sleep.png', 'stop.png', 'thinking.png',
      'toilet.png', 'train.png', 'trim fringe.png'
    ];
    
    const symbolsList: SymbolData[] = [];
    
    // Process each known symbol file
    knownSymbols.forEach((filename) => {
      if (filename) {
        // Create a symbol entry
        const name = formatSymbolName(filename);
        symbolsList.push({
          id: generateId(filename),
          name: name,
          imagePath: `/assets/${filename}`,
          tags: generateTags(name, filename)
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
  { id: 'bath', name: 'Bath', imagePath: '/assets/bath.png', tags: ['daily-activities'] },
  { id: 'bedtime_song', name: 'Bedtime Song', imagePath: '/assets/bedtime song.png', tags: ['daily-activities'] },
  { id: 'toilet', name: 'Toilet', imagePath: '/assets/toilet.png', tags: ['daily-activities'] },
  // Add a few more essential symbols as fallback
];