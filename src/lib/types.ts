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

// ==========================
// Battle Royale Game Types
// ==========================

export type WsEventType =
  | "ROOM_UPDATED"
  | "QUESTION_STARTED"
  | "LOCK_ANSWERS"
  | "SCOREBOARD_UPDATED"
  | "PLAYER_JOINED"
  | "PLAYER_LEFT"
  | "ATTACK_RESOLVED";

export interface WsEvent<T = unknown> {
  type: WsEventType;
  payload: T;
}

export interface Player {
  id: string; // uuid
  name: string;
  teamId: string;
  joinedAt: number; // epoch ms
}

export interface Team {
  id: string; // "A", "B", ...
  name: string; // "Team A"
  hp: number; // 0..maxHp
}

export interface RoomConfig {
  numTeams: number;
  maxHpPerTeam: number; // e.g. 100
  timePerQuestionMs: number; // e.g. 20000
  playersPerTeamMax: number;
  baseScore: number; // base points for correct
  speedBonusMax: number; // max speed bonus
  attackDamagePercent: number; // 5-15
  buffHealPercent: number; // 3-8
  maxDamagePerTurnPercent: number; // 20-40 cap per team per turn
  eliminationConfetti: boolean;
}

export interface QuestionItem {
  id: string;
  question: string;
  answers: string[]; // options
  correctIndex: number;
}

export interface QuestionState {
  currentQuestionId?: string;
  startedAt?: number; // epoch ms
  isLocked?: boolean;
}

export interface Submission {
  playerId: string;
  questionId: string;
  answerIndex: number;
  timeMs: number; // time taken by player
  isCorrect?: boolean;
  score?: number;
}

export interface AttackAction {
  attackerPlayerId: string;
  targetTeamId?: string; // if not provided and isBuff=true => buff own team
  isBuff?: boolean; // true => buff own team, false => attack others
  valuePercent?: number; // default 10 for attack, 5 for buff
}

export interface ScoreboardEntry {
  playerId: string;
  name: string;
  score: number;
}

export interface RoomState {
  id: string;
  code: string; // human friendly code
  config: RoomConfig;
  teams: Team[];
  players: Record<string, Player>; // by playerId
  question: QuestionState;
  submissions: Submission[];
  scoreboard: ScoreboardEntry[];
  createdAt: number;
  updatedAt: number;
}

export interface CreateRoomRequest {
  numTeams: number;
  maxHpPerTeam: number;
  timePerQuestionMs: number;
  playersPerTeamMax?: number;
  baseScore?: number;
  speedBonusMax?: number;
  attackDamagePercent?: number;
  buffHealPercent?: number;
  maxDamagePerTurnPercent?: number;
  eliminationConfetti?: boolean;
}

export interface JoinRoomRequest {
  roomCode: string;
  name: string;
  teamId: string;
}

export interface SubmitAnswerRequest {
  roomId: string;
  playerId: string;
  questionId: string;
  answerIndex: number;
  timeMs: number;
}

export const Scoring = {
  calculate: (
    isCorrect: boolean,
    timeLeftMs: number,
    timeLimitMs: number,
    baseScore = 1000,
    speedBonusMax = 500
  ): number => {
    if (!isCorrect) return 0;
    const speedBonus = speedBonusMax * (timeLeftMs / Math.max(1, timeLimitMs));
    return Math.round(baseScore + Math.max(0, speedBonus));
  },
};