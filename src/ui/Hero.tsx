// Hero Component - Sentence display and advanced controls

import React from 'react';
import { useUIStore } from '../store/ui';
import { usePacksStore } from '../store/packs';
import { buildSentence } from '../engine/hero';
import type { BuildContext } from '../types';

function Hero() {
  const {
    heroControls,
    selectedUnitId,
    setHeroTense,
    setHeroAspect,
    setHeroPolarity,
    setPassiveEnabled,
    setPassivePolarity,
    setPassiveQuestion,
    setPassiveByAgent,
    setPassiveAgentText,
    setPassiveViMarker,
    setPassiveVariant,
    setPassiveAllowPerfProg
  } = useUIStore();
  
  const { packs } = usePacksStore();

  // Find current unit
  const currentUnit = packs.units.find(u => u.id === selectedUnitId) || packs.units[0];

  // Build sentence
  let heroResult = { enHtml: 'Select a unit to see example', viText: 'Chọn một đơn vị để xem ví dụ', warn: undefined };
  
  if (currentUnit) {
    const context: BuildContext = {
      unit: currentUnit,
      subj: heroControls.subject,
      baseVerb: heroControls.baseVerb,
      advWord: heroControls.selectedPack === 'adv' && heroControls.selectedWord ? heroControls.selectedWord : undefined,
      adjWord: heroControls.selectedPack === 'adj' && heroControls.selectedWord ? heroControls.selectedWord : undefined,
      nounWord: heroControls.selectedPack === 'noun' && heroControls.selectedWord ? heroControls.selectedWord : undefined,
      prepWord: heroControls.selectedPack === 'prep' && heroControls.selectedWord ? heroControls.selectedWord : undefined,
      pass: heroControls.passive,
      tense: heroControls.tense,
      aspect: heroControls.aspect,
      polarity: heroControls.polarity
    };
    
    heroResult = buildSentence(context);
  }

  const handleTenseClick = (tense: 'present' | 'past' | 'future') => {
    setHeroTense(tense);
  };

  const handleAspectClick = (aspect: 'simple' | 'prog' | 'perf' | 'perfprog' | 'goingto') => {
    setHeroAspect(aspect);
  };

  const handlePolarityClick = (polarity: 'affirm' | 'neg' | 'question') => {
    setHeroPolarity(polarity);
  };

  return (
    <div className="hero-section">
      {/* Sentence Display */}
      <div className="hero-sentence" dangerouslySetInnerHTML={{ __html: heroResult.enHtml }} />
      <div className="hero-translation">{heroResult.viText}</div>
      
      {/* Warning Display */}
      {heroResult.warn && (
        <div className="markup-warn" style={{ marginTop: '12px', fontSize: 'calc(12px * var(--ui-zoom))' }}>
          ⚠️ {heroResult.warn}
        </div>
      )}

      {/* Hero Controls */}
      <div className="hero-controls">
        {/* Tense Control */}
        <div className="control-group">
          <label className="control-label">Tense</label>
          <div className="segment-control">
            <button
              className={`segment-item ${heroControls.tense === 'present' ? 'active' : ''}`}
              onClick={() => handleTenseClick('present')}
            >
              Present
            </button>
            <button
              className={`segment-item ${heroControls.tense === 'past' ? 'active' : ''}`}
              onClick={() => handleTenseClick('past')}
            >
              Past
            </button>
            <button
              className={`segment-item ${heroControls.tense === 'future' ? 'active' : ''}`}
              onClick={() => handleTenseClick('future')}
            >
              Future
            </button>
          </div>
        </div>

        {/* Aspect Control */}
        <div className="control-group">
          <label className="control-label">Aspect</label>
          <div className="segment-control">
            <button
              className={`segment-item ${heroControls.aspect === 'simple' ? 'active' : ''}`}
              onClick={() => handleAspectClick('simple')}
            >
              Simple
            </button>
            <button
              className={`segment-item ${heroControls.aspect === 'prog' ? 'active' : ''}`}
              onClick={() => handleAspectClick('prog')}
            >
              Progressive
            </button>
            <button
              className={`segment-item ${heroControls.aspect === 'perf' ? 'active' : ''}`}
              onClick={() => handleAspectClick('perf')}
            >
              Perfect
            </button>
            <button
              className={`segment-item ${heroControls.aspect === 'perfprog' ? 'active' : ''}`}
              onClick={() => handleAspectClick('perfprog')}
            >
              PerfProg
            </button>
            {heroControls.tense === 'future' && (
              <button
                className={`segment-item ${heroControls.aspect === 'goingto' ? 'active' : ''}`}
                onClick={() => handleAspectClick('goingto')}
              >
                Be going to
              </button>
            )}
          </div>
        </div>

        {/* Polarity Control */}
        <div className="control-group">
          <label className="control-label">Polarity/Query</label>
          <div className="segment-control">
            <button
              className={`segment-item ${heroControls.polarity === 'affirm' ? 'active' : ''}`}
              onClick={() => handlePolarityClick('affirm')}
            >
              A
            </button>
            <button
              className={`segment-item ${heroControls.polarity === 'neg' ? 'active' : ''}`}
              onClick={() => handlePolarityClick('neg')}
            >
              N
            </button>
            <button
              className={`segment-item ${heroControls.polarity === 'question' ? 'active' : ''}`}
              onClick={() => handlePolarityClick('question')}
            >
              Q
            </button>
          </div>
        </div>

        {/* Passive Block */}
        <div className="passive-block">
          <div className="passive-row">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={heroControls.passive.enabled}
                onChange={(e) => setPassiveEnabled(e.target.checked)}
              />
              <span className="control-label">Passive</span>
            </label>

            {heroControls.passive.enabled && (
              <>
                <div className="segment-control">
                  <button
                    className={`segment-item ${heroControls.passive.polarity === 'affirm' ? 'active' : ''}`}
                    onClick={() => setPassivePolarity('affirm')}
                  >
                    PA
                  </button>
                  <button
                    className={`segment-item ${heroControls.passive.polarity === 'neg' ? 'active' : ''}`}
                    onClick={() => setPassivePolarity('neg')}
                  >
                    PN
                  </button>
                  <button
                    className={`segment-item ${heroControls.passive.questionYN ? 'active' : ''}`}
                    onClick={() => setPassiveQuestion(!heroControls.passive.questionYN)}
                  >
                    PQ
                  </button>
                </div>
              </>
            )}
          </div>

          {heroControls.passive.enabled && (
            <div className="passive-row">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={heroControls.passive.byAgent}
                  onChange={(e) => setPassiveByAgent(e.target.checked)}
                />
                <span className="text-sm">by-agent</span>
              </label>

              {heroControls.passive.byAgent && (
                <input
                  type="text"
                  value={heroControls.passive.agentText || ''}
                  onChange={(e) => setPassiveAgentText(e.target.value)}
                  placeholder="someone"
                  className="text-sm"
                  style={{ width: '100px' }}
                />
              )}

              <select
                value={heroControls.passive.viMarker}
                onChange={(e) => setPassiveViMarker(e.target.value as any)}
                className="text-sm"
              >
                <option value="auto">VI: auto</option>
                <option value="được">VI: được</option>
                <option value="bị">VI: bị</option>
              </select>

              <select
                value={heroControls.passive.variant}
                onChange={(e) => setPassiveVariant(e.target.value as any)}
                className="text-sm"
              >
                <option value="be">Variant: be</option>
                <option value="get">Variant: get</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={heroControls.passive.allowPerfProg}
                  onChange={(e) => setPassiveAllowPerfProg(e.target.checked)}
                />
                <span className="text-sm">Allow PerfProg</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;