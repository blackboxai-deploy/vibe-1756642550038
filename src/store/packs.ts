// Packs Store - Vocabulary and Units Management with Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Packs, 
  VerbForm, 
  AdjItem, 
  AdvItem, 
  NounItem, 
  PrepItem, 
  VocabItem, 
  Unit,
  ImportFormat,
  PackManifest
} from '../types';
import { STORAGE_KEYS } from '../types';
import { SEED_PACKS } from '../data/seed_packs';
import { UNITS_125 } from '../data/units_125';

interface PacksState {
  // Data
  packs: Packs;
  
  // Actions
  updatePacks: (newPacks: Partial<Packs>) => void;
  importPacks: (importData: ImportFormat[]) => Promise<{ success: number; errors: string[] }>;
  exportPacks: () => PackManifest;
  resetPacks: () => void;
  
  // Individual pack operations
  addVerbForm: (verb: VerbForm) => void;
  addAdjItem: (adj: AdjItem) => void;
  addAdvItem: (adv: AdvItem) => void;
  addNounItem: (noun: NounItem) => void;
  addPrepItem: (prep: PrepItem) => void;
  addVocabItem: (vocab: VocabItem) => void;
  
  removeVerbForm: (base: string) => void;
  removeAdjItem: (word: string) => void;
  removeAdvItem: (word: string) => void;
  removeNounItem: (word: string, type: string) => void;
  removePrepItem: (word: string) => void;
  removeVocabItem: (word: string, pos?: string) => void;
  
  // Search and filter
  searchPacks: (query: string, packType?: keyof Packs) => any[];
  getFilteredPacks: (packType: keyof Packs, filters: Record<string, any>) => any[];
}

export const usePacksStore = create<PacksState>()(
  persist(
    (set, get) => ({
      // Initialize with seed data + units
      packs: {
        ...SEED_PACKS,
        units: UNITS_125
      },

      updatePacks: (newPacks) => {
        set((state) => ({
          packs: { ...state.packs, ...newPacks }
        }));
      },

      importPacks: async (importDataArray) => {
        const errors: string[] = [];
        let successCount = 0;

        try {
          const currentPacks = get().packs;
          const mergedPacks = { ...currentPacks };

          for (const importData of importDataArray) {
            try {
              const packsToMerge = isPackManifest(importData) 
                ? importData.contains 
                : importData;

              // Merge each pack type with deduplication
              if (packsToMerge.verb_forms) {
                mergedPacks.verb_forms = mergeVerbForms(mergedPacks.verb_forms, packsToMerge.verb_forms);
              }
              if (packsToMerge.adjs) {
                mergedPacks.adjs = mergeAdjItems(mergedPacks.adjs, packsToMerge.adjs);
              }
              if (packsToMerge.advs) {
                mergedPacks.advs = mergeAdvItems(mergedPacks.advs, packsToMerge.advs);
              }
              if (packsToMerge.nouns) {
                mergedPacks.nouns = mergeNounItems(mergedPacks.nouns, packsToMerge.nouns);
              }
              if (packsToMerge.preps) {
                mergedPacks.preps = mergePrepItems(mergedPacks.preps, packsToMerge.preps);
              }
              if (packsToMerge.vocab) {
                mergedPacks.vocab = mergeVocabItems(mergedPacks.vocab, packsToMerge.vocab);
              }
              if (packsToMerge.units) {
                mergedPacks.units = mergeUnits(mergedPacks.units, packsToMerge.units);
              }

              successCount++;
            } catch (error) {
              errors.push(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }

          set({ packs: mergedPacks });
          return { success: successCount, errors };

        } catch (error) {
          return { 
            success: 0, 
            errors: [`Global import error: ${error instanceof Error ? error.message : 'Unknown error'}`] 
          };
        }
      },

      exportPacks: () => {
        const packs = get().packs;
        return {
          kind: 'thaytai-pack',
          version: '1.0',
          contains: packs
        };
      },

      resetPacks: () => {
        set({
          packs: {
            ...SEED_PACKS,
            units: UNITS_125
          }
        });
      },

      // Individual add operations
      addVerbForm: (verb) => {
        set((state) => ({
          packs: {
            ...state.packs,
            verb_forms: [...state.packs.verb_forms.filter(v => v.base !== verb.base), verb]
          }
        }));
      },

      addAdjItem: (adj) => {
        set((state) => ({
          packs: {
            ...state.packs,
            adjs: [...state.packs.adjs.filter(a => a.word !== adj.word), adj]
          }
        }));
      },

      addAdvItem: (adv) => {
        set((state) => ({
          packs: {
            ...state.packs,
            advs: [...state.packs.advs.filter(a => a.word !== adv.word), adv]
          }
        }));
      },

      addNounItem: (noun) => {
        set((state) => ({
          packs: {
            ...state.packs,
            nouns: [...state.packs.nouns.filter(n => !(n.word === noun.word && n.type === noun.type)), noun]
          }
        }));
      },

      addPrepItem: (prep) => {
        set((state) => ({
          packs: {
            ...state.packs,
            preps: [...state.packs.preps.filter(p => p.word !== prep.word), prep]
          }
        }));
      },

      addVocabItem: (vocab) => {
        set((state) => ({
          packs: {
            ...state.packs,
            vocab: [...state.packs.vocab.filter(v => !(v.word === vocab.word && v.pos === vocab.pos)), vocab]
          }
        }));
      },

      // Individual remove operations
      removeVerbForm: (base) => {
        set((state) => ({
          packs: {
            ...state.packs,
            verb_forms: state.packs.verb_forms.filter(v => v.base !== base)
          }
        }));
      },

      removeAdjItem: (word) => {
        set((state) => ({
          packs: {
            ...state.packs,
            adjs: state.packs.adjs.filter(a => a.word !== word)
          }
        }));
      },

      removeAdvItem: (word) => {
        set((state) => ({
          packs: {
            ...state.packs,
            advs: state.packs.advs.filter(a => a.word !== word)
          }
        }));
      },

      removeNounItem: (word, type) => {
        set((state) => ({
          packs: {
            ...state.packs,
            nouns: state.packs.nouns.filter(n => !(n.word === word && n.type === type))
          }
        }));
      },

      removePrepItem: (word) => {
        set((state) => ({
          packs: {
            ...state.packs,
            preps: state.packs.preps.filter(p => p.word !== word)
          }
        }));
      },

      removeVocabItem: (word, pos) => {
        set((state) => ({
          packs: {
            ...state.packs,
            vocab: state.packs.vocab.filter(v => !(v.word === word && v.pos === pos))
          }
        }));
      },

      // Search functionality
      searchPacks: (query, packType) => {
        const packs = get().packs;
        const lowerQuery = query.toLowerCase();

        if (packType) {
          const pack = packs[packType];
          return pack.filter((item: any) => 
            Object.values(item).some(value => 
              typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
            )
          );
        }

        // Search all packs
        const results: any[] = [];
        Object.entries(packs).forEach(([type, items]) => {
          const filtered = (items as any[]).filter((item: any) =>
            Object.values(item).some(value =>
              typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
            )
          );
          results.push(...filtered.map(item => ({ ...item, _packType: type })));
        });

        return results;
      },

      // Filter functionality
      getFilteredPacks: (packType, filters) => {
        const pack = get().packs[packType];
        
        return pack.filter((item: any) => {
          return Object.entries(filters).every(([key, value]) => {
            if (value === 'all' || !value) return true;
            return item[key] === value;
          });
        });
      }
    }),
    {
      name: STORAGE_KEYS.DATABASE,
      version: 1,
      // Only persist the packs data
      partialize: (state) => ({ packs: state.packs }),
    }
  )
);

// Utility functions for merging packs with deduplication

function isPackManifest(data: ImportFormat): data is PackManifest {
  return 'kind' in data && data.kind === 'thaytai-pack';
}

function mergeVerbForms(existing: VerbForm[], incoming: VerbForm[]): VerbForm[] {
  const merged = [...existing];
  
  incoming.forEach(newVerb => {
    const existingIndex = merged.findIndex(v => v.base === newVerb.base);
    if (existingIndex >= 0) {
      // Patch existing entry with non-empty values
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...(newVerb.past && { past: newVerb.past }),
        ...(newVerb.pp && { pp: newVerb.pp }),
        ...(newVerb.vi && { vi: newVerb.vi })
      };
    } else {
      merged.push(newVerb);
    }
  });
  
  return merged;
}

function mergeAdjItems(existing: AdjItem[], incoming: AdjItem[]): AdjItem[] {
  const merged = [...existing];
  
  incoming.forEach(newAdj => {
    const existingIndex = merged.findIndex(a => a.word === newAdj.word);
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...(newAdj.vi && { vi: newAdj.vi }),
        ...(newAdj.subtype && { subtype: newAdj.subtype })
      };
    } else {
      merged.push(newAdj);
    }
  });
  
  return merged;
}

function mergeAdvItems(existing: AdvItem[], incoming: AdvItem[]): AdvItem[] {
  const merged = [...existing];
  
  incoming.forEach(newAdv => {
    const existingIndex = merged.findIndex(a => a.word === newAdv.word);
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...(newAdv.vi && { vi: newAdv.vi }),
        ...(newAdv.klass && { klass: newAdv.klass })
      };
    } else {
      merged.push(newAdv);
    }
  });
  
  return merged;
}

function mergeNounItems(existing: NounItem[], incoming: NounItem[]): NounItem[] {
  const merged = [...existing];
  
  incoming.forEach(newNoun => {
    const existingIndex = merged.findIndex(n => n.word === newNoun.word && n.type === newNoun.type);
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...(newNoun.vi && { vi: newNoun.vi })
      };
    } else {
      merged.push(newNoun);
    }
  });
  
  return merged;
}

function mergePrepItems(existing: PrepItem[], incoming: PrepItem[]): PrepItem[] {
  const merged = [...existing];
  
  incoming.forEach(newPrep => {
    const existingIndex = merged.findIndex(p => p.word === newPrep.word);
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...(newPrep.vi && { vi: newPrep.vi }),
        ...(newPrep.cat && { cat: newPrep.cat }),
        ...(newPrep.ex && { ex: newPrep.ex })
      };
    } else {
      merged.push(newPrep);
    }
  });
  
  return merged;
}

function mergeVocabItems(existing: VocabItem[], incoming: VocabItem[]): VocabItem[] {
  const merged = [...existing];
  
  incoming.forEach(newVocab => {
    const existingIndex = merged.findIndex(v => v.word === newVocab.word && v.pos === newVocab.pos);
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...(newVocab.vi && { vi: newVocab.vi })
      };
    } else {
      merged.push(newVocab);
    }
  });
  
  return merged;
}

function mergeUnits(existing: Unit[], incoming: Unit[]): Unit[] {
  const merged = [...existing];
  
  incoming.forEach(newUnit => {
    const existingIndex = merged.findIndex(u => u.id === newUnit.id);
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...(newUnit.name_en && { name_en: newUnit.name_en }),
        ...(newUnit.name_vi && { name_vi: newUnit.name_vi }),
        ...(newUnit.tags && newUnit.tags.length > 0 && { tags: newUnit.tags }),
        ...(newUnit.core_knowledge && { core_knowledge: newUnit.core_knowledge })
      };
    } else {
      merged.push(newUnit);
    }
  });
  
  return merged;
}