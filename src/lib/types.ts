export type MediaKind = "photo" | "document" | "video";
export type DocType = "event" | "poem" | "letter" | "speech" | "photo" | "document";

export interface MediaItem {
  url: string;
  kind: MediaKind;
  caption?: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface TimelineItem {
  id: string;
  year: number;
  date?: string; // YYYY-MM-DD
  title: string;
  summary: string;
  content?: string; // Full content for letters/documents
  location?: string;
  type: DocType;
  media?: MediaItem[];
  sources?: SourceLink[];
  tags?: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO Date
  author?: string;
  cover?: string;
  metadata?: {
    authorName?: string;
    sourceLink?: string;
    submittedAt?: string;
  };
}

// Quiz Types
export interface QuizChoice {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  choices: QuizChoice[];
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  type?: "single" | "multiple" | "true_false";
  grade_hint?: "THCS" | "THPT" | "nang_cao";
  topic?: "tieu_su" | "su_kien" | "van_ban" | "tu_tuong" | "dia_danh" | "to_chuc" | "van_hoa";
  correct_answers?: string[];
  sources?: string[];
}

export interface QuizMetadata {
  title: string;
  language: string;
  version: string;
  created_at: string;
  description: string;
  copyright: string;
  tags: string[];
}

export interface QuizData {
  metadata: QuizMetadata;
  items: QuizQuestion[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
  grade: 'excellent' | 'good' | 'average' | 'poor';
  incorrectAnswers?: QuizQuestion[];
}
