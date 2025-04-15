import React from 'react';
import { SymbolData } from '../data/symbols';
import styles from './SymbolSelectorPopup.module.css';

interface SymbolSelectorPopupProps {
  symbol: SymbolData;
  onAdd: () => void;
  onClose: () => void;
}

const SymbolSelectorPopup: React.FC<SymbolSelectorPopupProps> = ({ symbol, onAdd, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}> {/* Close on overlay click */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside modal */}
        <h2>Add Symbol?</h2>
        <div className={styles.symbolPreview}>
          <img
            src={symbol.imagePath}
            alt={symbol.name}
            className={styles.symbolImage}
          />
          <span className={styles.symbolName}>{symbol.name}</span>
        </div>
        <div className={styles.modalActions}>
          <button onClick={onAdd} className={`${styles.button} ${styles.addButton}`}>Add to Page</button>
          <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SymbolSelectorPopup; 