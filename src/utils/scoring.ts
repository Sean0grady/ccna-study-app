import { domainIdFromLabel, type DomainId } from '@/data/domains';
import type { Question } from '@/types/question';

export interface AnsweredQuestion {
  question: Question;
  selectedIndex: number;
  correct: boolean;
}

export interface SessionScore {
  correct: number;
  total: number;
}

export function computeSessionScore(answers: AnsweredQuestion[]): SessionScore {
  return {
    correct: answers.filter((a) => a.correct).length,
    total: answers.length,
  };
}

export function computeDomainBreakdown(
  answers: AnsweredQuestion[]
): Partial<Record<DomainId, { correct: number; total: number }>> {
  const breakdown: Partial<Record<DomainId, { correct: number; total: number }>> = {};
  for (const answer of answers) {
    const domainId = domainIdFromLabel(answer.question.domain);
    if (!domainId) continue;
    const entry = breakdown[domainId] ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (answer.correct) entry.correct += 1;
    breakdown[domainId] = entry;
  }
  return breakdown;
}
