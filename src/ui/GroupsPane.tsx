// Groups Pane Component - Grammar groups list

import React, { useMemo } from 'react';
import { useUIStore } from '../store/ui';
import { usePacksStore } from '../store/packs';
import { GROUPS_50 } from '../data/groups_50';

function GroupsPane() {
  const { selectedGroupId, searchQuery, setSelectedGroup, setSearchQuery } = useUIStore();
  const { packs } = usePacksStore();

  // Filter groups based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return GROUPS_50;
    
    const query = searchQuery.toLowerCase();
    return GROUPS_50.filter(group => 
      group.vi.toLowerCase().includes(query) ||
      group.en.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Count units in each group
  const groupUnitCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    packs.units.forEach(unit => {
      counts[unit.groupId] = (counts[unit.groupId] || 0) + 1;
    });
    return counts;
  }, [packs.units]);

  return (
    <div className="groups-column">
      <div className="column-header">
        Grammar Groups
        <span className="unit-count">{filteredGroups.length}</span>
      </div>
      
      <div className="column-content">
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-box"
        />

        {/* Groups List */}
        <div className="groups-list">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className={`group-item ${selectedGroupId === group.id ? 'selected' : ''}`}
              onClick={() => setSelectedGroup(group.id)}
            >
              <div className="group-item-name">
                {group.vi}
                <span className="unit-count">{groupUnitCounts[group.id] || 0}</span>
              </div>
              <div className="group-item-en">{group.en}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GroupsPane;