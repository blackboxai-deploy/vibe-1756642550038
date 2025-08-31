// English → Vietnamese Mapping System

import type { Subject } from '../types';

/**
 * Get Vietnamese tense marker based on English tense/aspect
 */
export function getVietnameseTenseMarker(
  tense: string, 
  aspect: string, 
  isFrequency: boolean = false
): string {
  // Present Simple
  if (tense === 'present' && aspect === 'simple') {
    return isFrequency ? 'thường' : '';  // Use 'thường' for habitual actions
  }
  
  // Progressive -> đang
  if (aspect === 'prog') {
    return 'đang';
  }
  
  // Perfect -> đã
  if (aspect === 'perf' || aspect === 'perfprog') {
    return 'đã';
  }
  
  // Past Simple -> đã
  if (tense === 'past' && aspect === 'simple') {
    return 'đã';
  }
  
  // Future will -> sẽ
  if (tense === 'future' && aspect === 'simple') {
    return 'sẽ';
  }
  
  // Going to -> sắp
  if (aspect === 'goingto') {
    return 'sắp';
  }
  
  return '';
}

/**
 * Get Vietnamese passive marker
 */
export function getVietnamesePassiveMarker(
  viMarker: 'auto' | 'được' | 'bị',
  variant: 'be' | 'get',
  verbBase: string
): string {
  if (viMarker === 'được') return 'được';
  if (viMarker === 'bị') return 'bị';
  
  // Auto selection logic
  if (variant === 'get') return 'bị';
  
  // Check if verb implies negative outcome
  const negativeVerbs = [
    'fire', 'steal', 'injure', 'damage', 'arrest', 'punish', 'kill',
    'break', 'destroy', 'hurt', 'harm', 'attack', 'rob', 'cheat'
  ];
  
  if (negativeVerbs.includes(verbBase.toLowerCase())) {
    return 'bị';
  }
  
  return 'được';
}

/**
 * Convert English sentence structure to Vietnamese
 */
export function mapToVietnamese({
  subject,
  tenseMarker,
  passiveMarker,
  verb,
  isNegative,
  isQuestion,
  byAgent,
  adjective,
  adverb,
  noun,
  preposition,
  isPassive
}: {
  subject: Subject;
  tenseMarker: string;
  passiveMarker?: string;
  verb: string;
  isNegative?: boolean;
  isQuestion?: boolean;
  byAgent?: string;
  adjective?: string;
  adverb?: string;
  noun?: string;
  preposition?: string;
  isPassive?: boolean;
}): string {
  const viSubject = getVietnameseSubject(subject);
  
  let sentence = viSubject;
  
  if (isPassive && passiveMarker) {
    // Passive voice structure
    if (isNegative) {
      sentence += ` không ${passiveMarker} ${verb}`;
    } else if (isQuestion) {
      sentence = `${viSubject} có ${passiveMarker} ${verb} không?`;
    } else {
      sentence += ` ${passiveMarker} ${verb}`;
    }
    
    if (byAgent) {
      sentence += ` bởi ${byAgent}`;
    }
  } else {
    // Active voice structure
    if (isNegative) {
      if (tenseMarker) {
        sentence += ` không ${tenseMarker} ${verb}`;
      } else {
        sentence += ` không ${verb}`;
      }
    } else if (isQuestion) {
      if (tenseMarker) {
        sentence = `${viSubject} có ${tenseMarker} ${verb} không?`;
      } else {
        sentence = `${viSubject} có ${verb} không?`;
      }
    } else {
      if (tenseMarker) {
        sentence += ` ${tenseMarker} ${verb}`;
      } else {
        sentence += ` ${verb}`;
      }
    }
  }
  
  // Add adjective (after verb in Vietnamese)
  if (adjective) {
    sentence += ` ${adjective}`;
  }
  
  // Add noun object
  if (noun) {
    sentence += ` ${noun}`;
  }
  
  // Add preposition phrase
  if (preposition) {
    sentence += ` ${preposition}`;
  }
  
  // Add adverb (typically at the end)
  if (adverb) {
    sentence += ` ${adverb}`;
  }
  
  return sentence + '.';
}

/**
 * Get Vietnamese subject pronoun
 */
function getVietnameseSubject(subject: Subject): string {
  const subjectMap: Record<Subject, string> = {
    'I': 'Tôi',
    'you': 'Bạn',
    'we': 'Chúng tôi', 
    'they': 'Họ',
    'he': 'Anh ấy',
    'she': 'Cô ấy',
    'it': 'Nó',
    'N': 'Người đó',    // Generic singular person
    'Ns': 'Những người đó'  // Generic plural people
  };
  return subjectMap[subject];
}

/**
 * Convert English verb to Vietnamese equivalent
 */
export function translateVerb(englishVerb: string): string {
  const verbMap: Record<string, string> = {
    // Common verbs
    'be': 'là',
    'have': 'có',
    'do': 'làm',
    'go': 'đi',
    'come': 'đến',
    'get': 'được',
    'make': 'làm',
    'take': 'lấy',
    'give': 'cho',
    'see': 'thấy',
    'know': 'biết',
    'think': 'nghĩ',
    'say': 'nói',
    'tell': 'kể',
    'speak': 'nói',
    'work': 'làm việc',
    'study': 'học',
    'learn': 'học',
    'teach': 'dạy',
    'read': 'đọc',
    'write': 'viết',
    'listen': 'nghe',
    'understand': 'hiểu',
    'help': 'giúp',
    'want': 'muốn',
    'need': 'cần',
    'like': 'thích',
    'love': 'yêu',
    'eat': 'ăn',
    'drink': 'uống',
    'sleep': 'ngủ',
    'walk': 'đi bộ',
    'run': 'chạy',
    'play': 'chơi',
    'watch': 'xem',
    'buy': 'mua',
    'sell': 'bán',
    'open': 'mở',
    'close': 'đóng',
    'start': 'bắt đầu',
    'finish': 'kết thúc',
    'win': 'thắng',
    'lose': 'thua',
    'find': 'tìm',
    'meet': 'gặp',
    'leave': 'rời',
    'arrive': 'đến',
    'call': 'gọi',
    'answer': 'trả lời',
    'ask': 'hỏi',
    'wait': 'đợi',
    'remember': 'nhớ',
    'forget': 'quên',
    'feel': 'cảm thấy',
    'look': 'nhìn',
    'seem': 'có vẻ',
    'become': 'trở thành',
    'live': 'sống',
    'die': 'chết',
    'cook': 'nấu',
    'clean': 'dọn dẹp',
    'wash': 'rửa',
    'drive': 'lái xe',
    'fly': 'bay',
    'swim': 'bơi',
    'dance': 'nhảy',
    'sing': 'hát',
    'smile': 'mỉm cười',
    'laugh': 'cười',
    'cry': 'khóc',
    'accept': 'chấp nhận',
    'refuse': 'từ chối',
    'agree': 'đồng ý',
    'disagree': 'không đồng ý'
  };
  
  return verbMap[englishVerb.toLowerCase()] || englishVerb;
}

/**
 * Convert English adjective to Vietnamese
 */
export function translateAdjective(englishAdj: string): string {
  const adjMap: Record<string, string> = {
    'good': 'tốt',
    'bad': 'xấu',
    'big': 'lớn',
    'small': 'nhỏ',
    'happy': 'vui',
    'sad': 'buồn',
    'beautiful': 'đẹp',
    'ugly': 'xấu',
    'smart': 'thông minh',
    'stupid': 'ngu',
    'fast': 'nhanh',
    'slow': 'chậm',
    'hot': 'nóng',
    'cold': 'lạnh',
    'new': 'mới',
    'old': 'cũ',
    'young': 'trẻ',
    'easy': 'dễ',
    'difficult': 'khó',
    'important': 'quan trọng',
    'interesting': 'thú vị',
    'boring': 'nhàm chán'
  };
  
  return adjMap[englishAdj.toLowerCase()] || englishAdj;
}

/**
 * Convert English adverb to Vietnamese
 */
export function translateAdverb(englishAdv: string): string {
  const advMap: Record<string, string> = {
    'quickly': 'nhanh chóng',
    'slowly': 'chậm chạp',
    'carefully': 'cẩn thận',
    'easily': 'dễ dàng',
    'often': 'thường xuyên',
    'sometimes': 'đôi khi',
    'never': 'không bao giờ',
    'always': 'luôn luôn',
    'usually': 'thường',
    'rarely': 'hiếm khi',
    'here': 'ở đây',
    'there': 'ở đó',
    'now': 'bây giờ',
    'today': 'hôm nay',
    'yesterday': 'hôm qua',
    'tomorrow': 'ngày mai'
  };
  
  return advMap[englishAdv.toLowerCase()] || englishAdv;
}

/**
 * Convert English noun to Vietnamese
 */
export function translateNoun(englishNoun: string): string {
  const nounMap: Record<string, string> = {
    'book': 'cuốn sách',
    'car': 'xe ô tô',
    'house': 'ngôi nhà',
    'dog': 'con chó',
    'cat': 'con mèo',
    'teacher': 'giáo viên',
    'student': 'học sinh',
    'friend': 'bạn bè',
    'family': 'gia đình',
    'water': 'nước',
    'food': 'thức ăn',
    'school': 'trường học',
    'work': 'công việc',
    'money': 'tiền',
    'time': 'thời gian',
    'day': 'ngày',
    'night': 'đêm',
    'morning': 'buổi sáng',
    'afternoon': 'buổi chiều',
    'evening': 'buổi tối'
  };
  
  return nounMap[englishNoun.toLowerCase()] || englishNoun;
}