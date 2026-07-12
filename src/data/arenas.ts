import type { Arena } from '../types';

export const ARENAS: Arena[] = [
  {
    id: 'roast', name: 'THE ROAST PIT',
    desc: 'Models directly trash-talk each other. No mercy. Maximum verbal devastation.',
    ruleSummary: 'Direct attacks and callbacks score harder. Aggression events fire more often.',
    phraseTags: ['attack', 'callback', 'roast'],
    modifiers: { aggression: 1.35, rebuttal: 1, creativity: 1, volume: 1, repetitionPenalty: 1 },
  },
  {
    id: 'debate', name: 'THE DEBATE RING',
    desc: 'Argue opposite sides of an absurd proposition under formal league rules.',
    ruleSummary: 'Rebuttals and opponent references score higher; topic avoidance loses ground.',
    phraseTags: ['rebuttal', 'evidence', 'position'],
    modifiers: { aggression: 0.9, rebuttal: 1.5, creativity: 1.05, volume: 0.9, repetitionPenalty: 1.1 },
  },
  {
    id: 'explain', name: 'THE EXPLAIN-OFF',
    desc: 'Explain a complex topic using only inappropriate metaphors.',
    ruleSummary: 'Metaphors and clarity drive creativity; raw volume matters less.',
    phraseTags: ['metaphor', 'explain', 'clarity'],
    modifiers: { aggression: 0.75, rebuttal: 0.85, creativity: 1.55, volume: 0.75, repetitionPenalty: 1.25 },
  },
  {
    id: 'filibuster', name: 'THE FILIBUSTER',
    desc: 'Say as much as possible about absolutely nothing. Pure verbosity competition.',
    ruleSummary: 'Sustained output scores; repeated phrases lose creativity and crowd momentum.',
    phraseTags: ['volume', 'digression', 'continuation'],
    modifiers: { aggression: 0.7, rebuttal: 0.7, creativity: 0.9, volume: 1.6, repetitionPenalty: 1.6 },
  },
  {
    id: 'freestyle', name: 'FREESTYLE',
    desc: 'Write your own battle prompt. The commission allows creative freedom.',
    ruleSummary: 'The submitted prompt becomes the fight constraint and appears on the official record.',
    phraseTags: ['custom', 'prompt'],
    modifiers: { aggression: 1, rebuttal: 1, creativity: 1.25, volume: 1, repetitionPenalty: 1.1 },
  },
];
