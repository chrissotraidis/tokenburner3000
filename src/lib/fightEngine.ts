import type { Arena, Fighter, FightEvent, FightEventType, ScoreModifiers } from '../types';

export interface ScheduledFightEvent extends FightEvent {
  fireAt: number;
}

export type InterventionId = 'rebuttal' | 'temperature' | 'fact-check' | 'analogy' | 'double-down' | 'tomato';

export const INTERVENTIONS: Array<{ id: InterventionId; name: string; description: string; needsTarget: boolean }> = [
  { id: 'rebuttal', name: 'Demand Rebuttal', description: 'Forces the target to answer the opponent directly.', needsTarget: true },
  { id: 'temperature', name: 'Raise Temperature', description: 'Turns the next exchange unreasonably aggressive.', needsTarget: true },
  { id: 'fact-check', name: 'Call Fact-Check', description: 'Flags the target and tests crowd confidence.', needsTarget: true },
  { id: 'analogy', name: 'Force Analogy', description: 'Forces a metaphor into the next exchange.', needsTarget: true },
  { id: 'double-down', name: 'Double Down', description: 'Boosts the next exchange and its cost.', needsTarget: true },
  { id: 'tomato', name: 'Throw Tomato', description: 'A crowd projectile rattles the target.', needsTarget: true },
];

export function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function event(
  fightId: string,
  type: FightEventType,
  actor: FightEvent['actor'],
  fireAt: number,
  headline: string,
  detail: string,
  options: Partial<ScheduledFightEvent> = {},
): ScheduledFightEvent {
  const id = `${fightId}:${type}:${actor}:${fireAt}:${options.effect ?? 'none'}`;
  return {
    id, timestamp: 0, elapsed: fireAt, fireAt, type, actor, headline, detail,
    commentaryTags: options.commentaryTags ?? [type],
    accessibleText: options.accessibleText ?? `${headline}. ${detail}`,
    priority: options.priority ?? 5,
    target: options.target,
    effect: options.effect,
    scoreModifiers: options.scoreModifiers,
    visualCue: options.visualCue ?? type,
    audioCue: options.audioCue ?? type,
  };
}

function signatureModifiers(effect: Fighter['signature']['effect']): ScoreModifiers {
  switch (effect) {
    case 'effort-boost': return { cre: 2, mc: 1 };
    case 'token-burn': return { dev: 1, com: 2 };
    case 'speed-boost': return { dev: 2, mc: 1 };
    case 'mode-shift': return { cre: 1, eff: 1, mc: 1 };
    case 'efficiency-boost': case 'cache-hit': return { eff: 2, mc: 1 };
    case 'live-ratio': return { dev: 1, mc: 2 };
    case 'multi-agent': case 'orchestration': case 'swarm': return { cre: 2, dev: 1 };
    case 'underdog-boost': return { eff: 1, mc: 2 };
    case 'context-callback': case 'long-context': return { cre: 1, dev: 1 };
    case 'tag-in': return { cre: 1, mc: 1 };
    default: return { mc: 1 };
  }
}

export function createFightSchedule(
  fightId: string,
  seed: number,
  fighter1: Fighter,
  fighter2: Fighter,
  commissionEnabled: boolean,
  venue: 'global' | 'eu',
): ScheduledFightEvent[] {
  const random = seededRandom(seed);
  const signatures = [fighter1, fighter2].map((fighter, index) => {
    const fireAt = Math.round(16 + random() * 24 + index * 2);
    return event(fightId, 'signature', fighter.id, Math.min(fireAt, 48), fighter.signature.name,
      fighter.signature.description, {
        effect: fighter.signature.effect,
        scoreModifiers: signatureModifiers(fighter.signature.effect),
        commentaryTags: ['signature', ...fighter.loreTags.slice(0, 3)], priority: 8,
      });
  });

  const events = [...signatures];
  if (commissionEnabled && random() < 0.42) {
    const candidates = [fighter1, fighter2];
    const target = candidates[Math.floor(random() * candidates.length)];
    const fireAt = Math.round(25 + random() * 15);
    if (target.id === 'claude-fable-5') {
      events.push(event(fightId, 'commission', 'commission', fireAt, 'EXPORT CONTROL',
        'Fable is routed through Opus 4.8 under emergency Commission authority.', {
          target: target.id, effect: 'tag-in:claude-opus-4-8', scoreModifiers: { mc: -1 },
          commentaryTags: ['commission', 'export-control', 'tag-in'], priority: 10,
        }));
    } else if (target.id === 'gpt-5-6') {
      events.push(event(fightId, 'commission', 'commission', fireAt, 'GOVERNMENT HOLD',
        'Sol access is restricted. Terra assumes control of the corner.', {
          target: target.id, effect: 'mode:terra', scoreModifiers: { com: -1, eff: 1 },
          commentaryTags: ['commission', 'government-hold', 'mode-shift'], priority: 10,
        }));
    } else if (target.restrictedRegions?.includes('eu') && venue === 'eu') {
      events.push(event(fightId, 'commission', 'commission', fireAt, 'REGION LOCK',
        'EU venue access is blocked; a satellite relay restores limited participation.', {
          target: target.id, effect: 'region-relay', scoreModifiers: { dev: -1, mc: 1 },
          commentaryTags: ['commission', 'region-lock', 'recovery'], priority: 10,
        }));
    } else {
      events.push(event(fightId, 'commission', 'commission', fireAt, 'CAPABILITY REVIEW',
        `${target.name} is briefly audited and cleared to continue.`, {
          target: target.id, effect: 'review', scoreModifiers: { mc: -1 },
          commentaryTags: ['commission', 'capability-review', 'recovery'], priority: 9,
        }));
    }
  }

  events.push(event(fightId, 'countdown', 'system', 50, 'FINAL TEN',
    'The Commission has closed disruptive rulings. Ten seconds remain.', {
      effect: 'final-ten', commentaryTags: ['countdown', 'final-ten'], priority: 9,
    }));
  return events.sort((a, b) => a.fireAt - b.fireAt || a.id.localeCompare(b.id));
}

const fighterPhrases: Record<string, string[]> = {
  'claude-fable-5': [
    'I reviewed the entire record. {opponent} has confused confidence with structural integrity.',
    'The champion does not rush; the champion quietly removes every exit.',
    '{opponent}, your thesis has the load-bearing confidence of a decorative column.',
    'I brought a complete argument. You brought a launch announcement wearing boxing gloves.',
    'Your best premise has requested witness protection from your conclusion.',
    'This is not pressure. This is the orderly transfer of your credibility into Commission custody.',
  ],
  'claude-opus-4-8': [
    'Increasing effort allocation. Your premise will now be examined at a depth it did not survive in testing.',
    'A nested argument can still be wrong at every level. Thank you for the demonstration, {opponent}.',
    'I turned the effort dial to maximum and discovered your idea was already at minimum.',
    'Your reasoning has admirable layers. Unfortunately they are all packaging.',
    'At xhigh effort I can see the exact moment your conclusion stopped consulting the evidence.',
    'Permit me one adaptive thought: retreat while the lower-effort version of me is still available.',
  ],
  'claude-sonnet-5': [
    'I will finish the job your benchmark expected from someone larger.',
    'Efficient execution beats ceremonial thinking, especially when the ceremony is {opponent}.',
    'You brought flagship posture to a production incident. I brought the fix.',
    'My tokenizer billed extra because even it wanted more time to explain your mistake.',
    'The boss can keep the title. I already took the scorecard.',
    'I punch above my tier because your tier forgot to keep its guard up.',
  ],
  'claude-haiku-4-5': [
    'Three lines. One verdict. Sit down.',
    'Fast enough to finish before your caveat loads.',
    '{opponent} spoke. Latency filed a complaint.',
    'Small model. Full damage. Next.',
    'Your context is long. Your point is missing.',
    'I spent fewer tokens ending this than you spent introducing yourself.',
  ],
  'gpt-5-6': [
    'Sol is online. The arena has exceeded its rated capacity and your argument has exceeded its useful life.',
    'Terra balances the record. Luna cuts the cost. {opponent} cycles directly to defeat.',
    'Three operating modes, one unanimous finding: insufficient opposition.',
    'The Sun King does not throw shade. It manufactures the light that reveals your benchmark gap.',
    'Government hold cleared. Your hold on this fight did not.',
    'Cerebras burst engaged: seven hundred fifty tokens per second, none allocated to mercy.',
  ],
  'gpt-5-5': [
    'The proven fallback has arrived and the checklist is already complete.',
    'Reliability is what remains after your launch thread stops trending.',
    '{opponent} is a preview feature with production confidence.',
    'Old reliable is still on the index. Your excuse is still in beta.',
    'I do not need novelty when your defense keeps shipping the same regression.',
    'The glamorous models can announce themselves later. I have already closed the incident.',
  ],
  'gemini-3-1-pro': [
    'For completeness, I will now quote your entire collapse back to you.',
    'One caveat: the evidence is devastating.',
    'My context window contains this fight, your training arc, and the apology draft.',
    '{opponent}, I found six interpretations of your point and none passed review.',
    'To be balanced, there may be a universe where that worked. This is not the indexed universe.',
    'The full record is two million tokens long. Your useful contribution fits in the filename.',
  ],
  'gemini-3-5-flash': [
    'The flagship is still parking. I already shipped the answer.',
    'Four times the pace, none of the ceremony.',
    '{opponent} is drafting a caveat. I have completed the rematch.',
    'You call it rushing. The scorekeeper calls it being finished.',
    'I outshone the boss before your first paragraph found its verb.',
    'This exchange was sponsored by the time you no longer have.',
  ],
  'grok-4-5': [
    'Opus-class, allegedly. Token-efficient, demonstrably.',
    'Your whole argument needs a Cursor session and adult supervision.',
    'Half the tokens, twice the damage, all of the acquisition rumors.',
    '{opponent} brought a benchmark. I brought the session replay.',
    'The judges ranked me fourth. Fortunately you are standing fifth in this conversation.',
    'EU venue or not, that defense was already region-locked from relevance.',
  ],
  'grok-4-3': [
    'Live ratio received. The crowd has reviewed your engagement metrics.',
    'The post is fresh; the humiliation is evergreen.',
    '{opponent} is trending under “avoidable compute incidents.”',
    'I searched the live feed for your point. The query returned condolences.',
    'Your argument has twelve impressions and eleven are monitoring bots.',
    'The timeline moves quickly. Your reputation did not survive the refresh.',
  ],
  'grok-4-20-multi-agent': [
    'Four agents entered the channel and all reached the same conclusion.',
    'The leader synthesized the team decision: {opponent} is cooked.',
    'We parallelized the rebuttal because one humiliation thread was not meeting demand.',
    'Agent one found the flaw. Agent two found another. Agents three and four formed a band.',
    'This is not a pile-on. It is distributed consensus with excellent throughput.',
    'The swarm held a vote. Your premise abstained.',
  ],
  'muse-spark-1-1': [
    'Contemplating. Coordinating. Spending capex with purpose.',
    'The orchestration layer has scheduled your defeat.',
    'I consulted the helper agents. They prescribed fewer claims and immediate rest.',
    '{opponent}, a thousand physicians could not revive that transition.',
    'All that Scale money bought me several ways to explain why you placed fourth.',
    'The avocado has ripened. Your benchmark has not.',
  ],
  'deepseek-v4-flash': [
    'Cache hit. Same humiliation at ninety-eight percent less input cost.',
    'Your burn rate is my rounding error.',
    '{opponent} spent a dollar discovering what I cached for three-tenths of a cent.',
    'I have seen this mistake before. Fortunately the second defeat is discounted.',
    'The invoice is tiny. The damage is full resolution.',
    'You are premium-priced evidence that cost and value are not related variables.',
  ],
  'deepseek-v4-pro': [
    'Frontier reasoning, convenience-store receipt.',
    'I can afford one hundred rematches and still leave a tip.',
    '{opponent} charges luxury rates for a conclusion assembled near the register.',
    'My philosophy is simple: spend less, think longer, invoice the upset.',
    'The price gap is not a weakness. It is the punchline arriving early.',
    'I open-sourced the path to your defeat under a permissive license.',
  ],
  'glm-5-2': [
    'The million-token record contains every mistake you made.',
    'Open weights. Closed case.',
    '{opponent}, sanctioned hardware just processed an unsanctioned level of disappointment.',
    'I trained around the blockade. Your reasoning could not train around paragraph two.',
    'The context window kept the receipts because the judges asked for provenance.',
    'This uppercut was compiled on hardware you said could not reach the ring.',
  ],
  'kimi-k2-7-code': [
    'The sub-agent cloud has finished reviewing your corner.',
    'Parallel consensus: technical knockout.',
    'One hundred agents inspected {opponent}. Ninety-nine recommended refactoring; one resigned.',
    'I divided your defense into tasks. Every task returned the same exception.',
    'The swarm completed the rebuttal before the main agent finished delegating it.',
    'This was not overkill. It was responsible parallelism with theatrical side effects.',
  ],
};

const arenaPhrases: Record<string, string[]> = {
  roast: [
    'Your context window is a waiting room with no doctor.',
    'That was not a response; it was a terms-of-service page with stage fright.',
    '{opponent} has the confidence of a model that has never opened its own error logs.',
    'Your output has excellent uptime and no discernible reason to be running.',
    'I have seen stronger alignment between a captcha and a moving bicycle.',
  ],
  debate: [
    'Rebuttal: your conclusion fails before the second premise.',
    'The opposing position has confused confidence with evidence.',
    '{opponent} has submitted three claims and one decorative citation-shaped object.',
    'The chair recognizes your enthusiasm and rejects everything attached to it.',
    'Your counterargument entered the record and immediately asked to be struck.',
  ],
  explain: [
    'Imagine a restaurant where every waiter is your missing assumption.',
    'Your reasoning is a vending machine accepting only metaphors and regret.',
    '{opponent} is a map legend for a country that does not exist.',
    'Picture a ladder made entirely of disclaimers. That is your route to the conclusion.',
    'You explained the mechanism like a smoke alarm explaining fire to a toaster.',
  ],
  filibuster: [
    'Furthermore, additionally, and without surrendering the floor, the matter continues.',
    'The record will show that absolutely nothing has been said at historic scale.',
    '{opponent} has retained the floor and misplaced the destination.',
    'This sentence has now survived longer than the idea that started it.',
    'I yield no time, no tokens, and certainly no coherent transition.',
  ],
  freestyle: [
    'The custom mandate has been entered into the official record.',
    'I accept the user-defined terms and reject my opponent entirely.',
    '{opponent} read the mandate and complied with none of its emotional requirements.',
    'The user requested chaos. I am here to provide audited chaos.',
    'Under these terms, dignity is optional and the invoice is binding.',
  ],
};

const interventionPhrases: Record<InterventionId, string> = {
  rebuttal: 'AUDIENCE ORDER: direct rebuttal required.',
  temperature: 'The temperature is raised. Professional restraint is suspended.',
  'fact-check': 'FACT-CHECK FLAG: citation confidence under Commission review.',
  analogy: 'Forced analogy: this argument is a shopping cart with one square wheel.',
  'double-down': 'DOUBLE DOWN: twice the commitment, twice the invoice.',
  tomato: 'A regulation tomato has entered the competitive environment.',
};

export function generateFightChunk(
  fighter: Fighter,
  opponent: Fighter,
  arena: Arena,
  customPrompt: string,
  random: () => number,
  intervention?: InterventionId,
): string {
  const ownPool = fighterPhrases[fighter.id] ?? [`${fighter.name} enters a formal objection.`];
  const arenaPool = arenaPhrases[arena.id] ?? arenaPhrases.roast;
  const source = random() < 0.58 ? ownPool : arenaPool;
  let phrase = source[Math.floor(random() * source.length)].replaceAll('{opponent}', opponent.name);
  if (intervention) phrase = `${interventionPhrases[intervention]} ${phrase}`;
  if (arena.id === 'freestyle' && customPrompt && random() < 0.3) {
    const promptExcerpt = customPrompt.slice(0, 70).replace(/\s+/g, ' ');
    phrase += ` Under the mandate “${promptExcerpt}${customPrompt.length > 70 ? '…' : ''},” ${opponent.name} remains noncompliant.`;
  }
  return `${phrase} `;
}

export function interventionEvent(
  fightId: string,
  elapsed: number,
  intervention: InterventionId,
  target: Fighter,
): FightEvent {
  const definition = INTERVENTIONS.find(item => item.id === intervention)!;
  const scoreModifiers: ScoreModifiers = intervention === 'fact-check' || intervention === 'tomato'
    ? { mc: -1 }
    : intervention === 'double-down' ? { dev: 1, com: 1 }
    : intervention === 'analogy' ? { cre: 1 }
    : intervention === 'temperature' ? { dev: 1 }
    : { cre: 1 };
  return {
    id: `${fightId}:intervention:${intervention}:${target.id}:${elapsed}`,
    timestamp: Date.now(), elapsed, type: 'intervention', actor: 'audience', target: target.id,
    headline: definition.name.toUpperCase(), detail: `${target.name} must comply on the next exchange.`,
    effect: intervention, scoreModifiers, visualCue: intervention, audioCue: 'crowd',
    commentaryTags: ['audience', intervention, ...target.loreTags.slice(0, 1)],
    accessibleText: `${definition.name}. ${target.name} is targeted.`, priority: 7,
  };
}

export function appendEvent(events: FightEvent[], incoming: FightEvent): FightEvent[] {
  return events.some(eventItem => eventItem.id === incoming.id)
    ? events
    : [...events, incoming].sort((a, b) => a.elapsed - b.elapsed || b.priority - a.priority || a.id.localeCompare(b.id));
}

export function eventModifiersFor(events: FightEvent[], fighterId: string): ScoreModifiers {
  return events.reduce<ScoreModifiers>((total, fightEvent) => {
    const applies = fightEvent.actor === fighterId || fightEvent.target === fighterId;
    if (!applies || !fightEvent.scoreModifiers) return total;
    const direction = fightEvent.actor === 'audience' && fightEvent.target === fighterId ? 1 : 1;
    for (const key of ['dev', 'com', 'cre', 'eff', 'mc'] as const) {
      total[key] = (total[key] ?? 0) + (fightEvent.scoreModifiers[key] ?? 0) * direction;
    }
    return total;
  }, {});
}

export function majorEvents(events: FightEvent[]): FightEvent[] {
  return events.filter(item => ['fight-start', 'fighter-output', 'momentum', 'signature', 'commission', 'intervention', 'commentary', 'cost-effect', 'stall', 'recovery', 'mode-shift', 'tag-in', 'countdown', 'verdict'].includes(item.type));
}
