// 50 Grammar Groups (Vietnamese + English)

import type { Group } from '../types';

export const GROUPS_50: Group[] = [
  // Tenses (1-3)
  { id: 1, vi: "Thì hiện tại", en: "Present Tenses" },
  { id: 2, vi: "Thì quá khứ", en: "Past Tenses" },
  { id: 3, vi: "Thì tương lai", en: "Future Tenses" },
  
  // Modals & Patterns (4-6)
  { id: 4, vi: "Động từ khuyết thiếu", en: "Modal Verbs" },
  { id: 5, vi: "Cấu trúc câu", en: "Sentence Patterns" },
  { id: 6, vi: "Sự hòa hợp chủ-vị", en: "Subject-Verb Agreement" },
  
  // Nouns & Determiners (7-10)
  { id: 7, vi: "Danh từ", en: "Nouns" },
  { id: 8, vi: "Mạo từ", en: "Articles" },
  { id: 9, vi: "Từ hạn định", en: "Determiners" },
  { id: 10, vi: "Đại từ (1)", en: "Pronouns (Basic)" },
  
  // More Pronouns & Adjectives (11-14)
  { id: 11, vi: "Đại từ (2)", en: "Pronouns (Advanced)" },
  { id: 12, vi: "Tính từ (1)", en: "Adjectives (Basic)" },
  { id: 13, vi: "Tính từ (2)", en: "Adjectives (Advanced)" },
  { id: 14, vi: "Trạng từ (1)", en: "Adverbs (Basic)" },
  
  // Adverbs & Comparison (15-18)
  { id: 15, vi: "Trạng từ (2)", en: "Adverbs (Advanced)" },
  { id: 16, vi: "So sánh (1)", en: "Comparison (Basic)" },
  { id: 17, vi: "So sánh (2)", en: "Comparison (Advanced)" },
  { id: 18, vi: "Giới từ (1)", en: "Prepositions (Time)" },
  
  // Prepositions (19-21)
  { id: 19, vi: "Giới từ (2)", en: "Prepositions (Place)" },
  { id: 20, vi: "Giới từ (3)", en: "Prepositions (Movement)" },
  { id: 21, vi: "Loại động từ", en: "Verb Types" },
  
  // Negation & Questions (22-26)
  { id: 22, vi: "Phủ định", en: "Negation" },
  { id: 23, vi: "Câu hỏi (1)", en: "Questions (Yes/No)" },
  { id: 24, vi: "Câu hỏi (2)", en: "Questions (Wh-questions)" },
  { id: 25, vi: "Câu hỏi (3)", en: "Questions (Tag Questions)" },
  { id: 26, vi: "Câu mệnh lệnh", en: "Imperatives" },
  
  // Passive Voice (27-28)
  { id: 27, vi: "Bị động (1)", en: "Passive Voice (Basic)" },
  { id: 28, vi: "Bị động (2)", en: "Passive Voice (Advanced)" },
  
  // Relative Clauses (29-31)
  { id: 29, vi: "Mệnh đề quan hệ (1)", en: "Relative Clauses (Defining)" },
  { id: 30, vi: "Mệnh đề quan hệ (2)", en: "Relative Clauses (Non-defining)" },
  { id: 31, vi: "Mệnh đề quan hệ (3)", en: "Relative Clauses (Advanced)" },
  
  // Noun Clauses (32-33)
  { id: 32, vi: "Mệnh đề danh từ (1)", en: "Noun Clauses (That/If/Whether)" },
  { id: 33, vi: "Mệnh đề danh từ (2)", en: "Noun Clauses (Embedded Questions)" },
  
  // Adverbial Clauses (34-38)
  { id: 34, vi: "Mệnh đề trạng ngữ (1)", en: "Adverbial Clauses (Time)" },
  { id: 35, vi: "Mệnh đề trạng ngữ (2)", en: "Adverbial Clauses (Reason)" },
  { id: 36, vi: "Mệnh đề trạng ngữ (3)", en: "Adverbial Clauses (Purpose)" },
  { id: 37, vi: "Mệnh đề trạng ngữ (4)", en: "Adverbial Clauses (Contrast)" },
  { id: 38, vi: "Mệnh đề trạng ngữ (5)", en: "Adverbial Clauses (Condition)" },
  
  // Conditionals (39-44)
  { id: 39, vi: "Câu điều kiện (0)", en: "Zero Conditional" },
  { id: 40, vi: "Câu điều kiện (1)", en: "First Conditional" },
  { id: 41, vi: "Câu điều kiện (2)", en: "Second Conditional" },
  { id: 42, vi: "Câu điều kiện (3)", en: "Third Conditional" },
  { id: 43, vi: "Câu điều kiện (Mixed A)", en: "Mixed Conditional A" },
  { id: 44, vi: "Câu điều kiện (Mixed B)", en: "Mixed Conditional B" },
  
  // Advanced Structures (45-50)
  { id: 45, vi: "Câu ước", en: "Wishes" },
  { id: 46, vi: "Thức giả định", en: "Subjunctive" },
  { id: 47, vi: "Câu chẻ", en: "Cleft Sentences" },
  { id: 48, vi: "Đảo ngữ", en: "Inversion" },
  { id: 49, vi: "Loại câu", en: "Sentence Types" },
  { id: 50, vi: "Trật tự từ", en: "Word Order" }
];

// Helper function to get group by ID
export function getGroupById(id: number): Group | undefined {
  return GROUPS_50.find(group => group.id === id);
}

// Helper function to get groups by category
export function getGroupsByCategory(category: string): Group[] {
  const categoryMap: Record<string, number[]> = {
    tenses: [1, 2, 3],
    modals: [4, 5, 6],
    nouns: [7, 8, 9, 10, 11],
    adjectives: [12, 13, 16, 17],
    adverbs: [14, 15],
    prepositions: [18, 19, 20],
    verbs: [21, 22],
    questions: [23, 24, 25, 26],
    passive: [27, 28],
    clauses: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
    conditionals: [39, 40, 41, 42, 43, 44],
    advanced: [45, 46, 47, 48, 49, 50]
  };
  
  const groupIds = categoryMap[category] || [];
  return GROUPS_50.filter(group => groupIds.includes(group.id));
}