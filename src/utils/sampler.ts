import { DOMAINS, type DomainId } from '@/data/domains';
import type { Question } from '@/types/question';

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Flat/even sampling across all domains: each domain gets floor(count / domainCount),
 * with the remainder randomly distributed across a shuffled subset of domains each call.
 * If a domain's pool is smaller than its quota, the shortfall is backfilled from the
 * remaining largest pools so the total returned is always exactly `count` (when enough
 * questions exist overall).
 */
export function sampleMixedExam(pool: Record<DomainId, Question[]>, count = 20): Question[] {
  const domainIds = DOMAINS.map((d) => d.id);
  const baseQuota = Math.floor(count / domainIds.length);
  const remainder = count % domainIds.length;
  const bonusDomains = new Set(shuffle(domainIds).slice(0, remainder));

  const quotas: Record<DomainId, number> = {} as Record<DomainId, number>;
  for (const id of domainIds) {
    quotas[id] = baseQuota + (bonusDomains.has(id) ? 1 : 0);
  }

  const selected: Question[] = [];
  const leftovers: Question[] = [];

  for (const id of domainIds) {
    const shuffled = shuffle(pool[id] ?? []);
    const quota = quotas[id];
    selected.push(...shuffled.slice(0, quota));
    leftovers.push(...shuffled.slice(quota));
  }

  const shortfall = count - selected.length;
  if (shortfall > 0) {
    selected.push(...shuffle(leftovers).slice(0, shortfall));
  }

  return shuffle(selected);
}
