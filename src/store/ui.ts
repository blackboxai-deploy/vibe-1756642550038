// UI Store - Interface state and hero controls with Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIState, HeroControls, PassiveOptions, Subject } from '../types';
import { STORAGE_KEYS } from '../types';

interface UIStore extends UIState {
  // Hero controls
  heroControls: HeroControls;
  
  // UI Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setUIZoom: (zoom: number) => void;
  setCoreZoom: (zoom: number) => void;
  setPresentationMode: (enabled: boolean) => void;
  setSelectedGroup: (groupId: number | null) => void;
  setSelectedUnit: (unitId: number | null) => void;
  setSearchQuery: (query: string) => void;
  setPackModalOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;
  setActivePackTab: (tab: 'verb' | 'adj' | 'adv' | 'noun' | 'prep' | 'vocab') => void;
  setPackFilter: (packType: keyof UIState['packFilters'], filter: string) => void;
  setAlphaFilter: (letter: string | null) => void;
  
  // Hero Controls Actions
  setHeroTense: (tense: 'present' | 'past' | 'future') => void;
  setHeroAspect: (aspect: 'simple' | 'prog' | 'perf' | 'perfprog' | 'goingto') => void;
  setHeroPolarity: (polarity: 'affirm' | 'neg' | 'question') => void;
  setHeroSubject: (subject: Subject) => void;
  setHeroBaseVerb: (verb: string) => void;
  setHeroSelectedPack: (pack: 'verb' | 'adj' | 'adv' | 'noun' | 'prep' | 'vocab') => void;
  setHeroSelectedWord: (word: string | undefined) => void;
  
  // Passive Controls Actions
  setPassiveEnabled: (enabled: boolean) => void;
  setPassivePolarity: (polarity: 'affirm' | 'neg') => void;
  setPassiveQuestion: (question: boolean) => void;
  setPassiveByAgent: (enabled: boolean) => void;
  setPassiveAgentText: (text: string) => void;
  setPassiveViMarker: (marker: 'auto' | 'được' | 'bị') => void;
  setPassiveVariant: (variant: 'be' | 'get') => void;
  setPassiveAllowPerfProg: (allow: boolean) => void;
  
  // Utility actions
  resetHeroControls: () => void;
  resetUI: () => void;
}

// Default passive options
const defaultPassiveOptions: PassiveOptions = {
  enabled: false,
  polarity: 'affirm',
  questionYN: false,
  byAgent: false,
  agentText: 'someone',
  viMarker: 'auto',
  variant: 'be',
  allowPerfProg: false
};

// Default hero controls
const defaultHeroControls: HeroControls = {
  tense: 'present',
  aspect: 'simple',
  polarity: 'affirm',
  subject: 'I',
  baseVerb: 'work',
  selectedPack: 'verb',
  selectedWord: undefined,
  passive: defaultPassiveOptions
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // UI State
      theme: 'light',
      uiZoom: 100,
      coreZoom: 100,
      presentationMode: false,
      selectedGroupId: 1, // Default to first group (Present Tenses)
      selectedUnitId: null,
      searchQuery: '',
      packModalOpen: false,
      settingsModalOpen: false,
      activePackTab: 'verb',
      packFilters: {
        verb: 'all',
        noun: 'all', 
        prep: 'all',
        vocab: 'all'
      },
      alphaFilter: null,
      
      // Hero Controls
      heroControls: defaultHeroControls,

      // UI Actions
      setTheme: (theme) => set({ theme }),
      
      setUIZoom: (zoom) => {
        const clampedZoom = Math.max(80, Math.min(200, zoom));
        set({ uiZoom: clampedZoom });
      },
      
      setCoreZoom: (zoom) => {
        const clampedZoom = Math.max(80, Math.min(200, zoom));
        set({ coreZoom: clampedZoom });
      },
      
      setPresentationMode: (enabled) => set({ presentationMode: enabled }),
      setSelectedGroup: (groupId) => set({ selectedGroupId: groupId, selectedUnitId: null }),
      setSelectedUnit: (unitId) => set({ selectedUnitId: unitId }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setPackModalOpen: (open) => set({ packModalOpen: open }),
      setSettingsModalOpen: (open) => set({ settingsModalOpen: open }),
      setActivePackTab: (tab) => set({ activePackTab: tab }),
      
      setPackFilter: (packType, filter) => {
        set((state) => ({
          packFilters: {
            ...state.packFilters,
            [packType]: filter
          }
        }));
      },
      
      setAlphaFilter: (letter) => set({ alphaFilter: letter }),

      // Hero Controls Actions
      setHeroTense: (tense) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            tense
          }
        }));
      },

      setHeroAspect: (aspect) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            aspect
          }
        }));
      },

      setHeroPolarity: (polarity) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            polarity
          }
        }));
      },

      setHeroSubject: (subject) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            subject
          }
        }));
      },

      setHeroBaseVerb: (verb) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            baseVerb: verb
          }
        }));
      },

      setHeroSelectedPack: (pack) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            selectedPack: pack,
            selectedWord: undefined // Reset word when pack changes
          }
        }));
      },

      setHeroSelectedWord: (word) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            selectedWord: word
          }
        }));
      },

      // Passive Controls Actions
      setPassiveEnabled: (enabled) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            passive: {
              ...state.heroControls.passive,
              enabled
            }
          }
        }));
      },

      setPassivePolarity: (polarity) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            passive: {
              ...state.heroControls.passive,
              polarity
            }
          }
        }));
      },

      setPassiveQuestion: (question) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            passive: {
              ...state.heroControls.passive,
              questionYN: question
            }
          }
        }));
      },

      setPassiveByAgent: (enabled) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            passive: {
              ...state.heroControls.passive,
              byAgent: enabled
            }
          }
        }));
      },

      setPassiveAgentText: (text) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            passive: {
              ...state.heroControls.passive,
              agentText: text
            }
          }
        }));
      },

      setPassiveViMarker: (marker) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            passive: {
              ...state.heroControls.passive,
              viMarker: marker
            }
          }
        }));
      },

      setPassiveVariant: (variant) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            passive: {
              ...state.heroControls.passive,
              variant
            }
          }
        }));
      },

      setPassiveAllowPerfProg: (allow) => {
        set((state) => ({
          heroControls: {
            ...state.heroControls,
            passive: {
              ...state.heroControls.passive,
              allowPerfProg: allow
            }
          }
        }));
      },

      // Utility actions
      resetHeroControls: () => {
        set({ heroControls: defaultHeroControls });
      },

      resetUI: () => {
        set({
          theme: 'light',
          uiZoom: 100,
          coreZoom: 100,
          presentationMode: false,
          selectedGroupId: 1,
          selectedUnitId: null,
          searchQuery: '',
          packModalOpen: false,
          settingsModalOpen: false,
          activePackTab: 'verb',
          packFilters: {
            verb: 'all',
            noun: 'all',
            prep: 'all', 
            vocab: 'all'
          },
          alphaFilter: null,
          heroControls: defaultHeroControls
        });
      }
    }),
    {
      name: STORAGE_KEYS.UI_SETTINGS,
      version: 1,
      // Persist UI settings but not temporary state like modals
      partialize: (state) => ({
        theme: state.theme,
        uiZoom: state.uiZoom,
        coreZoom: state.coreZoom,
        selectedGroupId: state.selectedGroupId,
        heroControls: state.heroControls,
        packFilters: state.packFilters
      }),
    }
  )
);