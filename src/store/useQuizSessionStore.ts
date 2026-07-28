import { create } from 'zustand';

import type { DomainId } from '@/data/domains';
import type { Question } from '@/types/question';
import type { AnsweredQuestion, SessionScore } from '@/utils/scoring';
import { computeDomainBreakdown, computeSessionScore } from '@/utils/scoring';
import { useProgressStore } from '@/store/useProgressStore';

export type QuizMode = 'practice' | 'exam' | 'missed';

export interface CompletedSessionSummary {
  mode: QuizMode;
  domainId?: DomainId;
  score: SessionScore;
  domainBreakdown: ReturnType<typeof computeDomainBreakdown>;
  answers: AnsweredQuestion[];
}

interface QuizSessionState {
  mode: QuizMode | null;
  domainId: DomainId | null;
  questions: Question[];
  currentIndex: number;
  selectedIndex: number | null;
  answers: AnsweredQuestion[];
  lastCompletedSession: CompletedSessionSummary | null;
}

interface QuizSessionActions {
  startSession: (mode: QuizMode, questions: Question[], domainId?: DomainId) => void;
  selectChoice: (index: number) => void;
  nextQuestion: () => void;
  finishSession: () => void;
  resetSession: () => void;
}

const initialState: QuizSessionState = {
  mode: null,
  domainId: null,
  questions: [],
  currentIndex: 0,
  selectedIndex: null,
  answers: [],
  lastCompletedSession: null,
};

export const useQuizSessionStore = create<QuizSessionState & QuizSessionActions>((set, get) => ({
  ...initialState,

  startSession: (mode, questions, domainId) => {
    set({
      mode,
      domainId: domainId ?? null,
      questions,
      currentIndex: 0,
      selectedIndex: null,
      answers: [],
    });
  },

  selectChoice: (index) => {
    const { questions, currentIndex, selectedIndex } = get();
    if (selectedIndex !== null) return;

    const question = questions[currentIndex];
    if (!question) return;

    const correct = index === question.correctAnswer;
    set((state) => ({
      selectedIndex: index,
      answers: [...state.answers, { question, selectedIndex: index, correct }],
    }));

    useProgressStore.getState().recordAnswer(question.id, question.domain, correct);
  },

  nextQuestion: () => {
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      selectedIndex: null,
    }));
  },

  finishSession: () => {
    const { mode, domainId, answers } = get();
    if (!mode) return;

    const summary: CompletedSessionSummary = {
      mode,
      domainId: domainId ?? undefined,
      score: computeSessionScore(answers),
      domainBreakdown: computeDomainBreakdown(answers),
      answers,
    };

    if (mode === 'exam') {
      useProgressStore.getState().recordExamCompletion(answers);
    }

    set({ lastCompletedSession: summary });
  },

  resetSession: () => {
    set({ ...initialState, lastCompletedSession: get().lastCompletedSession });
  },
}));
