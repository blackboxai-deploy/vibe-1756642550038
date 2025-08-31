// Main Application Component

import React, { useEffect } from 'react';
import { useUIStore } from './store/ui';
import Topbar from './ui/Topbar';
import Hero from './ui/Hero'; 
import GroupsPane from './ui/GroupsPane';
import UnitsPane from './ui/UnitsPane';
import CorePane from './ui/CorePane';
import PackModal from './ui/PackModal';
import SettingsModal from './ui/SettingsModal';

function App() {
  const {
    theme,
    uiZoom,
    coreZoom,
    presentationMode,
    packModalOpen,
    settingsModalOpen
  } = useUIStore();

  // Apply theme and zoom to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--ui-zoom', (uiZoom / 100).toString());
    document.documentElement.style.setProperty('--core-zoom', (coreZoom / 100).toString());
  }, [theme, uiZoom, coreZoom]);

  return (
    <div className="app">
      {/* Topbar */}
      <Topbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Main Layout - Three Columns or Presentation Mode */}
      <div className={`main-layout ${presentationMode ? 'presentation-mode' : 'three-column-mode'}`}>
        {!presentationMode && (
          <>
            {/* Left: Grammar Groups */}
            <div className="groups-column">
              <GroupsPane />
            </div>
            
            {/* Middle: Grammar Units */}
            <div className="units-column">
              <UnitsPane />
            </div>
          </>
        )}
        
        {/* Right: Core Knowledge (full width in presentation mode) */}
        <div className={`core-column ${presentationMode ? 'full-width' : ''}`}>
          <CorePane />
        </div>
      </div>
      
      {/* Modals */}
      {packModalOpen && <PackModal />}
      {settingsModalOpen && <SettingsModal />}
    </div>
  );
}

export default App;