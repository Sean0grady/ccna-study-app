export const DOMAINS = [
  { id: 'network-fundamentals', label: 'Network Fundamentals', file: 'network-fundamentals.json' },
  { id: 'network-access', label: 'Network Access', file: 'network-access.json' },
  { id: 'ip-connectivity', label: 'IP Connectivity', file: 'ip-connectivity.json' },
  { id: 'ip-services', label: 'IP Services', file: 'ip-services.json' },
  { id: 'security-fundamentals', label: 'Security Fundamentals', file: 'security-fundamentals.json' },
  { id: 'automation-programmability', label: 'Automation and Programmability', file: 'automation-programmability.json' },
] as const;

export type DomainId = (typeof DOMAINS)[number]['id'];

export function getDomainLabel(id: DomainId): string {
  return DOMAINS.find((d) => d.id === id)?.label ?? id;
}

export function domainIdFromLabel(label: string): DomainId | undefined {
  return DOMAINS.find((d) => d.label === label)?.id;
}
