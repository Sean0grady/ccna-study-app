import { DOMAINS, type DomainId } from '@/data/domains';
import automationProgrammability from '@/data/questions/automation-programmability.json';
import ipConnectivity from '@/data/questions/ip-connectivity.json';
import ipServices from '@/data/questions/ip-services.json';
import networkAccess from '@/data/questions/network-access.json';
import networkFundamentals from '@/data/questions/network-fundamentals.json';
import securityFundamentals from '@/data/questions/security-fundamentals.json';
import type { Question } from '@/types/question';
import { sampleMixedExam as sampleMixedExamFromPool } from '@/utils/sampler';

const RAW: Record<DomainId, Question[]> = {
  'network-fundamentals': networkFundamentals as Question[],
  'network-access': networkAccess as Question[],
  'ip-connectivity': ipConnectivity as Question[],
  'ip-services': ipServices as Question[],
  'security-fundamentals': securityFundamentals as Question[],
  'automation-programmability': automationProgrammability as Question[],
};

function validateQuestionBank(bank: Record<DomainId, Question[]>) {
  const seenIds = new Set<string>();
  for (const domain of DOMAINS) {
    const questions = bank[domain.id];
    for (const q of questions) {
      const prefix = `[${domain.file}] question "${q.id}"`;
      if (q.choices.length !== 4) {
        console.error(`${prefix} does not have exactly 4 choices`);
      }
      if (q.correctAnswer < 0 || q.correctAnswer > 3) {
        console.error(`${prefix} has an out-of-range correctAnswer: ${q.correctAnswer}`);
      }
      if (!q.explanation?.trim()) {
        console.error(`${prefix} is missing an explanation`);
      }
      if (q.domain !== domain.label) {
        console.error(`${prefix} has domain "${q.domain}", expected "${domain.label}"`);
      }
      if (seenIds.has(q.id)) {
        console.error(`Duplicate question id "${q.id}" found in ${domain.file}`);
      }
      seenIds.add(q.id);
    }
  }
}

if (__DEV__) {
  validateQuestionBank(RAW);
}

export function getAllQuestions(): Question[] {
  return DOMAINS.flatMap((domain) => RAW[domain.id]);
}

export function getQuestionsByDomain(domainId: DomainId): Question[] {
  return RAW[domainId] ?? [];
}

export function getQuestionById(id: string): Question | undefined {
  return getAllQuestions().find((q) => q.id === id);
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const idSet = new Set(ids);
  return getAllQuestions().filter((q) => idSet.has(q.id));
}

export function getQuestionCountByDomain(domainId: DomainId): number {
  return getQuestionsByDomain(domainId).length;
}

export function sampleMixedExam(count = 20): Question[] {
  return sampleMixedExamFromPool(RAW, count);
}
