import type { Fighter, FightEvent } from '../types';
import { seededRandom, hashSeed } from './fightEngine';

const templates: Record<string, string[]> = {
  'fight-start': ['{headline}. The arena contract is now binding.'],
  signature: [
    '{fighter} has activated {headline}. The paperwork is already on fire.',
    '{headline} lands clean for {fighter}. The opposing corner is requesting an audit.',
  ],
  commission: [
    'The Commission has entered the fight: {headline}. Competitive integrity remains allegedly intact.',
    '{headline}. A ruling so decisive it arrived before the explanation.',
  ],
  intervention: [
    'The crowd invokes {headline}. {target} must answer immediately.',
    '{headline} from the cheap seats. The audience has become a regulatory body.',
  ],
  countdown: ['Ten seconds remain. Every token now requires executive approval.'],
  'mode-shift': ['{fighter} changes operating mode. Finance has been notified.'],
  momentum: ['Lead change: {fighter} has seized the output rail. The other corner is recalculating.'],
  'cost-effect': ['{fighter} has opened a burn gap large enough to concern an auditor.'],
  'fighter-output': ['Another token milestone falls. Useful work remains unconfirmed.'],
  stall: ['{target} has triggered the repetition buzzer. The crowd has heard enough.'],
  default: ['{headline}. The official record grows heavier.'],
};

function fill(template: string, event: FightEvent, fighters: Fighter[]): string {
  const fighter = fighters.find(item => item.id === event.actor);
  const target = fighters.find(item => item.id === event.target);
  return template
    .replaceAll('{fighter}', fighter?.name ?? String(event.actor))
    .replaceAll('{target}', target?.name ?? event.target ?? 'the target')
    .replaceAll('{headline}', event.headline);
}

export function commentaryForEvent(event: FightEvent, fighters: Fighter[], used: Set<string>): string {
  const pool = templates[event.type] ?? templates.default;
  const random = seededRandom(hashSeed(event.id));
  const ordered = [...pool].sort(() => random() - 0.5);
  const candidate = ordered.map(line => fill(line, event, fighters)).find(line => !used.has(line));
  return candidate ?? fill(templates.default[0], event, fighters);
}
