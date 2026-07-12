import type { FightRecord, FighterSnapshot } from '../types';
import { getFighterById } from '../data/fighters';

const STORAGE_KEY = 'tokenburner3000_fights';
const PREDICTION_KEY = 'tokenburner3000_prediction_streak';

interface LegacyFightRecord {
  id: string;
  timestamp: number;
  fighter1: string;
  fighter2: string;
  arena: string;
  winner: string;
  f1Score: number;
  f2Score: number;
  f1Tokens: number;
  f2Tokens: number;
  f1Cost?: number;
  f2Cost?: number;
  totalCost: number;
  duration: number;
}

function fallbackSnapshot(id: string): FighterSnapshot {
  const fighter = getFighterById(id);
  return fighter
    ? { id: fighter.id, name: fighter.name, title: fighter.title, logo: fighter.logo, provider: fighter.provider, color: fighter.color, rosterTier: fighter.rosterTier }
    : { id, name: id, title: 'Archived Competitor', logo: '📼', provider: 'Historical', color: 'text-gray-400', rosterTier: 'legend' };
}

function migrateRecord(record: FightRecord | LegacyFightRecord): FightRecord {
  if ('schemaVersion' in record && record.schemaVersion === 2) return record;
  const isDraw = record.f1Score === record.f2Score;
  const legacyTotalCost = record.totalCost ?? 0;
  return {
    schemaVersion: 2,
    id: record.id,
    seed: record.timestamp >>> 0,
    timestamp: record.timestamp,
    fighter1: record.fighter1,
    fighter2: record.fighter2,
    fighter1Snapshot: fallbackSnapshot(record.fighter1),
    fighter2Snapshot: fallbackSnapshot(record.fighter2),
    arena: record.arena,
    customPrompt: '',
    winner: isDraw ? null : record.winner,
    result: isDraw ? 'draw' : 'win',
    f1Score: record.f1Score,
    f2Score: record.f2Score,
    f1Tokens: record.f1Tokens,
    f2Tokens: record.f2Tokens,
    f1Cost: record.f1Cost ?? legacyTotalCost / 2,
    f2Cost: record.f2Cost ?? legacyTotalCost / 2,
    totalCost: legacyTotalCost,
    duration: record.duration,
    events: [],
  };
}

export function getFightRecords(): FightRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<FightRecord | LegacyFightRecord>;
    return parsed.map(migrateRecord);
  } catch {
    return [];
  }
}

export function saveFightRecord(record: FightRecord): void {
  const records = getFightRecords();
  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export interface LeaderboardEntry {
  fighterId: string;
  snapshot: FighterSnapshot;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalTokens: number;
  totalCost: number;
  pricedFights: number;
  avgScore: number;
  fights: number;
}

export function getLeaderboard(): LeaderboardEntry[] {
  const records = getFightRecords();
  const stats: Record<string, Omit<LeaderboardEntry, 'fighterId' | 'winRate' | 'avgScore'>> = {};

  for (const r of records) {
    const participants = [
      { id: r.fighter1, snapshot: r.fighter1Snapshot, tokens: r.f1Tokens, cost: r.f1Cost, score: r.f1Score },
      { id: r.fighter2, snapshot: r.fighter2Snapshot, tokens: r.f2Tokens, cost: r.f2Cost, score: r.f2Score },
    ];
    for (const p of participants) {
      if (!stats[p.id]) stats[p.id] = { snapshot: p.snapshot, wins: 0, losses: 0, draws: 0, totalTokens: 0, totalCost: 0, pricedFights: 0, fights: 0 } as Omit<LeaderboardEntry, 'fighterId' | 'winRate' | 'avgScore'> & { totalScore?: number };
      const s = stats[p.id] as typeof stats[string] & { totalScore?: number };
      s.snapshot = p.snapshot;
      s.fights++;
      s.totalTokens += p.tokens;
      s.totalScore = (s.totalScore ?? 0) + p.score;
      if (p.cost != null) { s.totalCost += p.cost; s.pricedFights++; }
      if (r.result === 'draw') s.draws++;
      else if (r.winner === p.id) s.wins++;
      else s.losses++;
    }
  }

  return Object.entries(stats)
    .map(([fighterId, raw]) => {
      const s = raw as typeof raw & { totalScore?: number };
      return {
        fighterId, snapshot: s.snapshot, wins: s.wins, losses: s.losses, draws: s.draws,
        winRate: s.fights > 0 ? (s.wins / s.fights) * 100 : 0,
        totalTokens: s.totalTokens, totalCost: s.totalCost, pricedFights: s.pricedFights,
        avgScore: s.fights > 0 ? (s.totalScore ?? 0) / s.fights : 0, fights: s.fights,
      };
    })
    .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);
}

export function getHeadToHead(fighter1Id: string, fighter2Id: string) {
  const records = getFightRecords().filter(r =>
    (r.fighter1 === fighter1Id && r.fighter2 === fighter2Id) ||
    (r.fighter1 === fighter2Id && r.fighter2 === fighter1Id));
  let f1Wins = 0; let f2Wins = 0; let draws = 0;
  for (const r of records) {
    if (r.result === 'draw') draws++;
    else if (r.winner === fighter1Id) f1Wins++;
    else if (r.winner === fighter2Id) f2Wins++;
  }
  return { fighter1Id, fighter2Id, f1Wins, f2Wins, draws, totalFights: records.length };
}

export function getPredictionStreak(): number {
  return Number.parseInt(localStorage.getItem(PREDICTION_KEY) ?? '0', 10) || 0;
}

export function updatePredictionStreak(correct: boolean): number {
  const next = correct ? getPredictionStreak() + 1 : 0;
  localStorage.setItem(PREDICTION_KEY, String(next));
  return next;
}
