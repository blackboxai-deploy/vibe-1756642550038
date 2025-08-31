// Settings Modal Component - App configuration

import React from 'react';
import { useUIStore } from '../store/ui';

function SettingsModal() {
  const {
    theme,
    uiZoom,
    coreZoom,
    presentationMode,
    setTheme,
    setUIZoom,
    setCoreZoom,
    setPresentationMode,
    setSettingsModalOpen,
    resetUI
  } = useUIStore();

  const handleClose = () => {
    setSettingsModalOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" style={{ width: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {/* Theme */}
          <div className="mb-6">
            <label className="control-label mb-2">Theme</label>
            <div className="segment-control">
              <button
                className={`segment-item ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
              <button
                className={`segment-item ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
            </div>
          </div>

          {/* UI Zoom */}
          <div className="mb-6">
            <label className="control-label mb-2">
              UI Zoom: {uiZoom}%
            </label>
            <input
              type="range"
              min="80"
              max="200"
              step="10"
              value={uiZoom}
              onChange={(e) => setUIZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Core Font Zoom */}
          <div className="mb-6">
            <label className="control-label mb-2">
              Content Font Zoom: {coreZoom}%
            </label>
            <input
              type="range"
              min="80"
              max="200"
              step="10"
              value={coreZoom}
              onChange={(e) => setCoreZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Presentation Mode */}
          <div className="mb-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={presentationMode}
                onChange={(e) => setPresentationMode(e.target.checked)}
              />
              <span className="control-label">Presentation Mode</span>
            </label>
            <p className="text-sm text-ink-secondary mt-1">
              Hide sidebars and show only content for teaching
            </p>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end gap-3">
            <button className="btn" onClick={handleClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={resetUI}>
              Reset All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;