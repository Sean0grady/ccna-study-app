import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { domainIdFromLabel } from '@/data/domains';
import type { ExamHistoryEntry, ProgressState } from '@/types/progress';
import type { AnsweredQuestion } from '@/utils/scoring';
import { computeDomainBreakdown, computeSessionScore } from '@/utils/scoring';
import { PROGRESS_STORAGE_KEY } from '@/utils/storageKeys';

const MAX_EXAM_HISTORY = 20;

interface ProgressActions {
  recordAnswer: (questionId: string, domainLabel: string, correct: boolean) => void;
  recordExamCompletion: (answers: AnsweredQuestion[]) => void;
  clearMissedQuestion: (questionId: string) => void;
  clearAllMissed: () => void;
}

const initialState: ProgressState = {
  version: 1,
  domainStats: {},
  missedQuestions: {},
  examHistory: [],
};

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      recordAnswer: (questionId, domainLabel, correct) => {
        const domainId = domainIdFromLabel(domainLabel);
        if (!domainId) return;

        set((state) => {
          const existingStat = state.domainStats[domainId] ?? {
            correct: 0,
            incorrect: 0,
            lastPracticedAt: null,
          };

          const domainStats = {
            ...state.domainStats,
            [domainId]: {
              correct: existingStat.correct + (correct ? 1 : 0),
              incorrect: existingStat.incorrect + (correct ? 0 : 1),
              lastPracticedAt: new Date().toISOString(),
            },
          };

          const missedQuestions = { ...state.missedQuestions };
          if (correct) {
            delete missedQuestions[questionId];
          } else {
            const existing = missedQuestions[questionId];
            missedQuestions[questionId] = {
              questionId,
              domainId,
              timesMissed: (existing?.timesMissed ?? 0) + 1,
              lastMissedAt: new Date().toISOString(),
            };
          }

          return { domainStats, missedQuestions };
        });
      },

      recordExamCompletion: (answers) => {
        const score = computeSessionScore(answers);
        const breakdown = computeDomainBreakdown(answers);
        const entry: ExamHistoryEntry = {
          id: `exam-${Date.now()}`,
          takenAt: new Date().toISOString(),
          scoreCorrect: score.correct,
          scoreTotal: score.total,
          domainBreakdown: breakdown,
        };

        set((state) => ({
          examHistory: [entry, ...state.examHistory].slice(0, MAX_EXAM_HISTORY),
        }));
      },

      clearMissedQuestion: (questionId) => {
        set((state) => {
          const missedQuestions = { ...state.missedQuestions };
          delete missedQuestions[questionId];
          return { missedQuestions };
        });
      },

      clearAllMissed: () => {
        set({ missedQuestions: {} });
      },
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        version: state.version,
        domainStats: state.domainStats,
        missedQuestions: state.missedQuestions,
        examHistory: state.examHistory,
      }),
    }
  )
);
