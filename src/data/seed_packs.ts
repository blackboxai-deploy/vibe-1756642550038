// Seed Vocabulary Packs - Demo data for immediate use

import type { Packs, VerbForm, AdjItem, AdvItem, NounItem, PrepItem, VocabItem } from '../types';

// Demo Verb Forms (20 irregular + 20 regular)
const VERB_FORMS: VerbForm[] = [
  // Irregular verbs
  { base: "be", past: "was/were", pp: "been", vi: "là/ở" },
  { base: "have", past: "had", pp: "had", vi: "có" },
  { base: "do", past: "did", pp: "done", vi: "làm" },
  { base: "go", past: "went", pp: "gone", vi: "đi" },
  { base: "get", past: "got", pp: "gotten", vi: "được/lấy" },
  { base: "make", past: "made", pp: "made", vi: "làm/tạo" },
  { base: "take", past: "took", pp: "taken", vi: "lấy/mang" },
  { base: "come", past: "came", pp: "come", vi: "đến" },
  { base: "see", past: "saw", pp: "seen", vi: "thấy" },
  { base: "know", past: "knew", pp: "known", vi: "biết" },
  { base: "think", past: "thought", pp: "thought", vi: "nghĩ" },
  { base: "say", past: "said", pp: "said", vi: "nói" },
  { base: "tell", past: "told", pp: "told", vi: "kể" },
  { base: "give", past: "gave", pp: "given", vi: "cho" },
  { base: "find", past: "found", pp: "found", vi: "tìm thấy" },
  { base: "leave", past: "left", pp: "left", vi: "rời đi" },
  { base: "feel", past: "felt", pp: "felt", vi: "cảm thấy" },
  { base: "become", past: "became", pp: "become", vi: "trở thành" },
  { base: "bring", past: "brought", pp: "brought", vi: "mang đến" },
  { base: "buy", past: "bought", pp: "bought", vi: "mua" },
  
  // Regular verbs
  { base: "work", past: "worked", pp: "worked", vi: "làm việc" },
  { base: "study", past: "studied", pp: "studied", vi: "học" },
  { base: "play", past: "played", pp: "played", vi: "chơi" },
  { base: "watch", past: "watched", pp: "watched", vi: "xem" },
  { base: "listen", past: "listened", pp: "listened", vi: "nghe" },
  { base: "help", past: "helped", pp: "helped", vi: "giúp đỡ" },
  { base: "want", past: "wanted", pp: "wanted", vi: "muốn" },
  { base: "need", past: "needed", pp: "needed", vi: "cần" },
  { base: "like", past: "liked", pp: "liked", vi: "thích" },
  { base: "love", past: "loved", pp: "loved", vi: "yêu" },
  { base: "live", past: "lived", pp: "lived", vi: "sống" },
  { base: "walk", past: "walked", pp: "walked", vi: "đi bộ" },
  { base: "talk", past: "talked", pp: "talked", vi: "nói chuyện" },
  { base: "cook", past: "cooked", pp: "cooked", vi: "nấu ăn" },
  { base: "clean", past: "cleaned", pp: "cleaned", vi: "dọn dẹp" },
  { base: "open", past: "opened", pp: "opened", vi: "mở" },
  { base: "close", past: "closed", pp: "closed", vi: "đóng" },
  { base: "start", past: "started", pp: "started", vi: "bắt đầu" },
  { base: "finish", past: "finished", pp: "finished", vi: "kết thúc" },
  { base: "answer", past: "answered", pp: "answered", vi: "trả lời" }
];

// Demo Adjectives (15 items)
const ADJ_ITEMS: AdjItem[] = [
  { word: "good", vi: "tốt", subtype: "base" },
  { word: "bad", vi: "xấu", subtype: "base" },
  { word: "big", vi: "lớn", subtype: "base" },
  { word: "small", vi: "nhỏ", subtype: "base" },
  { word: "happy", vi: "vui", subtype: "base" },
  { word: "sad", vi: "buồn", subtype: "base" },
  { word: "beautiful", vi: "đẹp", subtype: "base" },
  { word: "ugly", vi: "xấu xí", subtype: "base" },
  { word: "smart", vi: "thông minh", subtype: "base" },
  { word: "fast", vi: "nhanh", subtype: "base" },
  { word: "slow", vi: "chậm", subtype: "base" },
  { word: "tired", vi: "mệt", subtype: "ed" },
  { word: "excited", vi: "hứng thú", subtype: "ed" },
  { word: "interesting", vi: "thú vị", subtype: "ing" },
  { word: "boring", vi: "nhàm chán", subtype: "ing" }
];

// Demo Adverbs (15 items)
const ADV_ITEMS: AdvItem[] = [
  { word: "often", vi: "thường xuyên", klass: "frequency" },
  { word: "usually", vi: "thường", klass: "frequency" },
  { word: "sometimes", vi: "đôi khi", klass: "frequency" },
  { word: "never", vi: "không bao giờ", klass: "frequency" },
  { word: "always", vi: "luôn luôn", klass: "frequency" },
  { word: "quickly", vi: "nhanh chóng", klass: "manner" },
  { word: "slowly", vi: "chậm chạp", klass: "manner" },
  { word: "carefully", vi: "cẩn thận", klass: "manner" },
  { word: "easily", vi: "dễ dàng", klass: "manner" },
  { word: "well", vi: "tốt", klass: "manner" },
  { word: "very", vi: "rất", klass: "degree" },
  { word: "really", vi: "thực sự", klass: "degree" },
  { word: "quite", vi: "khá", klass: "degree" },
  { word: "here", vi: "ở đây", klass: "place" },
  { word: "there", vi: "ở đó", klass: "place" }
];

// Demo Nouns (15 sing + 10 plu + 10 unc)
const NOUN_ITEMS: NounItem[] = [
  // Singular countable
  { word: "book", type: "sing", vi: "cuốn sách" },
  { word: "car", type: "sing", vi: "xe ô tô" },
  { word: "house", type: "sing", vi: "ngôi nhà" },
  { word: "dog", type: "sing", vi: "con chó" },
  { word: "cat", type: "sing", vi: "con mèo" },
  { word: "teacher", type: "sing", vi: "giáo viên" },
  { word: "student", type: "sing", vi: "học sinh" },
  { word: "friend", type: "sing", vi: "bạn bè" },
  { word: "computer", type: "sing", vi: "máy tính" },
  { word: "phone", type: "sing", vi: "điện thoại" },
  { word: "table", type: "sing", vi: "cái bàn" },
  { word: "chair", type: "sing", vi: "cái ghế" },
  { word: "window", type: "sing", vi: "cửa sổ" },
  { word: "door", type: "sing", vi: "cửa ra vào" },
  { word: "school", type: "sing", vi: "trường học" },
  
  // Plural
  { word: "books", type: "plu", vi: "những cuốn sách" },
  { word: "cars", type: "plu", vi: "những xe ô tô" },
  { word: "houses", type: "plu", vi: "những ngôi nhà" },
  { word: "children", type: "plu", vi: "trẻ em" },
  { word: "people", type: "plu", vi: "mọi người" },
  { word: "women", type: "plu", vi: "phụ nữ" },
  { word: "men", type: "plu", vi: "đàn ông" },
  { word: "feet", type: "plu", vi: "bàn chân" },
  { word: "teeth", type: "plu", vi: "răng" },
  { word: "mice", type: "plu", vi: "chuột" },
  
  // Uncountable
  { word: "water", type: "unc", vi: "nước" },
  { word: "milk", type: "unc", vi: "sữa" },
  { word: "money", type: "unc", vi: "tiền" },
  { word: "time", type: "unc", vi: "thời gian" },
  { word: "music", type: "unc", vi: "âm nhạc" },
  { word: "love", type: "unc", vi: "tình yêu" },
  { word: "happiness", type: "unc", vi: "hạnh phúc" },
  { word: "information", type: "unc", vi: "thông tin" },
  { word: "advice", type: "unc", vi: "lời khuyên" },
  { word: "homework", type: "unc", vi: "bài tập về nhà" }
];

// Demo Prepositions (20 items across 4 categories)
const PREP_ITEMS: PrepItem[] = [
  // Time prepositions
  { word: "at", vi: "vào (thời gian)", cat: "time", ex: "at 3 o'clock" },
  { word: "in", vi: "trong (thời gian)", cat: "time", ex: "in the morning" },
  { word: "on", vi: "vào (ngày)", cat: "time", ex: "on Monday" },
  { word: "during", vi: "trong suốt", cat: "time", ex: "during the meeting" },
  { word: "for", vi: "trong (khoảng thời gian)", cat: "time", ex: "for 2 hours" },
  
  // Place prepositions
  { word: "in", vi: "trong (không gian)", cat: "place", ex: "in the room" },
  { word: "on", vi: "trên", cat: "place", ex: "on the table" },
  { word: "at", vi: "ở (địa điểm)", cat: "place", ex: "at school" },
  { word: "under", vi: "dưới", cat: "place", ex: "under the bridge" },
  { word: "over", vi: "phía trên", cat: "place", ex: "over the clouds" },
  { word: "between", vi: "giữa (hai)", cat: "place", ex: "between A and B" },
  { word: "among", vi: "giữa (nhiều)", cat: "place", ex: "among friends" },
  
  // Movement prepositions
  { word: "to", vi: "đến", cat: "move", ex: "go to school" },
  { word: "from", vi: "từ", cat: "move", ex: "come from home" },
  { word: "into", vi: "vào trong", cat: "move", ex: "walk into the room" },
  { word: "out of", vi: "ra khỏi", cat: "move", ex: "come out of the house" },
  { word: "through", vi: "qua", cat: "move", ex: "walk through the park" },
  
  // Other prepositions
  { word: "with", vi: "với", cat: "other", ex: "with my friends" },
  { word: "without", vi: "không có", cat: "other", ex: "without money" },
  { word: "about", vi: "về", cat: "other", ex: "talk about work" }
];

// Demo Vocabulary (20 general items)
const VOCAB_ITEMS: VocabItem[] = [
  { word: "hello", vi: "xin chào", pos: "phr" },
  { word: "goodbye", vi: "tạm biệt", pos: "phr" },
  { word: "please", vi: "xin lỗi/làm ơn", pos: "adv" },
  { word: "thank you", vi: "cám ơn", pos: "phr" },
  { word: "sorry", vi: "xin lỗi", pos: "adj" },
  { word: "excuse me", vi: "xin lỗi (để qua)", pos: "phr" },
  { word: "yes", vi: "có/đúng", pos: "adv" },
  { word: "no", vi: "không", pos: "adv" },
  { word: "maybe", vi: "có thể", pos: "adv" },
  { word: "today", vi: "hôm nay", pos: "adv" },
  { word: "tomorrow", vi: "ngày mai", pos: "adv" },
  { word: "yesterday", vi: "hôm qua", pos: "adv" },
  { word: "morning", vi: "buổi sáng", pos: "n" },
  { word: "afternoon", vi: "buổi chiều", pos: "n" },
  { word: "evening", vi: "buổi tối", pos: "n" },
  { word: "night", vi: "ban đêm", pos: "n" },
  { word: "weekend", vi: "cuối tuần", pos: "n" },
  { word: "family", vi: "gia đình", pos: "n" },
  { word: "important", vi: "quan trọng", pos: "adj" },
  { word: "difficult", vi: "khó khăn", pos: "adj" }
];

// Export consolidated packs
export const SEED_PACKS: Packs = {
  verb_forms: VERB_FORMS,
  adjs: ADJ_ITEMS,
  advs: ADV_ITEMS,
  nouns: NOUN_ITEMS,
  preps: PREP_ITEMS,
  vocab: VOCAB_ITEMS,
  units: [] // Units are handled separately in units_125.ts
};

// Individual pack exports for selective import
export {
  VERB_FORMS,
  ADJ_ITEMS,
  ADV_ITEMS,
  NOUN_ITEMS,
  PREP_ITEMS,
  VOCAB_ITEMS
};