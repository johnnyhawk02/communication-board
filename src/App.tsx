import { useRef } from 'react';
import SymbolLibrary from './components/SymbolLibrary';
import A4Preview from './components/A4Preview';
import ExportButton from './components/ExportButton';
import CustomDragLayer from './components/CustomDragLayer';
import { useBoardStore } from './store/useBoardStore'; // Import store hook
import './App.css'; // Global styles

function App() {
  const setGridSize = useBoardStore((state) => state.setGridSize);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="appContainer">
      <SymbolLibrary />
      <main className="mainContent">
        <div ref={previewRef} id="a4-preview-container">
          <A4Preview />
        </div>
      </main>
      <div className="exportArea">
        {/* Add Grid Size Buttons */}
        <div className="gridSizeOptions">
          <button onClick={() => setGridSize(3, 2)} title="Set grid to 2 columns x 3 rows">
            2x3
          </button>
          <button onClick={() => setGridSize(4, 3)} title="Set grid to 3 columns x 4 rows">
            3x4
          </button>
        </div>
        <ExportButton previewRef={previewRef} />
      </div>
      <CustomDragLayer />
    </div>
  );
}

export default App; 