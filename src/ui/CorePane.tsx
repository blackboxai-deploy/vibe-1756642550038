// Core Pane Component - Knowledge content display

import React, { useMemo } from 'react';
import { useUIStore } from '../store/ui';
import { usePacksStore } from '../store/packs';

function CorePane() {
  const { selectedUnitId, presentationMode } = useUIStore();
  const { packs } = usePacksStore();

  // Find selected unit
  const selectedUnit = useMemo(() => {
    if (!selectedUnitId) return null;
    return packs.units.find(unit => unit.id === selectedUnitId) || null;
  }, [selectedUnitId, packs.units]);

  // Parse core knowledge markup (simplified for now)
  const parseMarkup = (content: string): string => {
    if (!content) return '';
    
    return content
      .replace(/\[H1\]\s*(.+)/g, '<h1>$1</h1>')
      .replace(/\[H2\]\s*(.+)/g, '<h2>$1</h2>')
      .replace(/\[H3\]\s*(.+)/g, '<h3>$1</h3>')
      .replace(/\[FORMULA\]\s*(.+)/g, '<div class="markup-formula">$1</div>')
      .replace(/\[RULE\]\s*(.+)/g, '<div class="markup-rule">$1</div>')
      .replace(/\[EX\]\s*(.+)/g, '<div class="markup-example">$1</div>')
      .replace(/\[NOTE\]\s*(.+)/g, '<div class="markup-note">$1</div>')
      .replace(/\[TIP\]\s*(.+)/g, '<div class="markup-tip">$1</div>')
      .replace(/\[WARN\]\s*(.+)/g, '<div class="markup-warn">$1</div>')
      .replace(/\[DANGER\]\s*(.+)/g, '<div class="markup-danger">$1</div>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`core-column ${presentationMode ? 'full-width' : ''}`}>
      <div className="column-header">
        Kiến Thức Cốt Lõi
        {presentationMode && <span className="text-sm opacity-70">(Presentation Mode)</span>}
      </div>
      
      <div className="column-content">
        {selectedUnit ? (
          <div className="core-content">
            <h1>{selectedUnit.name_vi}</h1>
            <h2 className="text-ink-secondary mb-4">{selectedUnit.name_en}</h2>
            
            {/* Tags Display */}
            <div className="flex flex-wrap mb-6">
              {selectedUnit.tags.map((tag) => (
                <span key={tag} className="tag-badge">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Core Knowledge Content */}
            {selectedUnit.core_knowledge ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: parseMarkup(selectedUnit.core_knowledge) 
                }}
              />
            ) : (
              <div className="markup-note">
                <strong>Nội dung sẽ được bổ sung</strong>
                <br />
                Đây là đơn vị ngữ pháp <em>{selectedUnit.name_vi}</em> với ID #{selectedUnit.id}.
                <br />
                Thuộc nhóm {selectedUnit.groupId} với các thẻ: {selectedUnit.tags.join(', ')}.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-ink-secondary mb-2">Chưa chọn đơn vị ngữ pháp</h3>
            <p className="text-ink-tertiary">
              Chọn một đơn vị từ danh sách bên trái để xem kiến thức cốt lõi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CorePane;