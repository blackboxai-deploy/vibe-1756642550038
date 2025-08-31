// English Morphology Engine - Handles -s, -ed, -ing formation

// Words that do NOT double final consonant when adding -ing
export const NO_DOUBLE = new Set([
  'answer', 'offer', 'suffer', 'open', 'happen', 'travel',
  'listen', 'enter', 'order', 'cover', 'gather', 'wonder',
  'remember', 'consider', 'deliver', 'discover', 'develop'
]);

// Stative verbs that cannot be used in progressive aspect
export const STATIVE = new Set([
  'have', 'know', 'believe', 'think', 'love', 'like', 'hate',
  'prefer', 'want', 'need', 'seem', 'appear', 'understand',
  'realize', 'remember', 'own', 'belong', 'contain', 'include',
  'matter', 'fit', 'agree', 'depend', 'mean', 'lack', 'cost',
  'weigh', 'measure', 'exist', 'consist', 'deserve', 'require'
]);

// Verbs that are potentially harmful/negative for passive auto-selection
export const NEGATIVE_VERBS = new Set([
  'fire', 'steal', 'injure', 'damage', 'arrest', 'punish', 'kill',
  'break', 'destroy', 'hurt', 'harm', 'attack', 'rob', 'cheat',
  'deceive', 'abandon', 'betray', 'insult', 'criticize', 'reject'
]);

/**
 * Add 3rd person singular -s/-es
 */
export function sEs(verb: string): string {
  const v = verb.toLowerCase().trim();
  
  // Special cases
  if (v === 'have') return 'has';
  if (v === 'be') return 'is';
  if (v === 'do') return 'does';
  if (v === 'go') return 'goes';
  
  // Consonant + y -> ies
  if (v.length >= 2 && /[^aeiou]y$/.test(v)) {
    return v.slice(0, -1) + 'ies';
  }
  
  // Ends with s, x, z, ch, sh, o -> +es
  if (/(s|x|z|ch|sh|o)$/.test(v)) {
    return v + 'es';
  }
  
  // Default: +s
  return v + 's';
}

/**
 * Form V-ing with proper rules
 */
export function vIng(verb: string): string {
  const v = verb.toLowerCase().trim();
  
  // Special case: ie -> ying
  if (v.endsWith('ie')) {
    return v.slice(0, -2) + 'ying';
  }
  
  // Drop 'e' if ends with 'e' (but not for be, see, dye, agree)
  if (v.endsWith('e') && !['be', 'see', 'dye', 'agree'].includes(v)) {
    return v.slice(0, -1) + 'ing';
  }
  
  // Check if we should NOT double the consonant
  if (NO_DOUBLE.has(v)) {
    return v + 'ing';
  }
  
  // Double consonant for CVC pattern (short vowel + single consonant)
  if (/[bcdfghjklmnpqrstvwxyz][aeiou][bcdfgklmnprst]$/.test(v) && v.length >= 3) {
    return v + v.slice(-1) + 'ing';
  }
  
  // Default: just add -ing
  return v + 'ing';
}

/**
 * Form regular past tense -ed
 */
export function pastRegular(verb: string): string {
  const v = verb.toLowerCase().trim();
  
  // Already ends with 'e' -> +d
  if (v.endsWith('e')) {
    return v + 'd';
  }
  
  // Consonant + y -> ied
  if (v.length >= 2 && /[^aeiou]y$/.test(v)) {
    return v.slice(0, -1) + 'ied';
  }
  
  // CVC doubling (same rule as -ing)
  if (!NO_DOUBLE.has(v) && /[bcdfghjklmnpqrstvwxyz][aeiou][bcdfgklmnprst]$/.test(v) && v.length >= 3) {
    return v + v.slice(-1) + 'ed';
  }
  
  // Default: +ed
  return v + 'ed';
}

/**
 * Check if verb is stative (cannot use progressive)
 */
export function isStative(verb: string): boolean {
  return STATIVE.has(verb.toLowerCase().trim());
}

/**
 * Check if verb implies negative outcome (for passive auto-selection)
 */
export function isNegativeVerb(verb: string): boolean {
  return NEGATIVE_VERBS.has(verb.toLowerCase().trim());
}

/**
 * Get proper be-form for subject
 */
export function getBe(subject: string, tense: 'present' | 'past'): string {
  if (tense === 'present') {
    if (subject === 'I') return 'am';
    if (['he', 'she', 'it', 'N'].includes(subject)) return 'is';
    return 'are'; // you, we, they, Ns
  } else { // past
    if (subject === 'I' || ['he', 'she', 'it', 'N'].includes(subject)) return 'was';
    return 'were'; // you, we, they, Ns
  }
}

/**
 * Get proper have-form for subject
 */
export function getHave(subject: string): string {
  if (['he', 'she', 'it', 'N'].includes(subject)) return 'has';
  return 'have'; // I, you, we, they, Ns
}

/**
 * Get proper do-form for subject
 */
export function getDo(subject: string): string {
  if (['he', 'she', 'it', 'N'].includes(subject)) return 'does';
  return 'do'; // I, you, we, they, Ns
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Check if word needs article (a/an)
 */
export function needsArticle(word: string): string | null {
  const w = word.toLowerCase();
  if (/^[aeiou]/.test(w)) return 'an';
  if (/^[bcdfghjklmnpqrstvwxyz]/.test(w)) return 'a';
  return null;
}

/**
 * Get subject pronoun for Vietnamese
 */
export function getVietnameseSubject(subject: string): string {
  const subjectMap: Record<string, string> = {
    'I': 'Tôi',
    'you': 'Bạn',
    'we': 'Chúng tôi',
    'they': 'Họ',
    'he': 'Anh ấy',
    'she': 'Cô ấy',
    'it': 'Nó',
    'N': 'Anh ấy',  // Generic singular
    'Ns': 'Họ'      // Generic plural
  };
  return subjectMap[subject] || subject;
}