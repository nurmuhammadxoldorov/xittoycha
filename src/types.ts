export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  xp: number;
  lessonsCompleted: number;
  completedLessonIds: number[]; // HSK 1 completed IDs
  completedHsk2LessonIds?: number[]; // HSK 2 completed IDs
  completedHsk3LessonIds?: number[]; // HSK 3 completed IDs
  bookmarkedWords: string[];
  streakDays: number;
  mockExamResults?: MockExamResult[];
  certificates?: CertificateData[];
  dialoguePracticesCount?: number;
  createdAt: string;
}

export type CertificateType =
  | 'HSK 1 Course'
  | 'HSK 2 Course'
  | 'HSK 3 Course'
  | 'HSK 1 Mock'
  | 'HSK 2 Mock'
  | 'HSK 3 Mock';

export interface CertificateData {
  id: string; // Unique Certificate ID e.g., 'HSK-UZ-2026-78241'
  userId: string;
  userName: string;
  type: CertificateType;
  level: 'HSK 1' | 'HSK 2' | 'HSK 3';
  titleCn: string;
  titleUz: string;
  titleEn: string;
  issueDate: string;
  score?: number; // Optional exam/progress score e.g. 285 or 100
  totalPossibleScore?: number; // e.g. 300
  grade: string; // e.g., "A+ (A'lo / 优秀)"
  sealTextCn: string;
  issuer: string;
  director: string;
  verificationUrl: string;
  securityHash: string;
}

export interface MockExamResult {
  id: string;
  date: string;
  listeningScore: number;
  readingScore: number;
  writingScore: number;
  speakingScore: number;
  totalScore: number;
  passed: boolean;
}

export interface AIDialogueMessage {
  id: string;
  role: 'user' | 'assistant';
  cn: string;
  py: string;
  uz: string;
  audioText?: string;
  timestamp: string;
}

export interface AIDialogueFeedback {
  fluencyScore: number; // 0-100
  grammarScore: number; // 0-100
  pronunciationScore: number; // 0-100
  overallScore: number; // 0-100
  strengths: string[];
  mistakes: Array<{
    original: string;
    correction: string;
    reason: string;
  }>;
  suggestedPhrases: Array<{
    cn: string;
    py: string;
    uz: string;
  }>;
  encouragement: string;
}

export interface VocabWord {
  id: string;
  cn: string;
  py: string;
  en: string;
  uz: string;
  level: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6';
  radical?: string;
  strokes?: number;
  pos?: string; // Part of speech: noun, verb, adj, etc.
  exampleCn?: string;
  examplePy?: string;
  exampleEn?: string;
  exampleUz?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface WritingPrompt {
  id: number;
  prompt: string;
  sampleAnswer: string;
  pinyinSample?: string;
}

export interface LessonData {
  id: number;
  level?: 'HSK 1' | 'HSK 2' | 'HSK 3';
  titleCn: string;
  titleEn: string;
  titleUz: string;
  subtitle: string;
  description: string;
  minVideoMinutes?: number; // e.g., 3 for HSK 1, 5 for HSK 2
  vocab: Array<{
    cn: string;
    py: string;
    en: string;
    uz: string;
  }>;
  grammarTitle: string;
  grammarPattern: string;
  grammarExplanationEn: string;
  grammarExplanationUz: string;
  grammarExample: {
    cn: string;
    py: string;
    en: string;
    uz: string;
  };
  videoScript: string[];
  dialogue: Array<{
    speaker: 'A' | 'B';
    cn: string;
    py: string;
    en: string;
    uz: string;
  }>;
  speakingTargets: string[];
  quizQuestions: QuizQuestion[];
  writingPrompts: WritingPrompt[];
}
