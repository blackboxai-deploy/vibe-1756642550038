// Hero Sentence Builder Engine - Core sentence construction

import type { BuildContext, HeroResult, Subject, PassiveOptions } from '../types';
import { 
  sEs, vIng, pastRegular, isStative, isNegativeVerb,
  getBe, getHave, getDo, capitalize, needsArticle
} from './morph';
import { 
  getVietnameseTenseMarker, 
  getVietnamesePassiveMarker, 
  mapToVietnamese,
  translateVerb, 
  translateAdjective, 
  translateAdverb, 
  translateNoun 
} from './vi_map';

/**
 * Main hero sentence builder
 */
export function buildSentence(ctx: BuildContext): HeroResult {
  const { unit, subj, baseVerb, pass, tense, aspect, polarity } = ctx;
  
  try {
    // Determine hero type from unit tags
    const heroType = getHeroType(unit.tags);
    
    switch (heroType) {
      case 'verb':
        return buildVerbHero(ctx);
      case 'adj':
        return buildAdjectiveHero(ctx);
      case 'adv':
        return buildAdverbHero(ctx);
      case 'noun':
        return buildNounHero(ctx);
      case 'prep':
        return buildPrepositionHero(ctx);
      default:
        return buildVerbHero(ctx); // Default fallback
    }
  } catch (error) {
    return {
      enHtml: 'Error building sentence',
      viText: 'Lỗi xây dựng câu',
      warn: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Determine hero type from unit tags
 */
function getHeroType(tags: string[]): 'verb' | 'adj' | 'adv' | 'noun' | 'prep' {
  if (tags.includes('topic:adjectives')) return 'adj';
  if (tags.includes('topic:adverbs')) return 'adv';
  if (tags.includes('topic:nouns')) return 'noun';
  if (tags.includes('topic:prepositions')) return 'prep';
  return 'verb'; // Default for most grammar units
}

/**
 * Build verb-based hero sentences
 */
function buildVerbHero(ctx: BuildContext): HeroResult {
  const { subj, baseVerb, pass, tense, aspect, polarity, advWord } = ctx;
  
  let warning: string | undefined;
  
  // Check stative verb in progressive
  if (aspect === 'prog' && isStative(baseVerb)) {
    warning = `Stative verb "${baseVerb}" cannot be used in progressive aspect. Using simple aspect instead.`;
    ctx.aspect = 'simple';
  }
  
  if (pass.enabled) {
    return buildPassiveVerbSentence(ctx);
  } else {
    return buildActiveVerbSentence({ ...ctx, warning });
  }
}

/**
 * Build active verb sentence
 */
function buildActiveVerbSentence(ctx: BuildContext & { warning?: string }): HeroResult {
  const { subj, baseVerb, tense, aspect, polarity, advWord, warning } = ctx;
  
  const auxiliaries: string[] = [];
  let mainVerb = baseVerb;
  let isNegative = polarity === 'neg';
  let isQuestion = polarity === 'question';
  
  // Build verb chain based on tense and aspect
  switch (tense) {
    case 'present':
      if (aspect === 'simple') {
        if (['he', 'she', 'it', 'N'].includes(subj)) {
          mainVerb = sEs(baseVerb);
        }
        if (isNegative || isQuestion) {
          auxiliaries.push(getDo(subj));
          mainVerb = baseVerb;
        }
      } else if (aspect === 'prog') {
        auxiliaries.push(getBe(subj, 'present'));
        mainVerb = vIng(baseVerb);
      } else if (aspect === 'perf') {
        auxiliaries.push(getHave(subj));
        mainVerb = pastRegular(baseVerb); // For regular verbs
      } else if (aspect === 'perfprog') {
        auxiliaries.push(getHave(subj), 'been');
        mainVerb = vIng(baseVerb);
      }
      break;
      
    case 'past':
      if (aspect === 'simple') {
        mainVerb = pastRegular(baseVerb);
        if (isNegative || isQuestion) {
          auxiliaries.push('did');
          mainVerb = baseVerb;
        }
      } else if (aspect === 'prog') {
        auxiliaries.push(getBe(subj, 'past'));
        mainVerb = vIng(baseVerb);
      } else if (aspect === 'perf') {
        auxiliaries.push('had');
        mainVerb = pastRegular(baseVerb);
      } else if (aspect === 'perfprog') {
        auxiliaries.push('had', 'been');
        mainVerb = vIng(baseVerb);
      }
      break;
      
    case 'future':
      if (aspect === 'simple') {
        auxiliaries.push('will');
      } else if (aspect === 'goingto') {
        auxiliaries.push(getBe(subj, 'present'), 'going', 'to');
      } else if (aspect === 'prog') {
        auxiliaries.push('will', 'be');
        mainVerb = vIng(baseVerb);
      } else if (aspect === 'perf') {
        auxiliaries.push('will', 'have');
        mainVerb = pastRegular(baseVerb);
      } else if (aspect === 'perfprog') {
        auxiliaries.push('will', 'have', 'been');
        mainVerb = vIng(baseVerb);
      }
      break;
  }
  
  // Handle negation and questions
  let sentence = buildSentenceStructure({
    subject: subj,
    auxiliaries,
    mainVerb,
    isNegative,
    isQuestion,
    adverb: advWord
  });
  
  // Create Vietnamese translation
  const tenseMarker = getVietnameseTenseMarker(tense, aspect, !!advWord);
  const viText = mapToVietnamese({
    subject: subj,
    tenseMarker,
    verb: translateVerb(baseVerb),
    isNegative,
    isQuestion,
    adverb: advWord ? translateAdverb(advWord) : undefined
  });
  
  // Add HTML highlighting
  const enHtml = highlightVerbPhrase(sentence, auxiliaries, mainVerb);
  
  return { enHtml, viText, warn: warning };
}

/**
 * Build passive verb sentence
 */
function buildPassiveVerbSentence(ctx: BuildContext): HeroResult {
  const { subj, baseVerb, pass, tense, aspect, polarity } = ctx;
  
  let warning: string | undefined;
  
  // Check if verb can be passive
  if (isStative(baseVerb)) {
    warning = `Stative verb "${baseVerb}" should not be used in passive voice.`;
  }
  
  const auxiliaries: string[] = [];
  const pastParticiple = pastRegular(baseVerb); // For regular verbs
  
  let isNegative = pass.polarity === 'neg';
  let isQuestion = pass.questionYN;
  
  // Build passive chain
  const passiveAux = buildPassiveChain(subj, tense, aspect, pass.variant, pass.allowPerfProg);
  auxiliaries.push(...passiveAux);
  
  let sentence = buildSentenceStructure({
    subject: subj,
    auxiliaries,
    mainVerb: pastParticiple,
    isNegative,
    isQuestion,
    byAgent: pass.byAgent ? pass.agentText : undefined
  });
  
  // Vietnamese translation
  const tenseMarker = getVietnameseTenseMarker(tense, aspect);
  const passiveMarker = getVietnamesePassiveMarker(pass.viMarker, pass.variant, baseVerb);
  
  const viText = mapToVietnamese({
    subject: subj,
    tenseMarker,
    passiveMarker,
    verb: translateVerb(baseVerb),
    isNegative,
    isQuestion,
    byAgent: pass.byAgent ? pass.agentText : undefined,
    isPassive: true
  });
  
  // Add HTML highlighting
  const enHtml = highlightPassivePhrase(sentence, auxiliaries, pastParticiple, passiveMarker);
  
  return { enHtml, viText, warn: warning };
}

/**
 * Build adjective hero sentences
 */
function buildAdjectiveHero(ctx: BuildContext): HeroResult {
  const { subj, adjWord, tense, aspect, polarity } = ctx;
  
  if (!adjWord) {
    return {
      enHtml: 'No adjective selected',
      viText: 'Chưa chọn tính từ',
      warn: 'Please select an adjective'
    };
  }
  
  const auxiliaries: string[] = [];
  let isNegative = polarity === 'neg';
  let isQuestion = polarity === 'question';
  
  // Build be-chain for adjectives
  switch (tense) {
    case 'present':
      if (aspect === 'simple') {
        auxiliaries.push(getBe(subj, 'present'));
      } else if (aspect === 'prog') {
        auxiliaries.push(getBe(subj, 'present'), 'being');
      } else if (aspect === 'perf') {
        auxiliaries.push(getHave(subj), 'been');
      }
      break;
    case 'past':
      if (aspect === 'simple') {
        auxiliaries.push(getBe(subj, 'past'));
      } else if (aspect === 'prog') {
        auxiliaries.push(getBe(subj, 'past'), 'being');
      } else if (aspect === 'perf') {
        auxiliaries.push('had', 'been');
      }
      break;
    case 'future':
      if (aspect === 'simple') {
        auxiliaries.push('will', 'be');
      } else if (aspect === 'goingto') {
        auxiliaries.push(getBe(subj, 'present'), 'going', 'to', 'be');
      }
      break;
  }
  
  let sentence = buildSentenceStructure({
    subject: subj,
    auxiliaries,
    mainVerb: adjWord,
    isNegative,
    isQuestion
  });
  
  // Vietnamese translation
  const tenseMarker = getVietnameseTenseMarker(tense, aspect);
  const viText = mapToVietnamese({
    subject: subj,
    tenseMarker,
    verb: 'là', // "be" in Vietnamese
    adjective: translateAdjective(adjWord),
    isNegative,
    isQuestion
  });
  
  const enHtml = highlightAdjectivePhrase(sentence, adjWord);
  
  return { enHtml, viText };
}

/**
 * Build adverb hero sentences
 */
function buildAdverbHero(ctx: BuildContext): HeroResult {
  const { subj, baseVerb, advWord, tense, aspect, polarity } = ctx;
  
  if (!advWord) {
    return {
      enHtml: 'No adverb selected', 
      viText: 'Chưa chọn trạng từ',
      warn: 'Please select an adverb'
    };
  }
  
  // Use verb structure with adverb positioning
  const result = buildActiveVerbSentence({
    ...ctx,
    baseVerb: baseVerb || 'work', // Default verb
    advWord
  });
  
  // Enhance highlighting for adverb
  const enHtml = highlightAdverbPhrase(result.enHtml, advWord);
  
  return { ...result, enHtml };
}

/**
 * Build noun hero sentences
 */
function buildNounHero(ctx: BuildContext): HeroResult {
  const { subj, nounWord, tense, aspect, polarity } = ctx;
  
  if (!nounWord) {
    return {
      enHtml: 'No noun selected',
      viText: 'Chưa chọn danh từ', 
      warn: 'Please select a noun'
    };
  }
  
  const auxiliaries: string[] = [];
  let isNegative = polarity === 'neg';
  let isQuestion = polarity === 'question';
  
  // Build have-chain for nouns
  switch (tense) {
    case 'present':
      if (aspect === 'simple') {
        auxiliaries.push(getHave(subj));
      } else if (aspect === 'perf') {
        auxiliaries.push(getHave(subj), 'had');
      }
      break;
    case 'past':
      if (aspect === 'simple') {
        auxiliaries.push('had');
      }
      break;
    case 'future':
      if (aspect === 'simple') {
        auxiliaries.push('will', 'have');
      }
      break;
  }
  
  // Add article if needed
  const article = needsArticle(nounWord);
  const nounPhrase = article ? `${article} ${nounWord}` : nounWord;
  
  let sentence = buildSentenceStructure({
    subject: subj,
    auxiliaries,
    mainVerb: nounPhrase,
    isNegative,
    isQuestion
  });
  
  // Vietnamese translation
  const tenseMarker = getVietnameseTenseMarker(tense, aspect);
  const viText = mapToVietnamese({
    subject: subj,
    tenseMarker,
    verb: 'có', // "have" in Vietnamese
    noun: translateNoun(nounWord),
    isNegative,
    isQuestion
  });
  
  const enHtml = highlightNounPhrase(sentence, nounPhrase);
  
  return { enHtml, viText };
}

/**
 * Build preposition hero sentences
 */
function buildPrepositionHero(ctx: BuildContext): HeroResult {
  const { subj, prepWord, nounWord, tense, aspect, polarity } = ctx;
  
  if (!prepWord) {
    return {
      enHtml: 'No preposition selected',
      viText: 'Chưa chọn giới từ',
      warn: 'Please select a preposition'
    };
  }
  
  const auxiliaries: string[] = [];
  let isNegative = polarity === 'neg';
  let isQuestion = polarity === 'question';
  
  // Build be-chain for preposition phrases
  auxiliaries.push(getBe(subj, tense as 'present' | 'past'));
  
  const nounPart = nounWord || 'school';
  const article = needsArticle(nounPart);
  const prepPhrase = article ? `${prepWord} ${article} ${nounPart}` : `${prepWord} ${nounPart}`;
  
  let sentence = buildSentenceStructure({
    subject: subj,
    auxiliaries,
    mainVerb: prepPhrase,
    isNegative,
    isQuestion
  });
  
  // Vietnamese translation
  const tenseMarker = getVietnameseTenseMarker(tense, aspect);
  const viText = mapToVietnamese({
    subject: subj,
    tenseMarker,
    verb: 'ở', // Common preposition verb
    preposition: `${prepWord} ${translateNoun(nounPart)}`,
    isNegative,
    isQuestion
  });
  
  const enHtml = highlightPrepPhrase(sentence, prepPhrase);
  
  return { enHtml, viText };
}

/**
 * Build passive auxiliary chain
 */
function buildPassiveChain(
  subject: Subject, 
  tense: string, 
  aspect: string, 
  variant: 'be' | 'get',
  allowPerfProg: boolean
): string[] {
  if (variant === 'get') {
    return buildGetPassiveChain(subject, tense, aspect);
  }
  
  return buildBePassiveChain(subject, tense, aspect, allowPerfProg);
}

/**
 * Build be-passive chain
 */
function buildBePassiveChain(
  subject: Subject, 
  tense: string, 
  aspect: string, 
  allowPerfProg: boolean
): string[] {
  const be = getBe(subject, tense as 'present' | 'past');
  const have = getHave(subject);
  
  switch (tense) {
    case 'present':
      if (aspect === 'simple') return [be];
      if (aspect === 'prog') return [be, 'being'];
      if (aspect === 'perf') return [have, 'been'];
      if (aspect === 'perfprog') return allowPerfProg ? [have, 'been', 'being'] : [have, 'been'];
      break;
      
    case 'past':
      if (aspect === 'simple') return [getBe(subject, 'past')];
      if (aspect === 'prog') return [getBe(subject, 'past'), 'being'];
      if (aspect === 'perf') return ['had', 'been'];
      if (aspect === 'perfprog') return allowPerfProg ? ['had', 'been', 'being'] : ['had', 'been'];
      break;
      
    case 'future':
      if (aspect === 'simple') return ['will', 'be'];
      if (aspect === 'goingto') return [be, 'going', 'to', 'be'];
      if (aspect === 'prog') return ['will', 'be', 'being'];
      if (aspect === 'perf') return ['will', 'have', 'been'];
      if (aspect === 'perfprog') return allowPerfProg ? ['will', 'have', 'been', 'being'] : ['will', 'have', 'been'];
      break;
  }
  
  return [be]; // Default fallback
}

/**
 * Build get-passive chain
 */
function buildGetPassiveChain(subject: Subject, tense: string, aspect: string): string[] {
  switch (tense) {
    case 'present':
      if (aspect === 'simple') return (['he', 'she', 'it', 'N'].includes(subject)) ? ['gets'] : ['get'];
      if (aspect === 'prog') return [getBe(subject, 'present'), 'getting'];
      if (aspect === 'perf') return [getHave(subject), 'gotten']; // American English
      break;
      
    case 'past':
      if (aspect === 'simple') return ['got'];
      if (aspect === 'prog') return [getBe(subject, 'past'), 'getting'];
      if (aspect === 'perf') return ['had', 'gotten'];
      break;
      
    case 'future':
      if (aspect === 'simple') return ['will', 'get'];
      if (aspect === 'goingto') return [getBe(subject, 'present'), 'going', 'to', 'get'];
      break;
  }
  
  return ['get']; // Default fallback
}

/**
 * Build complete sentence structure
 */
function buildSentenceStructure({
  subject,
  auxiliaries,
  mainVerb,
  isNegative,
  isQuestion,
  adverb,
  byAgent
}: {
  subject: Subject;
  auxiliaries: string[];
  mainVerb: string;
  isNegative?: boolean;
  isQuestion?: boolean;
  adverb?: string;
  byAgent?: string;
}): string {
  let parts: string[] = [];
  
  if (isQuestion && auxiliaries.length > 0) {
    // Question: auxiliary + subject + ...
    const firstAux = auxiliaries[0];
    const restAux = auxiliaries.slice(1);
    
    parts.push(capitalize(firstAux));
    
    if (isNegative && firstAux !== 'will') {
      parts.push(`${subject} not`);
    } else {
      parts.push(subject);
      if (isNegative) parts.push('not');
    }
    
    if (restAux.length > 0) {
      parts.push(...restAux);
    }
    
    // Add frequency adverb after auxiliary
    if (adverb && ['often', 'usually', 'sometimes', 'never', 'always'].includes(adverb.toLowerCase())) {
      parts.push(adverb);
    }
    
    parts.push(mainVerb);
    
    // Add other adverbs at end
    if (adverb && !['often', 'usually', 'sometimes', 'never', 'always'].includes(adverb.toLowerCase())) {
      parts.push(adverb);
    }
    
    if (byAgent) {
      parts.push(`by ${byAgent}`);
    }
    
    return parts.join(' ') + '?';
  } else {
    // Statement: subject + auxiliary + ...
    parts.push(capitalize(subject));
    
    if (auxiliaries.length > 0) {
      if (isNegative) {
        parts.push(auxiliaries[0]);
        parts.push('not');
        if (auxiliaries.length > 1) {
          parts.push(...auxiliaries.slice(1));
        }
      } else {
        parts.push(...auxiliaries);
      }
    }
    
    // Add frequency adverb after auxiliary
    if (adverb && ['often', 'usually', 'sometimes', 'never', 'always'].includes(adverb.toLowerCase())) {
      parts.push(adverb);
    }
    
    parts.push(mainVerb);
    
    // Add other adverbs at end
    if (adverb && !['often', 'usually', 'sometimes', 'never', 'always'].includes(adverb.toLowerCase())) {
      parts.push(adverb);
    }
    
    if (byAgent) {
      parts.push(`by ${byAgent}`);
    }
    
    return parts.join(' ') + '.';
  }
}

/**
 * HTML highlighting functions
 */
function highlightVerbPhrase(sentence: string, auxiliaries: string[], mainVerb: string): string {
  let highlighted = sentence;
  
  // Highlight verb phrase in orange
  auxiliaries.forEach(aux => {
    highlighted = highlighted.replace(new RegExp(`\\b${aux}\\b`, 'gi'), `<span class="tok-verb">${aux}</span>`);
  });
  
  highlighted = highlighted.replace(new RegExp(`\\b${mainVerb}\\b`, 'gi'), `<span class="tok-verb">${mainVerb}</span>`);
  
  return highlighted;
}

function highlightPassivePhrase(sentence: string, auxiliaries: string[], pastParticiple: string, passiveMarker: string): string {
  let highlighted = highlightVerbPhrase(sentence, auxiliaries, pastParticiple);
  
  // Mute passive markers in Vietnamese context
  if (passiveMarker) {
    highlighted += ` <span class="tok-passive-marker">(${passiveMarker})</span>`;
  }
  
  return highlighted;
}

function highlightAdjectivePhrase(sentence: string, adjWord: string): string {
  return sentence.replace(new RegExp(`\\b${adjWord}\\b`, 'gi'), `<span class="tok-adj">${adjWord}</span>`);
}

function highlightAdverbPhrase(sentence: string, advWord: string): string {
  return sentence.replace(new RegExp(`\\b${advWord}\\b`, 'gi'), `<span class="tok-adv">${advWord}</span>`);
}

function highlightNounPhrase(sentence: string, nounPhrase: string): string {
  return sentence.replace(new RegExp(nounPhrase, 'gi'), `<span class="tok-noun">${nounPhrase}</span>`);
}

function highlightPrepPhrase(sentence: string, prepPhrase: string): string {
  return sentence.replace(new RegExp(prepPhrase, 'gi'), `<span class="tok-prep">${prepPhrase}</span>`);
}