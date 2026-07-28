import { DOMAINS, type DomainId } from '@/data/domains';
import { getQuestionCountByDomain } from '@/data/questionLoader';
import { useProgressStore } from '@/store/useProgressStore';

export interface DomainDisplayStat {
  id: DomainId;
  label: string;
  questionCount: number;
  correct: number;
  incorrect: number;
  attempted: number;
  accuracy: number | null;
  missedCount: number;
}

export function useDomainStats(): DomainDisplayStat[] {
  const domainStats = useProgressStore((state) => state.domainStats);
  const missedQuestions = useProgressStore((state) => state.missedQuestions);

  return DOMAINS.map((domain) => {
    const stat = domainStats[domain.id];
    const correct = stat?.correct ?? 0;
    const incorrect = stat?.incorrect ?? 0;
    const attempted = correct + incorrect;
    const missedCount = Object.values(missedQuestions).filter((m) => m.domainId === domain.id).length;

    return {
      id: domain.id,
      label: domain.label,
      questionCount: getQuestionCountByDomain(domain.id),
      correct,
      incorrect,
      attempted,
      accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : null,
      missedCount,
    };
  });
}
