import type { DomainId } from '@/data/domains';

export interface DomainStat {
  correct: number;
  incorrect: number;
  lastPracticedAt: string | null;
}

export interface MissedQuestionEntry {
  questionId: string;
  domainId: DomainId;
  timesMissed: number;
  lastMissedAt: string;
}

export interface ExamHistoryEntry {
  id: string;
  takenAt: string;
  scoreCorrect: number;
  scoreTotal: number;
  domainBreakdown: Partial<Record<DomainId, { correct: number; total: number }>>;
}

export interface ProgressState {
  version: 1;
  domainStats: Partial<Record<DomainId, DomainStat>>;
  missedQuestions: Record<string, MissedQuestionEntry>;
  examHistory: ExamHistoryEntry[];
}
