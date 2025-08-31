// Topbar Component - Pack chips, import, settings

import React from 'react';
import { useUIStore } from '../store/ui';

const PACK_TYPES = [
  { key: 'verb' as const, label: 'Verb' },
  { key: 'adj' as const, label: 'Adj' },
  { key: 'adv' as const, label: 'Adv' },
  { key: 'noun' as const, label: 'Noun' },
  { key: 'prep' as const, label: 'Prep' },
  { key: 'vocab' as const, label: 'Vocabulary' }
];

const SUBJECTS = [
  { value: 'I' as const, label: 'I' },
  { value: 'you' as const, label: 'you' },
  { value: 'we' as const, label: 'we' },
  { value: 'they' as const, label: 'they' },
  { value: 'he' as const, label: 'he' },
  { value: 'she' as const, label: 'she' },
  { value: 'it' as const, label: 'it' },
  { value: 'N' as const, label: 'N' },
  { value: 'Ns' as const, label: 'Ns' }
];

function Topbar() {
  const {
    heroControls,
    setPackModalOpen,
    setSettingsModalOpen,
    setHeroSelectedPack,
    setHeroSubject,
    setHeroBaseVerb
  } = useUIStore();

  const handlePackClick = (packType: typeof PACK_TYPES[number]['key']) => {
    setHeroSelectedPack(packType);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHeroSubject(e.target.value as any);
  };

  const handleVerbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeroBaseVerb(e.target.value);
  };

  const handleImportClick = () => {
    setPackModalOpen(true);
  };

  const handleSettingsClick = () => {
    setSettingsModalOpen(true);
  };

  return (
    <div className="topbar">
      {/* Pack Type Chips */}
      <div className="flex gap-2">
        {PACK_TYPES.map((pack) => (
          <button
            key={pack.key}
            className={`pack-chip ${heroControls.selectedPack === pack.key ? 'active' : ''}`}
            onClick={() => handlePackClick(pack.key)}
          >
            {pack.label}
          </button>
        ))}
      </div>

      {/* Import Button */}
      <button className="btn btn-primary" onClick={handleImportClick}>
        📥 Import
      </button>

      {/* Subject Selector */}
      <div className="control-group">
        <label className="control-label">Subject</label>
        <select 
          value={heroControls.subject} 
          onChange={handleSubjectChange}
          className="text-base"
        >
          {SUBJECTS.map((subject) => (
            <option key={subject.value} value={subject.value}>
              {subject.label}
            </option>
          ))}
        </select>
      </div>

      {/* Verb Input */}
      <div className="control-group">
        <label className="control-label">Verb</label>
        <input
          type="text"
          value={heroControls.baseVerb}
          onChange={handleVerbChange}
          placeholder="Enter base verb..."
          className="text-base"
          style={{ minWidth: '120px' }}
        />
      </div>

      {/* Settings Button */}
      <button className="btn" onClick={handleSettingsClick}>
        ⚙️ Settings
      </button>
    </div>
  );
}

export default Topbar;