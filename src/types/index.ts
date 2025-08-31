// Core Type Definitions for THAYTAI Grammar Web

// Tag Schema - Comprehensive grammar tags
export type Tag =
  // Topic tags
  | 'topic:tense' | 'topic:modals' | 'topic:patterns' | 'topic:nouns' | 'topic:articles'
  | 'topic:determiners' | 'topic:pronouns' | 'topic:adjectives' | 'topic:adverbs' | 'topic:comparison'
  | 'topic:prepositions' | 'topic:verb_types' | 'topic:negation' | 'topic:questions' | 'topic:imperatives'
  | 'topic:passive' | 'topic:sva' | 'topic:relative' | 'topic:noun_clause' | 'topic:adv_clause'
  | 'topic:conditionals' | 'topic:wishes' | 'topic:subjunctive' | 'topic:reported'
  | 'topic:cleft' | 'topic:inversion' | 'topic:sentence_types' | 'topic:word_order'
  | 'topic:conjunctions' | 'topic:discourse'
  // Tense/Time frame tags
  | 'tense:present' | 'tense:past' | 'tense:future'
  | 'slot:base' | 'slot:prog' | 'slot:perf' | 'slot:perfprog' | 'slot:goingto'
  | 'aux:will'
  // Modals, patterns, voice, questions, detail tags
  | 'modal:can' | 'modal:may' | 'modal:must' | 'modal:should' | 'modal:will' | 'modal:shouldhave'
  | 'pattern:usedto' | 'pattern:toinf' | 'pattern:gerund' | 'pattern:bare' | 'pattern:causative' | 'pattern:getdone'
  | 'p:basic' | 'p:advanced'
  | 'q:yn' | 'q:wh' | 'q:tag'
  | 'type:0' | 'type:1' | 'type:2' | 'type:3' | 'type:mixedA' | 'type:mixedB';

// Core Entities
export interface Group {
  id: number;
  vi: string;
  en: string;
}

export interface Unit {
  id: number;              // 1..125
  name_en: string;
  name_vi: string;
  tags: Tag[];
  groupId: number;         // 1..50
  core_knowledge: string;  // markup content
}

// Vocabulary Pack Items
export interface VerbForm {
  base: string;
  past: string;
  pp: string;
  vi?: string;
}

export interface AdjItem {
  word: string;
  vi?: string;
  subtype?: 'base' | 'ed' | 'ing';
}

export interface AdvItem {
  word: string;
  vi?: string;
  klass?: 'frequency' | 'manner' | 'degree' | 'time' | 'place' | 'linking';
}

export interface NounItem {
  word: string;
  type: 'sing' | 'plu' | 'unc';
  vi?: string;
}

export interface PrepItem {
  word: string;
  vi?: string;
  cat?: 'time' | 'place' | 'move' | 'other';
  ex?: string;
}

export interface VocabItem {
  word: string;
  vi?: string;
  pos?: 'v' | 'n' | 'adj' | 'adv' | 'prep' | 'phr';
}

// Pack Structure
export interface Packs {
  verb_forms: VerbForm[];
  adjs: AdjItem[];
  advs: AdvItem[];
  nouns: NounItem[];
  preps: PrepItem[];
  vocab: VocabItem[];
  units: Unit[];
}

// Passive Voice Configuration
export interface PassiveOptions {
  enabled: boolean;
  polarity: 'affirm' | 'neg';     // PA/PN
  questionYN: boolean;            // PQ
  byAgent: boolean;
  agentText?: string;             // "him/the teacher/…"
  viMarker: 'auto' | 'được' | 'bị';
  variant: 'be' | 'get';          // default 'be'
  allowPerfProg: boolean;         // default false
}

// Subject Types
export type Subject = 'I' | 'you' | 'we' | 'they' | 'he' | 'she' | 'it' | 'N' | 'Ns';

// Tense/Aspect/Voice Controls
export interface HeroControls {
  tense: 'present' | 'past' | 'future';
  aspect: 'simple' | 'prog' | 'perf' | 'perfprog' | 'goingto';
  polarity: 'affirm' | 'neg' | 'question';
  subject: Subject;
  baseVerb: string;
  selectedPack: 'verb' | 'adj' | 'adv' | 'noun' | 'prep' | 'vocab';
  selectedWord?: string;
  passive: PassiveOptions;
}

// Build Context for Hero Engine
export interface BuildContext {
  unit: Unit;
  subj: Subject;
  baseVerb: string;
  advWord?: string;
  adjWord?: string;
  nounWord?: string;
  prepWord?: string;
  pass: PassiveOptions;
  tense: string;
  aspect: string;
  polarity: string;
}

// Hero Build Result
export interface HeroResult {
  enHtml: string;
  viText: string;
  warn?: string;
}

// UI State
export interface UIState {
  theme: 'light' | 'dark';
  uiZoom: number;         // 80-200%
  coreZoom: number;       // 80-200%
  presentationMode: boolean;
  selectedGroupId: number | null;
  selectedUnitId: number | null;
  searchQuery: string;
  packModalOpen: boolean;
  settingsModalOpen: boolean;
  activePackTab: 'verb' | 'adj' | 'adv' | 'noun' | 'prep' | 'vocab';
  packFilters: {
    verb: 'all' | 'irregular';
    noun: 'all' | 'sing' | 'plu' | 'unc';
    prep: 'all' | 'time' | 'place' | 'move' | 'other';
    vocab: 'all';
  };
  alphaFilter: string | null;   // A-Z filtering
}

// Import/Export Types
export interface PackManifest {
  kind: 'thaytai-pack';
  version: string;
  contains: Packs;
}

export type ImportFormat = Packs | PackManifest;

// Morphology Types
export interface MorphologyResult {
  word: string;
  warning?: string;
}

// Storage Keys
export const STORAGE_KEYS = {
  DATABASE: 'tt_grammar_db_v1',
  UI_SETTINGS: 'tt_ui_settings_v1',
  THEME: 'tt_theme_v1'
} as const;