import type { FightRecord } from '../types';

const STORAGE_KEY = 'tokenburner3000_fights';

export function getFightRecords(): FightRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
  wins: number;
  losses: number;
  winRate: number;
  totalTokens: number;
  totalCost: number;
  avgScore: number;
  fights: number;
}

export function getLeaderboard(): LeaderboardEntry[] {
  const records = getFightRecords();
  const stats: Record<string, { wins: number; losses: number; totalTokens: number; totalCost: number; totalScore: number; fights: number }> = {};

  for (const r of records) {
    for (const fid of [r.fighter1, r.fighter2]) {
      if (!stats[fid]) {
        stats[fid] = { wins: 0, losses: 0, totalTokens: 0, totalCost: 0, totalScore: 0, fights: 0 };
      }
      stats[fid].fights++;
      const isF1 = fid === r.fighter1;
      stats[fid].totalTokens += isF1 ? r.f1Tokens : r.f2Tokens;
      // Use per-fighter cost if available, fallback to split for old records
      stats[fid].totalCost += isF1
        ? (r.f1Cost ?? r.totalCost / 2)
        : (r.f2Cost ?? r.totalCost / 2);
      stats[fid].totalScore += isF1 ? r.f1Score : r.f2Score;
      if (fid === r.winner) {
        stats[fid].wins++;
      } else {
        stats[fid].losses++;
      }
    }
  }

  return Object.entries(stats)
    .map(([fighterId, s]) => ({
      fighterId,
      wins: s.wins,
      losses: s.losses,
      winRate: s.fights > 0 ? (s.wins / s.fights) * 100 : 0,
      totalTokens: s.totalTokens,
      totalCost: s.totalCost,
      avgScore: s.fights > 0 ? s.totalScore / s.fights : 0,
      fights: s.fights,
    }))
    .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);
}

export function getHeadToHead(fighter1Id: string, fighter2Id: string) {
  const records = getFightRecords().filter(
    r => (r.fighter1 === fighter1Id && r.fighter2 === fighter2Id) ||
         (r.fighter1 === fighter2Id && r.fighter2 === fighter1Id)
  );

  let f1Wins = 0;
  let f2Wins = 0;
  for (const r of records) {
    if (r.winner === fighter1Id) f1Wins++;
    else if (r.winner === fighter2Id) f2Wins++;
  }

  return { fighter1Id, fighter2Id, f1Wins, f2Wins, totalFights: records.length };
}
