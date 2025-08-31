// Units Pane Component - Grammar units in selected group

import React, { useMemo } from 'react';
import { useUIStore } from '../store/ui';
import { usePacksStore } from '../store/packs';

function UnitsPane() {
  const { selectedGroupId, selectedUnitId, setSelectedUnit } = useUIStore();
  const { packs } = usePacksStore();

  // Filter units by selected group
  const unitsInGroup = useMemo(() => {
    if (!selectedGroupId) return [];
    return packs.units.filter(unit => unit.groupId === selectedGroupId);
  }, [selectedGroupId, packs.units]);

  const groupName = selectedGroupId 
    ? packs.units.find(u => u.groupId === selectedGroupId)?.groupId.toString() || 'Unknown'
    : 'No Group Selected';

  return (
    <div className="units-column">
      <div className="column-header">
        Grammar Units
        <span className="unit-count">{unitsInGroup.length}</span>
      </div>
      
      <div className="column-content">
        {selectedGroupId ? (
          <div className="units-list">
            {unitsInGroup.map((unit) => (
              <div
                key={unit.id}
                className={`unit-item ${selectedUnitId === unit.id ? 'selected' : ''}`}
                onClick={() => setSelectedUnit(unit.id)}
              >
                <div className="unit-item-name">
                  {unit.name_vi}
                </div>
                <div className="unit-item-en">{unit.name_en}</div>
                
                {/* Tags */}
                <div className="flex flex-wrap mt-2">
                  {unit.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag-badge">
                      {tag.replace('topic:', '').replace('_', ' ')}
                    </span>
                  ))}
                  {unit.tags.length > 3 && (
                    <span className="tag-badge opacity-70">
                      +{unit.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-ink-secondary">
            Select a grammar group to view its units
          </div>
        )}
      </div>
    </div>
  );
}

export default UnitsPane;