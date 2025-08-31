// Pack Modal Component - Vocabulary management

import React from 'react';
import { useUIStore } from '../store/ui';

function PackModal() {
  const { setPackModalOpen } = useUIStore();

  const handleClose = () => {
    setPackModalOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" style={{ width: '800px', height: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Pack Management</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="text-center py-8">
            <h3 className="mb-4">Vocabulary Pack Management</h3>
            <p className="text-ink-secondary mb-4">
              Import/Export vocabulary packs, browse word collections
            </p>
            <p className="text-sm text-ink-tertiary">
              Coming in next implementation phase...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackModal;