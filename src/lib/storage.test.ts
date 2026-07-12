import { beforeEach, describe, expect, it } from 'vitest';
import { getFightRecords, getLeaderboard, getHeadToHead } from './storage';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  clear() { this.values.clear(); }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });

describe('storage migration', () => {
  beforeEach(() => storage.clear());

  it('migrates a legacy tie to a draw with historical snapshots', () => {
    storage.setItem('tokenburner3000_fights', JSON.stringify([{
      id: 'old', timestamp: 100, fighter1: 'gpt4o', fighter2: 'command', arena: 'roast',
      winner: 'gpt4o', f1Score: 40, f2Score: 40, f1Tokens: 100, f2Tokens: 100,
      totalCost: 0.01, duration: 60,
    }]));
    const record = getFightRecords()[0];
    expect(record.result).toBe('draw');
    expect(record.winner).toBeNull();
    expect(record.fighter1Snapshot.name).toBe('GPT-4o');
    expect(getLeaderboard().every(entry => entry.wins === 0 && entry.losses === 0 && entry.draws === 1)).toBe(true);
    expect(getHeadToHead('gpt4o', 'command').draws).toBe(1);
  });
});
